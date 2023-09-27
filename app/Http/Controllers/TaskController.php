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
use Illuminate\Support\Facades\Gate;
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
        if($request->hasAny(['priority_from', 'priority_to', 'status', 'title'])) {
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
        $user = Auth::user();

        if(!$user->can('view', $task)) {
            return $this->responseError('You haven\'t access to this task.');
        }

        return $this->responseSuccess('Task loaded successfully.', [new TaskResource($task)]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $user      = Auth::user();
        $validated = $request->all();
        $task      = $this->repository->create($user, $validated);

        if($task) {
            return $this->responseSuccess('Task created successfully.', new TaskResource($task));
        }

        return $this->responseError('Error on create task.', 500);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $user = Auth::user();

        if(!$user->can('update', $task)) {
            return $this->responseError('You can\' edit this task.');
        }

        $task = $this->repository->update($task, $request->all());
        if($task) {
            return $this->responseSuccess('Task successfully updated.', new TaskResource($task));
        }

        return $this->responseError('Error on edit task.', 500);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $user = Auth::user();

        if(!$user->can('delete', $task)) {
            return $this->responseError('You can\'t delete this task.');
        }

        $result = $this->repository->delete($task);
        if($result) {
            return $this->responseSuccess('Task successfully deleted.');
        }

        return $this->responseError('Error on delete task.', 500);
    }

    /**
     * Set status for task to DONE
     */
    public function markDone(Task $task)
    {
        $user = Auth::user();

        if(!$user->can('mark-done', $task)) {
            return $this->responseError('You can\'t update this task.');
        }

        if($task->hasNotDoneChild()) {
            return $this->responseError('You must complete all child tasks.');
        }

        $task = $this->repository->markDone($task);
        if($task) {
            return $this->responseSuccess('Task successfully updated.', new TaskResource($task));
        }

        return $this->responseError('Error on update task.', 500);
    }
}
