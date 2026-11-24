-- Rumbo al PPER: cada cuenta solo puede usarse en UN dispositivo a la vez.
-- Gana el último que entra: el anterior se cierra solo («Tu cuenta se ha abierto en otro dispositivo»).
-- Cada navegador tiene un identificador propio (dispositivo) guardado en su almacenamiento local.

create table public.sesiones (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dispositivo text not null,
  desde timestamptz not null default now(),
  visto timestamptz not null default now()
);
alter table public.sesiones enable row level security;
-- sin políticas: solo se toca con las funciones de abajo

-- Al iniciar sesión: este dispositivo pasa a ser el activo (y expulsa al anterior)
create function public.reclamar_sesion(d text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null or coalesce(length(d), 0) < 8 or not public.tengo_acceso() then return false; end if;
  insert into public.sesiones (user_id, dispositivo) values ((select auth.uid()), d)
  on conflict (user_id) do update set dispositivo = excluded.dispositivo, desde = now(), visto = now();
  return true;
end $$;

-- Mientras se usa: ¿sigue siendo este el dispositivo activo? (si la cuenta no tenía ninguno, lo adopta)
create function public.sesion_valida(d text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare actual text;
begin
  if (select auth.uid()) is null or coalesce(length(d), 0) < 8 then return false; end if;
  select dispositivo into actual from public.sesiones where user_id = (select auth.uid());
  if actual is null then
    insert into public.sesiones (user_id, dispositivo) values ((select auth.uid()), d) on conflict (user_id) do nothing;
    return true;
  end if;
  if actual <> d then return false; end if;
  update public.sesiones set visto = now() where user_id = (select auth.uid());
  return true;
end $$;

-- dispositivo activo de quien llama (para las políticas del progreso)
create function public.mi_dispositivo() returns text
language sql stable security definer set search_path = '' as $$
  select dispositivo from public.sesiones where user_id = (select auth.uid());
$$;

revoke all on function public.reclamar_sesion(text), public.sesion_valida(text), public.mi_dispositivo() from public, anon;
grant execute on function public.reclamar_sesion(text), public.sesion_valida(text), public.mi_dispositivo() to authenticated;

-- el progreso solo se guarda desde el dispositivo activo (el expulsado no puede pisar los datos)
alter table public.progreso add column dispositivo text not null default '';
drop policy "crear mi progreso" on public.progreso;
drop policy "cambiar mi progreso" on public.progreso;
create policy "crear mi progreso" on public.progreso for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.tengo_acceso()) and dispositivo = (select public.mi_dispositivo()));
create policy "cambiar mi progreso" on public.progreso for update to authenticated
  using (user_id = (select auth.uid()) and (select public.tengo_acceso()))
  with check (user_id = (select auth.uid()) and (select public.tengo_acceso()) and dispositivo = (select public.mi_dispositivo()));
