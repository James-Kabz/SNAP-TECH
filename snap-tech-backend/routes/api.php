<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// authentication
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
// Route::get('me', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('/permissions',PermissionController::class)->middleware('auth:sanctum');


// roles
Route::apiResource('/roles',RoleController::class);

Route::get('/roles/{roleId}/give-permissions', [RoleController::class, 'getRolePermissions']);

// Route::get('/roles/{roleId}/permissions', [RoleController::class, 'addPermissionToRole']);

Route::post('/roles/{roleId}/give-permissions', [RoleController::class, 'syncPermissionToRole']);


// categories apis
Route::apiResource('/categories',CategoryController::class);

// products apis
Route::apiResource('/products',ProductController::class);

// orders apis
Route::apiResource('/orders',OrderController::class);

// orderItems apis
Route::apiResource('/order-items',OrderItemsController::class);