<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'parentId'    => $this->parent_id,
            'priority'    => $this->priority,
            'status'      => $this->status,
            'title'       => $this->title,
            'description' => $this->description,
            'completedAt' => $this->completed_at,
            'createdAt'   => Carbon::parse($this->created_at)->format('d-m-Y H:i:s'),
            'subtask'       => new TaskCollection($this->subtask),
        ];
    }

}
