<?php

namespace App\Http\Requests\Pet;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_id' => ['required', 'exists:teams,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:pets,slug,' . $this->route('id')],
            'species' => ['required', 'string', 'in:dog,cat,rabbit,bird,other'],
            'breed' => ['nullable', 'string', 'max:255'],
            'age_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'age_months' => ['nullable', 'integer', 'min:0', 'max:11'],
            'gender' => ['nullable', 'string', 'in:male,female'],
            'size' => ['required', 'string', 'in:small,medium,large'],
            'color' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'medical_notes' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:available,adopted,in_process,withheld'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'photo_url' => ['nullable', 'string', 'url', 'max:2048'],
        ];
    }
}
