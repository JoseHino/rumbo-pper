-- Rumbo al PPER: cuentas con verificación del correo y progreso por usuario

-- perfiles: nombre y correo de cada cuenta (se rellena solo al crearla)
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '',
  email text not null unique,
  creado timestamptz not null default now()
);
alter table public.perfiles enable row level security;
create policy "cada uno ve su perfil" on public.perfiles for select to authenticated using (id = (select auth.uid()));

create function public.nuevo_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfiles (id, nombre, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), lower(new.email));
  return new;
end $$;
create trigger al_crear_usuario after insert on auth.users for each row execute function public.nuevo_perfil();

-- códigos de 6 cifras (solo los usa la función «registro» con la clave de servicio)
create table public.codigos_correo (
  user_id uuid not null references auth.users (id) on delete cascade,
  purpose text not null check (purpose in ('verify', 'reset')),
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  last_sent_at timestamptz not null default now(),
  primary key (user_id, purpose)
);
alter table public.codigos_correo enable row level security;

-- progreso: el estado completo de la app (p) y cifras sueltas para ver el uso
create table public.progreso (
  user_id uuid primary key references auth.users (id) on delete cascade,
  p text not null,
  ts bigint not null default 0,
  millas int not null default 0,
  respuestas int not null default 0,
  aciertos int not null default 0,
  dias int not null default 0,
  simulacros int not null default 0,
  actualizado timestamptz not null default now()
);
alter table public.progreso enable row level security;
create policy "leer mi progreso" on public.progreso for select to authenticated using (user_id = (select auth.uid()));
create policy "crear mi progreso" on public.progreso for insert to authenticated with check (user_id = (select auth.uid()));
create policy "cambiar mi progreso" on public.progreso for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- uso: vista para el administrador (solo desde el panel de Supabase, no desde la app)
create view public.uso with (security_invoker = true) as
select f.nombre, f.email, f.creado as registro, u.email_confirmed_at is not null as verificado,
       u.last_sign_in_at as ultimo_acceso, g.actualizado as ultima_actividad,
       coalesce(g.millas, 0) as millas, coalesce(g.dias, 0) as dias_de_estudio,
       coalesce(g.respuestas, 0) as respuestas, coalesce(g.aciertos, 0) as aciertos,
       coalesce(g.simulacros, 0) as simulacros
from public.perfiles f join auth.users u on u.id = f.id left join public.progreso g on g.user_id = f.id;
revoke all on public.uso from anon, authenticated;
