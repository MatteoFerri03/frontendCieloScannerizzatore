<template>
  <div>
    <!-- Profilo Header -->
    <div class="profile-header">
      <div class="profile-avatar">
        <i class="fas fa-user"></i>
      </div>
      <h2>{{ auth.nickname }}</h2>
      <p style="opacity: 0.8;">Membro CieloScannerizzatore</p>

      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userStats.totalFlights }}</div>
          <div class="stat-label">Voli effettuati</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userStats.countries }}</div>
          <div class="stat-label">Paesi visitati</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userStats.points }}</div>
          <div class="stat-label">Punti</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userStats.discount }}%</div>
          <div class="stat-label">Sconto attuale</div>
        </div>
      </div>
    </div>

    <!-- Tabs di navigazione - Leaderboard e Badge in tab specifica -->
    <section class="section">
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'badges' }"
          @click="activeTab = 'badges'"
        >
          <i class="fas fa-medal"></i> Badge & Progress
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'heatmap' }"
          @click="activeTab = 'heatmap'"
        >
          <i class="fas fa-fire"></i> Heatmap
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'sconti' }"
          @click="activeTab = 'sconti'"
        >
          <i class="fas fa-tags"></i> I miei sconti
        </button>
      </div>

      <!-- TAB BADGE -->
      <div v-if="activeTab === 'badges'">
        <h3 class="section-title"><i class="fas fa-medal"></i> I tuoi Badge</h3>
        <div class="badges-grid">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="badge-card"
            :class="badge.unlocked ? 'unlocked' : 'locked'"
          >
            <div class="badge-icon">{{ badge.icon }}</div>
            <div class="badge-name">{{ badge.name }}</div>
            <div class="badge-desc">{{ badge.desc }}</div>
            <div class="progress-bar" style="margin-top: 0.5rem;">
              <div class="progress-fill" :style="{ width: badge.progress + '%' }"></div>
            </div>
            <div style="font-size: 0.65rem; color: var(--text-light);">{{ badge.progress }}%</div>
          </div>
        </div>

        <!-- Prossimo achievement -->
        <div class="card" style="margin-top: 2rem; border-left: 4px solid var(--accent);">
          <h4 style="margin-bottom: 0.5rem;">
            <i class="fas fa-bullseye" style="color: var(--accent);"></i> Prossimo obiettivo
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-light);">
            Prenota ancora <strong>{{ nextGoal.remaining }}</strong> voli per sbloccare
            "<strong>{{ nextGoal.name }}</strong>" e ottenere <strong>{{ nextGoal.reward }}</strong>!
          </p>
          <div class="progress-bar" style="margin-top: 0.5rem;">
            <div class="progress-fill" :style="{ width: nextGoal.progress + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- TAB HEATMAP -->
      <div v-if="activeTab === 'heatmap'">
        <!-- Consenso utente per la heatmap (come da specifiche) -->
        <div v-if="!heatmapConsent" class="consent-banner">
          <p>
            <i class="fas fa-info-circle"></i>
            La heatmap mostra i tuoi voli nell'arco dei mesi. Vuoi visualizzarla?
          </p>
          <button class="btn btn-primary" @click="heatmapConsent = true">
            Mostra Heatmap
          </button>
        </div>

        <div v-else>
          <h3 class="section-title"><i class="fas fa-fire"></i> I tuoi viaggi nel tempo</h3>
          <div class="card">
            <div class="heatmap-months">
              <span v-for="m in months" :key="m">{{ m }}</span>
            </div>
            <div class="heatmap-container">
              <div class="heatmap-grid">
                <div
                  v-for="(val, i) in heatmapData"
                  :key="i"
                  class="heatmap-cell"
                  :class="'heat-' + val"
                  :title="getMonthName(i) + ': ' + val + ' voli'"
                ></div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.8rem; font-size: 0.75rem; color: var(--text-light);">
              <span>Meno</span>
              <div class="heatmap-cell heat-0" style="width: 14px; height: 14px;"></div>
              <div class="heatmap-cell heat-1" style="width: 14px; height: 14px;"></div>
              <div class="heatmap-cell heat-2" style="width: 14px; height: 14px;"></div>
              <div class="heatmap-cell heat-3" style="width: 14px; height: 14px;"></div>
              <div class="heatmap-cell heat-4" style="width: 14px; height: 14px;"></div>
              <span>Più</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB SCONTI -->
      <div v-if="activeTab === 'sconti'">
        <h3 class="section-title"><i class="fas fa-tags"></i> I tuoi sconti disponibili</h3>
        <div class="features-grid">
          <div v-for="sconto in sconti" :key="sconto.id" class="card" style="padding: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
              <div class="feature-icon" :class="sconto.color" style="width: 40px; height: 40px; font-size: 1rem;">
                <i :class="sconto.icon"></i>
              </div>
              <div>
                <h4>{{ sconto.name }}</h4>
                <p style="font-size: 0.8rem; color: var(--text-light);">{{ sconto.desc }}</p>
              </div>
            </div>
            <div style="font-size: 1.3rem; font-weight: 700; color: var(--success);">
              -{{ sconto.value }}%
            </div>
          </div>
        </div>

        <div v-if="sconti.length === 0" class="empty-state">
          <i class="fas fa-tag"></i>
          <p>Nessuno sconto ancora disponibile. Inizia a viaggiare!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGamificationStore } from '../stores/gamification'

const auth = useAuthStore()
const gamification = useGamificationStore()
const activeTab = ref('badges')
const heatmapConsent = ref(false)

const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']

// Carica le statistiche utente dal backend
onMounted(() => {
  if (auth.nickname) {
    gamification.loadUserStats(auth.nickname)
  }
})

const userStats = computed(() => ({
  totalFlights: gamification.userStats.totalFlights,
  countries: gamification.userStats.countries,
  points: gamification.userStats.points,
  discount: gamification.userStats.discount
}))

// Heatmap da backend (convertita in array da oggetto)
const heatmapData = computed(() => {
  const data = []
  for (let i = 0; i < 12; i++) {
    const monthKey = `2024-${String(i + 1).padStart(2, '0')}`
    data.push(gamification.userStats.heatmap[monthKey] || 0)
  }
  return data
})

function getMonthName(index) {
  return months[index] || ''
}

// Badge dal backend con calcolo progresso
const badges = computed(() => {
  return gamification.userStats.badges.map(b => {
    const totalRequired = b.requiredFlights || b.requiredCountries || 1
    const current = b.requiredFlights ? userStats.value.totalFlights : userStats.value.countries
    const progress = Math.min(100, Math.round((current / totalRequired) * 100))
    
    return {
      id: b.id,
      name: b.name,
      desc: b.description,
      icon: b.icon,
      unlocked: b.unlocked,
      progress: b.unlocked ? 100 : progress
    }
  })
})

const nextGoal = computed(() => {
  const locked = badges.value.filter(b => !b.unlocked).sort((a, b) => b.progress - a.progress)[0]
  if (!locked) return { name: 'Nessuno', remaining: 0, reward: 'Completato!', progress: 100 }
  
  return {
    name: locked.name,
    remaining: Math.ceil((100 - locked.progress) / 10),
    reward: 'badge speciale',
    progress: locked.progress
  }
})

const sconti = computed(() => {
  const result = []
  if (userStats.value.discount > 0) {
    result.push({
      id: 1,
      name: `Sconto Attivo ${userStats.value.discount}%`,
      desc: `Hai accumulato ${userStats.value.points} punti!`,
      value: userStats.value.discount,
      icon: 'fas fa-star',
      color: 'sky'
    })
  }
  return result
})
</script>
