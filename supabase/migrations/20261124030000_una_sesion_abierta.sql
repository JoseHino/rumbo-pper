-- Rumbo al PPER: la cuenta se puede usar en cualquier dispositivo, pero NUNCA en dos a la vez.
-- Una sesión está «abierta» mientras la app está en pantalla (la app avisa cada minuto). Si se cierra, se deja en
-- segundo plano o se bloquea el móvil, la app la libera al momento; si se apaga o pierde la conexión, a los 2 minutos.
-- Otro dispositivo solo puede entrar cuando no hay ninguna sesión abierta. (Sustituye a la regla del dispositivo fijo.)

-- Ocupa la sesión para este dispositivo si está libre (o ya era suya). Sirve al entrar y como «sigo aquí» cada minuto.
create or replace function public.reclamar_sesion(d text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare actual text; ultimo timestamptz;
begin
  if (select auth.uid()) is null or coalesce(length(d), 0) < 8 or not public.tengo_acceso() then return false; end if;
  if public.sin_limite() then return true; end if;
  select dispositivo, visto into actual, ultimo from public.sesiones where user_id = (select auth.uid()) for update;
  if actual is null then
    insert into public.sesiones (user_id, dispositivo) values ((select auth.uid()), d)
    on conflict (user_id) do update set dispositivo = excluded.dispositivo, desde = now(), visto = now();
    return true;
  end if;
  if actual = d then
    update public.sesiones set visto = now() where user_id = (select auth.uid());
    return true;
  end if;
  if ultimo < now() - interval '2 minutes' then
    update public.sesiones set dispositivo = d, desde = now(), visto = now() where user_id = (select auth.uid());
    return true;
  end if;
  return false;
end $$;

-- Igual que reclamar (se mantiene el nombre que usa la app)
create or replace function public.sesion_valida(d text) returns boolean
language sql security definer set search_path = '' as $$
  select public.reclamar_sesion(d);
$$;

-- Al cerrar la app, dejarla en segundo plano o cerrar sesión: libera la sesión al momento
create function public.liberar_sesion(d text) returns void
language sql security definer set search_path = '' as $$
  update public.sesiones set visto = 'epoch' where user_id = (select auth.uid()) and dispositivo = d;
$$;
revoke all on function public.liberar_sesion(text) from public, anon;
grant execute on function public.liberar_sesion(text) to authenticated;
