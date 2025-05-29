<?php

namespace App\Services\Task;

use App\Enums\TaskStatusEnum;
use App\Interfaces\Task\TaskServiceInterface;
use App\Models\Task;
// Removed: use App\Models\User;

class TaskService implements TaskServiceInterface
{
    /**
     * @param array $data
     * @param string $cookieUserId
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function create(array $data, string $cookieUserId)
    {
        $data['cookie_user_id'] = $cookieUserId;
        // user_id might still be needed if you want to associate with a registered user later,
        // but for now, focusing on cookie_user_id. If user_id is not in $data, it will be null.
        // If your $fillable in Task model doesn't include user_id or it's nullable, this is fine.
        // Or, if user_id should be explicitly null: $data['user_id'] = null;
        return Task::create($data);
    }

    /**
     * @param $task
     * @param $data
     * @return Task
     */
    public function update($task, $data)
    {
        $task->update($data);
        return $task;
    }

    /**
     * @param Task $task
     * @return bool|null
     */
    public function delete(Task $task)
    {
        return $task->delete();
    }

    /**
     * @param Task $task
     * @return Task
     */
    public function markDone(Task $task)
    {
        $updated = $task->update([
            'status' => TaskStatusEnum::DONE
        ]);

        if (!$updated) {
            return false; // Explicitly return false if update failed
        }
        return $task; // Return the task model on success
    }
}
