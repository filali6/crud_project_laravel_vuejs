<template>
    <div class="create-page">
        <a-card class="create-card">
            <template #title>
                <plus-outlined />
                Créer un nouvel utilisateur
            </template>

            <ItemForm @submit="handleCreate" />
        </a-card>
    </div>
</template>

<script>
import ItemForm from '../components/ItemForm.vue'
import { PlusOutlined } from '@ant-design/icons-vue'

export default {
    name: 'CreateUser',
    components: {
        ItemForm,
        PlusOutlined
    },
    methods: {
        handleCreate(data) {
            console.log('Créer:', data)
            // Envoie vers API ou stockage
        }
    }
}
</script>

<style scoped>
.create-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
}

.create-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
</style>