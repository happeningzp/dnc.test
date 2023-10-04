<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskFilterResource extends JsonResource
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
            'parentId'    => $this->when($this->parent_id, $this->parent_id),
            'priority'    => $this->priority,
            'status'      => $this->status,
            'title'       => $this->title,
            'description' => $this->description,
            'completedAt' => Carbon::parse($this->completed_at)->format('Y-m-d H:i:s'),
            'createdAt'   => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
