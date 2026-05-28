<?php

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_id' => ['required', 'exists:teams,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:announcements,slug,' . $this->route('id')],
            'description' => ['required', 'string'],
            'event_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:adoption_fair,fundraiser,workshop,campaign,other'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'is_published' => ['boolean'],
        ];
    }
}
