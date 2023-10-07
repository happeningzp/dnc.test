<?php

namespace App\Services\Task;

use App\Interfaces\Task\TaskServiceInterface;
use App\Models\Task;
use App\Models\User;

class TaskService implements TaskServiceInterface
{
    /**
     * @param User $user
     * @param $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function create(User $user, $data)
    {
        return $user->tasks()->create($data);
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
        $task->update([
            'status' => 1
        ]);
        return $task;
    }
}
