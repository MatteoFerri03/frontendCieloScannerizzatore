import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:8080'

export const useGamificationStore = defineStore('gamification', () => {
  const loading = ref(false)
  const error = ref(null)
  const userStats = reactive({
    totalFlights: 0,
    countries: 0,
    points: 0,
    discount: 0,
    badges: [],
    heatmap: {}
  })
  const leaderboard = ref([])

  async function loadUserStats(nickname) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/api/gamification/stats/${nickname}`)
      const data = response.data
      
      userStats.totalFlights = data.totalFlights
      userStats.countries = data.countriesVisited
      userStats.points = data.totalPoints
      userStats.discount = data.currentDiscount
      userStats.badges = data.badges
      userStats.heatmap = data.monthlyFlights || {}
    } catch (err) {
      error.value = err.response?.data?.message || 'Errore nel caricamento delle statistiche'
      console.error('Errore loadUserStats:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadLeaderboard() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/api/gamification/leaderboard`)
      leaderboard.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Errore nel caricamento della classifica'
      console.error('Errore loadLeaderboard:', err)
    } finally {
      loading.value = false
    }
  }

  async function createBooking(nickname, voloId, seats = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(`${API_URL}/api/bookings/${nickname}`, {
        voloId,
        seats
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Errore nella prenotazione'
      console.error('Errore createBooking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    userStats,
    leaderboard,
    loadUserStats,
    loadLeaderboard,
    createBooking
  }
})
