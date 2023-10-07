<?php

namespace App\Services\User;

use App\Interfaces\User\UserServiceInterface;
use App\Models\User;


class UserService implements UserServiceInterface
{
    public function create($data): User
    {
        return User::create($data);
    }
}
