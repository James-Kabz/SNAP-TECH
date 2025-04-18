<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Check if the resource is an array with 'user' key
        if (is_array($this->resource) && isset($this->resource['user'])) {
            $user = $this->resource['user'];
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->toArray(), // Using Spatie's getRoleNames()
                // Add other user fields as needed
                'token' => $this->resource['token'] ?? null,
            ];
        }
        
        // Handle case when resource is already a User model
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->getRoleNames()->toArray(), // Using Spatie's getRoleNames()
            // Add other user fields as needed
        ];
    }
}