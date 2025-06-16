<template>
  <div class="Chat-container">
    <a-card :title="`💬 Chat avec ${recipientName}`" class="Chat-card">
      
       
      <div class="messages-container" ref="messagesContainer">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          :class="['message', { 'own-message': msg.user.id === currentUserId }]"
        >
          <div class="message-header">
            <span class="username">{{ msg.user.name }}</span>
            <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
          </div>
          <div class="message-content">{{ msg.message }}</div>
        </div>
        
         
        <div v-if="messages.length === 0" class="no-messages">
          <a-empty description="Aucun message pour le moment">
            <template #image>
              <span style="font-size: 3rem;">💬</span>
            </template>
          </a-empty>
        </div>
      </div>
      
       
      <div class="input-container">
        <div class="input-wrapper">
          <a-input
            v-model:value="newMessage"
            placeholder="Tapez votre message..."
            :maxlength="500"
            @keyup.enter="handleSendMessage"
             
            :disabled="sending"
            class="message-input"
            size="large"
          />
          <a-button 
            type="primary" 
            @click="handleSendMessage"
            :loading="sending"
            :disabled="!newMessage.trim()"
            size="large"
          >
            <template #icon>
              <send-outlined />
            </template>
            Envoyer
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { SendOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ChatWebSocketService from '../services/ChatWebSocketService'

export default {
  name: 'ChatPage',
  props: ['userId'],  
  components: {
    SendOutlined
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      sending: false,
      currentUserId: null,
      recipientId: null,
      recipientName: 'Utilisateur',
       
    }
  },
  
  async mounted() {
    
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
      return
    }
    
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    this.currentUserId = user.id
    this.recipientId = parseInt(this.userId) 
    this.recipientName = `Utilisateur ${this.recipientId}`
    
     
    await this.initWebSocket()
    
     
    await this.loadHistory()
  },
  
  beforeUnmount() {
     
    ChatWebSocketService.disconnect()
  },
  
  methods: {
    async initWebSocket() {
      try {
         
        await ChatWebSocketService.connect(this.currentUserId)
        
         
        ChatWebSocketService.on('message_received', (data) => {
          
          
          const isMyMessage = data.user.id === this.currentUserId
          const isFromRecipient = data.user.id === this.recipientId
          const isToRecipient = data.recipient_id === this.recipientId
          const isToMe = data.recipient_id === this.currentUserId
          
          
          if ((isMyMessage && isToRecipient) || (isFromRecipient && isToMe)) {
            console.log(' Message ajouté à la conversation')
            this.messages.push(data)
            this.scrollToBottom()
            
             
            if (data.user.id !== this.currentUserId) {
              message.info(`💬 ${data.user.name}: ${data.message}`, 3)
            }
          } else {
            console.log(' Message ignoré')
          }
        })
         

        ChatWebSocketService.on('history_loaded', (messages) => {
          console.log(' Historique chargé:', messages.length)
          this.messages = messages
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        })
        
        console.log(' WebSocket initialisé')
      } catch (error) {
        console.error(' Erreur WebSocket:', error)
        message.error('Erreur de connexion au Chat')
      }
    },
    
    async loadHistory() {
      try {
        await ChatWebSocketService.getHistory(this.recipientId)
      } catch (error) {
        console.error(' Erreur chargement historique:', error)
        message.error('Erreur lors du chargement de l\'historique')
      }
    },
    
    async handleSendMessage() {
       
  
      this.sending = true
      
      try {
        const messageToSend = this.newMessage.trim()
        this.newMessage = ''
        
         
        await ChatWebSocketService.sendMessage(messageToSend, this.recipientId)
        
        console.log(' Message envoyé via WebSocket')
        
      } catch (error) {
        console.error(' Erreur envoi message:', error)
        message.error('Erreur lors de l\'envoi du message')
        
         
        //this.messages = this.messages.filter(msg => !msg.id.toString().startsWith('temp-'))
      } finally {
        this.sending = false
      }
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
     
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.Chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  height: calc(100vh - 140px);
}

.Chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.Chat-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 220px);
  padding: 1rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f0f0f0;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.own-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: 2rem;
}

.own-message .username {
  color: rgba(255,255,255,0.9);
}

.own-message .timestamp {
  color: rgba(255,255,255,0.7);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.username {
  font-weight: 600;
  color: #1890ff;
  font-size: 0.9rem;
}

.timestamp {
  font-size: 0.8rem;
  color: #999;
}

.message-content {
  word-wrap: break-word;
  line-height: 1.4;
}

.input-container {
  margin-top: auto;
}
.input-wrapper {
  display: flex;
  gap: 12px;  
  align-items: center;
}

.message-input {
  border-radius: 10px !important;
}

.no-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

 
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
 
</style>