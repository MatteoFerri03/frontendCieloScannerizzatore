import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const useFlightsStore = defineStore('flights', () => {
  const results = ref([])
  const loading = ref(false)
  const error = ref('')

  async function searchFlights(from, to, departureStart, departureEnd, maxPrice) {
    loading.value = true
    error.value = ''
    try {
      const params = { from, to }
      if (departureStart) params.departureStart = departureStart
      if (departureEnd) params.departureEnd = departureEnd
      if (maxPrice) params.maxPrice = maxPrice

      const res = await api.get('/Voli/ricerca', { params })
      results.value = res.data
    } catch (e) {
      error.value = 'Errore nella ricerca dei voli'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  return { results, loading, error, searchFlights }
})
