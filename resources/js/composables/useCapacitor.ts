import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { ref } from 'vue';

const isNative = ref(Capacitor.isNativePlatform());

export function useCapacitor() {
    function init() {
        if (!Capacitor.isNativePlatform()) return;

        App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
                document.body.classList.remove('app-inactive');
            } else {
                document.body.classList.add('app-inactive');
            }
        });

        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            const path = event.url.replace(/.*\/\//, '').replace(/^[^/]+/, '');
            if (path && path !== '/') {
                window.location.href = path;
            }
        });

        App.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
                App.exitApp();
            } else {
                window.history.back();
            }
        });
    }

    function setStatusBarStyle(dark: boolean) {
        if (!Capacitor.isNativePlatform()) return;
        import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
            StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
            StatusBar.setBackgroundColor({ color: '#2D6A4F' });
        });
    }

    return {
        isNative,
        init,
        setStatusBarStyle,
    };
}
