<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can register and receive token with 60 minutes expiration', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'user',
            'access_token',
            'token_type',
        ]);

    $user = User::where('email', 'john@example.com')->first();
    expect($user)->not->toBeNull();

    $token = $user->tokens()->first();
    expect($token)->not->toBeNull();
    expect(now()->diffInMinutes($token->expires_at))->toBeGreaterThanOrEqual(59);
});

test('user can login and receive token with 60 minutes expiration', function () {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user',
            'access_token',
            'token_type',
        ]);

    $token = $user->tokens()->first();
    expect($token)->not->toBeNull();
    expect(now()->diffInMinutes($token->expires_at))->toBeGreaterThanOrEqual(59);
});
