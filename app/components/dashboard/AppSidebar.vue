<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", icon: "LayoutDashboard", url: "/dashboard" },
  { title: "Proyectos", icon: "Folder", url: "#" },
  { title: "Equipo", icon: "Users", url: "#" },
  { title: "Configuración", icon: "Settings", url: "#" },
];
</script>

<template>
  <Sidebar collapsible="offcanvas" variant="inset">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            class="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <a href="#">
              <span class="text-base font-semibold">Assisli</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in navItems" :key="item.title">
          <SidebarMenuButton as-child :is-active="item.url === '/dashboard'">
            <a :href="item.url">
              <span>{{ item.title }}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child>
            <a href="/login">
              <span>Cerrar sesión</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
