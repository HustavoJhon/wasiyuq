<script setup lang="ts">
interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category: string
  tags: string[] | null
  published_at: string | null
  created_at: string
  updated_at: string
  team: { id: number; name: string; slug: string; logo: string | null; city: string | null; state: string | null }
  author: { id: number; name: string }
}

defineProps<{ post: BlogPost }>()

function formatDate(date: string | null): string {
  if (!date) {
return ''
}

  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(date))
}

function renderContent(content: string): string {
  return content
    .split('\n\n')
    .map(block => {
      if (block.startsWith('## ')) {
return '<h3 class="mt-8 text-lg font-semibold text-foreground">' + block.slice(3) + '</h3>'
}

      if (block.startsWith('- ')) {
        const items = block.split('\n').map(l => l.replace(/^- /, '')).filter(Boolean)

        return '<ul class="mt-2 list-disc pl-5 space-y-1">' + items.map(i => '<li>' + i + '</li>').join('') + '</ul>'
      }

      return '<p class="mt-4">' + block.replace(/\n/g, '<br>') + '</p>'
    })
    .join('')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
    <a href="/blog" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver al blog
    </a>

    <span class="mt-6 inline-block rounded-full bg-[#2D6A4F]/10 px-4 py-1 text-sm font-medium text-[#2D6A4F]">{{ post.category }}</span>

    <h1 class="mt-4 text-3xl font-bold tracking-tight text-foreground">{{ post.title }}</h1>

    <div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground/70">
      <span>{{ post.author.name }}</span>
      <span>{{ formatDate(post.published_at) }}</span>
    </div>

    <div class="mt-8 aspect-[16/9] rounded-2xl bg-gradient-to-br from-muted to-muted/80" />

    <div class="mt-10 text-muted-foreground leading-relaxed" v-html="renderContent(post.content)" />

    <div v-if="post.tags !== null && post.tags !== undefined && post.tags.length > 0" class="mt-10 flex flex-wrap gap-2">
      <span v-for="tag in post.tags" :key="tag" class="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">#{{ tag }}</span>
    </div>
  </div>
</template>
