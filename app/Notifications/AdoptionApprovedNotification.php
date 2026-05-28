<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdoptionApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $petName,
        public readonly string $teamName,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("¡Solicitud aprobada para {$this->petName}!")
            ->line("Tu solicitud para adoptar a {$this->petName} ha sido aprobada por {$this->teamName}.")
            ->line("Pronto nos pondremos en contacto para coordinar los siguientes pasos.")
            ->action('Ver mis postulaciones', url('/mi-adopcion/postulaciones'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'pet_name' => $this->petName,
            'message' => "Solicitud aprobada para {$this->petName}",
        ];
    }
}
