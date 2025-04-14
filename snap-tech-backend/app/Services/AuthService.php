<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function register(array $data)
    {
        // Create user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        
        // For API authentication with Sanctum, create token instead of login
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Add token to user object to return it
        $user->token = $token;
        
        return $user;
    }

    public function login(array $credentials)
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return false;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }
    public function logout()
    {
        // Revoke all tokens for the authenticated user
        if (Auth::check()) {
            Auth::user()->tokens()->delete();
        }
        Auth::guard('web')->logout();
    }
}
