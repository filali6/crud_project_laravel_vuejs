<template>
  <div class="login-container">
    <a-card class="login-card" title=" Connexion" :bordered="false">
      <a-form
        :model="formData"
        @finish="handleLogin"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label=" Email"
          name="email"
          :rules="[
            { required: true, message: 'Veuillez saisir votre email!' },
            { type: 'email', message: 'Email invalide!' }
          ]"
        >
          <a-input
            v-model:value="formData.email"
            placeholder="Entrer votre email"
            size="large"
             
          />
        </a-form-item>

        <a-form-item
          label=" Mot de passe"
          name="password"
          :rules="[{ required: true, message: 'Veuillez saisir votre mot de passe!' }]"
        >
          <a-input-password
            v-model:value="formData.password"
            placeholder="Entrer votre mot de passe"
            size="large"
             
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
            block
            class="login-btn"
          >
             
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </a-button>
        </a-form-item>

        <a-alert
          v-if="error"
          :message="error"
          type="error"
          show-icon
          closable
          @close="error = ''"
          class="error-alert"
        />
      </a-form>

      <a-divider>
        <span style="color: #999; font-size: 14px;">Pas de compte ?</span>
      </a-divider>

      <div class="register-link">
        <router-link to="/register">
          <a-button type="link" size="large" class="register-btn">
             
            Créer un compte
          </a-button>
        </router-link>
      </div>
    </a-card>
  </div>
</template>

<script>
import { h } from 'vue'
import { login } from '../services/authService'
import { message } from 'ant-design-vue'

export default {
  name: 'LoginPage',
  setup() {
    return {
      h
    }
  },
 
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''

      try {
        const result = await login({
          email: this.formData.email,
          password: this.formData.password
        })

        console.log('Login successful:', result)
        
        // Message de succès
        message.success('Connexion réussie ! 🎉')
         
        if (result.user?.role === 'admin' || result.role === 'admin') {
          this.$router.push('/home')
        } else {
          this.$router.push('/user')
        }

      } catch (error) {
        console.error('Login error:', error)
        this.error = error.response?.data?.message || 'Email ou mot de passe incorrect'
        message.error('Erreur de connexion')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:#667eea ;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.login-card :deep(.ant-card-head) {
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.login-card :deep(.ant-card-head-title) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
}

.login-btn {
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  background:   #667eea 0% ;
  border: none;
  border-radius: 6px;
}

.login-btn:hover {
  background:#5a6fd8 0%;
  border: none !important;
}

.error-alert {
  margin-top: 1rem;
}

.register-link {
  text-align: center;
}

.register-btn {
  color: #667eea;
  font-weight: 500;
  padding: 0;
  height: auto;
}

.register-btn:hover {
  color: #5a6fd8 !important;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    margin: 0;
  }
}
</style>