<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * User API Resource — transforms User model into JSON, hiding password.
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'email'     => $this->email,
            'role'      => $this->role,
            'createdAt' => $this->created_at?->toISOString(),
            // password is never exposed — the $hidden array on the Model handles this too
        ];
    }
}
