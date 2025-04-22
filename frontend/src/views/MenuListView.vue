<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()
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
  if (confirm(t('menuList.confirmDelete'))) {
    const deleted = await store.dispatch('deleteMenu', id)
    if (deleted) {
      // Refetch the menus
      store.dispatch('fetchMenus')
    }
  }
}

// Helper function to capitalize first letter
function capitalize(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get translated day and meal names
function getTranslatedDay(day) {
  return t(`home.days.${day}`);
}

function getTranslatedMeal(meal) {
  return t(`home.meals.${meal}`);
}

function setActiveTab(tab) {
  activeTab.value = tab
}

const activeTabPosition = computed(() => {
  switch (activeTab.value) {
    case 'normal': return '0%';
    case 'kids': return '33.33%';
    case 'allergy': return '66.66%';
    default: return '0%';
  }
});

const menuTypeLabels = computed(() => ({
  normal: t('home.menuTypes.normal'),
  kids: t('home.menuTypes.kids'),
  allergy: t('home.menuTypes.allergy')
}));
</script>

<template>
  <div class="menu-list-view">
    <h1 class="page-title">{{ t('menuList.title') }}</h1>
    
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab-button', { active: activeTab === 'normal' }]" 
          @click="setActiveTab('normal')"
        >
          <span class="tab-icon">🍽️</span>
          {{ menuTypeLabels.normal }}
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'kids' }]" 
          @click="setActiveTab('kids')"
        >
          <span class="tab-icon">👶</span>
          {{ menuTypeLabels.kids }}
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'allergy' }]" 
          @click="setActiveTab('allergy')"
        >
          <span class="tab-icon">🌱</span>
          {{ menuTypeLabels.allergy }}
        </button>
      </div>
      
      <div class="tab-indicator" :style="{ left: activeTabPosition }"></div>
    </div>
    
    <div v-if="loading" class="loading">
      <span class="spinner-large"></span>
      {{ t('menuList.loading') }}
    </div>
    
    <div v-else-if="error" class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      {{ error }}
    </div>
    
    <div v-else class="menu-grid">
      <div v-if="filteredMenus.length === 0" class="no-menus card">
        <div class="empty-state">
          <svg v-if="activeTab === 'allergy'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
            <path d="M7 2v20"></path>
            <path d="M21 15V2H11v13"></path>
            <path d="M11 15a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3"></path>
          </svg>
          <svg v-else-if="activeTab === 'normal'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <circle cx="9" cy="9" r="1"></circle>
            <circle cx="15" cy="9" r="1"></circle>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 12h.01"></path>
            <path d="M15 12h.01"></path>
            <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
            <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
          </svg>
          <p>{{ t('menuList.noMenus') }}</p>
          <p class="empty-state-hint">{{ t('menuList.tryGenerating') }}</p>
          <router-link to="/" class="btn btn-primary">{{ t('menuList.goToGenerator') }}</router-link>
        </div>
      </div>
      
      <div v-for="menu in filteredMenus" :key="menu.id" class="menu-card card">
        <div class="menu-ribbon" :class="'ribbon-' + menu.menuType"></div>
        <div class="menu-header">
          <h3>{{ menu.name }}</h3>
          <div class="menu-tags">
            <span class="tag day-tag">{{ getTranslatedDay(menu.dayOfWeek) }}</span>
            <span class="tag meal-tag">{{ getTranslatedMeal(menu.mealType) }}</span>
          </div>
        </div>
        <div class="menu-content">
          <p>{{ menu.description }}</p>
          <div class="menu-info">
            <div class="menu-info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span><strong>{{ t('menuDetail.info.serves', { count: menu.numberOfPeople }) }}</strong></span>
            </div>
            
            <!-- Show specific fields based on menu type -->
            <div v-if="activeTab === 'kids' && menu.KidsMenu" class="menu-info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><circle cx="9" cy="9" r="1"></circle><circle cx="15" cy="9" r="1"></circle><circle cx="12" cy="12" r="10"></circle></svg>
              <span><strong>{{ t('menuList.ageRange') }}:</strong> {{ menu.KidsMenu.ageRange }}</span>
            </div>
            <div v-if="activeTab === 'allergy' && menu.AllergyMenu" class="menu-info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 9.1a10 10 0 0 0 9.8 12.9"></path></svg>
              <span><strong>{{ t('menuList.allergens') }}:</strong> {{ menu.AllergyMenu.allergens || t('menuList.noneSpecified') }}</span>
            </div>
          </div>
        </div>
        <div class="menu-actions">
          <button @click="deleteMenuItem(menu.id)" class="btn btn-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            {{ t('menuList.deleteMenu') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-list-view {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  /* Add consistent height handling */
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.page-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 4px;
  background-color: var(--accent-color);
  border-radius: 2px;
}

.tabs-container {
  position: relative;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid var(--gray-medium);
  position: relative;
}

.tab-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-dark);
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  white-space: nowrap;
}

.tab-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.tab-button:hover {
  color: var(--primary-color);
}

.tab-button.active {
  color: var(--primary-color);
  font-weight: 700;
  border-bottom-color: var(--primary-color);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.menu-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
}

.ribbon-normal {
  background-color: var(--primary-color);
}

.ribbon-kids {
  background-color: #f97316;
}

.ribbon-allergy {
  background-color: #8b5cf6;
}

.menu-header {
  padding: 1.25rem 1.25rem 0.75rem 1.5rem;
  background-color: white;
}

.menu-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  border-radius: var(--border-radius);
  font-weight: 600;
}

.day-tag {
  background-color: var(--light-color);
  color: var(--primary-color);
}

.meal-tag {
  background-color: var(--secondary-color);
  color: var(--dark-color);
}

.menu-content {
  padding: 0 1.5rem 1.5rem;
  flex: 1;
  background-color: white;
}

.menu-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.menu-info {
  background-color: var(--gray-light);
  padding: 1rem;
  border-radius: var(--border-radius);
}

.menu-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.menu-info-item:last-child {
  margin-bottom: 0;
}

.menu-info-item svg {
  margin-right: 0.75rem;
  stroke: var(--primary-color);
  flex-shrink: 0;
}

.menu-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-medium);
  display: flex;
  justify-content: flex-end;
  background-color: white;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--border-radius);
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.btn svg {
  margin-right: 0.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-danger {
  background-color: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background-color: #dc3545;
  color: white;
}

.btn-danger svg {
  stroke: currentColor;
}

.no-menus {
  grid-column: 1 / -1;
  padding: 3rem;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-state svg {
  stroke: var(--gray-dark);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.empty-state-hint {
  color: var(--gray-dark);
  margin-bottom: 1.5rem;
}

.spinner-large {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid rgba(60, 110, 113, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}
</style>