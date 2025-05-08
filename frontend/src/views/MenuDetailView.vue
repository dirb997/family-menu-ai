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
  <div class="menu-detail-view container">
    <div v-if="loading" class="loading-state card">
      <span class="spinner-large"></span> <!-- Assuming spinner-large is defined globally or add here -->
      <p>{{ t('menuDetail.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-message card">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>{{ error }}</span>
    </div>
    
    <div v-else-if="menu" class="menu-detail-content card">
      <div class="menu-header-section">
        <h1 class="page-main-title">{{ menu.name }}</h1>
        <div class="menu-tags">
          <span class="tag type-tag">{{ getTranslatedMenuType(menu.menuType) }}</span>
          <span class="tag day-tag">{{ getTranslatedDay(menu.dayOfWeek) }}</span>
          <span class="tag meal-tag">{{ getTranslatedMeal(menu.mealType) }}</span>
        </div>
      </div>
      
      <div class="menu-body-section">
        <div class="menu-section">
          <h2 class="section-title">{{ t('menuDetail.sections.description') }}</h2>
          <p>{{ menu.description }}</p>
        </div>
        
        <div class="menu-section details-list">
          <h2 class="section-title">{{ t('menuDetail.sections.details') }}</h2>
          <ul>
            <li><strong>{{ t('menuDetail.info.serves', { count: menu.numberOfPeople }) }}</strong></li>
            
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
        <button @click="router.push('/menu-list')" class="btn btn-secondary">{{ t('menuDetail.backToList') }}</button>
        <button @click="deleteMenuItem" class="btn btn-danger">{{ t('menuList.deleteMenu') }}</button>
      </div>
    </div>
    
    <div v-else class="not-found-state card">
      <p>{{ t('menuDetail.notFound') }}</p>
      <button @click="router.push('/menu-list')" class="btn btn-primary">{{ t('menuDetail.backToList') }}</button>
    </div>
  </div>
</template>

<style scoped>
.container { /* Consistent container styling */
  max-width: 800px; /* Or 960px if preferred for wider content */
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-main-title {
  font-size: 2.2rem;
  color: var(--color-heading);
  margin-bottom: 1rem; /* Reduced margin */
  font-weight: 700;
}

.menu-detail-content.card {
  /* Uses global .card styles (bg, border, radius, shadow) */
  padding: 2rem; /* Ensure padding if not inherited */
}

.menu-header-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Slightly increased gap */
  margin-top: 1rem; /* Space between title and tags */
}

.tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* Specific tag styling if needed, otherwise general .tag is fine */
.type-tag { background-color: var(--vt-c-blue); color: var(--vt-c-white); border-color: var(--vt-c-blue);}
.day-tag { background-color: var(--vt-c-purple); color: var(--vt-c-white); border-color: var(--vt-c-purple); }
.meal-tag { background-color: var(--vt-c-green); color: var(--vt-c-white); border-color: var(--vt-c-green); }

.menu-section {
  margin-bottom: 2rem;
}

.menu-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.5rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.menu-section p {
  line-height: 1.7;
  color: var(--color-text);
}

.details-list ul {
  list-style-type: none;
  padding: 0;
}

.details-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1rem;
}

.details-list li strong {
  color: var(--color-heading); /* Make labels slightly more prominent */
  margin-right: 0.5rem;
}

.details-list li:last-child {
  border-bottom: none;
}

.menu-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end; /* Align buttons to the right */
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

/* Buttons will use global .btn, .btn-primary, .btn-secondary, .btn-danger styles */
/* Ensure these are defined in main.css or base.css */

.btn-secondary {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-secondary:hover {
  background-color: var(--vt-c-black-mute);
  border-color: var(--color-border-hover);
  color: var(--vt-c-text-dark-1);
}

.btn-danger {
  background-color: var(--vt-c-red, #d9534f); /* Fallback red */
  color: var(--vt-c-white);
  border: 1px solid transparent;
}
.btn-danger:hover {
  background-color: var(--vt-c-red-dark, #c9302c); /* Need a dark red variable */
  filter: brightness(90%);
}


/* Loading, Error, Not Found States */
.loading-state.card,
.error-message.card,
.not-found-state.card {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text);
  /* Inherits .card styles (bg, border, radius, shadow) */
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.spinner-large { /* Copied from MenuListView for consistency if not global */
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-accent-primary);
  animation: spin 1s infinite linear;
}

.error-message.card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vt-c-red-soft, #2c1a1a);
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

.not-found-state.card p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>