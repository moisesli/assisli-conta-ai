<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function handleRegister() {
  errorMsg.value = "";
  loading.value = true;

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Las contraseñas no coinciden";
    loading.value = false;
    return;
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        first_name: firstName.value || undefined,
        last_name: lastName.value || undefined,
      },
    },
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    // Registro exitoso — redirige a confirmación
    await navigateTo("/confirm");
  }
  loading.value = false;
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">Crear cuenta</h1>

      <form @submit.prevent="handleRegister" class="form">
        <input
          v-model="firstName"
          type="text"
          placeholder="Nombre (opcional)"
          class="input"
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Apellido (opcional)"
          class="input"
        />
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
          minlength="6"
          class="input"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          required
          minlength="6"
          class="input"
        />

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? "Creando cuenta..." : "Registrarse" }}
        </button>
      </form>

      <p class="login-link">
        ¿Ya tienes cuenta?
        <NuxtLink to="/login">Inicia sesión</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #1a1a2e;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #3b82f6;
}

.btn {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-link a {
  color: #3b82f6;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
