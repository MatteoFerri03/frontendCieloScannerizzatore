<template>
  <div>
    <!-- Header risultati -->
    <section class="hero" style="padding: 2rem 2rem 4rem;">
      <h1>Risultati ricerca</h1>
      <p v-if="route.query.from && route.query.to">
        {{ route.query.from }} <i class="fas fa-arrow-right"></i> {{ route.query.to }}
      </p>
    </section>

    <section class="section">
      <!-- Loading -->
      <div v-if="flights.loading" class="empty-state">
        <div class="spinner" style="width: 48px; height: 48px;"></div>
        <p style="margin-top: 1rem;">Ricerca voli in corso...</p>
      </div>

      <!-- Errore -->
      <div v-else-if="flights.error" class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ flights.error }}</p>
        <router-link to="/" class="btn btn-primary" style="margin-top: 1rem;">Torna alla ricerca</router-link>
      </div>

      <!-- Nessun risultato -->
      <div v-else-if="flights.results.length === 0" class="empty-state">
        <i class="fas fa-plane-slash"></i>
        <p>Nessun volo trovato per questa tratta</p>
        <router-link to="/" class="btn btn-primary" style="margin-top: 1rem;">Nuova ricerca</router-link>
      </div>

      <!-- Lista voli -->
      <div v-else>
        <p style="color: var(--text-light); margin-bottom: 1rem;">
          {{ flights.results.length }} voli trovati
        </p>

        <div
          v-for="volo in flights.results"
          :key="volo.id"
          class="card flight-card"
        >
          <div class="flight-info">
            <div class="flight-route">
              <span class="flight-city">{{ volo.partenzaAporto }}</span>
              <i class="fas fa-plane flight-arrow"></i>
              <span class="flight-city">{{ volo.arrivoAporto }}</span>
            </div>
            <div class="flight-details">
              <span><i class="fas fa-calendar"></i> {{ formatDate(volo.oraPart) }}</span>
              <span><i class="fas fa-clock"></i> {{ formatTime(volo.oraPart) }}</span>
              <span v-if="volo.oraDest"><i class="fas fa-undo"></i> Ritorno: {{ formatDate(volo.oraDest) }}</span>
              <span><i class="fas fa-building"></i> {{ volo.airline }}</span>
            </div>
          </div>

          <div class="flight-price">
            <div class="price">€{{ formatPrice(volo.prezzo) }}</div>
            <div class="price-label">per persona</div>
            <button class="btn btn-accent" style="margin-top: 0.5rem;" @click="handleBooking(volo)">
              Prenota
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlightsStore } from '../stores/flights'
import { useGamificationStore } from '../stores/gamification'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const flights = useFlightsStore()
const gamification = useGamificationStore()
const auth = useAuthStore()
const bookingInProgress = ref(false)

onMounted(() => {
  const { from, to, departureStart, departureEnd, maxPrice } = route.query
  if (from && to) {
    flights.searchFlights(from, to, departureStart, departureEnd, maxPrice)
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(price) {
  if (!price) return '0.00'
  return Number(price).toFixed(2)
}

async function handleBooking(volo) {
  if (!auth.isLoggedIn) {
    alert('Devi effettuare il login per prenotare un volo!')
    router.push('/login')
    return
  }

  if (bookingInProgress.value) return

  const confirm = window.confirm(
    `Confermi la prenotazione del volo ${volo.partenzaAporto} → ${volo.arrivoAporto} a €${formatPrice(volo.prezzo)}?\n\n` +
    `Il tuo sconto attuale verrà applicato automaticamente.`
  )

  if (!confirm) return

  try {
    bookingInProgress.value = true
    const booking = await gamification.createBooking(auth.nickname, volo.id, 1)
    
    alert(
      ` Prenotazione completata con successo!\n\n` +
      `Prezzo finale: €${formatPrice(booking.totalPrice)}\n` +
      `Sconto applicato: ${booking.discountApplied}%\n\n` +
      `Hai guadagnato punti! Controlla il tuo profilo.`
    )
    
    // Ricarica le statistiche utente
    await gamification.loadUserStats(auth.nickname)
    router.push('/profile')
  } catch (error) {
    alert(` Errore nella prenotazione: ${error.response?.data?.message || 'Riprova più tardi'}`)
  } finally {
    bookingInProgress.value = false
  }
}
</script>
