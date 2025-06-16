<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Events\ChatEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Handle WebSocket messages
     */
    public function handleMessage(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'data' => 'required|array'
        ]);

        $user = $request->user();
        $type = $request->type;
        $data = $request->data;

        switch ($type) {
            case 'send_message':
                return $this->sendMessage($user, $data);

            case 'get_history':
                return $this->getHistory($user, $data);

            case 'user_typing':
                return $this->userTyping($user, $data);

            default:
                return response()->json(['error' => 'Type non reconnu'], 400);
        }
    }

    private function sendMessage($user, $data)
    {
       
        if (!isset($data['message']) || !isset($data['recipient_id'])) {
            return response()->json(['error' => 'Message et recipient_id requis'], 400);
        }

        
        $message = Message::create([
            'message' => $data['message'],
            'user_id' => $user->id,
            'recipient_id' => $data['recipient_id']
        ]);

         
        $messageData = [
            'id' => $message->id,
            'message' => $message->message,
            'user' => [
                'id' => $user->id,
                'name' => $user->name
            ],
            'recipient_id' => $data['recipient_id'],
            'timestamp' => $message->created_at->toISOString()
        ];




        event(new ChatEvent('message_received', $messageData, $user->id, $data['recipient_id']));
        

        return response()->json(['success' => true, 'message_id' => $message->id]);
    }

    private function getHistory($user, $data)
    {
        if (!isset($data['recipient_id'])) {
            return response()->json(['error' => 'recipient_id requis'], 400);
        }

        $recipientId = $data['recipient_id'];

         
        $messages = Message::with('user:id,name')
            ->where(function ($query) use ($user, $recipientId) {
                 
                $query->where('user_id', $user->id)
                    ->where('recipient_id', $recipientId);
            })
            ->orWhere(function ($query) use ($user, $recipientId) {
                 
                $query->where('user_id', $recipientId)
                    ->where('recipient_id', $user->id);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'user' => [
                        'id' => $message->user->id,
                        'name' => $message->user->name,
                    ],
                    'timestamp' => $message->created_at->toISOString()
                ];
            });

         
        event(new ChatEvent('history_loaded', $messages->toArray(), $user->id));

        return response()->json(['success' => true, 'count' => $messages->count()]);
    }

    private function userTyping($user, $data)
    {
        if (!isset($data['recipient_id'])) {
            return response()->json(['error' => 'recipient_id requis'], 400);
        }

        $typingData = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name
            ],
            'is_typing' => $data['is_typing'] ?? true
        ];

         
        event(new ChatEvent('user_typing', $typingData, $user->id, $data['recipient_id']));

        return response()->json(['success' => true]);
    }
}
