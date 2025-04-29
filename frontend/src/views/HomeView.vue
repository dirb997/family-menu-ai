<script setup>
import { ref, computed, inject } from 'vue'
import { useStore } from 'vuex'

const { t, locale } = inject('translations')

const store = useStore()
const prompt = ref('')
const menuType = ref('normal')
const dayOfWeek = ref('monday')
const mealType = ref('dinner')

const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)
const generatedMenus = computed(() => store.getters.getGeneratedMenus)

const menuTypes = computed(() => [
  { value: 'normal', label: t('home.menuTypes.normal') },
  { value: 'kids', label: t('home.menuTypes.kids') },
  { value: 'allergy', label: t('home.menuTypes.allergy') }
])

const daysOfWeek = computed(() => [
  { value: 'monday', label: t('home.days.monday') },
  { value: 'tuesday', label: t('home.days.tuesday') },
  { value: 'wednesday', label: t('home.days.wednesday') },
  { value: 'thursday', label: t('home.days.thursday') },
  { value: 'friday', label: t('home.days.friday') },
  { value: 'saturday', label: t('home.days.saturday') },
  { value: 'sunday', label: t('home.days.sunday') }
])

const mealTypes = computed(() => [
  { value: 'breakfast', label: t('home.meals.breakfast') },
  { value: 'lunch', label: t('home.meals.lunch') },
  { value: 'dinner', label: t('home.meals.dinner') }
])

// Generate menu based on prompt
async function generateMenu() {
  if (!prompt.value.trim()) {
    alert(t('home.alerts.promptRequired'));
    return;
  }
  
  const result = await store.dispatch('generateMenu', { 
    prompt: prompt.value, 
    menuType: menuType.value 
  });
}

// Save a generated menu item to the database
async function saveMenuItem(dish) {
  const menuData = {
    name: dish.name,
    description: dish.description,
    numberOfPeople: dish.numberOfPeople || 4,
    menuType: menuType.value,
    dayOfWeek: dayOfWeek.value,
    mealType: mealType.value
  };

  // Add specific fields based on menu type
  if (menuType.value === 'kids') {
    menuData.ageRange = '3-12';
  } else if (menuType.value === 'allergy') {
    menuData.allergens = '';
  }

  const saved = await store.dispatch('saveMenu', menuData);
  if (saved) {
    alert(t('home.alerts.saveSuccess'));
  }
}

// Helper function to get day and meal in the right format for display
const getFormattedDayAndMeal = computed(() => {
  const day = t(`home.days.${dayOfWeek.value}`);
  const meal = t(`home.meals.${mealType.value}`);
  return { day, meal };
})
</script>

<template>
  <div class="home-view">
    <h1 class="page-title">{{ t('home.title') }}</h1>
    <div class="intro card">
      <p>{{ t('home.intro.welcome') }}</p>
      <p>{{ t('home.intro.instructions') }}</p>
    </div>

    <div class="prompt-container card">
      <h2>{{ t('home.generate.title') }}</h2>
      
      <div class="form-grid">
        <div class="form-group">
          <label for="menu-type">{{ t('home.generate.menuType') }}</label>
          <select id="menu-type" v-model="menuType" class="select-styled">
            <option v-for="type in menuTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="day">{{ t('home.generate.dayOfWeek') }}</label>
          <select id="day" v-model="dayOfWeek" class="select-styled">
            <option v-for="day in daysOfWeek" :key="day.value" :value="day.value">
              {{ day.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="meal">{{ t('home.generate.mealType') }}</label>
          <select id="meal" v-model="mealType" class="select-styled">
            <option v-for="meal in mealTypes" :key="meal.value" :value="meal.value">
              {{ meal.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="prompt">{{ t('home.generate.prompt') }}</label>
        <textarea
          id="prompt"
          v-model="prompt"
          :placeholder="t('home.generate.promptPlaceholder')"
          rows="5"
          class="textarea-styled"
        ></textarea>
      </div>
      
      <button @click="generateMenu" class="btn btn-primary" :disabled="loading">
        <span class="btn-icon" v-if="loading">
          <span class="spinner"></span>
        </span>
        <span v-else class="btn-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
        </span>
        {{ loading ? t('home.generate.generating') : t('home.generate.button') }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      {{ error }}
    </div>

    <div v-if="generatedMenus.length > 0" class="generated-menus">
      <h2 class="section-title">{{ t('home.results.title') }}</h2>
      
      <div v-for="(menu, menuIndex) in generatedMenus" :key="menuIndex" class="menu-result">
        <div v-for="(dish, index) in menu.dishes" :key="index" class="dish-card card">
          <h3>{{ dish.name }}</h3>
          <div class="dish-details">
            <span class="dish-serves">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              {{ t('home.results.serves', { count: dish.numberOfPeople || 4 }) }}
            </span>
          </div>
          <p class="dish-description">{{ dish.description }}</p>
          <div class="dish-actions">
            <button @click="saveMenuItem(dish)" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              {{ t('home.results.saveButton', { day: getFormattedDayAndMeal.day, meal: getFormattedDayAndMeal.meal }) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  padding-bottom: 2rem;
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

.intro {
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: var(--light-color);
  border-left: 4px solid var(--secondary-color);
}

.intro p {
  margin-bottom: 0.75rem;
}

.intro p:last-child {
  margin-bottom: 0;
}

.prompt-container {
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: white;
}

.prompt-container h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--dark-color);
}

.select-styled, .textarea-styled {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
}

.select-styled:focus, .textarea-styled:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(60, 110, 113, 0.2);
  outline: none;
}

.textarea-styled {
  resize: vertical;
  min-height: 120px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--border-radius);
  transition: all 0.3s;
  cursor: pointer;
}

.btn-icon {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 4px rgba(60, 110, 113, 0.2);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: 0 4px 8px rgba(60, 110, 113, 0.3);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: var(--gray-dark);
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
}

.generated-menus {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gray-medium);
}

.menu-result {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dish-card {
  background-color: white;
  padding: 1.5rem;
  margin-bottom: 0; /* Removed bottom margin since we're using gap */
  position: relative;
  border-top: 4px solid var(--primary-color);
}

.dish-card h3 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.dish-details {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--gray-dark);
}

.dish-serves {
  display: flex;
  align-items: center;
}

.dish-serves svg {
  margin-right: 0.25rem;
  stroke: var(--primary-color);
}

.dish-description {
  margin: 0.5rem 0 1.5rem;
  line-height: 1.6;
  color: var(--dark-color);
}

.dish-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--dark-color);
}

.btn-secondary:hover {
  background-color: #8ab1c7;
}

.error-message {
  display: flex;
  align-items: center;
  background-color: #fee;
  color: #c44;
  padding: 1rem;
  border-radius: var(--border-radius);
  border-left: 4px solid #c44;
  margin-bottom: 1rem;
}

.error-message svg {
  stroke: #c44;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .menu-result {
    grid-template-columns: 1fr;
  }
}
</style>