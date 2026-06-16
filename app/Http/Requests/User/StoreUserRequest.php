<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'verified' => ['boolean'],
            'is_super_admin' => ['boolean'],
            'team_id' => ['nullable', 'exists:teams,id'],
            'team_role' => ['nullable', 'string', 'in:member,admin,owner'],
        ];
    }
}
