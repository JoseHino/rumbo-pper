-- Rumbo al PPER: cada cuenta queda ATADA al primer dispositivo donde se usa (para que no se comparta).
-- Otro dispositivo no puede entrar. Durante las primeras 24 h desde que se crea la cuenta sí se puede cambiar
-- (en iPhone, la app instalada en la pantalla de inicio cuenta como otro dispositivo distinto de Safari).
-- Liberar el dispositivo de alguien (cambio de móvil):
--   delete from public.sesiones where user_id = (select id from public.perfiles where email = 'alumno@correo.com');
-- Sin límite de dispositivos (administradores):  update public.permitidos set multi = true where email = '...';

alter table public.permitidos add column multi boolean not null default false;

-- ¿quien llama puede usar varios dispositivos?
create function public.sin_limite() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.permitidos
    where email = lower(coalesce((select auth.jwt()) ->> 'email', '')) and activo and multi
  );
$$;

-- Al iniciar sesión: el dispositivo queda registrado; otro distinto solo entra en las primeras 24 h de la cuenta
create or replace function public.reclamar_sesion(d text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare actual text; creada timestamptz;
begin
  if (select auth.uid()) is null or coalesce(length(d), 0) < 8 or not public.tengo_acceso() then return false; end if;
  if public.sin_limite() then return true; end if;
  select dispositivo into actual from public.sesiones where user_id = (select auth.uid());
  if actual is null or actual = d then
    insert into public.sesiones (user_id, dispositivo) values ((select auth.uid()), d)
    on conflict (user_id) do update set visto = now();
    return true;
  end if;
  select created_at into creada from auth.users where id = (select auth.uid());
  if creada > now() - interval '24 hours' then
    update public.sesiones set dispositivo = d, desde = now(), visto = now() where user_id = (select auth.uid());
    return true;
  end if;
  return false;
end $$;

-- Mientras se usa: ¿este es el dispositivo registrado? (si la cuenta no tenía ninguno, lo registra)
create or replace function public.sesion_valida(d text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare actual text;
begin
  if (select auth.uid()) is null or coalesce(length(d), 0) < 8 then return false; end if;
  if public.sin_limite() then return true; end if;
  select dispositivo into actual from public.sesiones where user_id = (select auth.uid());
  if actual is null then
    insert into public.sesiones (user_id, dispositivo) values ((select auth.uid()), d) on conflict (user_id) do nothing;
    return true;
  end if;
  if actual <> d then return false; end if;
  update public.sesiones set visto = now() where user_id = (select auth.uid());
  return true;
end $$;

-- ¿puede guardar progreso desde este dispositivo?
create function public.puede_guardar(d text) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.sin_limite() or d = (select dispositivo from public.sesiones where user_id = (select auth.uid()));
$$;

revoke all on function public.sin_limite(), public.puede_guardar(text) from public, anon;
grant execute on function public.sin_limite(), public.puede_guardar(text) to authenticated;

drop policy "crear mi progreso" on public.progreso;
drop policy "cambiar mi progreso" on public.progreso;
create policy "crear mi progreso" on public.progreso for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.tengo_acceso()) and public.puede_guardar(dispositivo));
create policy "cambiar mi progreso" on public.progreso for update to authenticated
  using (user_id = (select auth.uid()) and (select public.tengo_acceso()))
  with check (user_id = (select auth.uid()) and (select public.tengo_acceso()) and public.puede_guardar(dispositivo));

-- (el administrador se marca con multi = true aparte, sin escribir su correo en el repositorio)

-- accesos: añade el dispositivo registrado
drop view public.accesos;
create view public.accesos with (security_invoker = true) as
select p.email, p.nombre, p.activo, p.multi as sin_limite_dispositivos, p.alta as acceso_desde, p.nota,
       f.id is not null as registrado, s.desde as dispositivo_desde, s.visto as ultimo_uso, u.last_sign_in_at as ultimo_acceso
from public.permitidos p
left join public.perfiles f on f.email = p.email
left join auth.users u on u.id = f.id
left join public.sesiones s on s.user_id = f.id
order by p.alta desc;
revoke all on public.accesos from anon, authenticated;
