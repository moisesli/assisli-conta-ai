export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const client = process.client;

  const protectedRoutes = ["/dashboard"];
  const guestOnlyRoutes = ["/login", "/register"];

  // Intentar obtener el usuario. En cliente, si useSupabaseUser() aún
  // no se actualizó (ej: justo después de login), leer sesión directo.
  let isAuthenticated = !!user.value;
  if (!isAuthenticated && client) {
    const { data } = await supabase.auth.getSession();
    isAuthenticated = !!data.session;
  }

  // Si no hay usuario autenticado y la ruta está protegida
  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => to.path.startsWith(route))
  ) {
    return navigateTo("/login");
  }

  // Si hay usuario autenticado y la ruta es solo para invitados
  if (isAuthenticated && guestOnlyRoutes.includes(to.path)) {
    return navigateTo("/dashboard");
  }
});
