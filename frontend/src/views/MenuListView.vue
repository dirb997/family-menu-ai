<script setup>
import { onMounted, ref, computed, inject } from 'vue'
import { useStore } from 'vuex'

const { t } = inject('translations')

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
  <div class="menu-list-view container">
    <h1 class="page-main-title">{{ t('menuList.title') }}</h1>
    
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
      <!-- Tab indicator can be styled with ::after on active button or kept if preferred -->
      <!-- <div class="tab-indicator" :style="{ left: activeTabPosition }"></div> -->
    </div>
    
    <div v-if="loading" class="loading-state card">
      <span class="spinner-large"></span>
      <p>{{ t('menuList.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-message card">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>{{ error }}</span>
    </div>
    
    <div v-else class="menu-grid-container">
      <div v-if="filteredMenus.length === 0" class="no-menus card">
        <div class="empty-state-content">
          <div class="empty-state-icon">
            <svg v-if="activeTab === 'allergy'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2H11v13"></path><path d="M11 15a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3"></path>
            </svg>
            <svg v-else-if="activeTab === 'normal'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path><circle cx="9" cy="9" r="1"></circle><circle cx="15" cy="9" r="1"></circle><circle cx="12" cy="12" r="10"></circle>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
            </svg>
          </div>
          <p class="empty-state-message">{{ t('menuList.noMenus') }}</p>
          <p class="empty-state-hint">{{ t('menuList.tryGenerating') }}</p>
          <router-link to="/" class="btn btn-primary">{{ t('menuList.goToGenerator') }}</router-link>
        </div>
      </div>
      
      <div class="menu-grid">
        <div v-for="menu in filteredMenus" :key="menu.id" class="menu-card card">
          <div class="menu-ribbon" :class="'ribbon-' + menu.menuType.toLowerCase()"></div>
          <div class="menu-header">
            <h3>{{ menu.name }}</h3>
            <div class="menu-tags">
              <span class="tag day-tag">{{ getTranslatedDay(menu.dayOfWeek) }}</span>
              <span class="tag meal-tag">{{ getTranslatedMeal(menu.mealType) }}</span>
            </div>
          </div>
          <div class="menu-content">
            <p class="menu-description">{{ menu.description }}</p>
            <div class="menu-info">
              <div class="menu-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>{{ t('menuDetail.info.serves', { count: menu.numberOfPeople }) }}</span>
              </div>
              
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
  </div>
</template>

<style scoped>
.container { /* Re-using .container from HomeView for consistency */
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem; /* Vertical and horizontal padding */
}

.page-main-title {
  font-size: 2.2rem; /* Slightly smaller than hero title */
  color: var(--color-heading);
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 700;
}

.tabs-container {
  margin-bottom: 2.5rem;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  padding: 0.5rem;
}

.tabs {
  display: flex;
  justify-content: space-around; /* Distribute tabs evenly */
  position: relative;
}

.tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* Allow tabs to grow equally */
  padding: 0.8rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--vt-c-text-dark-2); /* Muted color for inactive tabs */
  transition: all 0.3s ease;
  border-radius: 6px; /* Rounded corners for buttons */
  white-space: nowrap;
}

.tab-icon {
  margin-right: 0.6rem;
  font-size: 1.2rem;
}

.tab-button:hover {
  color: var(--vt-c-text-dark-1);
  background-color: var(--vt-c-black-soft); /* Subtle hover */
}

.tab-button.active {
  color: var(--vt-c-white); /* Bright text for active tab */
  background-color: var(--color-accent-primary);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Loading and Error States */
.loading-state,
.error-message.card /* Applied .card for consistency */ {
  /* Inherits .card styles from HomeView.vue (background, border, padding, etc.) */
  /* Ensure these are globally available or define them if not */
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text);
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.spinner-large {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border); /* Use theme border color */
  border-radius: 50%;
  border-top-color: var(--color-accent-primary); /* Accent color for spinner */
  animation: spin 1s infinite linear;
}

.error-message.card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vt-c-red-soft, #2c1a1a); /* Using variables from base.css */
  color: var(--vt-c-red, #ff6b6b);
  border-left: 4px solid var(--vt-c-red, #ff6b6b);
}

.error-message svg {
  stroke: var(--vt-c-red, #ff6b6b);
  margin-right: 0.75rem;
}
.error-message span {
  font-weight: 500;
}

/* Menu Grid */

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Adjusted minmax */
  gap: 2rem; /* Increased gap */
}

/* Individual Menu Card Styling */
.menu-card.card {
  /* Base .card styles are applied */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure cards in a row have same height if content varies */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-top: none; /* Remove generic top border if .card has one, ribbon will replace */
}

.menu-card.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Enhanced shadow on hover */
}

.menu-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px; /* Thinner ribbon */
  height: 100%;
}

.ribbon-normal { background-color: var(--vt-c-blue); }
.ribbon-kids { background-color: var(--vt-c-purple); } /* Using purple for kids */
.ribbon-allergy { background-color: var(--vt-c-green); } /* Using green for allergy */

.menu-header {
  padding: 1.25rem 1.25rem 0.75rem 1.5rem; /* Adjusted padding */
  /* background-color: transparent; /* Let card background show */
  margin-left: 6px; /* Offset by ribbon width */
}

.menu-header h3 {
  margin: 0 0 0.75rem 0;
  color: var(--color-heading);
  font-size: 1.4rem; /* Slightly larger */
  font-weight: 600;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 4px; /* Smaller radius for tags */
  font-weight: 500;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* .day-tag, .meal-tag can have specific colors if needed, but generic .tag is fine */

.menu-content {
  padding: 0 1.5rem 1.5rem;
  flex-grow: 1; /* Allow content to fill space */
  /* background-color: transparent; */
  margin-left: 6px; /* Offset by ribbon width */
  display: flex;
  flex-direction: column;
}

.menu-description {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  flex-grow: 1;
}

.menu-info {
  background-color: var(--color-background); /* Slightly different from card bg */
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  margin-top: 1rem;
}

.menu-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.menu-info-item:last-child {
  margin-bottom: 0;
}

.menu-info-item svg {
  margin-right: 0.75rem;
  stroke: var(--color-accent-secondary); /* Accent for icons */
  flex-shrink: 0;
}

.menu-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  margin-left: 6px; /* Offset by ribbon width */
  margin-top: auto; /* Push actions to bottom */
}

/* Button Styles (relying on global .btn from main.css, specific overrides here) */
.btn-danger {
  background-color: var(--vt-c-red, #d9534f); /* Fallback red */
  color: var(--vt-c-white);
  border: 1px solid transparent;
}

.btn-danger:hover {
  background-color: var(--vt-c-red-dark, #c9302c); /* Need a dark red variable */
  filter: brightness(90%);
}

.btn-danger svg {
  stroke: var(--vt-c-white);
}

/* Empty State Styling */
.no-menus.card {
  grid-column: 1 / -1; /* Span full width if grid is active */
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.empty-state-icon svg {
  stroke: var(--vt-c-text-dark-2); /* Muted icon color */
  margin-bottom: 1.5rem;
  width: 56px; /* Slightly smaller icons */
  height: 56px;
}

.empty-state-message {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.empty-state-hint {
  color: var(--vt-c-text-dark-2);
  margin-bottom: 2rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .container {
    padding: 1.5rem 1rem;
  }
  .page-main-title {
    font-size: 1.8rem;
  }
  .menu-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tabs {
    /* Allow tabs to scroll horizontally on small screens */
    overflow-x: auto;
    justify-content: flex-start; /* Align tabs to start */
    padding-bottom: 0.5rem; /* Space for scrollbar if needed */
  }
  .tab-button {
    flex-grow: 0; /* Don't grow, let them take natural width */
    padding: 0.75rem 1rem;
  }
}
</style>