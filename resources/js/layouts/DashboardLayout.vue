<script setup lang="ts">
import { ref } from 'vue'

const sidebarOpen = ref(true)

function isActive(path: string): boolean {
  return window.location.pathname.startsWith(path)
}
</script>

<template>
  <div class="flex min-h-screen bg-muted/30">
    <aside class="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card transition-all" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-64'">
      <div class="flex h-16 items-center gap-2 border-b border-border/50 px-6">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-sm font-bold text-white">W</span>
        <span class="text-lg font-bold text-card-foreground">Wasiyuq Admin</span>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto p-4">
        <a href="/admin" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin') && !isActive('/admin/mascotas') && !isActive('/admin/organizaciones') && !isActive('/admin/eventos') && !isActive('/admin/blog') && !isActive('/admin/adopciones') && !isActive('/admin/seguimiento') && !isActive('/admin/usuarios') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Dashboard
        </a>

        <div class="my-3 border-t border-border/50" />

        <a href="/admin/mascotas" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/mascotas') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
          Mascotas
        </a>

        <a href="/admin/organizaciones" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/organizaciones') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          Organizaciones
        </a>

        <a href="/admin/eventos" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/eventos') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Eventos
        </a>

        <a href="/admin/blog" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/blog') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          Blog
        </a>

        <a href="/admin/usuarios" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/usuarios') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          Usuarios
        </a>

        <a href="/admin/roles" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/roles') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
          Roles
        </a>

        <div class="my-3 border-t border-border/50" />

        <a href="/admin/adopciones" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/adopciones') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          Adopciones
        </a>

        <a href="/admin/seguimiento" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition" :class="isActive('/admin/seguimiento') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          Seguimiento
        </a>
      </nav>

      <div class="border-t border-border/50 p-4 space-y-1">
        <a href="/admin/perfil" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition" :class="isActive('/admin/perfil') ? 'bg-[#2D6A4F] text-white' : 'text-muted-foreground hover:bg-accent'">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Mi Perfil
        </a>
        <a href="/" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Volver al sitio
        </a>
      </div>
    </aside>

    <div class="flex flex-1 flex-col" :class="sidebarOpen ? 'ml-64' : 'ml-0'">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <button class="rounded-lg p-2 text-muted-foreground hover:bg-accent transition" @click="sidebarOpen = !sidebarOpen">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <div class="flex items-center gap-4">
          <a href="/admin/perfil" class="text-sm text-muted-foreground hover:text-foreground">Mi Perfil</a>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
