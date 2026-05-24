<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<{
  as?: string;
  asChild?: boolean;
  isActive?: boolean;
  class?: HTMLAttributes["class"];
}>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <Primitive
    :as="as || 'a'"
    :as-child="asChild"
    data-slot="sidebar-menu-sub-button"
    data-sidebar="menu-sub-button"
    :data-active="isActive"
    :class="
      cn(
        'peer/menu-sub-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'h-7 text-xs',
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
