-- Rumbo al PPER: acceso solo para los correos autorizados (alumnos)
-- Para dar acceso:   insert into public.permitidos (email, nombre) values ('alumno@correo.com', 'Nombre');
-- Para quitarlo:     update public.permitidos set activo = false where email = 'alumno@correo.com';
-- Para devolverlo:   update public.permitidos set activo = true  where email = 'alumno@correo.com';
-- Ver quién tiene acceso y si ya se ha registrado:  select * from public.accesos;

create table public.permitidos (
  email text primary key check (email = lower(trim(email)) and email like '%@%'),
  nombre text not null default '',
  nota text not null default '',
  activo boolean not null default true,
  alta timestamptz not null default now()
);
alter table public.permitidos enable row level security;
-- sin políticas: desde la app nadie la lee ni la cambia; solo el panel de Supabase y la función «registro»

-- ¿el usuario que ha entrado tiene acceso? (la app lo pregunta al entrar)
create function public.tengo_acceso() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.permitidos
    where email = lower(coalesce((select auth.jwt()) ->> 'email', '')) and activo
  );
$$;
revoke all on function public.tengo_acceso() from public, anon;
grant execute on function public.tengo_acceso() to authenticated;

-- el progreso solo se guarda y se lee con acceso activo
drop policy "leer mi progreso" on public.progreso;
drop policy "crear mi progreso" on public.progreso;
drop policy "cambiar mi progreso" on public.progreso;
create policy "leer mi progreso" on public.progreso for select to authenticated
  using (user_id = (select auth.uid()) and (select public.tengo_acceso()));
create policy "crear mi progreso" on public.progreso for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.tengo_acceso()));
create policy "cambiar mi progreso" on public.progreso for update to authenticated
  using (user_id = (select auth.uid()) and (select public.tengo_acceso()))
  with check (user_id = (select auth.uid()) and (select public.tengo_acceso()));

-- las cuentas que ya existían conservan el acceso
insert into public.permitidos (email, nombre, nota)
select email, nombre, 'cuenta anterior a la lista' from public.perfiles
on conflict (email) do nothing;

-- accesos: vista para el administrador (solo desde el panel de Supabase)
create view public.accesos with (security_invoker = true) as
select p.email, p.nombre, p.activo, p.alta as acceso_desde, p.nota,
       f.id is not null as registrado, u.last_sign_in_at as ultimo_acceso
from public.permitidos p
left join public.perfiles f on f.email = p.email
left join auth.users u on u.id = f.id
order by p.alta desc;
revoke all on public.accesos from anon, authenticated;
