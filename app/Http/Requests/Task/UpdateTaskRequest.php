<?php

namespace App\Http\Requests\Task;

use App\Enums\TaskStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'parent_id'    => ['integer', 'exists:tasks,id'],
            'title'        => ['string', 'max:255'],
            'description'  => ['string', 'max:2048'],
            'status'       => [new Enum(TaskStatusEnum::class)],
            'priority'     => ['integer', 'min:1', 'max:5'],
            'completed_at' => ['date_format:Y-m-d H:i:s']
        ];
    }
}
