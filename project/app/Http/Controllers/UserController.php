<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\User;
use App\Models\Message;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Events\UserCreated;
use App\Events\UserDeleted;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**get /api/users */
    public function index()
    {
        return User::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    /** POST /api/users */
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|string|email|unique:users',
            'password'=>'required|string|min:8'
        ]);
        
        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
        ]);
        event(new UserCreated($user->toArray()));
        return response()->json($user,201);
    }

    /**
     * Display the specified resource.
     */
    /** get /api/users/{id} */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /** patch /api/users/{id} */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'=>'string|max:255',
            'email'=> 'string|email|unique:users,email,'.$user->id,


        ]);
        $user->update($request->only(['name','email']));
        if($request->password){
            $user->update(['password'=>Hash::make($request->password)]);
        }
        return $user;
    }

    /**
     * Remove the specified resource from storage.
     */
    /** delete /api/users/{id} */
    public function destroy(User $user)
    {
        event(new UserDeleted($user->id,$user->name));
        $user->delete();
        return response()->json(null,204);
    }
  
}
    

