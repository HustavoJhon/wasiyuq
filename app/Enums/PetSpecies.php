<?php

namespace App\Enums;

enum PetSpecies: string
{
    case Dog = 'dog';
    case Cat = 'cat';
    case Rabbit = 'rabbit';
    case Bird = 'bird';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Dog => 'Perro',
            self::Cat => 'Gato',
            self::Rabbit => 'Conejo',
            self::Bird => 'Ave',
            self::Other => 'Otro',
        };
    }
}
