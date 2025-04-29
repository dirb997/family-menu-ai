<script setup>
import { onMounted, computed, inject } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const { t } = inject('translations')

const store = useStore()
const route = useRoute()
const router = useRouter()

const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)
const menu = computed(() => store.getters.getCurrentMenu)

onMounted(() => {
  const menuId = route.params.id
  if (menuId) {
    store.dispatch('fetchMenuById', menuId)
  }
})

// Delete a menu item
async function deleteMenuItem() {
  if (confirm(t('menuList.confirmDelete'))) {
    const deleted = await store.dispatch('deleteMenu', menu.value.id)
    if (deleted) {
      router.push('/menu-list')
    }
  }
}

// Get translated day name
function getTranslatedDay(day) {
  return t(`home.days.${day}`);
}

// Get translated meal type
function getTranslatedMeal(meal) {
  return t(`home.meals.${meal}`);
}

// Get translated menu type
function getTranslatedMenuType(type) {
  return t(`home.menuTypes.${type}`);
}
</script>

<template>
  <div class="menu-detail-view">
    <div v-if="loading" class="loading">
      {{ t('menuDetail.loading') }}
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="menu" class="menu-detail">
      <div class="menu-header">
        <h1>{{ menu.name }}</h1>
        <div class="menu-tags">
          <span class="tag type-tag">{{ getTranslatedMenuType(menu.menuType) }}</span>
          <span class="tag day-tag">{{ getTranslatedDay(menu.dayOfWeek) }}</span>
          <span class="tag meal-tag">{{ getTranslatedMeal(menu.mealType) }}</span>
        </div>
      </div>
      
      <div class="menu-content">
        <div class="menu-section">
          <h2>{{ t('menuDetail.sections.description') }}</h2>
          <p>{{ menu.description }}</p>
        </div>
        
        <div class="menu-section">
          <h2>{{ t('menuDetail.sections.details') }}</h2>
          <ul>
            <li><strong>{{ t('menuDetail.info.serves', { count: menu.numberOfPeople }) }}</strong></li>
            
            <!-- Show specific fields based on menu type -->
            <template v-if="menu.menuType === 'kids' && menu.KidsMenu">
              <li><strong>{{ t('menuList.ageRange') }}:</strong> {{ menu.KidsMenu.ageRange }}</li>
            </template>
            <template v-if="menu.menuType === 'allergy' && menu.AllergyMenu">
              <li><strong>{{ t('menuList.allergens') }}:</strong> {{ menu.AllergyMenu.allergens || t('menuList.noneSpecified') }}</li>
            </template>
            
            <li><strong>{{ t('menuDetail.info.created') }}:</strong> {{ new Date(menu.createdAt).toLocaleDateString() }}</li>
            <li><strong>{{ t('menuDetail.info.updated') }}:</strong> {{ new Date(menu.updatedAt).toLocaleDateString() }}</li>
          </ul>
        </div>
      </div>
      
      <div class="menu-actions">
        <button @click="router.push('/menu-list')" class="back-btn">{{ t('menuDetail.backToList') }}</button>
        <button @click="deleteMenuItem" class="delete-btn">{{ t('menuList.deleteMenu') }}</button>
      </div>
    </div>
    
    <div v-else class="not-found">
      {{ t('menuDetail.notFound') }}
      <button @click="router.push('/menu-list')" class="back-btn">{{ t('menuDetail.backToList') }}</button>
    </div>
  </div>
</template>

<style scoped>
.menu-detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.menu-header {
  margin-bottom: 2rem;
}

h1 {
  color: #3c6e71;
  margin-bottom: 1rem;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  font-size: 0.9rem;
  border-radius: 4px;
  font-weight: 500;
}

.type-tag {
  background-color: #3c6e71;
  color: white;
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
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.menu-section {
  margin-bottom: 2rem;
}

.menu-section h2 {
  color: #3c6e71;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.menu-section p {
  line-height: 1.6;
}

.menu-section ul {
  list-style-type: none;
  padding: 0;
}

.menu-section li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.menu-section li:last-child {
  border-bottom: none;
}

.menu-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.back-btn, .delete-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.back-btn {
  background-color: #98c1d9;
  color: #333;
}

.back-btn:hover {
  background-color: #7ea8c0;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.loading, .error-message, .not-found {
  padding: 2rem;
  text-align: center;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

.not-found {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>