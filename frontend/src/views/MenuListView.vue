<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const activeTab = ref('normal')

const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)
const allMenus = computed(() => store.getters.getMenus)

// Filter menus by type
const filteredMenus = computed(() => {
  return allMenus.value.filter(menu => menu.menuType === activeTab.value);
})

onMounted(() => {
  store.dispatch('fetchMenus')
})

// Delete a menu item
async function deleteMenuItem(id) {
  if (confirm('Are you sure you want to delete this menu item?')) {
    const deleted = await store.dispatch('deleteMenu', id)
    if (deleted) {
      // Refetch the menus
      store.dispatch('fetchMenus')
    }
  }
}

function setActiveTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="menu-list-view">
    <h1>All Menus</h1>
    
    <div class="tabs">
      <button 
        :class="['tab-button', { active: activeTab === 'normal' }]" 
        @click="setActiveTab('normal')"
      >
        Normal Menu
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'kids' }]" 
        @click="setActiveTab('kids')"
      >
        Kids Menu
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'allergy' }]" 
        @click="setActiveTab('allergy')"
      >
        Allergy-Friendly Menu
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      Loading menus...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="menu-grid">
      <div v-if="filteredMenus.length === 0" class="no-menus">
        No {{ activeTab }} menus found. Try generating some on the home page!
      </div>
      
      <div v-for="menu in filteredMenus" :key="menu.id" class="menu-card">
        <div class="menu-header">
          <h3>{{ menu.name }}</h3>
          <div class="menu-tags">
            <span class="tag day-tag">{{ menu.dayOfWeek.charAt(0).toUpperCase() + menu.dayOfWeek.slice(1) }}</span>
            <span class="tag meal-tag">{{ menu.mealType.charAt(0).toUpperCase() + menu.mealType.slice(1) }}</span>
          </div>
        </div>
        <div class="menu-content">
          <p>{{ menu.description }}</p>
          <p><strong>Serves:</strong> {{ menu.numberOfPeople }} people</p>
          
          <!-- Show specific fields based on menu type -->
          <div v-if="activeTab === 'kids' && menu.KidsMenu">
            <p><strong>Age Range:</strong> {{ menu.KidsMenu.ageRange }}</p>
          </div>
          <div v-if="activeTab === 'allergy' && menu.AllergyMenu">
            <p><strong>Allergens:</strong> {{ menu.AllergyMenu.allergens || 'None specified' }}</p>
          </div>
        </div>
        <div class="menu-actions">
          <button @click="deleteMenuItem(menu.id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-list-view {
  margin-bottom: 2rem;
}

h1 {
  color: #3c6e71;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ddd;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
}

.tab-button:hover {
  color: #3c6e71;
}

.tab-button.active {
  color: #3c6e71;
  font-weight: 700;
  border-bottom: 2px solid #3c6e71;
  margin-bottom: -2px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.menu-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.menu-header h3 {
  margin: 0;
  color: #3c6e71;
  margin-bottom: 0.5rem;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 4px;
  font-weight: 500;
}

.day-tag {
  background-color: #e0fbfc;
  color: #3c6e71;
}

.meal-tag {
  background-color: #98c1d9;
  color: #333;
}

.menu-content {
  padding: 1rem;
}

.menu-content p {
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.menu-actions {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #c82333;
}

.no-menus, .loading, .error-message {
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

.no-menus {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 3rem;
}
</style>