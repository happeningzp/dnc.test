<?php

namespace App\Interfaces\Task;

use App\Models\Task;
use App\Models\User;

interface TaskServiceInterface
{
    public function create(User $user, $data);
    public function update(Task $task, $data);
    public function delete(Task $task);
    public function markDone(Task $task);
}
