<?php

namespace App\Enums;

enum AnnouncementType: string
{
    case AdoptionFair = 'adoption_fair';
    case Fundraiser = 'fundraiser';
    case Workshop = 'workshop';
    case Campaign = 'campaign';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::AdoptionFair => 'Feria de Adopción',
            self::Fundraiser => 'Recaudación de Fondos',
            self::Workshop => 'Taller',
            self::Campaign => 'Campaña',
            self::Other => 'Otro',
        };
    }
}
