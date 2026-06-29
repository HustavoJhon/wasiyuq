<?php

namespace App\Models;

use App\Enums\PetSize;
use App\Enums\PetSpecies;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LostPet extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'species', 'breed', 'color', 'size',
        'age_description', 'description', 'last_seen_location',
        'last_seen_date', 'contact_phone', 'contact_email',
        'photos', 'status', 'user_id', 'team_id', 'is_resolved',
    ];

    protected function casts(): array
    {
        return [
            'species' => PetSpecies::class,
            'size' => PetSize::class,
            'photos' => 'array',
            'last_seen_date' => 'date',
            'is_resolved' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        if (isset($array['species']) && $array['species'] instanceof PetSpecies) {
            $array['species'] = $array['species']->value;
        }
        if (isset($array['size']) && $array['size'] instanceof PetSize) {
            $array['size'] = $array['size']->value;
        }

        return $array;
    }
}
