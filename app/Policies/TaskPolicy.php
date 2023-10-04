<?php

namespace App\Policies;

use App\Enums\TaskStatusEnum;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->id === $task->user_id && $task->status !== TaskStatusEnum::DONE;
    }

    public function markDone(User $user, Task $task): bool
    {
        return
            $user->id === $task->user_id
            && $task->status !== TaskStatusEnum::DONE;
    }
}
