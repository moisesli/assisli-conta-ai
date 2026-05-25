<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Categoria = {
  id: number;
  usuario_id: string;
  nombre: string;
  descripcion: string | null;
  tipo_ciclo: "mensual" | "dias";
  ciclo_dias: number | null;
  created_at: string;
};

defineProps<{
  open: boolean;
  categoria: Categoria | null;
  deleting: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  close: [];
}>();
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogDescription>
          Esta acción eliminará la categoría seleccionada y no se puede
          deshacer.
        </DialogDescription>
      </DialogHeader>

      <div class="rounded-lg border bg-muted/40 p-4 text-sm">
        <p class="font-medium">{{ categoria?.nombre }}</p>
        <p class="text-muted-foreground mt-1">
          {{ categoria?.descripcion || "Sin descripción" }}
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('close')">Cancelar</Button>
        <Button
          variant="destructive"
          :disabled="deleting"
          @click="emit('confirm')"
        >
          {{ deleting ? "Eliminando..." : "Confirmar eliminación" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
