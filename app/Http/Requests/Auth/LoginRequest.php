<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\FormRequestJson;

class LoginRequest extends FormRequestJson
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ];
    }
}
