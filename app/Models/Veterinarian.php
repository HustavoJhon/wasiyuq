<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Veterinarian extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'address', 'city', 'phone', 'whatsapp', 'email',
        'website', 'latitude', 'longitude', 'description',
        'services', 'photos', 'is_verified', 'team_id', 'user_id',
    ];

    protected function casts(): array
    {
        return [
            'services' => 'array',
            'photos' => 'array',
            'is_verified' => 'boolean',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(VeterinarianRating::class);
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

    public function ratingsCount(): int
    {
        return $this->ratings()->count();
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        $array['average_rating'] = $this->averageRating();
        $array['ratings_count'] = $this->ratingsCount();

        return $array;
    }
}
