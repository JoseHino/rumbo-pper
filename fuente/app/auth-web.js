/* ===== Cuentas (solo versión web): registro con verificación del correo y progreso en la nube ===== */
const AUTH = {
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
    if (session && session.user) return this.enter(session.user);
    this.form();
  },
  enter(user) {
    this.user = user;
    this.name = (user.user_metadata && user.user_metadata.full_name) || '';
    document.body.classList.remove('locked');
    this.go();
  },
  async logout() {
    try {
      await Store.flush();
      // espera a que termine cualquier guardado en curso antes de cerrar la sesión
      for (let i = 0; i < 40 && (Store.writing || Store.dirty || Store.timer); i++) await new Promise(r => setTimeout(r, 250));
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
    const e = esc(this.email), msg = (this.err ? `<p class="auth-err" role="alert">${esc(this.err)}</p>` : '') + (this.info ? `<p class="auth-info" role="status">${esc(this.info)}</p>` : '');
    const dis = this.busy ? 'disabled' : '';
    const F = {
      login: ['Entrar', `<form data-auth="login">
<label>Correo<input name="email" type="email" autocomplete="email" required value="${e}"></label>
<label>Contraseña<input name="pass" type="password" autocomplete="current-password" required minlength="8"></label>
${msg}<button class="btn wide" ${dis}>${this.busy ? 'Entrando…' : 'Entrar'}</button></form>
<p class="auth-alt">¿Aún no tienes cuenta? <button class="link" data-auth-step="signup">Regístrate gratis</button></p>
<p class="auth-alt"><button class="link" data-auth-step="reset">He olvidado la contraseña</button></p>`],
      signup: ['Crear cuenta', `<form data-auth="signup">
<label>Nombre<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label>
<label>Correo<input name="email" type="email" autocomplete="email" required value="${e}"></label>
<label>Contraseña <span class="small muted">(8 caracteres o más)</span><input name="pass" type="password" autocomplete="new-password" required minlength="8"></label>
<p class="small muted">Te enviaremos un código de 6 cifras para comprobar que el correo es tuyo. Tu progreso se guardará en tu cuenta y lo tendrás en cualquier dispositivo.</p>
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
  setStep(s) { this.step = s; this.err = ''; this.info = ''; this.form(); },
  async signIn(email, pass) {
    const { data, error } = await this.sb.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (error.code === 'email_not_confirmed') { this.pass = pass; this.call({ action: 'resend', email }); this.step = 'code'; this.info = 'Tu correo aún no está verificado: te hemos enviado un código nuevo.'; return; }
      this.err = error.status === 400 ? 'El correo o la contraseña no son correctos.' : 'No se ha podido entrar. Inténtalo de nuevo.'; return;
    }
    this.enter(data.user);
    return true;
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
      if (!ok) this.err = data.error || 'No se ha podido crear la cuenta. Inténtalo de nuevo.';
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
      simulacros: (p.sims || []).length, actualizado: new Date().toISOString(),
    });
    if (error) throw error;
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
  const d = e.target.closest('[data-auth-do="resend"]');
  if (d) {
    e.preventDefault();
    AUTH.call({ action: 'resend', email: AUTH.email }).then(({ ok, data }) => { AUTH.err = ok ? '' : (data.error || ''); AUTH.info = ok ? 'Te hemos enviado un código nuevo.' : ''; AUTH.form(); });
  }
});
ACT.logout = () => confirmBox({ title: 'Cerrar sesión', text: 'Tu progreso queda guardado en tu cuenta. Para volver a entrar necesitarás tu correo y tu contraseña.', ok: 'Cerrar sesión' }, () => AUTH.logout());
