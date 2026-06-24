<?php

namespace App\Models;

use App\Enums\PetSize;
use App\Enums\PetSpecies;
use App\Enums\PetStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pet extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'team_id', 'name', 'slug', 'species', 'breed',
        'age_years', 'age_months', 'gender', 'size', 'color',
        'description', 'medical_notes', 'status', 'photos',
    ];

    protected function casts(): array
    {
        return [
            'species' => PetSpecies::class,
            'size' => PetSize::class,
            'status' => PetStatus::class,
            'photos' => 'array',
            'age_years' => 'integer',
            'age_months' => 'integer',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function adoptions(): HasMany
    {
        return $this->hasMany(Adoption::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public static function generateUniqueSlug(string $name, ?int $exceptId = null): string
    {
        $slug = \Illuminate\Support\Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        $query = static::withTrashed()->where('slug', $slug);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }

        while ($query->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $query = static::withTrashed()->where('slug', $slug);
            if ($exceptId) {
                $query->where('id', '!=', $exceptId);
            }
            $counter++;
        }

        return $slug;
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        // Convertir enums a sus valores string para Inertia
        if (isset($array['species']) && $array['species'] instanceof PetSpecies) {
            $array['species'] = $array['species']->value;
        }
        if (isset($array['size']) && $array['size'] instanceof PetSize) {
            $array['size'] = $array['size']->value;
        }
        if (isset($array['status']) && $array['status'] instanceof PetStatus) {
            $array['status'] = $array['status']->value;
        }

        return $array;
    }
}
