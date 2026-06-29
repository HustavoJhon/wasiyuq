<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DniLookupService
{
    private ?string $token;

    private string $baseUrl;

    public function __construct()
    {
        $this->token = config('services.dni.token');
        $this->baseUrl = config('services.dni.url', 'https://dniruc.apisperu.com/api/v1/dni');
    }

    public function lookup(string $dni): ?array
    {
        $dni = preg_replace('/[^0-9]/', '', $dni);

        if (strlen($dni) !== 8) {
            return null;
        }

        if (empty($this->token)) {
            return [
                'nombres' => '',
                'apellidoPaterno' => '',
                'apellidoMaterno' => '',
                'dni' => $dni,
                'source' => 'token_missing',
            ];
        }

        try {
            $response = Http::timeout(10)
                ->get("{$this->baseUrl}/{$dni}", [
                    'token' => $this->token,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'nombres' => $data['nombres'] ?? '',
                    'apellidoPaterno' => $data['apellidoPaterno'] ?? '',
                    'apellidoMaterno' => $data['apellidoMaterno'] ?? '',
                    'dni' => $dni,
                    'source' => 'reniec',
                ];
            }
        } catch (\Exception $e) {
            Log::warning('DNI lookup fallo', ['dni' => $dni, 'error' => $e->getMessage()]);
        }

        return [
            'nombres' => '',
            'apellidoPaterno' => '',
            'apellidoMaterno' => '',
            'dni' => $dni,
            'source' => 'error',
        ];
    }
}
