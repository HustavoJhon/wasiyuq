<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shelter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'address', 'city', 'phone', 'whatsapp', 'email',
        'website', 'latitude', 'longitude', 'description',
        'services', 'photos', 'capacity', 'is_verified', 'team_id', 'user_id',
    ];

    protected function casts(): array
    {
        return [
            'services' => 'array',
            'photos' => 'array',
            'is_verified' => 'boolean',
            'capacity' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(ShelterRating::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function averageRating(): float
    {
        return round($this->ratings()->avg('rating') ?? 0, 1);
    }

    public function toArray(): array
    {
        $array = parent::toArray();
        $array['average_rating'] = $this->averageRating();
        $array['ratings_count'] = $this->ratings()->count();

        return $array;
    }
}
