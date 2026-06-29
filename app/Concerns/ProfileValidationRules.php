<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
            'dni' => $this->dniRules($userId),
            'whatsapp' => $this->whatsappRules(),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate whatsapp numbers.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function whatsappRules(): array
    {
        return ['nullable', 'string', 'max:30', 'regex:/^\+?[0-9]{7,15}$/'];
    }

    /**
     * Get the validation rules used to validate DNI numbers.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function dniRules(?int $userId = null): array
    {
        $rules = ['nullable', 'string', 'size:8', 'regex:/^[0-9]{8}$/'];

        if ($userId === null) {
            $rules[] = Rule::unique(User::class, 'dni');
        } else {
            $rules[] = Rule::unique(User::class, 'dni')->ignore($userId);
        }

        return $rules;
    }
}
