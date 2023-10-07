<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Interfaces\User\UserRepositoryInterface;
use App\Interfaces\User\UserServiceInterface;
use Illuminate\Support\Facades\Auth;

class AuthController extends BaseController
{
    public function __construct(
        protected UserRepositoryInterface $repository,
        protected UserServiceInterface $service,
    )
    {
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (!auth()->attempt($credentials)) {
            return $this->responseError(['error' => 'Unauthorised'], 401);
        }

        $data['token'] = $request->user()->token;
        $data['name']  = $request->user()->name;

        return $this->responseSuccess($data, 200);
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = $this->service->create($validated);

        $data['token'] = $user->token;

        return $this->responseSuccess($data, 200);
    }
}
