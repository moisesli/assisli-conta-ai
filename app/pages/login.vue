<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function handleLogin() {
  errorMsg.value = "";
  loading.value = true;

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    await navigateTo("/dashboard");
  }
  loading.value = false;
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">Iniciar sesión</h1>

      <form @submit.prevent="handleLogin" class="form">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="input"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
          class="input"
        />

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? "Iniciando sesión..." : "Iniciar sesión" }}
        </button>
      </form>

      <p class="register-link">
        ¿No tienes cuenta?
        <NuxtLink to="/register">Crear cuenta</NuxtLink>
      </p>
    </div>
  </div>
</template>
