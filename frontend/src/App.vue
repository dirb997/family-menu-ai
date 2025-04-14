<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="logo">
        <h1>Menu Creator</h1>
      </div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/weekly-menu">Weekly Menu</RouterLink>
        <RouterLink to="/menu-list">All Menus</RouterLink>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>© {{ new Date().getFullYear() }} Menu Creator App</p>
  </footer>
</template>

<style>
:root {
  --primary-color: #3c6e71;
  --primary-light: #95bdbf;
  --primary-dark: #284b4d;
  --secondary-color: #98c1d9;
  --accent-color: #ee6c4d;
  --light-color: #e0fbfc;
  --dark-color: #293241;
  --gray-light: #f4f4f8;
  --gray-medium: #e0e0e4;
  --gray-dark: #aeaeae;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--gray-light);
  color: var(--dark-color);
  line-height: 1.6;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo h1 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--light-color);
  border-radius: 3px;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 160px);
}

footer {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--dark-color);
  color: white;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

/* Global Button Styles */
button {
  cursor: pointer;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

/* Global Card Styles */
.card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

/* Form Controls */
input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  outline: none;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(60, 110, 113, 0.2);
}

/* Loading State */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--primary-color);
  font-weight: 500;
}

.loading::before {
  content: '';
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
  border: 3px solid var (--primary-light);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  background-color: #fee;
  color: #c44;
  padding: 1rem;
  border-radius: var(--border-radius);
  border-left: 4px solid #c44;
  margin-bottom: 1rem;
}

/* Media Queries */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  
  .logo {
    margin-bottom: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-links a {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  main {
    padding: 1rem;
  }
}
</style>
