<?php

namespace App\Enums;

enum FollowUpStatus: string
{
    case Pending = 'pending';
    case Completed = 'completed';
    case Missed = 'missed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::Completed => 'Completado',
            self::Missed => 'No Realizado',
        };
    }
}
