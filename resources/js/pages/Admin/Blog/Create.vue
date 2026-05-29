<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import InputError from '@/components/InputError.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Team {
  id: number
  name: string
  slug: string
}

defineProps<{ teams: Team[] }>()

const form = useForm({
  team_id: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: '',
  tags: '',
  is_published: false,
})

function submit() {
  form.transform((data) => ({
    ...data,
    tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : data.tags,
  })).post('/admin/blog')
}
</script>

<template>
  <div>
    <a href="/admin/blog" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver al blog
    </a>

    <div class="mt-4">
      <h1 class="text-2xl font-bold text-foreground">Nuevo Artículo</h1>
      <p class="mt-1 text-sm text-muted-foreground">Crea un nuevo artículo para el blog.</p>
    </div>

    <form @submit.prevent="submit" class="mt-6 max-w-lg space-y-5">
      <div class="space-y-1.5">
        <Label for="team_id">Organización *</Label>
        <Select @update:model-value="(v: string) => form.team_id = v">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Seleccionar organización" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="team in teams" :key="team.id" :value="String(team.id)">{{ team.name }}</SelectItem>
          </SelectContent>
        </Select>
        <InputError :message="form.errors.team_id" />
      </div>

      <div class="space-y-1.5">
        <Label for="title">Título *</Label>
        <Input id="title" v-model="form.title" :disabled="form.processing" />
        <InputError :message="form.errors.title" />
      </div>

      <div class="space-y-1.5">
        <Label for="excerpt">Extracto</Label>
        <textarea id="excerpt" v-model="form.excerpt" rows="2" class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" :disabled="form.processing" placeholder="Breve resumen del artículo" />
        <InputError :message="form.errors.excerpt" />
      </div>

      <div class="space-y-1.5">
        <Label for="content">Contenido *</Label>
        <textarea id="content" v-model="form.content" rows="10" class="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" :disabled="form.processing" />
        <InputError :message="form.errors.content" />
      </div>

      <div class="space-y-1.5">
        <Label for="cover_image">URL de imagen de portada</Label>
        <Input id="cover_image" v-model="form.cover_image" placeholder="https://" :disabled="form.processing" />
        <InputError :message="form.errors.cover_image" />
      </div>

      <div class="space-y-1.5">
        <Label for="category">Categoría</Label>
        <Input id="category" v-model="form.category" placeholder="Ej: Salud, Adopción, Consejos" :disabled="form.processing" />
        <InputError :message="form.errors.category" />
      </div>

      <div class="space-y-1.5">
        <Label for="tags">Tags</Label>
        <Input id="tags" v-model="form.tags" placeholder="separados por coma: perros, gatos, cuidados" :disabled="form.processing" />
        <p class="text-xs text-muted-foreground/70">Separa múltiples tags con coma.</p>
        <InputError :message="form.errors.tags" />
      </div>

      <div class="flex items-center gap-2">
        <input id="is_published" type="checkbox" v-model="form.is_published" class="h-4 w-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-[#2D6A4F]" :disabled="form.processing" />
        <Label for="is_published" class="!m-0">Publicar inmediatamente</Label>
      </div>
      <InputError :message="form.errors.is_published" />

      <div class="flex items-center gap-3 pt-2">
        <Button type="submit" :disabled="form.processing" class="bg-[#2D6A4F] text-white hover:bg-[#1B4332]">
          {{ form.processing ? 'Guardando...' : 'Guardar' }}
        </Button>
        <a href="/admin/blog" class="text-sm text-muted-foreground hover:text-foreground">Cancelar</a>
      </div>
    </form>
  </div>
</template>
