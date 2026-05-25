-- 001_initial_schema.sql

create table categorias (
  id          bigint primary key generated always as identity,
  usuario_id  uuid not null references auth.users(id) on delete cascade,
  nombre      text not null,
  descripcion text,
  tipo_ciclo  text not null check (tipo_ciclo in ('mensual', 'dias')),
  ciclo_dias  int check (
    (tipo_ciclo = 'dias' and ciclo_dias is not null and ciclo_dias > 0)
    or
    (tipo_ciclo = 'mensual' and ciclo_dias is null)
  ),
  created_at  timestamptz not null default now()
);

create table periodos (
  id            bigint primary key generated always as identity,
  categoria_id  bigint not null references categorias(id) on delete cascade,
  fecha_inicio  date not null,
  fecha_fin     date not null,
  cerrado       boolean not null default false,
  created_at    timestamptz not null default now()
);

create table registros (
  id          bigint primary key generated always as identity,
  periodo_id  bigint not null references periodos(id) on delete cascade,
  descripcion text not null,
  monto       numeric(10,2) not null check (monto > 0),
  fecha       date not null default current_date,
  created_at  timestamptz not null default now()
);

-- indices para las consultas mas frecuentes
create index on periodos(categoria_id, cerrado);
create index on registros(periodo_id);