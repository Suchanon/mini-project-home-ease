<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CatalogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Catalog Routes (Public)
Route::get('/categories', [CatalogController::class, 'getCategories']);
Route::get('/services', [CatalogController::class, 'getServices']);
Route::get('/services/{service_id}/providers', [CatalogController::class, 'getServiceProviders']);

// public
Route::post('/register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
