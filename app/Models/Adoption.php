<?php

namespace App\Models;

use App\Enums\AdoptionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Adoption extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pet_id', 'user_id', 'team_id', 'status',
        'motivation', 'experience_with_pets', 'has_yard',
        'housing_type', 'family_composition', 'notes',
        'reviewed_by', 'reviewed_at', 'acta_path',
        'why_this_pet', 'has_children', 'other_pets',
        'housing_ownership', 'hours_alone', 'veterinary_plan', 'agreement',
    ];

    protected function casts(): array
    {
        return [
            'status' => AdoptionStatus::class,
            'experience_with_pets' => 'boolean',
            'has_yard' => 'boolean',
            'has_children' => 'boolean',
            'hours_alone' => 'integer',
            'agreement' => 'boolean',
            'reviewed_at' => 'datetime',
        ];
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function adopter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class);
    }
}
