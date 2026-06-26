import { createInertiaApp } from '@inertiajs/vue3';
import type { DefineComponent } from '@inertiajs/vue3';
import { createApp, h } from 'vue';
import { initializeTheme } from '@/composables/useAppearance';
import { useCapacitor } from '@/composables/useCapacitor';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { initializeFlashToast } from '@/lib/flashToast';

initializeTheme();
initializeFlashToast();

const { init: initCapacitor } = useCapacitor();
initCapacitor();

const appName = import.meta.env.VITE_APP_NAME || 'Wasiyuq';

createInertiaApp({
    title: (title) =>
        title
            ? `${title} — ${appName}`
            : `${appName} — Adopción responsable en Cusco`,
    layout: (name) => {
        switch (true) {
            case name.startsWith('Public/'):
                return PublicLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('Adopter/'):
            case name.startsWith('Dashboard'):
            case name.startsWith('Admin/'):
            case name.startsWith('Teams/'):
            case name.startsWith('teams/'):
            case name.startsWith('settings/'):
                return DashboardLayout;
            default:
                return PublicLayout;
        }
    },
    resolve: (name): DefineComponent | Promise<DefineComponent> => {
        const pages = import.meta.glob('./pages/**/*.vue', { eager: true });

        return pages[`./pages/${name}.vue`];
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#2D6A4F',
    },
});
