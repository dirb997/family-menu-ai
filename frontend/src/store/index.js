import { createStore } from 'vuex'
import axios from 'axios'

// Use environment variable for API URL or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Log the API URL to help with debugging
console.log('API URL:', API_URL)

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
      try {
        console.log('Fetching menus from:', `${API_URL}/api/menu`)
        const response = await axios.get(`${API_URL}/api/menu`)
        console.log('Menus response:', response.data)
        commit('setMenus', response.data)
      } catch (error) {
        console.error('Error fetching menus:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
      } finally {
        commit('setLoading', false)
      }
    },
    
    async fetchWeeklyMenu({ commit }) {
      commit('setLoading', true)
      try {
        console.log('Fetching weekly menu from:', `${API_URL}/api/menu/weekly`)
        const response = await axios.get(`${API_URL}/api/menu/weekly`)
        console.log('Weekly menu response:', response.data)
        commit('setWeeklyMenu', response.data)
      } catch (error) {
        console.error('Error fetching weekly menu:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
      } finally {
        commit('setLoading', false)
      }
    },
    
    async fetchMenuById({ commit }, id) {
      commit('setLoading', true)
      try {
        console.log('Fetching menu by ID from:', `${API_URL}/api/menu/${id}`)
        const response = await axios.get(`${API_URL}/api/menu/${id}`)
        console.log('Menu by ID response:', response.data)
        commit('setCurrentMenu', response.data)
      } catch (error) {
        console.error('Error fetching menu by ID:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
      } finally {
        commit('setLoading', false)
      }
    },
    
    async generateMenu({ commit }, { prompt, menuType }) {
      commit('setLoading', true)
      try {
        console.log('Generating menu with prompt:', prompt, 'and menuType:', menuType)
        const response = await axios.post(`${API_URL}/api/ai/generate`, { prompt, menuType })
        console.log('Generated menu response:', response.data)
        if (response.data.dishes) {
          commit('addGeneratedMenu', response.data)
          return response.data
        } else if (response.data.rawResponse) {
          commit('setError', 'AI response format not recognized. Please try again.')
          return null
        }
      } catch (error) {
        console.error('Error generating menu:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
        return null
      } finally {
        commit('setLoading', false)
      }
    },
    
    async saveMenu({ commit, dispatch }, menuData) {
      commit('setLoading', true)
      try {
        console.log('Saving menu with data:', menuData)
        await axios.post(`${API_URL}/api/menu`, menuData)
        // After saving, refresh the menus list
        dispatch('fetchMenus')
        return true
      } catch (error) {
        console.error('Error saving menu:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    
    async updateMenu({ commit, dispatch }, { id, menuData }) {
      commit('setLoading', true)
      try {
        console.log('Updating menu with ID:', id, 'and data:', menuData)
        await axios.put(`${API_URL}/api/menu/${id}`, menuData)
        // After updating, refresh the menus list
        dispatch('fetchMenus')
        return true
      } catch (error) {
        console.error('Error updating menu:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    
    async deleteMenu({ commit, dispatch }, id) {
      commit('setLoading', true)
      try {
        console.log('Deleting menu with ID:', id)
        await axios.delete(`${API_URL}/api/menu/${id}`)
        // After deletion, refresh the menus list
        dispatch('fetchMenus')
        return true
      } catch (error) {
        console.error('Error deleting menu:', error)
        commit('setError', error.message || 'Network error when connecting to the API')
        return false
      } finally {
        commit('setLoading', false)
      }
    }
  }
})