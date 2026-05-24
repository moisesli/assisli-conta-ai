<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="
      cn(
        'bg-sidebar-border mx-2 w-auto data-[side=left]:data-[collapsible=offcanvas]:mx-0 data-[side=right]:data-[collapsible=offcanvas]:mx-0',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
