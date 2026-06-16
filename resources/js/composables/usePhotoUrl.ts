export function usePhotoUrl() {
    function photoUrl(path: string | null | undefined): string {
        if (!path || typeof path !== 'string') {
            return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
        }

        return path.startsWith('http') ? path : `/storage/${path}`;
    }

    return { photoUrl };
}
