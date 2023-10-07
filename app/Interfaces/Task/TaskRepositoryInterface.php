<?php

namespace App\Interfaces\Task;

use App\Models\Task;
use App\Models\User;

interface TaskRepositoryInterface
{
    public function getById($taskId);
    public function getAll(User $user, $request);
    public function getWithFilter(User $user, $request);
}
