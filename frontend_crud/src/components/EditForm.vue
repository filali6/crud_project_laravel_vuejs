<template>
    <a-form layout="vertical" @submit.prevent="submitForm" class="edit-form">
        <a-form-item label="Nom" required>
            <a-input v-model:value="form.name" placeholder="Entrez le nom" size="large" :disabled="loading" />
        </a-form-item>

        <a-form-item label="Email" required>
            <a-input v-model:value="form.email" type="email" placeholder="Entrez l'email" size="large"
                :disabled="loading" />
        </a-form-item>

        <a-form-item style="text-align: center; margin-top: 2rem;">
            <a-space size="large">
                <a-button type="primary" html-type="submit" size="large" :loading="loading">
                    <edit-outlined />
                    Modifier Utilisateur
                </a-button>

                <router-link to="/home">
                    <a-button size="large">
                        <close-outlined />
                        Annuler
                    </a-button>
                </router-link>
            </a-space>
        </a-form-item>
    </a-form>
</template>

<script>
import { getUserById, updateUser } from '@/services/userService'
import { EditOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
    name: 'EditForm',
    components: {
        EditOutlined,
        CloseOutlined
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
            },
            loading: false,
            error: null
        }
    },
    async mounted() {
        await this.loadUser()
    },
    methods: {
        async loadUser() {
            this.loading = true
            this.error = null

            try {
                const userId = this.$route.params.id
                console.log('🔍 Chargement user ID:', userId)

                const user = await getUserById(userId)

                this.form.name = user.name
                this.form.email = user.email

                console.log(' User chargé:', user)
                 
            } catch (error) {
                console.error(' Erreur de chargement:', error)
                message.error('Erreur lors du chargement des données')
                this.error = error.response?.data?.message || error.message || 'Erreur inconnue'
            }

            this.loading = false
        },

        async submitForm() {
            // Validation simple
            if (!this.form.name || !this.form.email) {
                message.warning('Nom et email sont obligatoires')
                return
            }

            try {
                this.loading = true
                const userId = this.$route.params.id
                console.log(' Mise à jour user ID:', userId)

                const updatedUser = await updateUser(userId, this.form)

                console.log(' User mis à jour:', updatedUser)
                message.success('Utilisateur modifié avec succès !')

                // Redirection
                this.$router.push('/home')

            } catch (error) {
                console.error(' Erreur lors de la mise à jour:', error)
                message.error('Erreur de mise à jour: ' + (error.response?.data?.message || error.message))
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.edit-form {
    max-width: 100%;
}
</style>