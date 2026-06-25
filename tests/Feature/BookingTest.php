<?php

use App\Enums\BookingStatus;
use App\Enums\ProviderStatus;
use App\Models\Booking;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('unauthenticated users cannot access booking routes', function () {
    $this->getJson('/api/bookings')->assertStatus(401);
    $this->postJson('/api/bookings', [])->assertStatus(401);
    $this->getJson('/api/bookings/1')->assertStatus(401);
    $this->postJson('/api/bookings/1/cancel')->assertStatus(401);
});

test('authenticated user can create a booking successfully', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
        'description' => 'Plumbing services',
    ]);

    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'description' => 'Fix leak',
        'base_price' => 500.00,
    ]);

    $provider = Provider::factory()->create([
        'status' => ProviderStatus::Available,
    ]);
    $provider->categories()->attach($category->id);

    $appointmentTime = now()->addDays(2)->format('Y-m-d H:i:s');

    $response = $this->actingAs($user)
        ->postJson('/api/bookings', [
            'service_id' => $service->id,
            'provider_id' => $provider->id,
            'description' => 'Need immediate fix',
            'appointment_datetime' => $appointmentTime,
            'address' => '123 Test St',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.description', 'Need immediate fix')
        ->assertJsonPath('data.address', '123 Test St')
        ->assertJsonPath('data.status', 'pending')
        ->assertJsonPath('data.price_charged', 500);

    $this->assertDatabaseHas('bookings', [
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'Need immediate fix',
        'address' => '123 Test St',
        'status' => 'pending',
        'price_charged' => 500.00,
    ]);
});

test('booking validation prevents invalid inputs', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/bookings', [
            'service_id' => 9999, // non-existent
            'provider_id' => 9999, // non-existent
            'description' => '', // empty
            'appointment_datetime' => now()->subDay()->format('Y-m-d H:i:s'), // past date
            'address' => '', // empty
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors([
            'service_id',
            'provider_id',
            'description',
            'appointment_datetime',
            'address',
        ]);
});

test('cannot book a provider if their status is not available', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
        'description' => 'Plumbing services',
    ]);

    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'description' => 'Fix leak',
        'base_price' => 500.00,
    ]);

    $provider = Provider::factory()->create([
        'status' => 'unavailable',
    ]);
    $provider->categories()->attach($category->id);

    $response = $this->actingAs($user)
        ->postJson('/api/bookings', [
            'service_id' => $service->id,
            'provider_id' => $provider->id,
            'description' => 'Need immediate fix',
            'appointment_datetime' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'address' => '123 Test St',
        ]);

    $response->assertStatus(422)
        ->assertJsonFragment(['message' => 'Provider is busy']);
});

test('cannot book a provider if they do not have the skill in the category', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
        'description' => 'Plumbing services',
    ]);

    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'description' => 'Fix leak',
        'base_price' => 500.00,
    ]);

    $provider = Provider::factory()->create([
        'status' => ProviderStatus::Available,
    ]);
    // Do not attach category to provider

    $response = $this->actingAs($user)
        ->postJson('/api/bookings', [
            'service_id' => $service->id,
            'provider_id' => $provider->id,
            'description' => 'Need immediate fix',
            'appointment_datetime' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'address' => '123 Test St',
        ]);

    $response->assertStatus(422)
        ->assertJsonFragment(['message' => 'provider has no skill in this category']);
});

test('user can view their own bookings list ordered by latest', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
        'description' => 'Plumbing services',
    ]);
    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'description' => 'Fix leak',
        'base_price' => 500.00,
    ]);
    $provider = Provider::factory()->create(['status' => ProviderStatus::Available]);
    $provider->categories()->attach($category->id);

    // Create two bookings with different timestamps
    $booking1 = Booking::create([
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'First booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'Address 1',
        'price_charged' => 500.00,
        'status' => BookingStatus::Pending,
    ]);

    // Move time forward slightly
    $this->travel(5)->minutes();

    $booking2 = Booking::create([
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'Second booking',
        'appointment_datetime' => now()->addDays(2)->format('Y-m-d H:i:s'),
        'address' => 'Address 2',
        'price_charged' => 500.00,
        'status' => BookingStatus::Pending,
    ]);

    $response = $this->actingAs($user)->getJson('/api/bookings');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $booking2->id) // latest first
        ->assertJsonPath('data.1.id', $booking1->id);
});

test('user can view their own booking detail', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
        'description' => 'Plumbing services',
    ]);
    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'description' => 'Fix leak',
        'base_price' => 500.00,
    ]);
    $provider = Provider::factory()->create(['status' => ProviderStatus::Available]);

    $booking = Booking::create([
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'My booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'My address',
        'price_charged' => 500.00,
        'status' => BookingStatus::Pending,
    ]);

    $this->actingAs($user)
        ->getJson("/api/bookings/{$booking->id}")
        ->assertStatus(200)
        ->assertJsonPath('data.id', $booking->id)
        ->assertJsonPath('data.description', 'My booking');
});

test('user cannot view another users booking', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
        'description' => 'Plumbing services',
    ]);
    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'description' => 'Fix leak',
        'base_price' => 500.00,
    ]);
    $provider = Provider::factory()->create(['status' => ProviderStatus::Available]);

    $booking = Booking::create([
        'user_id' => $userB->id, // belongs to B
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'User B Booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'Address B',
        'price_charged' => 500.00,
        'status' => BookingStatus::Pending,
    ]);

    // User A attempts to view User B's booking
    $this->actingAs($userA)
        ->getJson("/api/bookings/{$booking->id}")
        ->assertStatus(403);
});

test('user can cancel their own booking when status is pending or accepted', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
    ]);
    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'base_price' => 500.00,
    ]);
    $provider = Provider::factory()->create(['status' => ProviderStatus::Available]);

    $bookingPending = Booking::create([
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'Pending Booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'Address',
        'price_charged' => 500.00,
        'status' => BookingStatus::Pending,
    ]);

    $bookingAccepted = Booking::create([
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'Accepted Booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'Address',
        'price_charged' => 500.00,
        'status' => BookingStatus::Accepted,
    ]);

    // Cancel pending booking
    $this->actingAs($user)
        ->postJson("/api/bookings/{$bookingPending->id}/cancel")
        ->assertStatus(200)
        ->assertJsonPath('data.status', 'cancelled');

    $this->assertDatabaseHas('bookings', [
        'id' => $bookingPending->id,
        'status' => BookingStatus::Cancelled,
    ]);

    // Cancel accepted booking
    $this->actingAs($user)
        ->postJson("/api/bookings/{$bookingAccepted->id}/cancel")
        ->assertStatus(200)
        ->assertJsonPath('data.status', 'cancelled');

    $this->assertDatabaseHas('bookings', [
        'id' => $bookingAccepted->id,
        'status' => BookingStatus::Cancelled,
    ]);
});

test('user cannot cancel booking when not pending or accepted', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
    ]);
    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'base_price' => 500.00,
    ]);
    $provider = Provider::factory()->create(['status' => ProviderStatus::Available]);

    $bookingCancelled = Booking::create([
        'user_id' => $user->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'Cancelled Booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'Address',
        'price_charged' => 500.00,
        'status' => BookingStatus::Cancelled,
    ]);

    $this->actingAs($user)
        ->postJson("/api/bookings/{$bookingCancelled->id}/cancel")
        ->assertStatus(403);
});

test('user cannot cancel another users booking', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $category = Category::create([
        'name' => 'Plumbing',
        'slug' => 'plumbing',
    ]);
    $service = Service::create([
        'category_id' => $category->id,
        'name' => 'Leak Repair',
        'base_price' => 500.00,
    ]);
    $provider = Provider::factory()->create(['status' => ProviderStatus::Available]);

    $booking = Booking::create([
        'user_id' => $userB->id,
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'description' => 'User B Booking',
        'appointment_datetime' => now()->addDays(1)->format('Y-m-d H:i:s'),
        'address' => 'Address B',
        'price_charged' => 500.00,
        'status' => BookingStatus::Pending,
    ]);

    // User A tries to cancel B's booking
    $this->actingAs($userA)
        ->postJson("/api/bookings/{$booking->id}/cancel")
        ->assertStatus(403);
});
