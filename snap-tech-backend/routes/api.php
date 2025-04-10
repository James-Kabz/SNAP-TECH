<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('/permissions',PermissionController::class);


// roles
Route::apiResource('/roles',RoleController::class);

Route::get('/roles/{roleId}/give-permissions', [RoleController::class, 'getRolePermissions']);

// Route::get('/roles/{roleId}/permissions', [RoleController::class, 'addPermissionToRole']);

Route::post('/roles/{roleId}/give-permissions', [RoleController::class, 'syncPermissionToRole']);
