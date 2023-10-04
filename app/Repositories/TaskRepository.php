<?php

namespace App\Repositories;

use App\Enums\TaskStatusEnum;
use App\Interfaces\TaskRepositoryInterface;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class TaskRepository implements TaskRepositoryInterface
{
    /**
     * @param $taskId
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function getById($taskId)
    {
        return Task::query()
            ->findOrFail($taskId);
    }

    /**
     * @param User $user
     * @param $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll(User $user, $request)
    {
        $query = $user->tasks()
            ->whereNull('parent_id');

        if(isset($request['sort'])) {
            //with sorting
            $order = $request['order'] ?? 'asc';
            $query->sortBy($request['sort'], $order);

            $query->subtaskSortBy($request['sort'], $order);
        } else {
            //without sorting
            $query->with('subtask');
        }

        return $query->get();
    }

    /**
     * @param User $user
     * @param $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getWithFilter(User $user, $request)
    {
        $query = $user->tasks();

        if ($request->has('priority_from')) {
            $query->priorityFrom($request->priority_from);
        }
        if ($request->has('priority_to')) {
            $query->priorityTo($request->priority_to);
        }

        if ($request->has('status')) {
            $query->status($request->status);
        }

        if ($request->has('title')) {
            $query->titleLike($request->title);
        }

        if($request->has('sort')) {
            $order = $request['order'] ?? 'asc';
            $query->sortBy($request->sort, $order);
        }

        return $query->get();
    }

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
     * @return bool
     */
    public function delete(Task $task)
    {
        return $task->delete();
    }

    /**
     * @param Task $task
     * @return Task|false
     */
    public function markDone(Task $task)
    {
        try {
            $task->update([
                'status' => TaskStatusEnum::DONE
            ]);
            return $task;
        } catch (\Throwable $e) {
            Log::error('Error markDone Task', ['message' => $e->getMessage()]);
            return false;
        }
    }
}
