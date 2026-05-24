<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { SidebarMenuButtonVariants } from ".";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { sidebarMenuButtonVariants } from ".";

interface SidebarMenuButtonProps {
  as?: string;
  asChild?: boolean;
  variant?: SidebarMenuButtonVariants["variant"];
  size?: SidebarMenuButtonVariants["size"];
  isActive?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  as: "button",
  variant: "default",
  size: "default",
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="sidebar-menu-button"
    data-sidebar="menu-button"
    :data-active="isActive"
    :data-variant="variant"
    :data-size="size"
    :class="cn(sidebarMenuButtonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
