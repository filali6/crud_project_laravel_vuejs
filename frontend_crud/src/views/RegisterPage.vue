<template>
  <div class="register-container">
    <a-card class="register-card" title=" Inscription" :bordered="false">
      <a-form
        :model="formData"
        @finish="handleRegister"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label=" Nom complet"
          name="name"
          :rules="[{ required: true, message: 'Veuillez saisir votre nom complet!' }]"
        >
          <a-input
            v-model:value="formData.name"
            placeholder="Entrer votre nom complet"
            size="large"
            :prefix="h(UserOutlined)"
            :disabled="loading"
          />
        </a-form-item>

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
            placeholder="exemple@email.com"
            size="large"
            :prefix="h(MailOutlined)"
            :disabled="loading"
          />
        </a-form-item>

        <a-form-item
          label=" Mot de passe"
          name="password"
          :rules="[
            { required: true, message: 'Veuillez saisir votre mot de passe!' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères!' }
          ]"
        >
          <a-input-password
            v-model:value="formData.password"
            placeholder="Minimum 8 caractères"
            size="large"
            :prefix="h(LockOutlined)"
            :disabled="loading"
          />
        </a-form-item>

        <a-form-item
          label=" Confirmer le mot de passe"
          name="confirmPassword"
          :rules="[
            { required: true, message: 'Veuillez confirmer votre mot de passe!' },
            { validator: validatePassword }
          ]"
        >
          <a-input-password
            v-model:value="formData.confirmPassword"
            placeholder="Confirmer votre mot de passe"
            size="large"
            :prefix="h(SafetyOutlined)"
            :disabled="loading"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
            block
            class="register-btn"
          >
             
            {{ loading ? 'Inscription...' : "S'inscrire" }}
          </a-button>
        </a-form-item>

        <!-- Affichage des erreurs -->
        <div v-if="errors.length > 0" class="error-container">
          <a-alert
            v-for="(error, index) in errors"
            :key="index"
            :message="error"
            type="error"
            show-icon
            closable
            @close="removeError(index)"
            style="margin-bottom: 8px;"
          />
        </div>

        <a-alert
          v-if="generalError"
          :message="generalError"
          type="error"
          show-icon
          closable
          @close="generalError = ''"
          class="error-alert"
        />
      </a-form>

      <a-divider>
        <span style="color: #999; font-size: 14px;">Déjà un compte ?</span>
      </a-divider>

      <div class="login-link">
        <router-link to="/login">
          <a-button type="link" size="large" class="login-btn">
             
            Se connecter
          </a-button>
        </router-link>
      </div>
    </a-card>
  </div>
</template>

<script>
import { h } from 'vue'
 import { registerUser } from '../services/authService'
import { message } from 'ant-design-vue'

export default {
  name: 'RegisterPage',
  setup() {
    return {
      h
    }
  },
   
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      errors: [],
      generalError: ''
    }
  },
  
  mounted() {
     
    const token = localStorage.getItem('token')
    if (token) {
      this.$router.push('/user')
    }
  },
  
  methods: {
    validatePassword(rule, value) {
      if (value && value !== this.formData.password) {
        return Promise.reject('Les mots de passe ne correspondent pas!')
      }
      return Promise.resolve()
    },

    removeError(index) {
      this.errors.splice(index, 1)
    },

    async handleRegister() {
      this.loading = true
      this.errors = []
      this.generalError = ''

     
      if (this.formData.password !== this.formData.confirmPassword) {
        this.generalError = 'Les mots de passe ne correspondent pas'
        this.loading = false
        return
      }

      if (this.formData.password.length < 8) {
        this.generalError = 'Le mot de passe doit contenir au moins 8 caractères'
        this.loading = false
        return
      }

      try {
        const result = await registerUser({
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password
        })

        console.log('Registration successful:', result)
        
        // Message de succès
        message.success('Inscription réussie ! 🎉')
        
        // Réinitialiser le formulaire
        this.formData = {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
        
        // Rediriger vers la page utilisateur après inscription
        this.$router.push('/user')

      } catch (error) {
        console.error('Registration error:', error)
        
        // Gestion des erreurs de validation du serveur
        if (error.response?.data?.errors) {
          const serverErrors = error.response.data.errors
          this.errors = []
          
          // Convertir les erreurs Laravel en tableau simple
          Object.keys(serverErrors).forEach(field => {
            if (Array.isArray(serverErrors[field])) {
              this.errors.push(...serverErrors[field])
            } else {
              this.errors.push(serverErrors[field])
            }
          })
        } else {
          this.generalError = error.response?.data?.message || "Erreur lors de l'inscription"
        }
        
        message.error("Erreur lors de l'inscription")
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:#667eea ;
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.register-card :deep(.ant-card-head) {
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.register-card :deep(.ant-card-head-title) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
}

.register-btn {
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  background:   #667eea ;
  border: none;
  border-radius: 6px;
}

.register-btn:hover {
  background: #667eea  !important;
  border: none !important;
}

.error-container {
  margin-bottom: 1rem;
}

.error-alert {
  margin-top: 1rem;
}

.login-link {
  text-align: center;
}

.login-btn {
  color: #667eea ;
  font-weight: 500;
  padding: 0;
  height: auto;
}

.login-btn:hover {
  color: #667eea  !important;
}

/* Responsive */
@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    margin: 0;
  }
}
</style>