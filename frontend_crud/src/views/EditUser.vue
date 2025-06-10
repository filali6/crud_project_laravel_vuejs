<template>
    <div class="edit-page">
        <a-card class="edit-card">
            <template #title>
                <edit-outlined />
                Modifier Utilisateur
            </template>

            <EditForm @submit="handleEdit" />
        </a-card>
    </div>
</template>

<script>
import EditForm from '../components/EditForm.vue'
import { EditOutlined } from '@ant-design/icons-vue'

export default {
    name: 'EditUser',
    components: {
        EditForm,
        EditOutlined
    },
    methods: {
        handleEdit(formData) {
            // Si tu as besoin de traiter les données ici
            console.log('Données reçues du formulaire:', formData)
        }
    }
}
</script>

<style scoped>
.edit-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
}

.edit-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
</style>