<template>
    <!-- template howa elli fyh el html elli hwa equivalent taa return fel react yaany hedy linterface
      elli chtodhor w baaed naamloulha el style bech style loutaa w elly heya lequivalent taa css 
      w el script heyaa fel react elli kbal el return win naaytou lele states w les service w lkol  -->
    <div class="home-page">
      <a-typography-title :level="2" style="text-align: center; margin-bottom: 2rem;">
        📋Liste des Utilisateurs📋
      </a-typography-title>
  
  
      <a-spin v-if="loading" size="large" style="display: block; text-align: center; padding: 2rem;" />
  
  
      <a-empty v-if="!loading && users.length === 0" description="Aucun utilisateur trouvé">
        <router-link to="/create">
          
        </router-link>
      </a-empty>
  
  
      <a-list v-if="!loading && users.length > 0" :data-source="users" item-layout="horizontal" class="user-list">
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-button 
                type="primary" 
                shape="circle" 
                @click="goToChat(item.id)"
                title="Envoyer un message"
                class="message-btn"
              >
                <template #icon>
                  <message-outlined />
                </template>
              </a-button>
            </template>
            <a-list-item-meta>
              <template #title>
                <strong>{{ item.name }}</strong>
              </template>
              <template #description>
                🖃 {{ item.email }}
              </template>
            </a-list-item-meta>
  
             
          </a-list-item>
        </template>
      </a-list>
  
  
      <div v-if="!loading && users.length > 0" style="margin-top: 2rem; text-align: center;">
        <a-tag color="blue" style="margin-bottom: 1rem;">
          Total: {{ users.length }} utilisateur(s)
        </a-tag>
  
         
      </div>
    </div>
  </template>
  
  <script>
  import { getAllUsers } from '../services/userService'
   
  import { message } from 'ant-design-vue'
  import { MessageOutlined } from '@ant-design/icons-vue'
  export default {
    name: 'HomeUser',
    components: {
      MessageOutlined
       
      
    },
    data() {
      return {
        users: [],
        loading: false,
        error: null
      }
    },
  
    async mounted() {
  
  const token = localStorage.getItem('token');
  if (!token) {
    this.$router.push('/login');
    return;
  }
  
  await this.loadUsers()
  window.addEventListener('userListUpdate', this.handleUserListUpdate)
},
beforeUnmount() {
    window.removeEventListener('userListUpdate', this.handleUserListUpdate)
  },

  
    methods: {
      async loadUsers() {
        this.loading = true
        this.error = null
  
        try {
          console.log(' Récupération des utilisateurs...')
          const users = await getAllUsers()
          this.users = users
          console.log(' Utilisateurs récupérés:', users)
        } catch (error) {
          console.error(' Erreur lors de la récupération:', error)
          message.error('Erreur lors de la récupération des utilisateurs')
          this.error = error.response?.data?.message || error.message || 'Erreur inconnue'
        }
  
        this.loading = false
      },
      handleUserListUpdate() {
      console.log(' Rafraîchissement automatique de la liste')
      this.loadUsers()  
    },
    goToChat(userId) {
        this.$router.push(`/chat/${userId}`)
      },
  
      
    }
  }
  </script>
  
  <style scoped>
  .home-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .user-list {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  </style>