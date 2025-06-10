<template>
    <a-form layout="vertical" @submit.prevent="submitForm" class="add-form">
        <a-form-item label="Nom" required>
            <a-input v-model:value="form.name" placeholder="Entrez le nom" size="large" :disabled="loading" />
        </a-form-item>

        <a-form-item label="Email" required>
            <a-input v-model:value="form.email" type="email" placeholder="Entrez l'email" size="large"
                :disabled="loading" />
        </a-form-item>

        <a-form-item label="Mot de passe" required>
            <a-input-password v-model:value="form.password" placeholder="Entrez un mot de passe" size="large"
                :disabled="loading" />
        </a-form-item>

        <a-form-item style="text-align: center; margin-top: 2rem;">
            <a-space size="large">
                <a-button type="primary" html-type="submit" size="large" :loading="loading">
                    <plus-outlined />
                    Ajouter utilisateur
                </a-button>

                <router-link to="/">
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
import { createUser } from '@/services/userService'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
    name: 'CreateForm',
    components: {
        PlusOutlined,
        CloseOutlined
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
            },
            loading: false,
            error: null
        }
    },

    methods: {
        async submitForm() {
            // Validation simple
            if (!this.form.name || !this.form.email || !this.form.password) {
                message.warning('Tous les champs sont obligatoires')
                return
            }

            try {
                this.loading = true
                console.log('Création utilisateur:', this.form)

                // Appeler le service de création
                const newUser = await createUser(this.form)

                console.log('Utilisateur créé:', newUser)
                message.success('Utilisateur ajouté avec succès !')

                // Rediriger vers la page d'accueil
                this.$router.push('/')

            } catch (error) {
                console.error(' Erreur lors de la création:', error)
                message.error('Erreur lors de la création: ' + (error.response?.data?.message || error.message))
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.add-form {
    max-width: 100%;
}
</style>