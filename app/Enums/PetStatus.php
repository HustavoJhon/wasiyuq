<?php

namespace App\Enums;

enum PetStatus: string
{
    case Available = 'available';
    case Adopted = 'adopted';
    case InProcess = 'in_process';
    case Withheld = 'withheld';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Disponible',
            self::Adopted => 'Adoptado',
            self::InProcess => 'En Proceso',
            self::Withheld => 'Reservado',
        };
    }
}
