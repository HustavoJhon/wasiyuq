<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { Search, Loader2 } from 'lucide-vue-next';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

defineProps<{
    passwordRules: string;
}>();

const dniValue = ref('');
const lookingUp = ref(false);
const dniMessage = ref('');

async function lookupDni() {
    const dni = dniValue.value.replace(/\D/g, '');
    if (dni.length !== 8) {
        dniMessage.value = 'El DNI debe tener 8 dígitos.';
        return;
    }
    lookingUp.value = true;
    dniMessage.value = '';
    try {
        const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        const res = await fetch('/api/dni/lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            body: JSON.stringify({ dni }),
        });
        const data = await res.json();
        if (data.source === 'reniec') {
            const fullName = [data.nombres, data.apellidoPaterno, data.apellidoMaterno].filter(Boolean).join(' ');
            const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]');
            if (nameInput) nameInput.value = fullName;
            dniMessage.value = 'Nombre autocompletado desde RENIEC.';
        } else if (data.source === 'not_found') {
            dniMessage.value = 'DNI no encontrado. Verifica el numero.';
        } else if (data.source === 'token_missing') {
            dniMessage.value = 'API no configurada. Ingresa tu nombre manualmente.';
        } else {
            dniMessage.value = 'No se pudo consultar. Ingresa tu nombre manualmente.';
        }
    } catch {
        dniMessage.value = 'Error de conexión. Ingresa tu nombre manualmente.';
    } finally {
        lookingUp.value = false;
    }
}
</script>

<template>
    <Head title="Registrarse" />

    <a
        href="/auth/google"
        class="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-accent"
    >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
        Registrarse con Google
    </a>

    <div class="relative my-5">
        <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-border" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-3 text-muted-foreground/50"
                >o regístrate con</span
            >
        </div>
    </div>

    <Form
        v-bind="store.form()"
        :reset-on-success="['password', 'password_confirmation']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-5"
    >
        <div class="grid gap-1.5">
            <Label for="dni">DNI <span class="text-muted-foreground/50 font-normal">(opcional)</span></Label>
            <div class="flex gap-2">
                <Input
                    id="dni"
                    type="text"
                    inputmode="numeric"
                    v-model="dniValue"
                    name="dni"
                    autocomplete="off"
                    maxlength="8"
                    placeholder="12345678"
                    class="h-11 flex-1"
                    @input="dniMessage = ''"
                />
                <button type="button" @click="lookupDni" :disabled="lookingUp || dniValue.replace(/\D/g, '').length !== 8"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-[#2D6A4F] disabled:opacity-50">
                    <Loader2 v-if="lookingUp" class="h-4 w-4 animate-spin" />
                    <Search v-else class="h-4 w-4" />
                    Buscar
                </button>
            </div>
            <p v-if="dniMessage" class="text-[11px]" :class="dniMessage.includes('autocompletado') ? 'text-green-600' : 'text-amber-600'">{{ dniMessage }}</p>
            <InputError :message="errors.dni" />
        </div>

        <div class="grid gap-1.5">
            <Label for="name">Nombre completo</Label>
            <Input
                id="name"
                type="text"
                required
                :tabindex="1"
                autocomplete="name"
                name="name"
                placeholder="Ingresa tu nombre o busca por DNI"
                class="h-11"
            />
            <InputError :message="errors.name" />
        </div>

        <div class="grid gap-1.5">
            <Label for="email">Correo electrónico</Label>
            <Input
                id="email"
                type="email"
                required
                :tabindex="2"
                autocomplete="email"
                name="email"
                placeholder="correo@ejemplo.com"
                class="h-11"
            />
            <InputError :message="errors.email" />
        </div>

        <div class="grid gap-1.5">
            <Label for="whatsapp">WhatsApp <span class="text-muted-foreground/50 font-normal">(opcional)</span></Label>
            <Input
                id="whatsapp"
                type="tel"
                :tabindex="3"
                autocomplete="tel"
                name="whatsapp"
                placeholder="+51 900 000 000"
                class="h-11"
            />
            <p class="text-[11px] text-muted-foreground/60">Para que te contacten mas facil las organizaciones.</p>
            <InputError :message="errors.whatsapp" />
        </div>

        <div class="grid gap-1.5">
            <Label for="password">Contraseña</Label>
            <PasswordInput
                id="password"
                required
                :tabindex="4"
                autocomplete="new-password"
                name="password"
                placeholder="Creá tu contraseña"
                :passwordrules="passwordRules"
            />
            <InputError :message="errors.password" />
        </div>

        <div class="grid gap-1.5">
            <Label for="password_confirmation">Confirmar contraseña</Label>
            <PasswordInput
                id="password_confirmation"
                required
                :tabindex="6"
                autocomplete="new-password"
                name="password_confirmation"
                placeholder="Repetí tu contraseña"
                :passwordrules="passwordRules"
            />
            <InputError :message="errors.password_confirmation" />
        </div>

        <Button
            type="submit"
            class="h-11 w-full rounded-xl bg-[#2D6A4F] text-base font-semibold shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#246142]"
            tabindex="5"
            :disabled="processing"
            data-test="register-user-button"
        >
            <Spinner v-if="processing" class="mr-2" />
            Crear cuenta
        </Button>

        <p class="text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?
            <TextLink
                :href="login()"
                class="font-medium text-[#2D6A4F] hover:text-[#246142]"
                :tabindex="6"
                >Iniciar sesión</TextLink
            >
        </p>
    </Form>
</template>
