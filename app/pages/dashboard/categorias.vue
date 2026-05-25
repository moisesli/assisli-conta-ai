<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CategoriaFormDialog from "@/components/dashboard/categorias/CategoriaFormDialog.vue";
import CategoriaDeleteDialog from "@/components/dashboard/categorias/CategoriaDeleteDialog.vue";
import {
  IconCalendarMonth,
  IconCalendarRepeat,
  IconDotsVertical,
  IconEdit,
  IconHash,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-vue";
import { refDebounced } from "@vueuse/core";
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
const searchQuery = ref("");
const searchQueryDebounced = refDebounced(searchQuery, 300);
const page = ref(1);
const pageSize = 10;
const totalCount = ref(0);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / pageSize)),
);

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

function openCreateDialog() {
  formMode.value = "create";
  activeCategory.value = null;
  formOpen.value = true;
}

function openEditDialog(categoria: Categoria) {
  formMode.value = "edit";
  activeCategory.value = categoria;
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
  errorMessage.value = "";

  const searchTerm = searchQuery.value.trim();

  let query = supabase
    .from("categorias")
    .select(
      "id, usuario_id, nombre, descripcion, tipo_ciclo, ciclo_dias, created_at",
      { count: "exact" },
    )
    .eq("usuario_id", uid)
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`,
    );
  }

  const from = (page.value - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    errorMessage.value = error.message;
    categorias.value = [];
  } else {
    categorias.value = (data ?? []) as Categoria[];
    totalCount.value = count ?? 0;
  }

  loading.value = false;
}

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  fetchCategorias();
}

watch(searchQueryDebounced, () => {
  page.value = 1;
  fetchCategorias();
});

async function handleSave(
  payload: Database["public"]["Tables"]["categorias"]["Insert"],
) {
  const uid = currentUserId.value;
  if (!uid) return;

  errorMessage.value = "";
  saving.value = true;

  try {
    if (formMode.value === "create") {
      payload.usuario_id = uid;
      const { error } = await supabase.from("categorias").insert(payload);
      if (error) throw error;
    } else if (activeCategory.value) {
      const { error } = await supabase
        .from("categorias")
        .update(payload)
        .eq("id", activeCategory.value.id)
        .eq("usuario_id", uid);
      if (error) throw error;
    }

    formOpen.value = false;
    activeCategory.value = null;
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

async function handleDelete() {
  if (!activeCategory.value) return;

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
    if (resolved) await fetchCategorias();
  },
  { immediate: true },
);
</script>

<template>
  <div class="w-full max-w-5xl mx-auto">
    <div class="flex flex-col gap-3 p-3 md:p-4">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">Categorías</h1>
        <div class="flex items-center gap-2">
          <div class="relative w-48">
            <IconSearch
              class="text-muted-foreground pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2"
            />
            <input
              v-model="searchQuery"
              placeholder="Buscar…"
              class="border-input h-9 w-full rounded-md border bg-transparent pl-8 pr-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <Button
            size="sm"
            class="h-9 gap-1.5 px-3 cursor-pointer"
            @click="openCreateDialog"
          >
            <IconPlus class="h-4 w-4" />
            Nueva
          </Button>
        </div>
      </div>

      <p v-if="errorMessage" class="text-xs text-destructive">
        {{ errorMessage }}
      </p>

      <div class="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader class="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead class="hidden lg:table-cell w-10 text-center"
                ><IconHash class="mx-auto h-3.5 w-3.5"
              /></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead class="hidden md:table-cell w-36"
                >Descripción</TableHead
              >
              <TableHead class="w-24">Tipo</TableHead>
              <TableHead class="hidden sm:table-cell w-20">Ciclo</TableHead>
              <TableHead class="w-10"
                ><span class="sr-only">Acciones</span></TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody
            class="**:data-[slot=table-cell]:py-2 **:data-[slot=table-cell]:text-sm"
          >
            <TableRow v-if="loading">
              <TableCell
                colspan="6"
                class="py-8 text-center text-muted-foreground"
                >Cargando categorías…</TableCell
              >
            </TableRow>
            <TableRow v-else-if="categorias.length === 0">
              <TableCell
                colspan="6"
                class="py-8 text-center text-muted-foreground"
                >Todavía no tienes categorías.</TableCell
              >
            </TableRow>
            <TableRow v-for="categoria in categorias" :key="categoria.id">
              <TableCell
                class="hidden lg:table-cell w-10 text-center text-muted-foreground"
                >{{ categoria.id }}</TableCell
              >
              <TableCell class="font-medium">{{ categoria.nombre }}</TableCell>
              <TableCell class="hidden md:table-cell w-36 truncate">{{
                categoria.descripcion || "—"
              }}</TableCell>
              <TableCell class="w-24">
                <Badge
                  :variant="
                    categoria.tipo_ciclo === 'mensual' ? 'default' : 'secondary'
                  "
                  class="gap-1 text-xs"
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
              <TableCell
                class="hidden sm:table-cell w-20 text-muted-foreground"
              >
                {{
                  categoria.tipo_ciclo === "dias"
                    ? `${categoria.ciclo_dias} d`
                    : "—"
                }}
              </TableCell>
              <TableCell class="w-10" data-action-menu>
                <div class="relative inline-flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 cursor-pointer"
                    @click.stop="toggleMenu(categoria.id)"
                  >
                    <IconDotsVertical class="h-4 w-4" />
                    <span class="sr-only">Acciones</span>
                  </Button>
                  <div
                    v-if="openMenuId === categoria.id"
                    class="ring-foreground/10 bg-popover text-popover-foreground absolute right-0 top-full z-50 mt-1 min-w-28 rounded-lg p-1 shadow-md ring-1"
                  >
                    <button
                      class="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none"
                      @click.stop="
                        openEditDialog(categoria);
                        closeMenu();
                      "
                    >
                      <IconEdit class="h-4 w-4" /> Editar
                    </button>
                    <div class="bg-border mx-2 my-0.5 h-px" />
                    <button
                      class="hover:bg-accent hover:text-accent-foreground text-destructive flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none"
                      @click.stop="
                        openDeleteDialog(categoria);
                        closeMenu();
                      "
                    >
                      <IconTrash class="h-4 w-4" /> Eliminar
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div
        v-if="!loading && totalPages > 1"
        class="flex items-center justify-center gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
          >Anterior</Button
        >
        <span class="text-muted-foreground text-xs"
          >{{ page }} / {{ totalPages }}</span
        >
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= totalPages"
          @click="goToPage(page + 1)"
          >Siguiente</Button
        >
      </div>

      <CategoriaFormDialog
        :open="formOpen"
        :mode="formMode"
        :categoria="activeCategory"
        :saving="saving"
        @save="handleSave"
        @close="formOpen = false"
      />
      <CategoriaDeleteDialog
        :open="deleteOpen"
        :categoria="activeCategory"
        :deleting="deleting"
        @confirm="handleDelete"
        @close="deleteOpen = false"
      />
    </div>
  </div>
</template>
