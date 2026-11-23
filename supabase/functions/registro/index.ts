import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Cuentas de Rumbo al PPER con correo y contraseña (endpoint público, por eso no exige JWT):
//   action "signup":        crea la cuenta y manda un código para verificar el correo.
//   action "verify":        comprueba ese código y confirma el correo.
//   action "resend":        manda otro código de verificación.
//   action "reset_request": manda un código para cambiar la contraseña.
//   action "reset_confirm": comprueba ese código y pone la contraseña nueva.
// Los correos salen por Brevo (BREVO_API_KEY) desde MAIL_FROM_EMAIL (dominio seawithjose.es, autenticado en Brevo).
// Sin clave no se puede enviar correo y NO se crean cuentas: la verificación es obligatoria.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const BREVO_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const MAIL_FROM_EMAIL = Deno.env.get("MAIL_FROM_EMAIL") ?? "";
const MAIL_FROM_NAME = Deno.env.get("MAIL_FROM_NAME") ?? "Rumbo al PPER";
const CODE_MINUTES = 15;
const MAX_ATTEMPTS = 5;
const RESEND_WAIT_SECONDS = 60;
const canMail = () => BREVO_KEY !== "" && MAIL_FROM_EMAIL !== "";

type Purpose = "verify" | "reset";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function newCode() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(n).padStart(6, "0");
}
const esc = (t: string) => t.replace(/[<>&"]/g, "");

const COPY: Record<Purpose, { subject: (c: string) => string; title: string; lead: string }> = {
  verify: {
    subject: (c) => `${c} es tu código de Rumbo al PPER`,
    title: "Verifica tu correo",
    lead: "escribe este código en Rumbo al PPER para terminar de crear tu cuenta.",
  },
  reset: {
    subject: (c) => `${c} es tu código para cambiar la contraseña de Rumbo al PPER`,
    title: "Cambia tu contraseña",
    lead: "escribe este código en Rumbo al PPER para poner una contraseña nueva.",
  },
};

async function sendCode(userId: string, email: string, name: string, purpose: Purpose): Promise<boolean> {
  const code = newCode();
  const { error } = await admin.from("codigos_correo").upsert({
    user_id: userId,
    purpose,
    code_hash: await sha256(`${purpose}:${userId}:${code}`),
    expires_at: new Date(Date.now() + CODE_MINUTES * 60000).toISOString(),
    attempts: 0,
    last_sent_at: new Date().toISOString(),
  });
  if (error) return false;
  const c = COPY[purpose];
  const ignore = purpose === "verify"
    ? "Si no has creado una cuenta en Rumbo al PPER, ignora este mensaje."
    : "Si no has pedido cambiar la contraseña, ignora este mensaje: tu contraseña sigue siendo la misma.";
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_KEY, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: MAIL_FROM_NAME, email: MAIL_FROM_EMAIL },
      to: [{ email, name: name || email }],
      subject: c.subject(code),
      tags: ["rumbo-pper"],
      textContent: `Hola ${name}:\n\n${c.lead.charAt(0).toUpperCase() + c.lead.slice(1)}\n\n${code}\n\nCaduca en ${CODE_MINUTES} minutos.\n\n${ignore}`,
      htmlContent: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#142236">
<h2 style="margin:0 0 12px">${c.title}</h2>
<p style="margin:0 0 16px">Hola ${esc(name)}: ${c.lead}</p>
<p style="font-size:34px;font-weight:bold;letter-spacing:8px;margin:0 0 16px;padding:16px;background:#EAF1F4;border-radius:12px;text-align:center">${code}</p>
<p style="margin:0 0 8px;color:#4A5B6E;font-size:14px">Caduca en ${CODE_MINUTES} minutos.</p>
<p style="margin:0;color:#4A5B6E;font-size:14px">${ignore}</p>
</div>`,
    }),
  });
  return res.ok;
}

async function userByEmail(email: string) {
  const { data } = await admin.from("perfiles").select("id, nombre").eq("email", email).maybeSingle();
  if (!data) return null;
  const { data: u } = await admin.auth.admin.getUserById(data.id);
  if (!u?.user) return null;
  return { id: data.id as string, name: data.nombre as string, confirmed: !!u.user.email_confirmed_at };
}

/** Comprueba un código. Devuelve null si es válido (y lo consume) o la respuesta de error. */
async function checkCode(userId: string, purpose: Purpose, code: string): Promise<Response | null> {
  const bad = json({ error: "El código no es correcto o ha caducado. Pide uno nuevo." }, 400);
  const { data: row } = await admin.from("codigos_correo").select("*").eq("user_id", userId).eq("purpose", purpose).maybeSingle();
  if (!row || new Date(row.expires_at).getTime() < Date.now()) return bad;
  if (row.attempts >= MAX_ATTEMPTS) return json({ error: "Demasiados intentos. Pide un código nuevo." }, 429);
  if (row.code_hash !== (await sha256(`${purpose}:${userId}:${code}`))) {
    await admin.from("codigos_correo").update({ attempts: row.attempts + 1 }).eq("user_id", userId).eq("purpose", purpose);
    return bad;
  }
  await admin.from("codigos_correo").delete().eq("user_id", userId).eq("purpose", purpose);
  return null;
}

async function tooSoon(userId: string, purpose: Purpose) {
  const { data: row } = await admin.from("codigos_correo").select("last_sent_at").eq("user_id", userId).eq("purpose", purpose).maybeSingle();
  return !!row && Date.now() - new Date(row.last_sent_at).getTime() < RESEND_WAIT_SECONDS * 1000;
}

const cleanEmail = (b: Record<string, unknown>) => String(b.email ?? "").trim().toLowerCase();
const cleanCode = (b: Record<string, unknown>) => String(b.code ?? "").replace(/\D/g, "");
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 200;

async function signup(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const email = cleanEmail(body);
  const password = String(body.password ?? "");

  if (name.length < 2 || name.length > 80) return json({ error: "Escribe tu nombre." }, 400);
  if (!validEmail(email)) return json({ error: "Ese correo no parece válido." }, 400);
  if (password.length < 8 || password.length > 72)
    return json({ error: "La contraseña debe tener al menos 8 caracteres." }, 400);
  if (!canMail()) return json({ error: "El registro no está disponible ahora mismo. Inténtalo más tarde." }, 503);

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name: name },
  });
  if (error || !data.user) {
    const msg = (error?.message ?? "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists"))
      return json({ error: "Ya existe una cuenta con ese correo. Entra o cambia la contraseña." }, 409);
    return json({ error: "No se ha podido crear la cuenta. Inténtalo de nuevo." }, 500);
  }
  if (!(await sendCode(data.user.id, email, name, "verify"))) {
    // Sin correo no hay forma de verificar: se deshace el alta para que pueda repetirla.
    await admin.auth.admin.deleteUser(data.user.id);
    return json({ error: "No se ha podido enviar el correo de verificación. Revisa la dirección o inténtalo más tarde." }, 502);
  }
  return json({ ok: true, verify: true });
}

async function verify(body: Record<string, unknown>) {
  const code = cleanCode(body);
  if (code.length !== 6) return json({ error: "El código tiene 6 cifras." }, 400);
  const user = await userByEmail(cleanEmail(body));
  if (!user) return json({ error: "El código no es correcto o ha caducado. Pide uno nuevo." }, 400);
  if (user.confirmed) return json({ ok: true });
  const fail = await checkCode(user.id, "verify", code);
  if (fail) return fail;
  const { error } = await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
  if (error) return json({ error: "No se ha podido verificar. Inténtalo de nuevo." }, 500);
  return json({ ok: true });
}

async function resend(body: Record<string, unknown>) {
  const email = cleanEmail(body);
  const user = await userByEmail(email);
  // Misma respuesta exista o no la cuenta, para no revelar quién está registrado.
  if (!user || user.confirmed) return json({ ok: true });
  if (await tooSoon(user.id, "verify")) return json({ error: "Espera un minuto antes de pedir otro código." }, 429);
  if (!(await sendCode(user.id, email, user.name, "verify")))
    return json({ error: "No se ha podido enviar el correo. Inténtalo más tarde." }, 502);
  return json({ ok: true });
}

async function resetRequest(body: Record<string, unknown>) {
  const email = cleanEmail(body);
  if (!validEmail(email)) return json({ error: "Ese correo no parece válido." }, 400);
  if (!canMail()) return json({ error: "El cambio de contraseña no está disponible ahora mismo." }, 503);
  const user = await userByEmail(email);
  if (!user) return json({ ok: true });
  if (await tooSoon(user.id, "reset")) return json({ error: "Espera un minuto antes de pedir otro código." }, 429);
  if (!(await sendCode(user.id, email, user.name, "reset")))
    return json({ error: "No se ha podido enviar el correo. Inténtalo más tarde." }, 502);
  return json({ ok: true });
}

async function resetConfirm(body: Record<string, unknown>) {
  const code = cleanCode(body);
  const password = String(body.password ?? "");
  if (code.length !== 6) return json({ error: "El código tiene 6 cifras." }, 400);
  if (password.length < 8 || password.length > 72)
    return json({ error: "La contraseña debe tener al menos 8 caracteres." }, 400);
  const user = await userByEmail(cleanEmail(body));
  if (!user) return json({ error: "El código no es correcto o ha caducado. Pide uno nuevo." }, 400);
  const fail = await checkCode(user.id, "reset", code);
  if (fail) return fail;
  // El código demuestra que el correo es suyo: también queda verificado.
  const { error } = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  if (error) return json({ error: "No se ha podido cambiar la contraseña. Inténtalo de nuevo." }, 500);
  await admin.from("codigos_correo").delete().eq("user_id", user.id);
  return json({ ok: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Petición no válida." }, 400);
  }
  try {
    switch (body.action) {
      case "verify": return await verify(body);
      case "resend": return await resend(body);
      case "reset_request": return await resetRequest(body);
      case "reset_confirm": return await resetConfirm(body);
      default: return await signup(body);
    }
  } catch {
    return json({ error: "No se ha podido completar. Inténtalo de nuevo." }, 500);
  }
});
