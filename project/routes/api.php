<?php

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth;

use App\Http\Controllers\MessageController;

Route::post('register/admin', [Auth::class, 'registerAdmin']);
Route::post('register/user', [Auth::class, 'registerUser']);
Route::post('login', [Auth::class, 'login'])->name('login');
Route::get('users', [UserController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [Auth::class, 'logout']);
    Route::get('me', [Auth::class, 'me']);
    Route::post('websocket/message', [MessageController::class, 'handleMessage']);
});

Route::middleware('auth:admin-api')->group(function () {  
    Route::get('users/{user}', [UserController::class, 'show']);   
    Route::post('logout', [Auth::class, 'logout']);                
    Route::get('me', [Auth::class, 'me']);                         
    Route::post('users', [UserController::class, 'store']);
    Route::patch('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
});
