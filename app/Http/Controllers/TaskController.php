<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\IndexTaskRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskFilterCollection;
use App\Http\Resources\TaskResource;
use App\Interfaces\Task\TaskRepositoryInterface;
use App\Interfaces\Task\TaskServiceInterface;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends BaseController
{
    public function __construct(
        protected TaskRepositoryInterface $taskRepository,
        protected TaskServiceInterface $taskService
    )
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexTaskRequest $request)
    {
        $user = Auth::user();

        // filters
        if ($request->hasAny(['priority_from', 'priority_to', 'status', 'title'])) {
            $data = $this->taskRepository->getWithFilter($user, $request);
            return $this->responseSuccess(new TaskFilterCollection($data));
        }

        // no filters
        $data = $this->taskRepository->getAll($user, $request->only(['sort', 'order']));
        return $this->responseSuccess(new TaskCollection($data));
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return $this->responseSuccess([new TaskResource($task)]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->all();
        $task = $this->taskService->create($request->user(), $validated);

        return $this->responseSuccess(new TaskResource($task));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $task = $this->taskService->update($task, $request->all());
        return $this->responseSuccess(new TaskResource($task));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $this->taskService->delete($task);

        return $this->responseSuccess();
    }

    /**
     * Set status for task to DONE
     */
    public function markDone(Task $task)
    {
        $this->authorize('mark-done', $task);

        if ($task->hasNotDoneChild()) {
            return $this->responseError('You must complete all child tasks.');
        }

        $updatedTask = $this->taskService->markDone($task);
        if ($updatedTask) {
            return $this->responseSuccess(new TaskResource($updatedTask));
        }

        // If the service returned false, it means the update failed without an exception
        return $this->responseError('Failed to update task status to done.', 500);
    }
}
