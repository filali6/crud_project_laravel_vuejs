<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $userId;
    public $userName;
    /**
     * Create a new event instance.
     */
    public function __construct($userId,$userName)
    {
        $this->userId=$userId;
        $this->userName=$userName;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('users'),
        ];
    }
    public function broadcastWith()
    {
        return [
            'message' => 'Utilisateur supprimé: ' . $this->userName,
            'userId' => $this->userId,
            'userName' => $this->userName
        ];
    }
}
