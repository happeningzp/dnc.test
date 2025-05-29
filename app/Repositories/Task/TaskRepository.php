<?php

namespace App\Repositories\Task;

use App\Interfaces\Task\TaskRepositoryInterface;
use App\Models\Task;
// Removed: use App\Models\User;

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
     * @param string $cookieUserId
     * @param array $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll(string $cookieUserId, array $request)
    {
        $query = Task::where('cookie_user_id', $cookieUserId)
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
     * @param string $cookieUserId
     * @param \Illuminate\Http\Request $request (or specific request type like IndexTaskRequest)
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getWithFilter(string $cookieUserId, $request) // Keep $request as is, type hint if desired from controller
    {
        $query = Task::where('cookie_user_id', $cookieUserId);

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
            $order = $request->input('order', 'asc');
            $sortField = $request->input('sort');
            $query->sortBy($sortField, $order);
            // Also sort subtasks if sorting is applied to parent tasks
            $query->subtaskSortBy($sortField, $order);
        } else {
            // If no sorting, still load subtasks for the filtered parents
            $query->with('subtask');
        }

        return $query->get();
    }
}
