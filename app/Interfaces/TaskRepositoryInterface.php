<?php

namespace App\Interfaces;

use App\Models\Task;
use App\Models\User;

interface TaskRepositoryInterface
{
    public function getById($taskId);
    public function getAll(User $user, $request);
    public function getWithFilter(User $user, $request);
    public function create(User $user, $data);
    public function update(Task $task, $data);
    public function delete(Task $task);
    public function markDone(Task $task);
}
