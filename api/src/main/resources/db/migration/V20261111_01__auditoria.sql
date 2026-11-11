-- Auditoría: quién vio o cambió qué dato, sobre todo de estudiantes (Ley 8968 y la confianza de las escuelas).
-- Solo se agregan filas: los disparadores impiden editarlas, borrarlas o vaciar la tabla. Contra alguien que se
-- apodere de la base no alcanzan: por eso la aplicación se conecta con un rol que no es dueño de la tabla y solo
-- puede leer y agregar (DISENO.md, sección 7); los disparadores son la segunda barrera.
-- El detalle lleva ids, no datos personales: esta tabla no se borra. Retención: ver DISENO.md.
create table public.auditoria (
    id             uuid primary key default gen_random_uuid(),
    en             timestamptz not null default now(),
    actor_tipo     text not null check (actor_tipo in ('USUARIO', 'ESTUDIANTE', 'SISTEMA')),
    actor_id       uuid,
    accion         text not null check (accion <> ''),
    recurso        text not null check (recurso <> ''),
    recurso_id     uuid,
    institucion_id uuid,
    pedido         text,
    detalle        jsonb not null default '{}'::jsonb
);

-- La auditoría de una escuela, de la más nueva a la más vieja; y todo lo que le pasó a un recurso
create index auditoria_institucion_en_idx on public.auditoria (institucion_id, en desc);
create index auditoria_recurso_idx on public.auditoria (recurso, recurso_id);

create function public.auditoria_solo_agregar() returns trigger
    language plpgsql as
$$
begin
    raise exception 'La auditoría no se edita ni se borra: solo se agregan filas';
end;
$$;

create trigger auditoria_sin_cambios
    before update or delete on public.auditoria
    for each row execute function public.auditoria_solo_agregar();

create trigger auditoria_sin_vaciar
    before truncate on public.auditoria
    for each statement execute function public.auditoria_solo_agregar();
