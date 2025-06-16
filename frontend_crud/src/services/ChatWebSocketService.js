import Axios from "axios";

class ChatWebSocketService {
  constructor() {
    this.pusher = null;
    this.channel = null;
    this.currentUserId = null;
    this.callbacks = {};
  }

  async connect(userId) {
    this.currentUserId = userId;

     if (!window.Pusher) {
      await this.loadPusher();
    }

     this.pusher = new window.Pusher("cbbc1af6e4e60c4cf48b", {
      cluster: "eu",
      forceTLS: false,
      enabledTransports: ["ws"],
    });

     this.channel = this.pusher.subscribe(`chat.${userId}`);

     this.channel.bind("App\\Events\\ChatEvent", (data) => {
      console.log(" websocket reçu:", data);
      this.handleWebSocketMessage(data);
    });

    console.log(` WebSocket connecté au canal chat.${userId}`);
  }

  loadPusher() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.pusher.com/8.2.0/pusher.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  handleWebSocketMessage(data) {
    const { type, data: payload } = data;

    if (this.callbacks[type]) {
      this.callbacks[type](payload);
    }
  }

   on(eventType, callback) {
    this.callbacks[eventType] = callback;
  }

   off(eventType) {
    delete this.callbacks[eventType];
  }

   async sendMessage(message, recipientId) {
    try {
      const token = localStorage.getItem("token");

      await Axios.post(
        "http://127.0.0.1:8000/api/websocket/message",
        {
          type: "send_message",
          data: {
            message: message,
            recipient_id: recipientId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("msg envoyé");
    } catch (error) {
      console.error(" erreur websocket", error);
      throw error;
    }
  }

   async getHistory(recipientId) {
    try {
      const token = localStorage.getItem("token");

      await Axios.post(
        "http://127.0.0.1:8000/api/websocket/message",
        {
          type: "get_history",
          data: {
            recipient_id: recipientId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" historique websocket");
    } catch (error) {
      console.error(" erreur  historique:", error);
      throw error;
    }
  }

   async sendTyping(recipientId, isTyping = true) {
    try {
      const token = localStorage.getItem("token");

      await Axios.post(
        "http://127.0.0.1:8000/api/websocket/message",
        {
          type: "user_typing",
          data: {
            recipient_id: recipientId,
            is_typing: isTyping,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(" erreur typing", error);
    }
  }

  disconnect() {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(`chat.${this.currentUserId}`);
    }
    if (this.pusher) {
      this.pusher.disconnect();
    }
    this.callbacks = {};
    console.log("websocket deco");
  }
}

export default new ChatWebSocketService();
