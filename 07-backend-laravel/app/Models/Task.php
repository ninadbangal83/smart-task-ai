<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Task Eloquent Model — the M in Laravel MVC.
 * 
 * In Laravel, Models live in app/Models/ and represent database tables.
 * They contain relationships, scopes, and casts — NOT business logic.
 * Business logic belongs in Services.
 */
class Task extends Model
{
    use HasFactory, HasUuids;

    protected $table        = 'tasks';
    protected $primaryKey   = 'id';
    public    $incrementing = false;
    protected $keyType      = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'description',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ─── Relationships ─────────────────────────────────────────────
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ─── Scopes (Laravel Query Scopes) ─────────────────────────────

    /** scopePending — usage: Task::pending()->get() */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /** scopeCompleted — usage: Task::completed()->get() */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /** scopeForUser — usage: Task::forUser($userId)->get() */
    public function scopeForUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ─── Business Rule Helper (belongs on model in Laravel) ─────────

    /** Domain Guard: Cannot delete completed tasks */
    public function canBeDeleted(): bool
    {
        return $this->status !== 'completed';
    }
}
