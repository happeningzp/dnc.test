<?php

namespace App\Models;

use App\Enums\TaskStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parent_id',
        'user_id',
        'cookie_user_id', // Added cookie_user_id
        'title',
        'description',
        'status',
        'priority',
        'completed_at',
    ];

    protected $hidden = [
        'updated_at',
        'user_id'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function subtask() {
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function hasNotDoneChild()
    {
        // Ensure subtasks are loaded. loadMissing() is efficient.
        $this->loadMissing('subtask');

        foreach ($this->subtask as $subTask) {
            // If the current subtask is not done, then the parent has a "not done child".
            if ($subTask->status !== TaskStatusEnum::DONE->value) {
                return true;
            }
            // If the current subtask is done, recursively check if IT has any "not done children".
            if ($subTask->hasNotDoneChild()) {
                return true;
            }
        }
        // If the loop completes, all subtasks and their descendants are done.
        return false;
    }

    public function parent() {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function scopeStatus($query, $status) {
        return $query->where('status', $status);
    }
    public function scopeTitleLike($query, $search) {
        return $query->where('title', 'LIKE', "%{$search}%");
    }
    public function scopePriorityFrom($query, $from) {
        return $query->where('priority', '>=', $from);
    }
    public function scopePriorityTo($query, $to) {
        return $query->where('priority', '<=', $to);
    }

    /**
     * Sort Tasks
     * @param $query
     * @param $sort
     * @param $order
     * @return mixed
     */
    public function scopeSortBy($query, $sort, $order) {
        return $query->orderBy($sort, $order);
    }

    /**
     * Sort subtasks
     * @param $query
     * @param $sort
     * @param $order
     * @return mixed
     */
    public function scopeSubtaskSortBy($query, $sort, $order) {
        return $query->with(['subtask' => function ($query) use ($sort, $order) {
            $query->orderBy($sort, $order);
        }]);
    }
}
