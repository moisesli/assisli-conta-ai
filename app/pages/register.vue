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
    // Registro exitoso — redirige al dashboard
    await navigateTo("/dashboard");
  }
  loading.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-md">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">Crear cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para crear tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister">
          <FieldGroup>
            <Field>
              <Button variant="outline" type="button" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Google
              </Button>
            </Field>

            <Field>
              <FieldLabel for="name">Nombre completo</FieldLabel>
              <div class="grid grid-cols-2 gap-4">
                <Input
                  id="first-name"
                  v-model="firstName"
                  type="text"
                  placeholder="Nombre"
                />
                <Input
                  id="last-name"
                  v-model="lastName"
                  type="text"
                  placeholder="Apellido"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel for="email">Email</FieldLabel>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel for="password">Contraseña</FieldLabel>
              <Input
                id="password"
                v-model="password"
                type="password"
                required
                minlength="6"
              />
              <FieldDescription>Mínimo 6 caracteres</FieldDescription>
            </Field>

            <Field>
              <FieldLabel for="confirm-password"
                >Confirmar contraseña</FieldLabel
              >
              <Input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                required
                minlength="6"
              />
            </Field>

            <p v-if="errorMsg" class="text-sm text-destructive text-center">
              {{ errorMsg }}
            </p>

            <Field>
              <Button type="submit" class="w-full" :disabled="loading">
                {{ loading ? "Creando cuenta..." : "Crear cuenta" }}
              </Button>
              <FieldDescription class="text-center">
                ¿Ya tienes cuenta?
                <NuxtLink to="/login">Inicia sesión</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center text-balance">
      Al continuar, aceptas nuestros
      <a href="#">Términos de Servicio</a>
      y
      <a href="#">Política de Privacidad</a>.
    </FieldDescription>
  </div>
</template>
