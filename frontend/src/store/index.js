import { createStore } from 'vuex'
import axios from 'axios'

// Use environment variable for API URL or fallback to the proxy for development
const API_URL = import.meta.env.VITE_API_URL || ''

// Log the API URL to help with debugging
console.log('API URL:', API_URL || 'Using proxy path /api')

// Create axios instance with increased timeout for deployed environments
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased from 10s to 30s to handle slower response times on deployment
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper function to retry failed requests
const retryRequest = async (apiCall, retries = 3, delay = 1000) => {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`Request failed attempt ${attempt + 1}/${retries}: ${error.message}`);
      lastError = error;
      // Only delay if we're going to retry again
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }
  throw lastError;
};

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default createStore({
  state: {
    menus: [],
    weeklyMenu: null,
    currentMenu: null,
    loading: false,
    error: null,
    generatedMenus: []
  },
  getters: {
    getMenus: state => state.menus,
    getWeeklyMenu: state => state.weeklyMenu,
    getCurrentMenu: state => state.currentMenu,
    isLoading: state => state.loading,
    getError: state => state.error,
    getGeneratedMenus: state => state.generatedMenus
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus
    },
    setWeeklyMenu(state, weeklyMenu) {
      state.weeklyMenu = weeklyMenu
    },
    setCurrentMenu(state, menu) {
      state.currentMenu = menu
    },
    setLoading(state, isLoading) {
      state.loading = isLoading
    },
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },
    setGeneratedMenus(state, menus) {
      state.generatedMenus = menus
    },
    addGeneratedMenu(state, menu) {
      state.generatedMenus.push(menu)
    },
    clearGeneratedMenus(state) {
      state.generatedMenus = []
    }
  },
  actions: {
    async fetchMenus({ commit }) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Fetching menus from:', `${API_URL}/api/menu`)
        const response = await retryRequest(() => apiClient.get('/api/menu'));
        console.log('Menus response:', response.data)
        commit('setMenus', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching menus:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return []
      } finally {
        commit('setLoading', false)
      }
    },
    
    async fetchWeeklyMenu({ commit }) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Fetching weekly menu from:', `${API_URL}/api/menu/weekly`)
        const response = await retryRequest(() => apiClient.get('/api/menu/weekly'));
        console.log('Weekly menu response:', response.data)
        commit('setWeeklyMenu', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching weekly menu:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return null
      } finally {
        commit('setLoading', false)
      }
    },
    
    async fetchMenuById({ commit }, id) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Fetching menu by ID from:', `${API_URL}/api/menu/${id}`)
        const response = await retryRequest(() => apiClient.get(`/api/menu/${id}`));
        console.log('Menu by ID response:', response.data)
        commit('setCurrentMenu', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching menu by ID:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return null
      } finally {
        commit('setLoading', false)
      }
    },
    
    async generateMenu({ commit }, { prompt, menuType }) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Generating menu with prompt:', prompt, 'and menuType:', menuType)
        const response = await retryRequest(() => apiClient.post('/api/ai/generate', { prompt, menuType }));
        console.log('Generated menu response:', response.data)
        if (response.data.dishes) {
          commit('addGeneratedMenu', response.data)
          return response.data
        } else if (response.data.rawResponse) {
          commit('setError', 'AI response format not recognized. Please try again.')
          return null
        }
        return null
      } catch (error) {
        console.error('Error generating menu:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return null
      } finally {
        commit('setLoading', false)
      }
    },
    
    async saveMenu({ commit, dispatch }, menuData) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Saving menu with data:', menuData)
        const response = await retryRequest(() => apiClient.post('/api/menu', menuData));
        // After saving, refresh the menus list
        dispatch('fetchMenus')
        return true
      } catch (error) {
        console.error('Error saving menu:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    
    async updateMenu({ commit, dispatch }, { id, menuData }) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Updating menu with ID:', id, 'and data:', menuData)
        await retryRequest(() => apiClient.put(`/api/menu/${id}`, menuData));
        // After updating, refresh the menus list
        dispatch('fetchMenus')
        return true
      } catch (error) {
        console.error('Error updating menu:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    
    async deleteMenu({ commit, dispatch }, id) {
      commit('setLoading', true)
      commit('clearError')
      try {
        console.log('Deleting menu with ID:', id)
        await retryRequest(() => apiClient.delete(`/api/menu/${id}`));
        // After deletion, refresh the menus list
        dispatch('fetchMenus')
        return true
      } catch (error) {
        console.error('Error deleting menu:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Network error when connecting to the API'
        commit('setError', errorMessage)
        return false
      } finally {
        commit('setLoading', false)
      }
    },

    // Clear any stored errors
    clearError({ commit }) {
      commit('clearError')
    }
  }
})