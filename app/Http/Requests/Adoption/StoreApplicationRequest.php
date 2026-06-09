<?php

namespace App\Http\Requests\Adoption;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'motivation' => ['required', 'string', 'min:150', 'max:2000'],
            'experience_with_pets' => ['required', 'boolean'],
            'has_yard' => ['required', 'boolean'],
            'housing_type' => ['required', 'string', 'in:house,apartment,condo,other'],
            'family_composition' => ['required', 'string', 'max:500'],
            'why_this_pet' => ['nullable', 'string', 'max:1000'],
            'has_children' => ['nullable', 'boolean'],
            'other_pets' => ['nullable', 'string', 'max:500'],
            'housing_ownership' => ['nullable', 'string', 'in:own,rent,other'],
            'hours_alone' => ['nullable', 'integer', 'min:0', 'max:24'],
            'veterinary_plan' => ['nullable', 'string', 'max:1000'],
            'agreement' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'motivation.min' => 'Cuéntanos un poco más sobre tu motivación (mínimo 150 caracteres).',
            'motivation.required' => 'La motivación es obligatoria.',
            'experience_with_pets.required' => 'Indica si tienes experiencia con mascotas.',
            'has_yard.required' => 'Indica si tienes patio o jardín.',
            'housing_type.required' => 'Selecciona el tipo de vivienda.',
            'family_composition.required' => 'Describe la composición de tu hogar.',
            'agreement.accepted' => 'Debes aceptar el compromiso de adopción responsable.',
        ];
    }
}
