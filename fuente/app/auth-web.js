/* ===== Cuentas (solo versión web): registro con verificación del correo y progreso en la nube ===== */
const IG_ACCESO = `<div class="ig-acceso"><p>¿Aún no tienes acceso?</p><a class="btn-ig" href="https://www.instagram.com/rumboalexamen/" target="_blank" rel="noopener"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>Pídelo en Instagram</a></div>`;
const AUTH = {
  dev: (() => {
    // identificador de este navegador: con él se impide tener la cuenta abierta en dos dispositivos a la vez
    try {
      let d = localStorage.getItem('rumbo-pper-dispositivo');
      if (!d) { d = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); localStorage.setItem('rumbo-pper-dispositivo', d); }
      return d;
    } catch (e) { return 'sin-almacenamiento-' + Math.random().toString(36).slice(2); }
  })(),
  vigia: null,
  sb: null, user: null, name: '', step: 'login', email: '', pass: '', info: '', err: '', busy: false,
  cfg: window.PPER_SUPA || null,
  async call(body) {
    try {
      const res = await fetch(this.cfg.url + '/functions/v1/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: this.cfg.key, Authorization: 'Bearer ' + this.cfg.key },
        body: JSON.stringify(body),
      });
      return { ok: res.ok, data: await res.json().catch(() => ({})) };
    } catch (e) { return { ok: false, data: { error: 'No hay conexión. Inténtalo cuando tengas cobertura.' } }; }
  },
  async boot(go) {
    this.go = go;
    if (!this.cfg || !window.supabase) { this.paint('Sin conexión', '<p>Para entrar la primera vez necesitas conexión a internet. Después la app funciona sin cobertura.</p>'); return; }
    this.sb = window.supabase.createClient(this.cfg.url, this.cfg.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'rumbo-pper-auth' } });
    let session = null;
    try { session = (await this.sb.auth.getSession()).data.session; } catch (e) { session = null; }
    this.token = session ? session.access_token : null;
    this.sb.auth.onAuthStateChange((ev, ses) => { this.token = ses ? ses.access_token : null; });
    if (session && session.user) { if (await this.enter(session.user, false)) return; this.step = 'login'; return; }
    this.form();
  },
  async enter(user, nuevo) {
    // Solo entra quien tiene el acceso activo (lista de alumnos). Sin conexión se deja pasar: ya entró antes.
    let activo = true;
    try { const { data, error } = await this.sb.rpc('tengo_acceso'); if (!error && data === false) activo = false; } catch (e) { /* sin conexión */ }
    if (!activo) {
      try { await this.sb.auth.signOut(); } catch (e) { /* sin conexión */ }
      try { localStorage.removeItem(Store.K); } catch (e) { /* sin almacenamiento */ }
      this.paint('Sin acceso', `<p>La cuenta <b>${esc(user.email || '')}</b> no tiene el acceso activo.</p><p class="small muted">Para conseguir o renovar tu acceso, escríbenos por Instagram.</p>${IG_ACCESO}<p class="auth-alt"><button class="link" data-auth-step="login">Entrar con otra cuenta</button></p>`);
      return false;
    }
    // Nunca dos sesiones abiertas a la vez: este dispositivo entra solo si la cuenta no está abierta en otro
    try {
      const { data, error } = await this.sb.rpc('reclamar_sesion', { d: this.dev });
      if (!error && data === false) { this.bloquear(user); return false; }
    } catch (e) { /* sin conexión: se comprobará al volver la cobertura */ }
    if (this.recargar) { location.reload(); return true; } // vuelve tras un bloqueo: arranque limpio
    this.user = user;
    this.name = (user.user_metadata && user.user_metadata.full_name) || '';
    document.body.classList.remove('locked');
    this.vigilar();
    this.go();
    return true;
  },
  /* mientras la app está en pantalla avisa cada minuto de que la sesión sigue abierta; al ocultarla, la libera */
  vigilar() {
    clearInterval(this.vigia);
    const mira = async () => {
      if (!this.user || document.visibilityState === 'hidden') return;
      try {
        const { data, error } = await this.sb.rpc('reclamar_sesion', { d: this.dev });
        if (!error && data === false) this.bloquear(this.user);
      } catch (e) { /* sin conexión */ }
    };
    this.vigia = setInterval(mira, 60000);
    this.mira = mira;
    if (!this.oyentes) {
      this.oyentes = true;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') { if (this.mira) this.mira(); }
        else this.liberar();
      });
      window.addEventListener('pagehide', () => this.liberar());
      window.addEventListener('online', () => this.mira && this.mira());
    }
  },
  /* deja la sesión libre para otro dispositivo (al cerrar la app, dejarla en segundo plano o cerrar sesión) */
  liberar() {
    if (!this.user || !this.sb) return;
    try {
      const token = this.token;
      if (!token) return;
      fetch(this.cfg.url + '/rest/v1/rpc/liberar_sesion', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: this.cfg.key, Authorization: 'Bearer ' + token },
        body: JSON.stringify({ d: this.dev }),
      }).catch(() => {});
    } catch (e) { /* sin conexión */ }
  },
  /* la cuenta está abierta en otro dispositivo: no se puede usar aquí hasta que la cierren allí */
  bloquear(user) {
    clearInterval(this.vigia);
    this.user = null; this.mira = null; this.recargar = true;
    try { Store.ref = null; Store.mode = 'local'; } catch (e) { /* aún sin progreso */ }
    this.email = (user && user.email) || this.email;
    this.info = ''; this.err = '';
    this.pintaBloqueo();
  },
  pintaBloqueo() {
    const msg = (this.err ? `<p class="auth-err" role="alert">${esc(this.err)}</p>` : '');
    this.paint('Cuenta abierta en otro dispositivo', `<p>La cuenta <b>${esc(this.email)}</b> está abierta ahora mismo en otro móvil u ordenador.</p><p>Rumbo al PPER se puede usar en cualquier dispositivo, pero <b>no en dos a la vez</b>.</p><p class="small muted">Ciérrala en el otro dispositivo (o déjala en segundo plano) y pulsa «Reintentar». Tu progreso está guardado en tu cuenta.</p>${msg}<button class="btn wide" data-auth-do="reintentar">Reintentar</button><p class="auth-alt"><button class="link" data-auth-do="salir">Entrar con otra cuenta</button></p>`);
  },
  async reintentar() {
    try {
      const { data, error } = await this.sb.rpc('reclamar_sesion', { d: this.dev });
      if (!error && data === true) { location.reload(); return; }
      this.err = error ? 'No hay conexión. Inténtalo cuando tengas cobertura.' : 'Sigue abierta en el otro dispositivo.';
    } catch (e) { this.err = 'No hay conexión. Inténtalo cuando tengas cobertura.'; }
    this.pintaBloqueo();
  },
  async logout() {
    try {
      await Store.flush();
      // espera a que termine cualquier guardado en curso antes de cerrar la sesión
      for (let i = 0; i < 40 && (Store.writing || Store.dirty || Store.timer); i++) await new Promise(r => setTimeout(r, 250));
      try { await this.sb.rpc('liberar_sesion', { d: this.dev }); } catch (e) { /* sin conexión */ }
      await this.sb.auth.signOut();
    } catch (e) { /* sin conexión */ }
    try { localStorage.removeItem(Store.K); } catch (e) { /* sin almacenamiento */ }
    location.reload();
  },
  paint(title, html) {
    document.body.classList.add('locked');
    document.getElementById('top').innerHTML = '';
    document.getElementById('tabs').innerHTML = '';
    document.getElementById('view').innerHTML = `<section class="auth"><div class="auth-head">${ICONS.rose}<h1>Rumbo al PPER</h1><p class="muted">App de estudio del examen de Patrón Profesional de Embarcaciones de Recreo</p></div><div class="panel"><h2>${title}</h2>${html}</div></section>`;
  },
  form() {
    const e = esc(this.email), msg = (this.err ? `<p class="auth-err" role="alert">${esc(this.err)}</p>` : '') + (this.err && this.sinAcceso ? IG_ACCESO : '') + (this.info ? `<p class="auth-info" role="status">${esc(this.info)}</p>` : '');
    const dis = this.busy ? 'disabled' : '';
    const F = {
      login: ['Entrar', `<form data-auth="login">
<label>Correo<input name="email" type="email" autocomplete="email" required value="${e}"></label>
<label>Contraseña<input name="pass" type="password" autocomplete="current-password" required minlength="8"></label>
${msg}<button class="btn wide" ${dis}>${this.busy ? 'Entrando…' : 'Entrar'}</button></form>
<p class="auth-alt">¿Te han dado acceso y aún no tienes cuenta? <button class="link" data-auth-step="signup">Crea tu cuenta</button></p>
${IG_ACCESO}
<p class="auth-alt"><button class="link" data-auth-step="reset">He olvidado la contraseña</button></p>`],
      signup: ['Crear cuenta', `<form data-auth="signup">
<label>Nombre<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label>
<label>Correo<input name="email" type="email" autocomplete="email" required value="${e}"></label>
<label>Contraseña <span class="small muted">(8 caracteres o más)</span><input name="pass" type="password" autocomplete="new-password" required minlength="8"></label>
<p class="small muted">Usa el mismo correo con el que te dieron acceso. Te enviaremos un código de 6 cifras para comprobar que es tuyo. Tu progreso se guardará en tu cuenta y lo tendrás en cualquier dispositivo.</p>
${msg}<button class="btn wide" ${dis}>${this.busy ? 'Creando…' : 'Crear cuenta'}</button></form>
<p class="auth-alt">¿Ya tienes cuenta? <button class="link" data-auth-step="login">Entra</button></p>`],
      code: ['Verifica tu correo', `<form data-auth="code">
<p>Hemos enviado un código de 6 cifras a <b>${e}</b>. Escríbelo aquí para terminar. Si no lo ves, mira en «Correo no deseado».</p>
<label>Código<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,7}" maxlength="7" required class="auth-code"></label>
${msg}<button class="btn wide" ${dis}>${this.busy ? 'Comprobando…' : 'Verificar'}</button></form>
<p class="auth-alt"><button class="link" data-auth-do="resend">Enviar otro código</button> · <button class="link" data-auth-step="login">Volver</button></p>`],
      reset: ['Cambiar la contraseña', `<form data-auth="reset">
<p>Escribe el correo con el que te registraste y te enviaremos un código para poner una contraseña nueva.</p>
<label>Correo<input name="email" type="email" autocomplete="email" required value="${e}"></label>
${msg}<button class="btn wide" ${dis}>${this.busy ? 'Enviando…' : 'Enviar código'}</button></form>
<p class="auth-alt"><button class="link" data-auth-step="login">Volver</button></p>`],
      reset2: ['Contraseña nueva', `<form data-auth="reset2">
<p>Si hay una cuenta con <b>${e}</b>, te hemos enviado un código de 6 cifras.</p>
<label>Código<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" required class="auth-code"></label>
<label>Contraseña nueva <span class="small muted">(8 caracteres o más)</span><input name="pass" type="password" autocomplete="new-password" required minlength="8"></label>
${msg}<button class="btn wide" ${dis}>${this.busy ? 'Guardando…' : 'Guardar y entrar'}</button></form>
<p class="auth-alt"><button class="link" data-auth-step="reset">Enviar otro código</button> · <button class="link" data-auth-step="login">Volver</button></p>`],
    }[this.step];
    this.paint(F[0], F[1]);
    const first = document.querySelector('.auth input:not([value]), .auth input[value=""]');
    if (first && !this.busy) first.focus();
  },
  setStep(s) { this.step = s; this.err = ''; this.info = ''; this.sinAcceso = false; this.form(); },
  async signIn(email, pass) {
    const { data, error } = await this.sb.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (error.code === 'email_not_confirmed') { this.pass = pass; this.call({ action: 'resend', email }); this.step = 'code'; this.info = 'Tu correo aún no está verificado: te hemos enviado un código nuevo.'; return; }
      this.err = error.status === 400 ? 'El correo o la contraseña no son correctos.' : 'No se ha podido entrar. Inténtalo de nuevo.'; return;
    }
    if (await this.enter(data.user, true)) return true;
    return 'bloqueado';
  },
  async submit(kind, f) {
    const v = n => (f.elements[n] ? f.elements[n].value : '');
    this.err = ''; this.info = '';
    if (v('email')) this.email = v('email').trim().toLowerCase();
    this.busy = true; this.form(); this.busy = false;
    let done = false;
    if (kind === 'login') done = await this.signIn(this.email, v('pass'));
    else if (kind === 'signup') {
      const pass = v('pass');
      const { ok, data } = await this.call({ action: 'signup', name: v('name').trim(), email: this.email, password: pass });
      if (!ok) { this.sinAcceso = !!data.sinAcceso; this.err = data.sinAcceso ? 'Este correo no tiene acceso. Rumbo al PPER es solo para alumnos.' : (data.error || 'No se ha podido crear la cuenta. Inténtalo de nuevo.'); }
      else if (data.verify) { this.pass = pass; this.step = 'code'; }
      else done = await this.signIn(this.email, pass);
    } else if (kind === 'code') {
      const { ok, data } = await this.call({ action: 'verify', email: this.email, code: v('code').replace(/\D/g, '') });
      if (!ok) this.err = data.error || 'El código no es correcto.';
      else if (this.pass) done = await this.signIn(this.email, this.pass);
      else { this.step = 'login'; this.info = 'Correo verificado. Ya puedes entrar.'; }
    } else if (kind === 'reset') {
      const { ok, data } = await this.call({ action: 'reset_request', email: this.email });
      if (!ok) this.err = data.error || 'No se ha podido enviar el código.'; else this.step = 'reset2';
    } else if (kind === 'reset2') {
      const pass = v('pass');
      const { ok, data } = await this.call({ action: 'reset_confirm', email: this.email, code: v('code').replace(/\D/g, ''), password: pass });
      if (!ok) this.err = data.error || 'El código no es correcto.'; else done = await this.signIn(this.email, pass);
    }
    if (!done) this.form();
  },
  /* progreso en la tabla «progreso» (cada usuario solo ve su fila) */
  async pull() {
    const { data, error } = await this.sb.from('progreso').select('p, ts').eq('user_id', this.user.id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async push(p) {
    const days = Object.keys(p.days || {}).length;
    const { error } = await this.sb.from('progreso').upsert({
      user_id: this.user.id, p: JSON.stringify(p), ts: p.ts, millas: p.xp || 0,
      respuestas: (p.st && p.st.ans) || 0, aciertos: (p.st && p.st.ok) || 0, dias: days,
      simulacros: (p.sims || []).length, actualizado: new Date().toISOString(), dispositivo: this.dev,
    });
    if (error) { if (this.mira) this.mira(); throw error; }
  },
};
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-auth]');
  if (!f) return;
  e.preventDefault();
  AUTH.submit(f.dataset.auth, f);
});
document.addEventListener('click', e => {
  const s = e.target.closest('[data-auth-step]');
  if (s) { e.preventDefault(); AUTH.setStep(s.dataset.authStep); return; }
  if (e.target.closest('[data-auth-do="reintentar"]')) { e.preventDefault(); AUTH.reintentar(); return; }
  if (e.target.closest('[data-auth-do="salir"]')) {
    e.preventDefault();
    (async () => { try { await AUTH.sb.auth.signOut({ scope: 'local' }); } catch (x) { /* sin conexión */ } try { localStorage.removeItem(Store.K); } catch (x) { /* */ } location.reload(); })();
    return;
  }
  const d = e.target.closest('[data-auth-do="resend"]');
  if (d) {
    e.preventDefault();
    AUTH.call({ action: 'resend', email: AUTH.email }).then(({ ok, data }) => { AUTH.err = ok ? '' : (data.error || ''); AUTH.info = ok ? 'Te hemos enviado un código nuevo.' : ''; AUTH.form(); });
  }
});
ACT.logout = () => confirmBox({ title: 'Cerrar sesión', text: 'Tu progreso queda guardado en tu cuenta. Para volver a entrar necesitarás tu correo y tu contraseña.', ok: 'Cerrar sesión' }, () => AUTH.logout());
