<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type;
    public $data;
    public $userId;
    public $recipientId;

    /**
     * Create a new event instance.
     */
    public function __construct($type, $data, $userId, $recipientId = null)
    {
        $this->type = $type;
        $this->data = $data;
        $this->userId = $userId;
        $this->recipientId = $recipientId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        $channels = [];
 
        $channels[] = new Channel('chat.' . $this->userId);
 
        if ($this->recipientId) {
            $channels[] = new Channel('chat.' . $this->recipientId);
        }

        return $channels;
    }

    public function broadcastWith()
    {
        return [
            'type' => $this->type,
            'data' => $this->data,
            'timestamp' => now()->toISOString()
        ];
    }
}
