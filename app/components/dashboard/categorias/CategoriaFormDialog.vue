<script setup lang="ts">
import { reactive, watch } from "vue";
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

const props = withDefaults(
  defineProps<{
    open: boolean;
    mode: "create" | "edit";
    categoria: Categoria | null;
    saving: boolean;
  }>(),
  { categoria: null },
);

const emit = defineEmits<{
  save: [payload: CategoriaInsert];
  close: [];
}>();

const form = reactive({
  nombre: "",
  descripcion: "",
  tipo_ciclo: "mensual" as "mensual" | "dias",
  ciclo_dias: "",
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.mode === "edit" && props.categoria) {
      form.nombre = props.categoria.nombre;
      form.descripcion = props.categoria.descripcion ?? "";
      form.tipo_ciclo = props.categoria.tipo_ciclo;
      form.ciclo_dias = props.categoria.ciclo_dias?.toString() ?? "";
    } else if (isOpen) {
      form.nombre = "";
      form.descripcion = "";
      form.tipo_ciclo = "mensual";
      form.ciclo_dias = "";
    }
  },
);

function handleSave() {
  const payload: CategoriaInsert = {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim() || null,
    tipo_ciclo: form.tipo_ciclo,
    ciclo_dias: form.tipo_ciclo === "dias" ? Number(form.ciclo_dias) : null,
    usuario_id: props.categoria?.usuario_id ?? "",
  };
  emit("save", payload);
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {{ mode === "create" ? "Crear categoría" : "Editar categoría" }}
        </DialogTitle>
        <DialogDescription>
          Usa este modal para crear o actualizar una categoría sin salir de la
          lista.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nombre">Nombre</Label>
          <Input id="nombre" v-model="form.nombre" placeholder="Alimentación" />
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
        <Button variant="outline" @click="emit('close')">Cancelar</Button>
        <Button :disabled="saving" @click="handleSave">
          {{
            saving
              ? "Guardando..."
              : mode === "create"
                ? "Guardar"
                : "Actualizar"
          }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
