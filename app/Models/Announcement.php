<?php

namespace App\Models;

use App\Enums\AnnouncementType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'team_id', 'user_id', 'title', 'slug', 'description',
        'event_date', 'location', 'type', 'cover_image',
        'is_published', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => AnnouncementType::class,
            'is_published' => 'boolean',
            'event_date' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
