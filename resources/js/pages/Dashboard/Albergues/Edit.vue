<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, Upload, Save, Plus, X, Globe, MapPin, Phone } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();

interface Team {
    id: number; name: string; slug: string; bio: string | null; logo: string | null;
    website: string | null; phone: string | null; address: string | null; city: string | null;
    social_links: Record<string, string> | null; map_embed: string | null;
    gallery: string[] | null; support_info: Record<string, string> | null;
}

const props = defineProps<{ team: Team }>();

const form = useForm({
    name: props.team.name,
    bio: props.team.bio ?? '',
    website: props.team.website ?? '',
    phone: props.team.phone ?? '',
    address: props.team.address ?? '',
    city: props.team.city ?? '',
    logo: null as File | null,
    map_embed: props.team.map_embed ?? '',
    social_links: props.team.social_links ?? {} as Record<string, string>,
    gallery: props.team.gallery ?? [] as string[],
    gallery_files: [] as (File | null)[],
    support_info: props.team.support_info ?? {} as Record<string, string>,
});

const galleryFiles = ref<(File | null)[]>(new Array(props.team.gallery?.length ?? 0).fill(null));
const galleryPreviews = ref<string[]>(props.team.gallery ?? []);

function onGalleryFile(e: Event, i: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        galleryFiles.value[i] = file;
        form.gallery_files = galleryFiles.value;
        const r = new FileReader();
        r.onload = () => { galleryPreviews.value[i] = r.result as string; };
        r.readAsDataURL(file);
    }
}

function addGalleryUrl() {
    if (form.gallery.length < 6) {
        form.gallery.push('');
        galleryPreviews.value.push('');
        galleryFiles.value.push(null);
    }
}

function removeGalleryUrl(i: number) {
    form.gallery.splice(i, 1);
    galleryPreviews.value.splice(i, 1);
    galleryFiles.value.splice(i, 1);
    form.gallery_files = galleryFiles.value;
}
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <a :href="'/' + team.slug + '/dashboard'" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"><ArrowLeft class="h-4 w-4" /> Volver al dashboard</a>

        <div class="rounded-2xl border border-border/50 bg-card">
            <div class="border-b border-border/50 px-6 py-4"><h1 class="text-xl font-bold text-foreground">Editar perfil de {{ team.name }}</h1><p class="mt-1 text-sm text-muted-foreground">Esta información se muestra públicamente en la sección de Albergues.</p></div>

            <form @submit.prevent="submit" class="space-y-6 p-6">
                <!-- Logo + Name -->
                <div class="grid gap-6 sm:grid-cols-3">
                    <div>
                        <label class="block text-sm font-medium mb-2">Logo</label>
                        <div class="mb-3 h-32 w-32 overflow-hidden rounded-2xl border border-border bg-muted">
                            <img v-if="logoPreview" :src="logoPreview.startsWith('data:') ? logoPreview : photoUrl(logoPreview)" class="h-full w-full object-cover" />
                            <div v-else class="flex h-full items-center justify-center text-muted-foreground/30"><Upload class="h-8 w-8" /></div>
                        </div>
                        <label class="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"><Upload class="h-3.5 w-3.5" /> Cambiar logo<input type="file" accept="image/*" class="hidden" @change="onLogoChange" /></label>
                    </div>
                    <div class="sm:col-span-2 space-y-4">
                        <div><label class="block text-sm font-medium mb-1.5">Nombre *</label><input v-model="form.name" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div><label class="block text-sm font-medium mb-1.5">Ciudad</label><input v-model="form.city" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                            <div><label class="block text-sm font-medium mb-1.5">Teléfono</label><input v-model="form.phone" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        </div>
                        <div><label class="block text-sm font-medium mb-1.5">Dirección</label><input v-model="form.address" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        <div><label class="block text-sm font-medium mb-1.5">Sitio web</label><input v-model="form.website" type="url" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="https://..." /></div>
                    </div>
                </div>

                <!-- Bio -->
                <div><label class="block text-sm font-medium mb-1.5">Sobre nosotros (bio)</label><textarea v-model="form.bio" rows="4" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Contá la historia de tu organización..." /></div>

                <!-- Redes sociales -->
                <div>
                    <label class="block text-sm font-medium mb-2">Redes sociales</label>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div v-for="p in socialPlatforms" :key="p">
                            <label class="text-xs text-muted-foreground capitalize">{{ p }}</label>
                            <input v-model="form.social_links[p]" type="url" :placeholder="'https://' + p + '.com/...'" class="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal-500" />
                        </div>
                    </div>
                </div>

                <!-- Google Maps -->
                <div>
                    <label class="block text-sm font-medium mb-2">Google Maps (iframe embed)</label>
                    <textarea v-model="form.map_embed" rows="3" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>" />
                    <p class="text-[11px] text-muted-foreground mt-1">En Google Maps: Compartir → Incorporar mapa → copiá el código iframe.</p>
                    <div v-if="form.map_embed" class="mt-3 overflow-hidden rounded-xl border border-border" v-html="form.map_embed" style="height: 250px;" />
                </div>

                <!-- Galería -->
                <div>
                    <div class="flex items-center justify-between mb-2"><label class="text-sm font-medium">Galería de imágenes</label><button type="button" @click="addGalleryUrl" :disabled="form.gallery.length >= 6" class="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"><Plus class="h-3.5 w-3.5" /> Agregar</button></div>
                    <div class="space-y-2">
                        <div v-for="(url, i) in form.gallery" :key="i" class="flex gap-2">
                            <img v-if="galleryPreviews[i]" :src="galleryPreviews[i].startsWith('data:') || galleryPreviews[i].startsWith('http') || galleryPreviews[i].startsWith('/') ? galleryPreviews[i] : photoUrl(form.gallery[i])" class="h-16 w-16 shrink-0 rounded-lg object-cover border border-border" />
                            <input v-model="form.gallery[i]" type="text" placeholder="URL o subí una imagen..." class="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal-500" />
                            <label class="flex cursor-pointer items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted">
                                <Upload class="h-4 w-4" />
                                <input type="file" accept="image/*" class="hidden" @change="(e) => onGalleryFile(e, i)" />
                            </label>
                            <button type="button" @click="removeGalleryUrl(i)" class="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><X class="h-4 w-4" /></button>
                        </div>
                    </div>
                    <p v-if="form.gallery.length === 0" class="text-xs text-muted-foreground">No hay imágenes en la galería. Subí o pega URLs.</p>
                </div>

                <!-- Cuentas de apoyo -->
                <div>
                    <label class="block text-sm font-medium mb-2">Cuentas de apoyo / donaciones</label>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div v-for="s in supportFields" :key="s">
                            <label class="text-xs text-muted-foreground uppercase font-medium">{{ s }}</label>
                            <input v-model="form.support_info[s]" type="text" :placeholder="s === 'yape' || s === 'plin' ? 'Número de teléfono' : 'Número de cuenta'" class="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal-500" />
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
                    <a :href="'/' + team.slug + '/dashboard'" class="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</a>
                    <button type="submit" :disabled="form.processing" class="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"><Save class="h-4 w-4" /> Guardar cambios</button>
                </div>
            </form>
        </div>
    </div>
</template>
