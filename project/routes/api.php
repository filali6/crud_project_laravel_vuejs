<?php

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::apiResource('users', UserController::class);
//star heda yaamel l get w el post wel patch w kol chay wahdou yaaref ki taayet lel api 
?>