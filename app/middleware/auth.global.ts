export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient();

  const protectedRoutes = ["/dashboard"];
  const guestOnlyRoutes = ["/login", "/register"];

  // Obtener usuario verificado desde el servidor de Auth
  const { data } = await supabase.auth.getUser();
  const isAuthenticated = !!data.user;

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
