<script setup lang="ts">
import {
  IconDashboard,
  IconFolder,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconHelp,
  IconDatabase,
  IconReport,
  IconFileDescription,
  IconInnerShadowTop,
  IconLogout,
} from "@tabler/icons-vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const supabase = useSupabaseClient();

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Proyectos", url: "#", icon: IconFolder },
  { title: "Analíticas", url: "#", icon: IconChartBar },
  { title: "Equipo", url: "#", icon: IconUsers },
];

const navSecondary = [
  { title: "Configuración", url: "#", icon: IconSettings },
  { title: "Ayuda", url: "#", icon: IconHelp },
];

const documents = [
  { name: "Librería de datos", url: "#", icon: IconDatabase },
  { name: "Reportes", url: "#", icon: IconReport },
  { name: "Asistente", url: "#", icon: IconFileDescription },
];

const user = {
  name: "Usuario",
  email: "usuario@example.com",
};

async function handleLogout() {
  await supabase.auth.signOut();
  await navigateTo("/login");
}
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
            <a href="#" class="flex items-center gap-2 font-medium">
              <div
                class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
              >
                <IconInnerShadowTop class="size-4" />
              </div>
              Assisli
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent class="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navMain" :key="item.title">
              <SidebarMenuButton
                as-child
                :is-active="item.url === '/dashboard'"
                :tooltip="item.title"
              >
                <a :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup class="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Documentos</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="doc in documents" :key="doc.name">
            <SidebarMenuButton as-child>
              <a :href="doc.url">
                <component :is="doc.icon" />
                <span>{{ doc.name }}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navSecondary" :key="item.title">
              <SidebarMenuButton as-child>
                <a :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarSeparator />
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="text-muted-foreground truncate text-xs">{{
                user.email
              }}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton @click="handleLogout">
            <IconLogout />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
