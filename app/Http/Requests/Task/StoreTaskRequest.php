<?php

namespace App\Http\Requests\Task;

use App\Enums\TaskStatusEnum;
use App\Http\Requests\FormRequestJson;
use Illuminate\Validation\Rules\Enum;

class StoreTaskRequest extends FormRequestJson
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
            'title'        => ['required', 'string', 'max:255'],
            'description'  => ['string', 'max:2048'],
            'status'       => [new Enum(TaskStatusEnum::class)],
            'priority'     => ['required', 'integer', 'min:1', 'max:5'],
            'completed_at' => ['required', 'date_format:Y-m-d H:i:s']
        ];
    }
}
