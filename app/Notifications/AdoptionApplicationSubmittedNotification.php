<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdoptionApplicationSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $petName,
        public readonly string $adopterName,
        public readonly int $adoptionId,
        public readonly string $teamSlug,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Nueva solicitud de adopción para {$this->petName}")
            ->line("{$this->adopterName} ha enviado una solicitud para adoptar a {$this->petName}.")
            ->action('Revisar solicitud', url("/{$this->teamSlug}/adopciones/{$this->adoptionId}"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'adoption_id' => $this->adoptionId,
            'pet_name' => $this->petName,
            'adopter_name' => $this->adopterName,
        ];
    }
}
