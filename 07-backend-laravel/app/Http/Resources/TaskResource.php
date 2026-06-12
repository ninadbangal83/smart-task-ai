<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Task API Resource — transforms Task model into the JSON API response.
 * 
 * This is the Laravel equivalent of mapToEntity() / mapToDto() in Node.
 * It ensures the API always returns camelCase fields (matching the frontend)
 * regardless of how the DB column is named (snake_case).
 * 
 * Usage in controller:
 *   return new TaskResource($task);           // single
 *   return TaskResource::collection($tasks);  // collection
 */
class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'userId'      => $this->user_id,       // snake_case DB → camelCase API
            'title'       => $this->title,
            'description' => $this->description,
            'status'      => $this->status,
            'createdAt'   => $this->created_at?->toISOString(),
            'updatedAt'   => $this->updated_at?->toISOString(),
        ];
    }
}
