<?php

namespace App\Services;

class ChatbotService
{
    private array $rules = [];

    public function __construct()
    {
        $this->rules = [
            [
                'keywords' => ['adoptar', 'adopci', 'adopta', 'proceso', 'paso'],
                'response' => "¡Adoptar es fácil! Estos son los pasos:\n\n1. Explora las mascotas en /mascotas.\n2. Encuentra tu compañero ideal y haz clic en \"Postular\".\n3. Completa el formulario con tus datos.\n4. La organización revisará tu solicitud.\n5. Si es aprobada, coordinarán la entrega y seguimiento.\n\n¿Tienes dudas sobre algún paso en particular?",
                'buttons' => ['¿Qué requisitos necesito?', '¿Cuánto cuesta adoptar?', '¿Qué es el seguimiento?'],
            ],
            [
                'keywords' => ['requisito', 'necesito', 'necesita', 'documento', 'papel', 'condici'],
                'response' => "Para adoptar necesitas:\n\n• Ser mayor de edad (DNI vigente).\n• Contar con espacio adecuado para la mascota.\n• Compromiso de brindar alimento, salud y cariño.\n• Aceptar el seguimiento posterior a la adopción.\n• Si alquilas, verifica que tu contrato permita mascotas.\n\nCada organización puede tener requisitos adicionales.",
                'buttons' => ['¿Cómo es el seguimiento?', 'Vivo en departamento, ¿puedo adoptar?', 'Volver al inicio'],
            ],
            [
                'keywords' => ['costo', 'precio', 'cuesta', 'pago', 'gratis', 'gratuito', 'cuánto'],
                'response' => "La adopción en Wasiyuq es totalmente gratuita. Ninguna organización debe cobrarte por adoptar.\n\nLas mascotas se entregan esterilizadas, vacunadas y desparasitadas. Lo único que necesitas es compromiso, amor y responsabilidad para cuidar de tu nuevo amigo.",
                'buttons' => ['¿Cómo empiezo a adoptar?', '¿Qué requisitos necesito?', 'Quiero adoptar ya'],
            ],
            [
                'keywords' => ['departamento', 'apartamento', 'depa', 'piso', 'alquiler', 'alquilo', 'renta'],
                'response' => "¡Claro que puedes adoptar viviendo en departamento! Depende de la mascota y de tu espacio:\n\n• Para deptos se recomiendan mascotas pequeñas o medianas.\n• Asegúrate de tener tiempo para paseos (si es perro).\n• Verifica que tu contrato de alquiler permita mascotas.\n• Los gatos se adaptan muy bien a espacios reducidos.\n\nEl sistema te recomendará mascotas ideales según tu tipo de vivienda.",
                'buttons' => ['Mascotas pequeñas disponibles', '¿Cómo funciona la recomendación?', 'Volver al inicio'],
            ],
            [
                'keywords' => ['seguimiento', 'seguir', 'reporte', 'visita', 'control', 'seguim'],
                'response' => "Después de adoptar, la organización programa visitas de seguimiento para asegurar que la mascota esté bien:\n\n• Recibirás fechas programadas en tu panel.\n• Debes subir fotos y reportar el estado de la mascota.\n• Es obligatorio cumplir con los seguimientos.\n• Si hay algún problema, la organización te ayudará.\n\nEl seguimiento dura unos meses y garantiza adopciones exitosas.",
                'buttons' => ['¿Cada cuánto son las visitas?', 'No puedo cumplir un seguimiento', 'Volver al inicio'],
            ],
            [
                'keywords' => ['contacto', 'contactar', 'comunicar', 'teléfono', 'whatsapp', 'correo', 'email', 'llamar', 'ubicación', 'dirección'],
                'response' => "Puedes contactarnos de varias formas:\n\n• WhatsApp: +51 944 480 535\n• Correo: info@wasiyuq.pe\n• Formulario: /contacto\n\nO si prefieres, escríbenos aquí mismo y te respondemos lo antes posible.",
                'buttons' => ['Quiero registrar mi organización', 'Tengo un problema técnico', 'Volver al inicio'],
            ],
            [
                'keywords' => ['organización', 'organizacion', 'registrar', 'refugio', 'albergue', 'entidad', 'ong'],
                'response' => "¿Tienes un albergue o refugio? ¡Súmate a Wasiyuq!\n\n• Ve a /contacto y elige \"Registrar entidad\".\n• Te contactaremos para verificar tu organización.\n• Una vez aprobada, tendrás tu propio panel de gestión.\n• Podrás publicar mascotas, gestionar adopciones y seguimientos.\n\nTodo gratuito, sin costo para las organizaciones.",
                'buttons' => ['¿Cuánto cuesta registrar mi organización?', 'Ya tengo cuenta, ¿cómo ingreso?', 'Volver al inicio'],
            ],
            [
                'keywords' => ['perro', 'perrito', 'perros', 'can', 'canino'],
                'response' => "Tenemos varios perritos esperando un hogar. Puedes filtrar por tamaño, edad y más en /mascotas.\n\nNuestro sistema te recomendará los que mejor se adapten a tu estilo de vida si ya tienes una cuenta.",
                'buttons' => ['Ver perros disponibles', '¿Cómo adoptar?', 'Volver al inicio'],
            ],
            [
                'keywords' => ['gato', 'gatito', 'gatos', 'felino', 'minino'],
                'response' => "Los gatos son excelentes compañeros, especialmente para departamentos. Revisa los gatitos disponibles en /mascotas filtrando por la categoría Gatos.",
                'buttons' => ['Ver gatos disponibles', 'Vivo en departamento ¿puedo?', 'Volver al inicio'],
            ],
            [
                'keywords' => ['hola', 'buenas', 'buenos', 'saludo', 'ayuda', 'help'],
                'response' => "¡Hola! Soy el asistente virtual de Wasiyuq. Puedo ayudarte con:\n\n• Cómo adoptar una mascota\n• Requisitos para adoptar\n• Seguimiento post-adopción\n• Registrar tu organización\n• Contactarnos\n\n¿En qué te puedo ayudar?",
                'buttons' => ['Quiero adoptar', 'Tengo un albergue', 'Necesito ayuda'],
            ],
        ];
    }

    public function ask(string $message): array
    {
        $normalized = $this->normalize($message);

        $bestMatch = null;
        $bestScore = 0;

        foreach ($this->rules as $rule) {
            $score = $this->matchScore($normalized, $rule['keywords']);

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestMatch = $rule;
            }
        }

        if ($bestMatch && $bestScore > 0) {
            return [
                'response' => $bestMatch['response'],
                'buttons' => $bestMatch['buttons'],
                'matched' => true,
            ];
        }

        return [
            'response' => "No entendí muy bien tu consulta. Puedo ayudarte con estos temas:",
            'buttons' => [
                '¿Cómo adoptar una mascota?',
                '¿Qué requisitos necesito?',
                '¿Cuánto cuesta adoptar?',
                'Quiero registrar mi organización',
                'Necesito contactarlos',
            ],
            'matched' => false,
        ];
    }

    private function normalize(string $text): string
    {
        $text = mb_strtolower(trim($text), 'UTF-8');
        $text = strtr($text, 'áéíóúñ', 'aeioun');
        $text = preg_replace('/[^a-z0-9\s]/', '', $text);

        return $text;
    }

    private function matchScore(string $text, array $keywords): int
    {
        $score = 0;

        foreach ($keywords as $keyword) {
            $normalized = $this->normalize($keyword);

            if (str_contains($text, $normalized)) {
                $score += mb_strlen($normalized, 'UTF-8');
            }
        }

        return $score;
    }
}
