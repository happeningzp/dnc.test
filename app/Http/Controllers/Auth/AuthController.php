<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class AuthController extends BaseController
{
    public function __construct(protected UserRepositoryInterface $repository)
    {
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (!auth()->attempt($credentials))
            return $this->responseError('User credentials are wrong.', ['error' => 'Unauthorised'], 401);

        $user = Auth::user();

        $data['token'] = $user->token;
        $data['name']  = $user->name;

        return $this->responseSuccess('User login successfully.', $data, 200);
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = $this->repository->create($validated);

        $data['token'] = $user->token;

        return $this->responseSuccess('User register successfully.', $data, 200);
    }
}
