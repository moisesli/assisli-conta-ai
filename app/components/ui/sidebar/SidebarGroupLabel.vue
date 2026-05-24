<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="sidebar-group-label"
    data-sidebar="group-label"
    :class="
      cn(
        'text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
