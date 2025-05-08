<script setup>
import { onMounted, computed, inject } from 'vue'
import { useStore } from 'vuex'

const { t } = inject('translations')

const store = useStore()

const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)
const weeklyMenu = computed(() => store.getters.getWeeklyMenu)

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const mealTypes = ['breakfast', 'lunch', 'dinner']

onMounted(() => {
  store.dispatch('fetchWeeklyMenu')
})

// Delete a menu item
async function deleteMenuItem(id) {
  if (confirm(t('menuList.confirmDelete'))) {
    const deleted = await store.dispatch('deleteMenu', id)
    if (deleted) {
      store.dispatch('fetchWeeklyMenu')
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

// Improved truncation function with responsive limit
function truncateDescription(text) {
  if (!text) return '';
  const maxLength = window.innerWidth > 1200 ? 85 : (window.innerWidth > 768 ? 60 : 40);
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Fixed function to properly check if today matches the passed day name
function isToday(day) {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay(); // Returns 0-6 (0 = Sunday, 1 = Monday, etc.)
  return daysOfWeek[today] === day.toLowerCase();
}
</script>

<template>
  <div class="weekly-menu-view container">
    <h1 class="page-main-title">{{ t('weeklyMenu.title') }}</h1>
    
    <div v-if="loading" class="loading-state card">
      <span class="spinner-large"></span>
      <p>{{ t('menuDetail.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-message card">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>{{ error }}</span>
    </div>
    
    <div v-else-if="weeklyMenu && Object.keys(weeklyMenu).length > 0" class="weekly-calendar-wrapper card">
      <div class="calendar-grid-scroll-container">
        <div class="calendar-grid">
          <div class="grid-header corner-cell"></div> <!-- Empty corner cell -->
          <div v-for="day in days" :key="day" class="grid-header day-label">
            {{ getTranslatedDay(day) }}
          </div>
        
          <template v-for="meal in mealTypes" :key="meal">
            <div class="grid-header meal-label">
              <div class="meal-badge">{{ getTranslatedMeal(meal) }}</div>
            </div>
            <div v-for="day in days" :key="`${day}-${meal}`" class="menu-cell" :class="{ 'cell-today': isToday(day) }" :data-today-label="isToday(day) ? t('weeklyMenu.today') : ''">
              <div v-if="weeklyMenu[day] && weeklyMenu[day][meal] && weeklyMenu[day][meal].length" class="menu-items-container">
                <div v-for="menuItem in weeklyMenu[day][meal]" :key="menuItem.id" class="menu-item-card card">
                  <div class="menu-item-header">
                    <h4 class="menu-item-title" :title="menuItem.name">{{ menuItem.name }}</h4>
                    <button @click="deleteMenuItem(menuItem.id)" class="btn-icon-only delete-btn" :title="t('menuList.deleteMenu')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="menu-item-description" :title="menuItem.description">
                    {{ truncateDescription(menuItem.description) }}
                  </p>
                  <div class="menu-item-footer">
                    <span class="people-count">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      {{ menuItem.numberOfPeople }}
                    </span>
                    <span class="menu-type-badge" :class="'type-' + menuItem.menuType.toLowerCase()">
                      {{ getTranslatedMenuType(menuItem.menuType) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="empty-cell-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>{{ t('weeklyMenu.emptySlot') }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data-state card">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>
        </svg>
      </div>
      <p class="empty-state-message">{{ t('weeklyMenu.noData') }}</p>
      <p class="empty-state-hint">{{ t('weeklyMenu.generateHint') }}</p>
      <router-link to="/" class="btn btn-primary">{{ t('menuList.goToGenerator') }}</router-link>
    </div>
  </div>
</template>

<style scoped>
.container { /* Consistent container styling */
  max-width: 1200px; /* Wider for calendar view */
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-main-title {
  font-size: 2.2rem;
  color: var(--color-heading);
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 700;
  text-align: center;
}

.weekly-calendar-wrapper.card {
  padding: 0; /* Remove padding from wrapper if grid has its own */
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden; /* Important for child border radius and overflow */
}

.calendar-grid-scroll-container {
  overflow-x: auto; /* Enable horizontal scrolling for the grid */
  width: 100%;
}

.calendar-grid {
  display: grid;
  grid-template-columns: 100px repeat(7, minmax(140px, 1fr)); /* Time column + 7 days, min width for day cells */
  /* Removed gap, borders will handle separation */
  width: max-content; /* Allow grid to be wider than container for scrolling */
  min-width: 100%; /* Ensure it takes at least full width before scrolling */
  border-collapse: collapse; /* For a more table-like border appearance */
}

.grid-header {
  background-color: var(--vt-c-black-soft);
  color: var(--vt-c-text-dark-1);
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  position: sticky; /* Sticky headers for day labels */
  top: 0;
  z-index: 10;
}

.grid-header.corner-cell {
  background-color: var(--color-background-mute);
  border-left: none;
  position: sticky; /* Sticky corner cell */
  left: 0;
  z-index: 20; /* Above day labels */
}

.grid-header.meal-label {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: none;
  border-top: 1px solid var(--color-border);
  padding: 0.5rem;
  position: sticky; /* Sticky meal labels */
  left: 0;
  z-index: 15; /* Above cells, below corner */
  /* Simple text overflow for now, JS handles more complex truncation */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Show 2 lines */
  line-clamp: 2; /* Standard property */
  -webkit-box-orient: vertical;
}

.meal-badge {
  background-color: var(--color-accent-secondary); 
  color: var(--vt-c-white);
  padding: 0.5rem 0.75rem;
  border-radius: 15px; 
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.menu-cell {
  background-color: var(--color-background);
  padding: 0.75rem;
  min-height: 170px; 
  border-top: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  position: relative;
  display: flex;
  flex-direction: column; 
}

.cell-today {
  background-color: var(--color-background-mute); 
  position: relative;
}

.cell-today::after { 
  content: attr(data-today-label);
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: var(--color-accent-primary);
  color: var(--vt-c-white);
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 4px;
  font-weight: 600;
  z-index: 1;
}

.menu-items-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; 
  height: 100%;
}

.menu-item-card.card {
  padding: 0.75rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent-primary); 
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.menu-item-card.card:hover {
  border-color: var(--color-accent-primary);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.4rem;
}

.menu-item-title {
  margin: 0;
  color: var(--color-heading);
  font-size: 0.95rem;
  font-weight: 600;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.5rem;
}

.btn-icon-only.delete-btn {
  background: transparent;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  color: var(--vt-c-text-dark-2); 
  transition: color 0.3s;
}

.btn-icon-only.delete-btn:hover {
  color: var(--vt-c-red); 
}
.btn-icon-only.delete-btn svg {
  width: 16px; height: 16px;
}

.menu-item-description {
  font-size: 0.8rem;
  color: var(--color-text);
  line-height: 1.4;
  margin-bottom: 0.5rem;
  overflow: hidden; 
  flex-grow: 1;
  /* Simple text overflow for now, JS handles more complex truncation */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Show 2 lines */
  line-clamp: 2; /* Standard property */
  -webkit-box-orient: vertical;
}

.menu-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-top: auto; 
  color: var(--vt-c-text-dark-2);
}

.people-count {
  display: flex;
  align-items: center;
}

.people-count svg {
  margin-right: 0.3rem;
  stroke: currentColor;
}

.menu-type-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--vt-c-white);
  white-space: nowrap;
}

.type-normal { background-color: var(--vt-c-blue); }
.type-kids { background-color: var(--vt-c-purple); }
.type-allergy { background-color: var(--vt-c-green); }

.empty-cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100px; /* Ensure empty cells have some height */
  color: var(--vt-c-text-dark-2); 
  border: 2px dashed var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.empty-cell-content svg {
  stroke: var(--vt-c-text-dark-2);
  margin-bottom: 0.5rem;
  width: 28px; height: 28px;
}
.empty-cell-content span {
  font-size: 0.85rem;
}

/* Loading, Error, No Data States (Shared with other views) */
.loading-state.card,
.error-message.card,
.no-data-state.card {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin: 2rem auto; /* Center these states if they are the only content */
  max-width: 600px; /* Limit width for these states */
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.spinner-large {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-accent-primary);
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

.error-message.card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vt-c-red-soft, #2c1a1a);
  color: var(--vt-c-red, #ff6b6b);
  border-left: 4px solid var(--vt-c-red, #ff6b6b);
}
.error-message svg { stroke: var(--vt-c-red, #ff6b6b); margin-right: 0.75rem; }
.error-message span { font-weight: 500; }

.no-data-state.card .empty-state-icon svg {
  stroke: var(--vt-c-text-dark-2);
  margin-bottom: 1.5rem;
}
.no-data-state.card .empty-state-message {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}
.no-data-state.card .empty-state-hint {
  color: var(--vt-c-text-dark-2);
  margin-bottom: 2rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments for calendar */
@media (max-width: 992px) { /* Tablet and smaller */
  .container {
    max-width: 100%;
    padding: 1.5rem 1rem;
  }
  .calendar-grid {
    grid-template-columns: 80px repeat(7, minmax(120px, 1fr)); 
  }
  .grid-header, .menu-cell {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
  .menu-item-title { font-size: 0.9rem; }
  .menu-item-description { font-size: 0.75rem; -webkit-line-clamp: 2; line-clamp: 2; /* Standard property */ }
  .menu-type-badge { font-size: 0.65rem; padding: 0.15rem 0.3rem; }
}

@media (max-width: 768px) { /* Mobile */
  .page-main-title { font-size: 1.8rem; }
  .weekly-calendar-wrapper.card { padding: 0; }
  
  .calendar-grid-scroll-container {
    border-radius: 8px; /* Match parent card radius */
  }

  .calendar-grid {
    grid-template-columns: 70px repeat(7, minmax(110px, 1fr));
  }

  .grid-header.corner-cell, .grid-header.meal-label {
     width: 70px; /* Match first column width */
  }

  .menu-item-card.card {
    padding: 0.5rem;
    border-left-width: 3px;
  }
  .menu-item-title { font-size: 0.85rem; }
  .menu-item-description {
    /* Consider hiding description on very small screens if too cluttered */
    /* display: none; */
     -webkit-line-clamp: 1;
     line-clamp: 1; /* Standard property */
  }
  .menu-item-footer {
    font-size: 0.7rem;
    flex-direction: column; /* Stack footer items */
    align-items: flex-start;
    gap: 0.25rem;
  }
  .people-count svg { width: 12px; height: 12px; }
}
</style>