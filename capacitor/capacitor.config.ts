import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'pe.wasiyuq.app',
    appName: 'Wasiyuq',
    webDir: 'public',
    server: {
        url: 'http://10.0.2.2:8081',
        cleartext: true,
    },
    ios: {
        contentInset: 'automatic',
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: true,
    },
    plugins: {
        Camera: {
            permissions: ['camera', 'photos'],
        },
        LocalNotifications: {
            smallIcon: 'ic_notification',
            iconColor: '#2D6A4F',
        },
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#2D6A4F',
            showSpinner: true,
            spinnerColor: '#ffffff',
        },
    },
};

export default config;
