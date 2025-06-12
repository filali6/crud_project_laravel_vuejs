<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class RoleMiddleware
{
    public function handle($request, Closure $next, $role)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $token = JWTAuth::getToken();
            $payload = JWTAuth::getPayload($token);
            //$userRole = $payload->get('role');

            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token invalide',
                'error' => $e->getMessage()
            ], 401);
        }

        return $next($request);
    }
}
