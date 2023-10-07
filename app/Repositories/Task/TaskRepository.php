<?php

namespace App\Repositories\Task;

use App\Interfaces\Task\TaskRepositoryInterface;
use App\Models\Task;
use App\Models\User;

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
}
