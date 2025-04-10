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
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $user->assignRole('user');

        // registered user and the token
        $token = $user->createToken('auth_token')->plainTextToken;

        Auth::login($user);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function login(array $credentials)
    {
        // Remove 'id' from credentials if it exists
        $loginCredentials = array_intersect_key($credentials, array_flip(['email', 'password']));

        if (!Auth::attempt($loginCredentials)) {
            return false;
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function logout()
    {
        Auth::guard('web')->logout();
    }
}
