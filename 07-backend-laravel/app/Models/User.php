<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

/**
 * User Eloquent Model — the M in Laravel MVC.
 * 
 * Extends Authenticatable (not just Model) so it integrates
 * with Laravel's auth guards if needed alongside our custom JWT/Session.
 */
class User extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable;

    protected $table        = 'users';
    protected $primaryKey   = 'id';
    public    $incrementing = false;
    protected $keyType      = 'string';

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'role',
    ];

    /** Password and token are hidden from JSON serialization */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
        'email_verified_at' => 'datetime',
        'password'          => 'hashed', // Auto-hashes on assignment (Laravel 10+)
    ];

    // ─── Relationships ─────────────────────────────────────────────

    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id');
    }

    // ─── Business Rule Helpers ──────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function owns(Task $task): bool
    {
        return $this->id === $task->user_id;
    }
}
