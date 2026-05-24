<script setup lang="ts">
const supabase = useSupabaseClient();

async function handleLogout() {
  await supabase.auth.signOut();
  await navigateTo("/login");
}
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p>Bienvenido al panel de control.</p>
    <button @click="handleLogout">Cerrar sesión</button>
  </div>
</template>
