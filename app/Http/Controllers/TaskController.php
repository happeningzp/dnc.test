<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\IndexTaskRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskFilterCollection;
use App\Http\Resources\TaskResource;
use App\Interfaces\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends BaseController
{
    public function __construct(protected TaskRepositoryInterface $repository)
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
            $data = $this->repository->getWithFilter($user, $request);
            return $this->responseSuccess('Tasks load successfully.', new TaskFilterCollection($data));
        }

        // no filters
        $data = $this->repository->getAll($user, $request->only(['sort', 'order']));
        return $this->responseSuccess('Tasks load successfully.', new TaskCollection($data));
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return $this->responseSuccess('Task loaded successfully.', [new TaskResource($task)]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->all();
        $task = $this->repository->create($request->user(), $validated);

        return $this->responseSuccess('Task created successfully.', new TaskResource($task));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $task = $this->repository->update($task, $request->all());
        return $this->responseSuccess('Task successfully updated.', new TaskResource($task));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $this->repository->delete($task);

        return $this->responseSuccess('Task successfully deleted.');
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

        $task = $this->repository->markDone($task);
        if ($task) {
            return $this->responseSuccess('Task successfully updated.', new TaskResource($task));
        }

        return $this->responseError('Error on update task.', 500);
    }
}
