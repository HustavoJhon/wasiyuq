<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $this->route('user')],
            'password' => ['nullable', 'string', 'min:8'],
            'is_super_admin' => ['boolean'],
            'email_verified_at' => ['nullable', 'boolean'],
        ];
    }
}
