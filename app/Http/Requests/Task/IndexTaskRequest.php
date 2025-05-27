<?php

namespace App\Http\Requests\Task;

use App\Enums\TaskSortEnum;
use App\Enums\TaskStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class IndexTaskRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title'         => ['string', 'max:255'],
            'priority_from' => ['integer', 'min:1', 'max:5'],
            'priority_to'   => ['integer', 'min:1', 'max:5'],
            'status'        => [new Enum(TaskStatusEnum::class)],
            'sort'          => [new Enum(TaskSortEnum::class)],
            'order'         => ['in:asc,desc']
        ];
    }
}
