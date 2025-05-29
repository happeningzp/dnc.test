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
        // Authorization now handled by cookie_user_id check in controller
        return true; // Or false, depending on desired default if accidentally called
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Authorization now handled by cookie_user_id check in controller
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Authorization now handled by cookie_user_id check in controller
        // Original logic: return $user->id === $task->user_id && $task->status !== TaskStatusEnum::DONE;
        return true;
    }

    public function markDone(User $user, Task $task): bool
    {
        // Authorization now handled by cookie_user_id check in controller
        // Original logic: return $user->id === $task->user_id && $task->status !== TaskStatusEnum::DONE;
        return true;
    }
}
