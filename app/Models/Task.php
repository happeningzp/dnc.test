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

    protected $attributes = [
        'status' => TaskStatusEnum::Todo
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function subtask() {
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function hasNotDoneChild()
    {
        $this->load('subtask');
        $subtask = $this->subtask;

        foreach ($subtask as $task) {
            if ($task->status === TaskStatusEnum::Todo->value || $task->hasNotDoneChild()) {
                return true;
            }
        }
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
