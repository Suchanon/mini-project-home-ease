<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * Register a new user and generate a token.
     *
     * @param  array{name: string, email: string, password: string, phone: ?string}  $data
     * @return array{user: User, access_token: string, token_type: string}
     */
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
        ]);

        $token = $user->generateAuthToken();

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Authenticate a user and generate a token.
     *
     * @param  array{email: string, password: string}  $credentials
     * @return array{user: User, access_token: string, token_type: string}|null
     */
    public function login(array $credentials): ?array
    {
        if (! Auth::attempt($credentials)) {
            return null;
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->generateAuthToken();

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Revoke the user's current token.
     */
    public function logout(User $user): void
    {
        $token = $user->currentAccessToken();

        if (method_exists($token, 'delete')) {
            $token->delete();
        }
    }
}
