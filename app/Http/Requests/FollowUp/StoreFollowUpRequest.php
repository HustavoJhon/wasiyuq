<?php

namespace App\Http\Requests\FollowUp;

use Illuminate\Foundation\Http\FormRequest;

class StoreFollowUpRequest extends FormRequest
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
            'drive_link' => ['nullable', 'url'],
            'weight_kg' => ['nullable', 'numeric', 'min:0', 'max:200'],
            'vaccines' => ['nullable', 'array'],
            'vaccines.*.name' => ['required_with:vaccines', 'string', 'max:255'],
            'vaccines.*.date' => ['required_with:vaccines', 'date'],
            'vaccines.*.vet' => ['nullable', 'string', 'max:255'],
            'vaccines.*.next_due' => ['nullable', 'date'],
            'behavior' => ['nullable', 'string'],
            'health_status' => ['nullable', 'string', 'in:good,fair,poor'],
        ];
    }
}
