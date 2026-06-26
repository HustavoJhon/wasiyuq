<script setup lang="ts">
import { MessageCircle, X, Send } from 'lucide-vue-next';
import { nextTick, ref } from 'vue';

interface ChatMessage {
    sender: 'bot' | 'user';
    text: string;
    buttons?: string[];
}

const open = ref(false);
const messages = ref<ChatMessage[]>([]);
const input = ref('');
const loading = ref(false);
const chatEl = ref<HTMLElement | null>(null);

function toggle() {
    open.value = !open.value;
    if (open.value && messages.value.length === 0) {
        showWelcome();
    }
    if (open.value) {
        nextTick(() => scrollToBottom());
    }
}

function showWelcome() {
    messages.value.push({
        sender: 'bot',
        text: '¡Hola! Soy el asistente virtual de Wasiyuq. Puedo ayudarte con información sobre adopción, requisitos, seguimiento y más.\n\nEscribe tu consulta o elige una de las opciones:',
        buttons: ['Quiero adoptar', '¿Qué requisitos necesito?', '¿Cuánto cuesta?', 'Quiero registrar mi organización'],
    });
}

async function sendMessage(text?: string) {
    const messageText = text || input.value.trim();
    if (!messageText || loading.value) return;

    messages.value.push({ sender: 'user', text: messageText });
    input.value = '';
    loading.value = true;
    await nextTick(() => scrollToBottom());

    try {
        const response = await fetch('/api/chatbot/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({ message: messageText }),
        });

        const data = await response.json();
        messages.value.push({
            sender: 'bot',
            text: data.response,
            buttons: data.buttons || [],
        });
    } catch {
        messages.value.push({
            sender: 'bot',
            text: 'Ups, hubo un error. Intenta de nuevo.',
        });
    } finally {
        loading.value = false;
        await nextTick(() => scrollToBottom());
    }
}

function scrollToBottom() {
    if (chatEl.value) {
        chatEl.value.scrollTop = chatEl.value.scrollHeight;
    }
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}
</script>

<template>
    <div class="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <!-- Chat panel -->
        <Transition name="chat">
            <div v-if="open" class="absolute bottom-16 right-0 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/10 sm:w-[380px]">
                <!-- Header -->
                <div class="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-4 py-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                        <MessageCircle class="h-5 w-5 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-semibold text-white">Wasiyuq Assistant</p>
                        <p class="text-[11px] text-green-100/70">Responde en segundos</p>
                    </div>
                    <button @click="open = false" class="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <!-- Messages -->
                <div ref="chatEl" class="flex-1 space-y-3 overflow-y-auto p-4" style="max-height: 360px;">
                    <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                        <div class="max-w-[85%]">
                            <div
                                class="rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap"
                                :class="msg.sender === 'user'
                                    ? 'rounded-br-md bg-gradient-to-r from-[#2D6A4F] to-[#40916C] text-white'
                                    : 'rounded-bl-md bg-muted text-foreground'"
                            >
                                {{ msg.text }}
                            </div>
                            <!-- Quick reply buttons -->
                            <div v-if="msg.sender === 'bot' && msg.buttons && msg.buttons.length > 0" class="mt-2 flex flex-wrap gap-1.5">
                                <button
                                    v-for="btn in msg.buttons" :key="btn"
                                    @click="sendMessage(btn)"
                                    class="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                                >
                                    {{ btn }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Typing indicator -->
                    <div v-if="loading" class="flex justify-start">
                        <div class="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                            <div class="flex gap-1">
                                <span class="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style="animation-delay: 0ms;" />
                                <span class="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style="animation-delay: 150ms;" />
                                <span class="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style="animation-delay: 300ms;" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input -->
                <div class="flex items-center gap-2 border-t border-border/50 bg-muted/30 p-3">
                    <input
                        v-model="input"
                        @keydown="handleKeydown"
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        class="flex-1 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 outline-none transition focus:border-[#2D6A4F]"
                        :disabled="loading"
                    />
                    <button
                        @click="sendMessage()"
                        :disabled="!input.trim() || loading"
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] text-white shadow-sm transition hover:from-[#246142] hover:to-[#347D5A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Transition>

        <!-- FAB button -->
        <button
            @click="toggle"
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#40916C] text-white shadow-lg shadow-[#2D6A4F]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#2D6A4F]/30"
        >
            <MessageCircle v-if="!open" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
        </button>
    </div>
</template>

<style scoped>
.chat-enter-active {
    animation: chat-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-leave-active {
    animation: chat-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}
@keyframes chat-in {
    0% {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>
