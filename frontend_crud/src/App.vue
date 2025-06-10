<template>
  <div id="app">

    <a-layout>
      <a-layout-header class="header">
        <div class="nav-container">
          <h2 class="nav-title">CRUD Test Laravel+Vue.js</h2>
          <a-menu theme="dark" mode="horizontal" class="nav-menu" :selected-keys="[]">
            <a-menu-item key="home">
              <router-link to="/">
                <home-outlined />
                Accueil
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
      </a-layout-header>


      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import { HomeOutlined } from '@ant-design/icons-vue'

export default {
  name: 'App',
  components: {
    HomeOutlined
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

/* Contenu principal */
.main-content {
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
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

  .main-content {
    padding: 1rem;
  }
}
</style>