<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { inject, onMounted, ref } from 'vue'

const { t, locale } = inject('translations')

// Check if translations are loaded properly
onMounted(() => {
  console.log(`App mounted with locale: ${locale.value}`)
  // Test translation
  const testTranslation = t('nav.home')
  console.log('Translation test:', testTranslation)
})

const toggleLanguage = () => {
  console.log(`Toggling language from ${locale.value}`)
  locale.value = locale.value === 'en' ? 'ja' : 'en'
  console.log(`Language toggled to ${locale.value}`)
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <nav class="navbar">
        <div class="logo">
          <RouterLink to="/" class="logo-link">Menu Creator</RouterLink>
        </div>
        <div class="nav-links">
          <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
          <RouterLink to="/weekly-menu">{{ t('nav.weeklyMenu') }}</RouterLink>
          <RouterLink to="/menu-list">{{ t('nav.allMenus') }}</RouterLink>
        </div>
        <div class="language-switcher">
          <button @click="toggleLanguage" class="language-toggle btn">
            {{ locale === 'en' ? '日本語' : 'English' }}
          </button>
        </div>
      </nav>
    </header>

    <main class="content-container">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="app-footer">
      <p>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
      <p>{{ t('footer.contact') }}</p>
    </footer>
  </div>
</template>

<style scoped>
/* Removed global :root variables and styles like *, body, global button, card, etc. 
   Those are now in base.css and main.css */

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
}

.app-header {
  background-color: var(--vt-c-black-soft); /* Darker header */
  color: var(--vt-c-text-dark-1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensure header is above other content */
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1280px; /* Consistent max-width */
  margin: 0 auto;
}

.logo-link {
  margin: 0;
  color: var(--vt-c-text-dark-1);
  font-size: 1.6rem;
  font-weight: 700; /* Bolder logo */
  text-decoration: none;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--vt-c-text-dark-2); /* Muted text for links */
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px; /* Consistent border-radius */
  transition: color 0.3s, background-color 0.3s;
  position: relative;
}

.nav-links a:hover {
  color: var(--vt-c-text-dark-1);
  background-color: var(--vt-c-black-mute); /* Subtle hover background */
}

.nav-links a.router-link-exact-active {
  color: var(--color-accent-primary); /* Accent color for active link */
  font-weight: 600;
}

.nav-links a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -4px; /* Position underline slightly below */
  left: 0.5rem; /* Align with padding */
  right: 0.5rem; /* Align with padding */
  height: 2px;
  background-color: var(--color-accent-primary);
  border-radius: 1px;
}

.language-switcher {
  margin-left: 1rem;
}

.language-toggle.btn {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid var(--color-border);
}

.language-toggle.btn:hover {
  background-color: var(--vt-c-black-mute);
  color: var(--vt-c-text-dark-1);
  border-color: var(--color-border-hover);
}

.content-container {
  flex: 1;
  width: 100%;
  /* max-width: 1280px; /* Max width for content area, consistent with navbar */
  /* margin: 0 auto; /* Center content */
  /* padding: 2rem; /* Padding around content, can be adjusted or moved to specific views */
  /* The HomeView.vue now has its own .container for max-width and padding */
}

/* Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Removed absolute positioning for transitions to simplify layout flow, 
   ensure views manage their own height and don't collapse parent during transition. 
   If jank occurs, may need to re-evaluate fixed height or absolute positioning strategy for transitions. */

.app-footer {
  text-align: center;
  padding: 2rem;
  background-color: var(--vt-c-black); /* Very dark footer */
  color: var(--vt-c-text-dark-2);
  border-top: 1px solid var(--color-border);
}

/* Loading spinner animation (if used globally by App.vue, otherwise remove if only in components) */
@keyframes spin {
  to { transform: rotate(360deg); }
}
/* Example of a global loading spinner style if App.vue had its own loading state */
/* .loading-spinner-global {
  width: 50px;
  height: 50px;
  border: 5px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-accent-primary);
  animation: spin 1s infinite linear;
} */

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start; /* Align items to start on mobile */
    padding: 1rem;
  }
  
  .logo-link {
    margin-bottom: 1rem;
  }
  
  .nav-links {
    width: 100%;
    flex-direction: column; /* Stack nav links */
    gap: 0.5rem; /* Reduce gap for stacked links */
    margin-bottom: 1rem;
  }
  
  .nav-links a {
    padding: 0.75rem 0.5rem; /* Adjust padding for vertical layout */
    text-align: left;
  }

  .nav-links a.router-link-exact-active::after {
    bottom: 0; /* Adjust underline for stacked links */
    left: 0;
    right: auto;
    width: 4px; /* Vertical bar style for active link */
    height: 100%;
  }

  .language-switcher {
    margin-left: 0;
    margin-top: 1rem; /* Space above language switcher */
    width: 100%;
  }
  .language-toggle.btn {
    width: 100%;
    text-align: center;
  }

  .content-container {
    padding: 1rem; /* Reduce padding on mobile */
  }
}
</style>
