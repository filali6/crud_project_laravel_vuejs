<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class Auth extends Controller
{

    public function registerAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = auth('admin-api')->login($admin);

        return response()->json([
            'success' => true,
            'message' => 'admin créé avec succès',
            'admin' => $admin,
            'token' => $token
        ], 201);
    }

    public function registerUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'success' => true,
            'message' => 'utilisateur créé avec succès',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $email = $request->email;
        $password = $request->password;

       
        $admin = Admin::where('email', $email)->first();
        if ($admin && Hash::check($password, $admin->password)) {
            $token = auth('admin-api')->login($admin);
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => $admin,
                'role' => 'admin'
            ]);
        }

         
        $user = User::where('email', $email)->first();
        if ($user && Hash::check($password, $user->password)) {
            $token = auth('api')->login($user);
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => $user,
                'role' => 'user'
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion'
            ], 500);
        }
    }

    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide'
            ], 401);
        }
    }
}
