<?php
 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'user_id',
        'recipient_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

     
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

     
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
