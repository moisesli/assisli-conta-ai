<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  IconCalendarMonth,
  IconCalendarRepeat,
  IconDotsVertical,
  IconEdit,
  IconHash,
  IconTrash,
} from "@tabler/icons-vue";
import type { Database } from "@/types/database.types";

type Categoria = {
  id: number;
  usuario_id: string;
  nombre: string;
  descripcion: string | null;
  tipo_ciclo: "mensual" | "dias";
  ciclo_dias: number | null;
  created_at: string;
};

type CategoriaInsert = Database["public"]["Tables"]["categorias"]["Insert"];

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const categorias = ref<Categoria[]>([]);
const currentUserId = ref<string | null>(null);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const errorMessage = ref("");

const formOpen = ref(false);
const deleteOpen = ref(false);
const formMode = ref<"create" | "edit">("create");
const activeCategory = ref<Categoria | null>(null);

const openMenuId = ref<number | null>(null);

function toggleMenu(id: number) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest("[data-action-menu]")) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const form = reactive({
  nombre: "",
  descripcion: "",
  tipo_ciclo: "mensual" as "mensual" | "dias",
  ciclo_dias: "",
});

function resetForm() {
  form.nombre = "";
  form.descripcion = "";
  form.tipo_ciclo = "mensual";
  form.ciclo_dias = "";
  activeCategory.value = null;
}

function openCreateDialog() {
  formMode.value = "create";
  resetForm();
  formOpen.value = true;
}

function openEditDialog(categoria: Categoria) {
  formMode.value = "edit";
  activeCategory.value = categoria;
  form.nombre = categoria.nombre;
  form.descripcion = categoria.descripcion ?? "";
  form.tipo_ciclo = categoria.tipo_ciclo;
  form.ciclo_dias = categoria.ciclo_dias?.toString() ?? "";
  formOpen.value = true;
}

function openDeleteDialog(categoria: Categoria) {
  activeCategory.value = categoria;
  deleteOpen.value = true;
}

async function fetchCategorias() {
  const uid = currentUserId.value;
  if (!uid) {
    categorias.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  const { data, error } = await supabase
    .from("categorias")
    .select(
      "id, usuario_id, nombre, descripcion, tipo_ciclo, ciclo_dias, created_at",
    )
    .eq("usuario_id", uid)
    .order("created_at", { ascending: false });

  if (error) {
    errorMessage.value = error.message;
    categorias.value = [];
  } else {
    categorias.value = (data ?? []) as Categoria[];
  }

  loading.value = false;
}

function normalizeDescripcion(value: string) {
  return value.trim() || null;
}

function buildPayload(): CategoriaInsert {
  const nombre = form.nombre.trim();
  const descripcion = normalizeDescripcion(form.descripcion);
  const uid = currentUserId.value;

  if (!nombre) {
    throw new Error("El nombre es obligatorio");
  }

  if (!uid) {
    throw new Error("Usuario no autenticado");
  }

  if (form.tipo_ciclo === "dias") {
    const cicloDias = Number(form.ciclo_dias);
    if (!Number.isInteger(cicloDias) || cicloDias <= 0) {
      throw new Error("El ciclo en días debe ser mayor que cero");
    }

    return {
      nombre,
      descripcion,
      tipo_ciclo: form.tipo_ciclo,
      ciclo_dias: cicloDias,
      usuario_id: uid,
    };
  }

  return {
    nombre,
    descripcion,
    tipo_ciclo: form.tipo_ciclo,
    ciclo_dias: null,
    usuario_id: uid,
  };
}

async function saveCategory() {
  errorMessage.value = "";

  try {
    const payload = buildPayload();
    saving.value = true;

    if (formMode.value === "create") {
      const { error } = await supabase.from("categorias").insert(payload);
      if (error) throw error;
    } else if (activeCategory.value) {
      const { error } = await supabase
        .from("categorias")
        .update(payload)
        .eq("id", activeCategory.value.id)
        .eq("usuario_id", currentUserId.value!);
      if (error) throw error;
    }

    formOpen.value = false;
    resetForm();
    await fetchCategorias();
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "No se pudo guardar la categoría";
  } finally {
    saving.value = false;
  }
}

async function deleteCategory() {
  if (!activeCategory.value) {
    return;
  }

  errorMessage.value = "";
  deleting.value = true;

  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", activeCategory.value.id)
    .eq("usuario_id", currentUserId.value!);

  deleting.value = false;

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  deleteOpen.value = false;
  activeCategory.value = null;
  await fetchCategorias();
}

async function resolveUserId() {
  // Obtener usuario verificado desde el servidor de Auth
  const { data } = await supabase.auth.getUser();
  if (data.user?.id) {
    currentUserId.value = data.user.id;
    return true;
  }

  currentUserId.value = null;
  return false;
}

watch(
  user,
  async () => {
    const resolved = await resolveUserId();
    if (resolved) {
      await fetchCategorias();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
    <section class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Categorías</h1>
          <p class="text-muted-foreground text-sm">
            Lista, crea, edita y elimina categorías con diálogos de shadcn.
          </p>
        </div>

        <Button @click="openCreateDialog">Nueva categoría</Button>
      </div>

      <p v-if="errorMessage" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>
    </section>

    <div class="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader class="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead class="w-12 text-center">
              <IconHash class="mx-auto h-4 w-4" />
            </TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead class="w-48">Descripción</TableHead>
            <TableHead class="w-28">Tipo</TableHead>
            <TableHead class="w-28">Ciclo</TableHead>
            <TableHead class="w-14">
              <span class="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="**:data-[slot=table-cell]:first:w-8">
          <TableRow v-if="loading">
            <TableCell
              colspan="6"
              class="py-8 text-center text-muted-foreground"
            >
              Cargando categorías...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="categorias.length === 0">
            <TableCell
              colspan="6"
              class="py-8 text-center text-muted-foreground"
            >
              Todavía no tienes categorías.
            </TableCell>
          </TableRow>
          <TableRow v-for="categoria in categorias" :key="categoria.id">
            <TableCell class="w-12 text-center text-xs text-muted-foreground">
              {{ categoria.id }}
            </TableCell>
            <TableCell class="font-medium">{{ categoria.nombre }}</TableCell>
            <TableCell class="w-48 truncate">{{
              categoria.descripcion || "Sin descripción"
            }}</TableCell>
            <TableCell class="w-28">
              <Badge
                :variant="
                  categoria.tipo_ciclo === 'mensual' ? 'default' : 'secondary'
                "
                class="gap-1"
              >
                <IconCalendarMonth
                  v-if="categoria.tipo_ciclo === 'mensual'"
                  class="h-3 w-3"
                />
                <IconCalendarRepeat v-else class="h-3 w-3" />
                {{
                  categoria.tipo_ciclo === "mensual" ? "Mensual" : "Por días"
                }}
              </Badge>
            </TableCell>
            <TableCell class="w-28 text-xs text-muted-foreground">
              {{
                categoria.tipo_ciclo === "dias"
                  ? `${categoria.ciclo_dias} días`
                  : "—"
              }}
            </TableCell>
            <TableCell class="w-14" data-action-menu>
              <div class="relative inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-9 w-9"
                  @click.stop="toggleMenu(categoria.id)"
                >
                  <IconDotsVertical class="h-5 w-5" />
                  <span class="sr-only">Acciones</span>
                </Button>
                <div
                  v-if="openMenuId === categoria.id"
                  class="ring-foreground/10 bg-popover text-popover-foreground absolute right-0 top-full z-50 mt-1 min-w-32 rounded-lg p-1 shadow-md ring-1"
                >
                  <button
                    class="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none"
                    @click.stop="
                      openEditDialog(categoria);
                      closeMenu();
                    "
                  >
                    <IconEdit class="h-4 w-4" />
                    Editar
                  </button>
                  <div class="bg-border mx-2 my-0.5 h-px" />
                  <button
                    class="hover:bg-accent hover:text-accent-foreground text-destructive flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none"
                    @click.stop="
                      openDeleteDialog(categoria);
                      closeMenu();
                    "
                  >
                    <IconTrash class="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model:open="formOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {{ formMode === "create" ? "Crear categoría" : "Editar categoría" }}
          </DialogTitle>
          <DialogDescription>
            Usa este modal para crear o actualizar una categoría sin salir de la
            lista.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="nombre">Nombre</Label>
            <Input
              id="nombre"
              v-model="form.nombre"
              placeholder="Alimentación"
            />
          </div>

          <div class="grid gap-2">
            <Label for="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              placeholder="Opcional"
            />
          </div>

          <div class="grid gap-2">
            <Label for="tipo_ciclo">Tipo de ciclo</Label>
            <select
              id="tipo_ciclo"
              v-model="form.tipo_ciclo"
              class="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            >
              <option value="mensual">Mensual</option>
              <option value="dias">Días</option>
            </select>
          </div>

          <div v-if="form.tipo_ciclo === 'dias'" class="grid gap-2">
            <Label for="ciclo_dias">Ciclo en días</Label>
            <Input
              id="ciclo_dias"
              v-model="form.ciclo_dias"
              type="number"
              min="1"
              placeholder="30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="formOpen = false">Cancelar</Button>
          <Button :disabled="saving" @click="saveCategory">
            {{
              saving
                ? "Guardando..."
                : formMode === "create"
                  ? "Guardar"
                  : "Actualizar"
            }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="deleteOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar categoría</DialogTitle>
          <DialogDescription>
            Esta acción eliminará la categoría seleccionada y no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>

        <div class="rounded-lg border bg-muted/40 p-4 text-sm">
          <p class="font-medium">{{ activeCategory?.nombre }}</p>
          <p class="text-muted-foreground mt-1">
            {{ activeCategory?.descripcion || "Sin descripción" }}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="deleteOpen = false"
            >Cancelar</Button
          >
          <Button
            variant="destructive"
            :disabled="deleting"
            @click="deleteCategory"
          >
            {{ deleting ? "Eliminando..." : "Confirmar eliminación" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
