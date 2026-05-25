-- 002_rls_categorias.sql
-- Habilita Row Level Security y crea políticas para la tabla categorias

alter table categorias enable row level security;

-- Política: los usuarios solo pueden ver sus propias categorías
create policy "Usuarios ven sus propias categorías"
  on categorias
  for select
  using (auth.uid() = usuario_id);

-- Política: los usuarios autenticados pueden crear sus propias categorías
create policy "Usuarios pueden crear sus propias categorías"
  on categorias
  for insert
  with check (auth.uid() = usuario_id);

-- Política: los usuarios pueden actualizar sus propias categorías
create policy "Usuarios pueden actualizar sus propias categorías"
  on categorias
  for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

-- Política: los usuarios pueden eliminar sus propias categorías
create policy "Usuarios pueden eliminar sus propias categorías"
  on categorias
  for delete
  using (auth.uid() = usuario_id);
