<template>
  <div id="app">
    <a-layout>
       
      <a-layout-header v-if="shouldShowHeader" class="header">
        <div class="nav-container">
          <h2 class="nav-title">CRUD Test Laravel+Vue.js</h2>
          
          <div class="nav-right">
            <a-menu theme="dark" mode="horizontal" class="nav-menu" :selected-keys="[]">
              <a-menu-item v-if="userRole === 'admin'" key="home">
                <router-link to="/home">
                  <home-outlined />
                  Accueil
                </router-link>
              </a-menu-item>
               
            </a-menu>
            
             
            <a-button 
              type="primary" 
              danger 
              @click="handleLogout"
              :loading="logoutLoading"
              class="logout-btn"
            >
              <logout-outlined />
              {{ logoutLoading ? 'Déconnexion...' : 'Déconnexion' }}
            </a-button>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="main-content" :class="{ 'no-header': !shouldShowHeader }">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { logout } from '@/services/authService'
import { message } from 'ant-design-vue'
import websocketService from './services/websocketService'

export default {
  name: 'App',
  components: {
    HomeOutlined,
    LogoutOutlined,
    
  },
  data() {
    return {
      logoutLoading: false,
      isAuthenticated: false,
      userRole: null
    }
  },
  
  computed: {
    
    shouldShowHeader() {
       
      const authPages = ['/login', '/register']
      const currentPath = this.$route.path
      
      return this.isAuthenticated && !authPages.includes(currentPath)
    }
  },
  
  async mounted() {
    this.checkAuthentication()
    if (this.isAuthenticated) {
      await websocketService.connect()
    }
  },
  
  methods: {
    checkAuthentication() {
      this.isAuthenticated = !!localStorage.getItem('token')
      console.log('Authentification vérifiée:', this.isAuthenticated)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      this.userRole = user.role || null
      
      console.log('role connecté:', this.userRole)
    },
    
    async handleLogout() {
      this.logoutLoading = true
      
      try {
        await logout()
        message.success('disconnected')
        websocketService.disconnect()
        
         
        this.isAuthenticated = false
        this.userRole = null
        
        this.$router.push('/login')
        
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
        message.error('Erreur lors de la déconnexion')
        
         
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.isAuthenticated = false
        this.$router.push('/login')
      } finally {
        this.logoutLoading = false
      }
    }
  },
  
   
  watch: {
    async '$route'() {
      this.checkAuthentication()
      if (this.isAuthenticated && !websocketService.pusher) {
        await websocketService.connect()
      }
    }
  }
}
</script>

<style>
/* Reset de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  min-height: 100vh;
}
 
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 64px;
}

.nav-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-menu {
  background: transparent !important;
  border-bottom: none !important;
  line-height: 64px;
}

.nav-menu .ant-menu-item {
  border-bottom: 2px solid transparent !important;
}

.nav-menu .ant-menu-item a {
  color: white !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-menu .ant-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 6px;
}

.nav-menu .ant-menu-item-selected {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 6px;
}

.logout-btn {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

/* Contenu principal */
.main-content {
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

/* Quand pas de header (login/register) */
.main-content.no-header {
  min-height: 100vh;
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }

  .nav-title {
    margin-bottom: 1rem;
  }

  .nav-right {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .nav-menu {
    width: 100%;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>