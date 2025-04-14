<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

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
  if (confirm('Are you sure you want to delete this menu item?')) {
    const deleted = await store.dispatch('deleteMenu', id)
    if (deleted) {
      store.dispatch('fetchWeeklyMenu')
    }
  }
}

// Helper function to capitalize first letter
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Add this method to the script setup section
function isToday(day) {
  const today = new Date().toLocaleLowerCase();
  return today.includes(day);
}
</script>

<template>
  <div class="weekly-menu-view">
    <h1 class="page-title">Weekly Menu Calendar</h1>
    
    <div v-if="loading" class="loading">
      <span class="spinner-large"></span>
      Loading weekly menu...
    </div>
    
    <div v-else-if="error" class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      {{ error }}
    </div>
    
    <div v-else-if="weeklyMenu" class="weekly-calendar card">
      <div class="calendar-header">
        <div class="day-header time-column"></div> <!-- Empty corner cell -->
        <div v-for="day in days" :key="day" class="day-header">
          {{ capitalize(day) }}
        </div>
      </div>
      
      <div v-for="meal in mealTypes" :key="meal" class="meal-row">
        <div class="meal-type time-column">
          <div class="meal-badge">{{ capitalize(meal) }}</div>
        </div>
        
        <div v-for="day in days" :key="`${day}-${meal}`" class="menu-cell" :class="{ 'cell-today': isToday(day) }">
          <div v-if="weeklyMenu[day] && weeklyMenu[day][meal] && weeklyMenu[day][meal].length" class="menu-items">
            <div v-for="menuItem in weeklyMenu[day][meal]" :key="menuItem.id" class="menu-item card">
              <div class="menu-item-header">
                <h4>{{ menuItem.name }}</h4>
                <button @click="deleteMenuItem(menuItem.id)" class="delete-btn" title="Delete this menu item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
              <p class="menu-item-description">{{ menuItem.description.length > 100 ? menuItem.description.substring(0, 100) + '...' : menuItem.description }}</p>
              <div class="menu-item-footer">
                <span class="people-count">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  {{ menuItem.numberOfPeople }} 
                </span>
                <span class="menu-type-badge" :class="`type-${menuItem.menuType}`">
                  {{ capitalize(menuItem.menuType) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="empty-cell">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span>No menu planned</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data card">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M8 14h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 18h.01"></path>
        <path d="M12 18h.01"></path>
        <path d="M16 18h.01"></path>
      </svg>
      <p>No menu data available yet.</p>
      <p class="no-data-hint">Generate some menu items on the home page to get started!</p>
      <router-link to="/" class="btn btn-primary">Go to Menu Generator</router-link>
    </div>
  </div>
</template>

<style scoped>
.weekly-menu-view {
  margin-bottom: 2rem;
}

.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.page-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background-color: var(--accent-color);
  border-radius: 2px;
}

.weekly-calendar {
  overflow: hidden;
  border: none;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}

.calendar-header {
  display: flex;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  color: white;
}

.day-header {
  flex: 1;
  text-align: center;
  padding: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.time-column {
  width: 100px;
  flex-shrink: 0;
}

.meal-row {
  display: flex;
  border-bottom: 1px solid var(--gray-medium);
}

.meal-row:last-child {
  border-bottom: none;
}

.meal-type {
  padding: 1rem;
  font-weight: bold;
  background-color: var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--gray-medium);
}

.meal-badge {
  background-color: var(--secondary-color);
  color: var(--dark-color);
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  width: 100%;
  text-align: center;
}

.menu-cell {
  flex: 1;
  padding: 0.75rem;
  min-height: 180px;
  border-right: 1px solid var(--gray-medium);
  background-color: white;
  position: relative;
}

.menu-cell:last-child {
  border-right: none;
}

.cell-today {
  background-color: rgba(224, 251, 252, 0.5);
}

.cell-today::before {
  content: 'TODAY';
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--accent-color);
  color: white;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border-bottom-left-radius: var(--border-radius);
  font-weight: bold;
}

.menu-items {
  height: 100%;
}

.menu-item {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-left: 3px solid var(--secondary-color);
  transition: var(--transition);
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.menu-item h4 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1rem;
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-dark);
  transition: var(--transition);
  margin-left: 0.5rem;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.delete-btn svg {
  stroke: currentColor;
}

.menu-item-description {
  font-size: 0.85rem;
  color: var(--dark-color);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.menu-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.people-count {
  display: flex;
  align-items: center;
  color: var(--gray-dark);
}

.people-count svg {
  margin-right: 0.25rem;
}

.menu-type-badge {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-normal {
  background-color: var(--light-color);
  color: var(--primary-color);
}

.type-kids {
  background-color: #ffedd5;
  color: #9a3412;
}

.type-allergy {
  background-color: #ede9fe;
  color: #5b21b6;
}

.empty-cell {
  height: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gray-dark);
  border: 2px dashed var(--gray-medium);
  border-radius: var(--border-radius);
}

.empty-cell svg {
  margin-bottom: 0.5rem;
  stroke: var(--gray-dark);
}

.loading, .error-message, .no-data {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.no-data svg {
  stroke: var(--gray-dark);
  margin-bottom: 1.5rem;
}

.no-data p {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.no-data-hint {
  color: var(--gray-dark);
  margin-bottom: 1.5rem;
}

.no-data .btn {
  min-width: 200px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .weekly-calendar {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .time-column {
    width: 80px;
  }
  
  .day-header, .menu-cell {
    padding: 0.5rem;
  }
  
  .menu-item-description {
    display: none;
  }
  
  .menu-item {
    padding: 0.5rem;
  }
  
  .menu-item h4 {
    font-size: 0.85rem;
  }
}
</style>