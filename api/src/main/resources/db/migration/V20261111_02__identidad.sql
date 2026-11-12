-- Identidad: las cuentas de las personas adultas (maestras, dirección, familias), sus sesiones y la recuperación de
-- la clave (DISENO.md, secciones 3 y 4). Los tokens se guardan solo como hash SHA-256 (32 bytes): una copia de la base
-- no sirve para entrar. Las fechas que deciden si algo sigue valiendo las pone la aplicación con su reloj.

-- Una cuenta existe solo con el correo confirmado (B18): no hay cuentas «a medias» que alguien pueda dejar preparadas.
create table public.usuarios (
    id                   uuid primary key default gen_random_uuid(),
    -- En minúsculas y sin espacios: así «Maria@X.cr» y «maria@x.cr» son la misma cuenta
    correo               text not null unique check (correo = lower(btrim(correo)) and correo like '_%@_%'),
    nombre               text not null check (btrim(nombre) <> ''),
    clave_hash           text not null,
    correo_confirmado_en timestamptz not null,
    creado_en            timestamptz not null,
    clave_cambiada_en    timestamptz not null
);

-- Quien pide una cuenta queda aquí hasta que abre el enlace del correo (24 h). Solo el correo: el nombre y la clave se
-- escriben al abrir el enlace, así que nada de lo que ponga quien pidió la cuenta llega a la cuenta de otra persona.
-- Puede haber varios para el mismo correo (lo pidió dos veces): al confirmar uno se crea la cuenta y se borran todos.
create table public.registros_pendientes (
    id         uuid primary key default gen_random_uuid(),
    correo     text not null check (correo = lower(btrim(correo))),
    token_hash bytea not null unique check (octet_length(token_hash) = 32),
    creado_en  timestamptz not null,
    expira_en  timestamptz not null
);
create index registros_pendientes_correo_idx on public.registros_pendientes (correo);
create index registros_pendientes_expira_idx on public.registros_pendientes (expira_en);

-- Una fila por cada vez que alguien entra. Vale hasta expira_en (30 días) y mientras se use (7 días sin uso la cierran).
-- Sin IP: no hace falta, y el hash de una IPv4 se revierte probando todas.
create table public.sesiones (
    id         uuid primary key default gen_random_uuid(),
    usuario_id uuid not null references public.usuarios (id),
    token_hash bytea not null unique check (octet_length(token_hash) = 32),
    creada_en  timestamptz not null,
    vista_en   timestamptz not null,
    expira_en  timestamptz not null,
    cerrada_en timestamptz,
    -- El navegador (cortado), para reconocer las sesiones abiertas
    agente     text check (length(agente) <= 200)
);
create index sesiones_usuario_abiertas_idx on public.sesiones (usuario_id) where cerrada_en is null;
create index sesiones_expira_idx on public.sesiones (expira_en);

-- Enlaces para poner una clave nueva: 30 minutos y un solo uso.
create table public.recuperaciones (
    id         uuid primary key default gen_random_uuid(),
    usuario_id uuid not null references public.usuarios (id),
    token_hash bytea not null unique check (octet_length(token_hash) = 32),
    creada_en  timestamptz not null,
    expira_en  timestamptz not null,
    usada_en   timestamptz
);
create index recuperaciones_usuario_idx on public.recuperaciones (usuario_id) where usada_en is null;
create index recuperaciones_expira_idx on public.recuperaciones (expira_en);
