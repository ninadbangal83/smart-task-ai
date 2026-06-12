<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * RegisterRequest — Laravel Form Request for input validation.
 * 
 * In Laravel, validation is NOT done in the controller or service.
 * Form Requests handle it automatically — if validation fails, Laravel
 * returns a 422 Unprocessable Entity JSON response before the controller runs.
 * 
 * This replaces the manual if(!email || !password) checks in the Node controllers.
 */
class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public endpoint — anyone can register
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:100'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role'     => ['sometimes', 'in:user,admin'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'    => 'User already exists',
            'password.min'    => 'Password must be at least 6 characters',
        ];
    }
}
