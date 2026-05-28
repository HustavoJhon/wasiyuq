<?php

namespace App\Enums;

enum PetSize: string
{
    case Small = 'small';
    case Medium = 'medium';
    case Large = 'large';

    public function label(): string
    {
        return match ($this) {
            self::Small => 'Pequeño',
            self::Medium => 'Mediano',
            self::Large => 'Grande',
        };
    }
}
