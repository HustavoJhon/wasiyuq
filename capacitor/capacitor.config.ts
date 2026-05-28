import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'pe.wasiyuq.app',
    appName: 'Wasiyuq',
    webDir: 'public/build',
    server: {
        url: 'http://10.0.2.2:8080',
        cleartext: true,
    },
    plugins: {
        Camera: { permissions: ['camera', 'photos'] },
        LocalNotifications: { smallIcon: 'ic_notification' },
    },
};

export default config;
