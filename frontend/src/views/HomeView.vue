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
    <section class="hero-section">
      <div class="hero-content container">
        <h1 class="hero-title">{{ t('home.title') }}</h1>
        <p class="hero-subtitle">{{ t('home.intro.welcome') }}</p>
        <p class="hero-description">{{ t('home.intro.instructions') }}</p>
      </div>
    </section>

    <div class="main-content container">
      <div class="prompt-container card">
        <h2 class="section-heading">{{ t('home.generate.title') }}</h2>
        
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
              <option v-for="dayItem in daysOfWeek" :key="dayItem.value" :value="dayItem.value">
                {{ dayItem.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="meal">{{ t('home.generate.mealType') }}</label>
            <select id="meal" v-model="mealType" class="select-styled">
              <option v-for="mealItem in mealTypes" :key="mealItem.value" :value="mealItem.value">
                {{ mealItem.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-group full-width-group">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </span>
          {{ loading ? t('home.generate.generating') : t('home.generate.button') }}
        </button>
      </div>

      <div v-if="error" class="error-message card">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>{{ error }}</span>
      </div>

      <div v-if="generatedMenus.length > 0" class="generated-menus">
        <h2 class="section-heading results-title">{{ t('home.results.title') }}</h2>
        
        <div class="menu-result-group">
          <div v-for="(menu, menuIndex) in generatedMenus" :key="menuIndex">
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
    </div>
  </div>
</template>

<style scoped>
/* General Layout */
.home-view {
  width: 100%;
  background-color: var(--color-background); /* Uses variables from base.css */
  color: var(--color-text);
}

.container {
  max-width: 960px; /* Adjusted max-width for content */
  margin: 0 auto;
  padding: 0 1.5rem; /* Horizontal padding */
}

/* Hero Section */
.hero-section {
  background-color: var(--vt-c-black-soft); /* Dark background for hero */
  padding: 4rem 0; /* Vertical padding */
  text-align: center;
  color: var(--vt-c-text-dark-1);
  border-bottom: 1px solid var(--color-border);
}

.hero-title {
  font-size: 2.8rem; /* Larger title */
  font-weight: 700;
  color: var(--vt-c-text-dark-1); /* Bright text on dark background */
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--vt-c-text-dark-2); /* Softer text color */
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--vt-c-text-dark-2);
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
}

/* Main Content Area */
.main-content {
  padding-top: 2.5rem;
  padding-bottom: 3rem;
}

/* Card Styling */
.card {
  background-color: var(--color-background-soft); /* Slightly different from page bg */
  border: 1px solid var(--color-border);
  border-radius: 8px; /* Consistent border radius */
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); /* Subtle shadow for light mode, might need adjustment for dark */
}

/* Section Headings */
.section-heading {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
}

.results-title {
  margin-top: 1rem; /* Space above results title if menus are shown */
}

/* Form Styling */

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive grid */
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 0; /* Removed bottom margin as gap handles it */
}

.full-width-group { /* Added for textarea to span full width if needed */
  grid-column: 1 / -1; /* Span all columns in the grid */
}

label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 500; /* Slightly bolder labels */
  color: var(--color-text);
  font-size: 0.95rem;
}

.select-styled,
.textarea-styled {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background); /* Match page background */
  color: var(--color-text);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.select-styled:focus,
.textarea-styled:focus {
  border-color: var(--color-accent-primary);
  /* Define --vt-c-blue-rgb in :root or use a fixed rgba value for the shadow */
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.3); /* Example: using fixed RGB for Vite's blue */
  outline: none;
}

.textarea-styled {
  min-height: 120px;
  resize: vertical;
}

.textarea-styled::placeholder {
  color: var(--vt-c-text-dark-2); /* Softer placeholder text, ensure this var is suitable or adjust */
  opacity: 0.7;
}


/* Button Styling */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.8rem; /* Adjusted padding */
  font-size: 1rem;
  font-weight: 600; /* Bolder button text */
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent; /* Base border */
  text-align: center;
}

.btn-icon {
  display: flex;
  align-items: center;
  margin-right: 0.6rem;
}
.btn-icon svg {
  width: 18px; /* Consistent icon size */
  height: 18px;
}

.btn-primary {
  background-color: var(--color-accent-primary);
  color: var(--vt-c-white); /* White text on accent background */
  border-color: var(--color-accent-primary);
}

.btn-primary:hover {
  background-color: var(--vt-c-blue); /* Ensure --vt-c-blue is a slightly different shade or use filter */
  filter: brightness(110%);
  transform: translateY(-1px);
  /* Define --vt-c-blue-rgb or use a fixed rgba value for the shadow */
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3); /* Example shadow */
}

.btn-primary:active {
  transform: translateY(0);
  filter: brightness(100%);
}

.btn-primary:disabled {
  background-color: var(--vt-c-black-mute); /* Muted background for disabled */
  color: var(--vt-c-text-dark-2);
  cursor: not-allowed;
  box-shadow: none;
  border-color: var(--vt-c-black-mute);
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3); /* Lighter border for spinner on dark button */
  border-radius: 50%;
  border-top-color: var(--vt-c-white); /* White top border for visibility */
  animation: spin 0.8s infinite linear;
}

/* Generated Menus Section */
.generated-menus {
  margin-top: 2.5rem;
}

.menu-result-group { 
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive cards */
  gap: 1.5rem;
}

.dish-card {
  /* Inherits .card styles, add specifics here */
  border-top: 4px solid var(--color-accent-primary); /* Accent top border */
  display: flex; /* Added for flex layout */
  flex-direction: column; /* Stack items vertically */
}

.dish-card h3 {
  color: var(--color-heading);
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.4rem; /* Slightly larger dish name */
  font-weight: 600;
}

.dish-details {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text); /* Use main text color */
  opacity: 0.9;
}

.dish-serves svg {
  margin-right: 0.4rem;
  stroke: var(--color-accent-secondary); /* Use secondary accent for icons */
}

.dish-description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--color-text);
  font-size: 0.95rem;
  flex-grow: 1; /* Allow description to take available space */
}

.dish-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto; /* Pushes actions to the bottom of the card */
}

.btn-secondary {
  background-color: var(--color-background-mute); /* Muted background */
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--vt-c-black-mute); /* Darken on hover */
  border-color: var(--color-border-hover);
  color: var(--vt-c-text-dark-1);
}
.btn-secondary svg {
  stroke: var(--color-accent-primary); /* Accent color for save icon */
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  /* Assuming --vt-c-red-soft and --vt-c-red are defined in base.css for error states */
  background-color: var(--vt-c-red-soft, #2c1a1a); 
  color: var(--vt-c-red, #ff6b6b); 
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--vt-c-red, #ff6b6b);
  /* .card styles (border, radius, margin) are already applied */
}

.error-message svg {
  stroke: var(--vt-c-red, #ff6b6b);
  margin-right: 0.75rem;
  flex-shrink: 0;
}
.error-message span {
  font-weight: 500;
}


@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .hero-description {
    font-size: 1rem;
  }
  .form-grid {
    grid-template-columns: 1fr; /* Stack form elements on smaller screens */
    gap: 1rem;
  }
  .section-heading {
    font-size: 1.5rem;
  }
  .dish-card h3 {
    font-size: 1.2rem;
  }
}
</style>