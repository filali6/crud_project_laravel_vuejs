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
        <a-button type="primary" size="large">
          <plus-outlined />
          Créer le premier utilisateur
        </a-button>
      </router-link>
    </a-empty>


    <a-list v-if="!loading && users.length > 0" :data-source="users" item-layout="horizontal" class="user-list">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <strong>{{ item.name }}</strong>
            </template>
            <template #description>
              🖃 {{ item.email }}
            </template>
          </a-list-item-meta>

          <template #actions>
            <router-link :to="`/edit/${item.id}`">
              <a-button type="default" size="small">
                <edit-outlined />
                Modifier
              </a-button>
            </router-link>

            <a-popconfirm title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?" ok-text="Oui" cancel-text="Non"
              @confirm="deleteUser(item.id)">
              <a-button type="primary" danger size="small">
                <delete-outlined />
                Supprimer
              </a-button>
            </a-popconfirm>
          </template>
        </a-list-item>
      </template>
    </a-list>


    <div v-if="!loading && users.length > 0" style="margin-top: 2rem; text-align: center;">
      <a-tag color="blue" style="margin-bottom: 1rem;">
        Total: {{ users.length }} utilisateur(s)
      </a-tag>

      <div>
        <router-link to="/create">
          <a-button type="primary" size="large">
            <plus-outlined />
            Ajouter un utilisateur
          </a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers, deleteUser } from '../services/userService'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'HomePage',
  components: {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
  },
  data() {
    return {
      users: [],
      loading: false,
      error: null
    }
  },

  async mounted() {
    await this.loadUsers()
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

    async deleteUser(userId) {
      try {
        console.log(' Suppression de l\'utilisateur:', userId)
        await deleteUser(userId)

        
        this.users = this.users.filter(user => user.id !== userId)

        console.log(' Utilisateur supprimé avec succès')
        message.success('User supprimé avec succes')
      } catch (error) {
        console.error('erreur suppression:', error)
        message.error('erreur  de suppression: ' + (error.response?.data?.message || error.message))
      }
    }
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