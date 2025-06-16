import { message } from "ant-design-vue";

class WebSocketService {
  constructor() {
    this.pusher = null;
    this.channel = null;
  }

  connect() {
     
    if (!window.Pusher) {
      const script = document.createElement("script");
      script.src = "https://js.pusher.com/8.2.0/pusher.min.js";
      document.head.appendChild(script);

      return new Promise((resolve) => {
        script.onload = () => {
          this.initPusher();
          resolve();
        };
      });
    } else {
      this.initPusher();
      return Promise.resolve();
    }
  }

  initPusher() {
    this.pusher = new window.Pusher("cbbc1af6e4e60c4cf48b", {
      cluster: "eu",
      forceTLS: false,  
      enabledTransports: ["ws", "wss"],  
      disableStats: true, 
    });

    this.channel = this.pusher.subscribe("users");

     
    this.channel.bind("App\\Events\\UserCreated", (data) => {
      message.success({
        content: ` ${data.message}`,
        duration: 4,
        style: {
          marginTop: "20vh",
        },
      });

       
      this.emitUserListUpdate();
    });

    
    this.channel.bind("App\\Events\\UserDeleted", (data) => {
      message.info({
        content: ` ${data.message}`,
        duration: 4,
        style: {
          marginTop: "20vh",
        },
      });

     
      this.emitUserListUpdate();
    });

    console.log(" WebSocket connecté et en écoute");
  }

  emitUserListUpdate() {
    
    const event = new CustomEvent("userListUpdate");
    window.dispatchEvent(event);
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }
}

export default new WebSocketService();
