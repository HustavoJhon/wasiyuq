<?php

namespace App\Http\Requests\FollowUp;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFollowUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'adoption_id' => ['required', 'exists:adoptions,id'],
            'scheduled_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:pending,completed,missed'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['url'],
        ];
    }
}
