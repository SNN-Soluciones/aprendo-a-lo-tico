-- Instituciones y grupos (DISENO.md, B21 a B24): escuelas y hogares, quién es qué en cada una, los códigos para unirse,
-- los años lectivos, los grupos con su código de clase y sus docentes. Los códigos de invitación se guardan solo como
-- hash SHA-256; el de clase, tal cual (la maestra lo vuelve a ver para imprimir las tarjetas).

-- Admins de plataforma (el equipo, B21). Se marcan a mano, con el rol dueño de la base:
--   insert into public.administradores (usuario_id, desde, motivo) values ('…', now(), 'Soporte de escuelas');
create table public.administradores (
    usuario_id uuid primary key references public.usuarios (id),
    desde      timestamptz not null,
    motivo     text not null check (btrim(motivo) <> '')
);

-- Una escuela (la crea el equipo) o un hogar (lo crea una familia). Los datos de ubicación son solo de las escuelas.
create table public.instituciones (
    id                 uuid primary key default gen_random_uuid(),
    tipo               text not null check (tipo in ('ESCUELA', 'HOGAR')),
    nombre             text not null check (btrim(nombre) <> '' and length(nombre) <= 120),
    codigo_mep         text unique check (codigo_mep ~ '^[0-9]{1,8}$'),
    provincia          text check (provincia in ('SAN_JOSE', 'ALAJUELA', 'CARTAGO', 'HEREDIA', 'GUANACASTE', 'PUNTARENAS', 'LIMON')),
    canton             text check (btrim(canton) <> '' and length(canton) <= 60),
    direccion_regional text check (btrim(direccion_regional) <> '' and length(direccion_regional) <= 80),
    creada_en          timestamptz not null,
    check (tipo = 'ESCUELA' or (codigo_mep is null and provincia is null and canton is null and direccion_regional is null))
);

-- Quién es qué en cada institución. Salir no borra la fila: se le pone «hasta» (queda la historia).
create table public.membresias (
    id             uuid primary key default gen_random_uuid(),
    usuario_id     uuid not null references public.usuarios (id),
    institucion_id uuid not null references public.instituciones (id),
    rol            text not null check (rol in ('DOCENTE', 'DIRECCION', 'ENCARGADO')),
    desde          timestamptz not null,
    hasta          timestamptz,
    check (hasta is null or hasta >= desde)
);
create unique index membresias_vigente_idx on public.membresias (usuario_id, institucion_id, rol) where hasta is null;
create index membresias_institucion_idx on public.membresias (institucion_id) where hasta is null;

-- Códigos para unirse (B22): de un solo uso, con fecha de vencimiento y el rol que dan.
create table public.invitaciones (
    id             uuid primary key default gen_random_uuid(),
    institucion_id uuid not null references public.instituciones (id),
    rol            text not null check (rol in ('DOCENTE', 'DIRECCION', 'ENCARGADO')),
    codigo_hash    bytea not null unique check (octet_length(codigo_hash) = 32),
    creada_por     uuid not null references public.usuarios (id),
    creada_en      timestamptz not null,
    expira_en      timestamptz not null,
    usada_en       timestamptz,
    usada_por      uuid references public.usuarios (id),
    revocada_en    timestamptz,
    check ((usada_en is null) = (usada_por is null))
);
create index invitaciones_pendientes_idx on public.invitaciones (institucion_id) where usada_en is null and revocada_en is null;
create index invitaciones_expira_idx on public.invitaciones (expira_en);

-- El curso de cada institución (B24): se crea solo con el primer grupo del año.
create table public.anios_lectivos (
    id             uuid primary key default gen_random_uuid(),
    institucion_id uuid not null references public.instituciones (id),
    anio           smallint not null check (anio between 2020 and 2100),
    desde          date not null,
    hasta          date not null,
    check (hasta > desde),
    unique (institucion_id, anio)
);

-- Un grupo («2-3»): grado de 0 (preparatoria) a 6. El código de clase va sin 0, O, 1 ni I.
create table public.grupos (
    id              uuid primary key default gen_random_uuid(),
    anio_lectivo_id uuid not null references public.anios_lectivos (id),
    grado           smallint not null check (grado between 0 and 6),
    seccion         text not null check (seccion ~ '^[0-9A-Z]{1,4}$'),
    codigo_clase    text not null unique check (codigo_clase ~ '^[2-9A-HJ-NP-Z]{6}$'),
    creado_en       timestamptz not null,
    unique (anio_lectivo_id, grado, seccion)
);

-- Quién da clases en cada grupo: una titular como mucho y las de materia (inglés, música…).
create table public.docentes_grupo (
    grupo_id   uuid not null references public.grupos (id),
    usuario_id uuid not null references public.usuarios (id),
    papel      text not null check (papel in ('TITULAR', 'MATERIA')),
    materia    text check (btrim(materia) <> '' and length(materia) <= 40),
    desde      timestamptz not null,
    primary key (grupo_id, usuario_id),
    check ((papel = 'MATERIA') = (materia is not null))
);
create unique index docentes_grupo_titular_idx on public.docentes_grupo (grupo_id) where papel = 'TITULAR';
create index docentes_grupo_usuario_idx on public.docentes_grupo (usuario_id);
