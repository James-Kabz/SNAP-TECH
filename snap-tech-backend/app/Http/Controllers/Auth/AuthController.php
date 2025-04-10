<?php

namespace App\Http\Controllers\Auth;

use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Http\Resources\AuthResource;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // register api
    public function register(AuthRequest $request)
    {
        try{
            $user = $this->authService->register($request->only('name', 'email', 'password'));

            return ApiResponseClass::sendResponse( new AuthResource($user), 'User registered successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);   
        }
    }

}
