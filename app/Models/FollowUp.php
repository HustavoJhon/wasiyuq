<?php

namespace App\Models;

use App\Enums\FollowUpStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUp extends Model
{
    protected $fillable = [
        'adoption_id', 'scheduled_date', 'completed_date',
        'status', 'notes', 'photos', 'created_by',
        'drive_link', 'weight_kg', 'vaccines',
        'behavior', 'health_status',
    ];

    protected function casts(): array
    {
        return [
            'status' => FollowUpStatus::class,
            'scheduled_date' => 'date',
            'completed_date' => 'date',
            'photos' => 'array',
            'vaccines' => 'array',
            'weight_kg' => 'decimal:2',
        ];
    }

    public function toArray(): array
    {
        $data = parent::toArray();
        $data['photos'] = $data['photos'] ?? [];
        $data['vaccines'] = $data['vaccines'] ?? [];
        return $data;
    }

    public function adoption(): BelongsTo
    {
        return $this->belongsTo(Adoption::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
