<?php

namespace App\Http\Controllers\Auth;

use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\AuthResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Auth;
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

            return ApiResponseClass::sendResponse([
                'user' => new UserResource($user),
            ], 'User registered successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);   
        }
    }

    // login api
    public function login(LoginRequest $request)
    {
        try{
            $credentials = $request->only('id','email', 'password');
            $result = $this->authService->login($credentials);

            if (!$result) {
                return response()->json([
                    'message' => 'Invalid email or password.'
                ], 401);
            }
            
            return ApiResponseClass::sendResponse( [
                'user' => new UserResource($result),
            ], 'User logged in successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    public function logout()
    {
        try{
            $this->authService->logout();

            return ApiResponseClass::sendResponse('', 'User logged out successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);   
        }
    }

    public function me(Request $request)
    {

        $user = Auth::user();
        if ($user === null) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        return response()->json(new UserResource($user));
    }
}
