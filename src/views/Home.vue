<template>
  <div>
    <!-- HERO con barra di ricerca -->
    <section class="hero">
      <h1>Trova il tuo volo low cost</h1>
      <p>Cerca, prenota e accumula punti per ottenere sconti incredibili</p>
    </section>

    <!-- SEARCH BOX -->
    <div class="search-box">
      <form @submit.prevent="handleSearch" class="search-row">
        <div class="search-field">
          <label>Da</label>
          <select v-model="from" required>
            <option value="">Seleziona aeroporto</option>
            <option value="FCO">FCO (Roma Fiumicino)</option>
            <option value="MXP">MXP (Milano Malpensa)</option>
            <option value="NAP">NAP (Napoli)</option>
            <option value="VCE">VCE (Venezia)</option>
            <option value="BCN">BCN (Barcellona)</option>
          </select>
        </div>

        <div class="search-field">
          <label>A</label>
          <select v-model="to" required>
            <option value="">Seleziona aeroporto</option>
            <option value="FCO">FCO (Roma Fiumicino)</option>
            <option value="MXP">MXP (Milano Malpensa)</option>
            <option value="NAP">NAP (Napoli)</option>
            <option value="VCE">VCE (Venezia)</option>
            <option value="BCN">BCN (Barcellona)</option>
          </select>
        </div>

        <div class="search-field">
          <label>Data partenza</label>
          <input v-model="departureStart" type="date" />
        </div>

        <div class="search-field">
          <label>Data ritorno</label>
          <input v-model="departureEnd" type="date" />
        </div>

        <div class="search-field">
          <label>Budget max (€)</label>
          <input v-model="maxPrice" type="number" min="0" placeholder="Es. 150" />
        </div>

        <button type="submit" class="btn btn-primary btn-lg">
          <i class="fas fa-search"></i> Cerca
        </button>
      </form>
    </div>

    <!-- FEATURES -->
    <section class="section">
      <h2 class="section-title"><i class="fas fa-star"></i> Perché CieloScannerizzatore?</h2>
      <div class="features-grid">
        <div class="card feature-card">
          <div class="feature-icon sky"><i class="fas fa-trophy"></i></div>
          <h3>Leaderboard & Badge</h3>
          <p>Viaggia di più, scala la classifica e sblocca badge esclusivi per ottenere sconti speciali.</p>
        </div>

        <div class="card feature-card">
          <div class="feature-icon sunset"><i class="fas fa-fire"></i></div>
          <h3>Heatmap Viaggi</h3>
          <p>Visualizza tutti i tuoi voli nell'arco dei mesi con una mappa di calore personalizzata.</p>
        </div>

        <div class="card feature-card">
          <div class="feature-icon green"><i class="fas fa-tags"></i></div>
          <h3>Sconti Progressivi</h3>
          <p>Più viaggi fai, più sconti accumuli. Tariffe ridotte per destinazioni mai visitate!</p>
        </div>
      </div>
    </section>

    <!-- COME FUNZIONA -->
    <section class="section">
      <h2 class="section-title"><i class="fas fa-route"></i> Come funziona</h2>
      <div class="features-grid">
        <div class="card feature-card">
          <div class="feature-icon sky"><i class="fas fa-user-plus"></i></div>
          <h3>1. Registrati</h3>
          <p>Crea il tuo account gratuito in pochi secondi.</p>
        </div>

        <div class="card feature-card">
          <div class="feature-icon sunset"><i class="fas fa-plane-departure"></i></div>
          <h3>2. Cerca e Prenota</h3>
          <p>Trova il volo perfetto al prezzo più basso.</p>
        </div>

        <div class="card feature-card">
          <div class="feature-icon green"><i class="fas fa-gift"></i></div>
          <h3>3. Ottieni Premi</h3>
          <p>Accumula punti e sblocca achievement per sconti e premi speciali.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const from = ref('')
const to = ref('')
const departureStart = ref('')
const departureEnd = ref('')
const maxPrice = ref('')

function handleSearch() {
  const query = {
    from: from.value,
    to: to.value
  }
  if (departureStart.value) query.departureStart = departureStart.value + 'T00:00:00'
  if (departureEnd.value) query.departureEnd = departureEnd.value + 'T23:59:59'
  if (maxPrice.value) query.maxPrice = maxPrice.value

  router.push({ name: 'SearchResults', query })
}
</script>
