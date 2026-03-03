<template>
  <div>
    <section class="hero" style="padding: 2rem 2rem 4rem;">
      <h1><i class="fas fa-trophy"></i> Classifica Viaggiatori</h1>
      <p>Viaggia di più per scalare la classifica e ottenere sconti esclusivi</p>
    </section>

    <section class="section">
      <!-- Top 3 Podio -->
      <div style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <div
          v-for="(player, index) in topThree"
          :key="player.nickname"
          class="card"
          style="text-align: center; padding: 1.5rem 2rem; min-width: 200px;"
          :style="{ order: index === 0 ? 1 : index === 1 ? 0 : 2 }"
        >
          <div class="rank-badge" :class="'rank-' + (index + 1)" style="margin: 0 auto 0.5rem; width: 48px; height: 48px; font-size: 1.2rem;">
            {{ index + 1 }}
          </div>
          <h3 style="margin-bottom: 0.2rem;">{{ player.nickname }}</h3>
          <p style="font-size: 0.85rem; color: var(--text-light);">{{ player.points }} punti</p>
          <p style="font-size: 0.8rem; color: var(--success); margin-top: 0.3rem;">
            {{ player.flights }} voli · {{ player.countries }} paesi
          </p>
          <div style="margin-top: 0.5rem;">
            <span v-for="b in player.badges" :key="b" style="font-size: 1.2rem; margin: 0 0.1rem;">{{ b }}</span>
          </div>
        </div>
      </div>

      <!-- Tabella classifica completa -->
      <div class="card" style="overflow-x: auto;">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Viaggiatore</th>
              <th>Punti</th>
              <th>Voli</th>
              <th>Paesi</th>
              <th>Badge</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(player, index) in leaderboard"
              :key="player.nickname"
              :style="isCurrentUser(player) ? { background: '#eff6ff', fontWeight: '600' } : {}"
            >
              <td>
                <span
                  class="rank-badge"
                  :class="index < 3 ? 'rank-' + (index + 1) : 'rank-default'"
                >
                  {{ index + 1 }}
                </span>
              </td>
              <td>
                {{ player.nickname }}
                <span v-if="isCurrentUser(player)" style="color: var(--primary); font-size: 0.75rem;"> (tu)</span>
              </td>
              <td>{{ player.points }}</td>
              <td>{{ player.flights }}</td>
              <td>{{ player.countries }}</td>
              <td>
                <span v-for="b in player.badges" :key="b" style="margin-right: 0.2rem;">{{ b }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Info gamification -->
      <div class="card" style="margin-top: 2rem; border-left: 4px solid var(--warning);">
        <h4 style="margin-bottom: 0.5rem;">
          <i class="fas fa-info-circle" style="color: var(--warning);"></i> Come accumulare punti
        </h4>
        <ul style="font-size: 0.9rem; color: var(--text-light); padding-left: 1.2rem; line-height: 1.8;">
          <li><strong>+50 punti</strong> per ogni volo prenotato</li>
          <li><strong>+100 punti</strong> per ogni nuovo paese visitato</li>
          <li><strong>+200 punti</strong> per sblocco badge speciale</li>
          <li><strong>Sconto 5%</strong> raggiunti 500 punti</li>
          <li><strong>Sconto 10%</strong> raggiunti 1000 punti</li>
          <li><strong>Sconto 15%</strong> raggiunti 2000 punti</li>
          <li><strong>Tariffe ridotte</strong> per destinazioni mai visitate!</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGamificationStore } from '../stores/gamification'

const auth = useAuthStore()
const gamification = useGamificationStore()

onMounted(() => {
  gamification.loadLeaderboard()
})

const leaderboard = computed(() => {
  return gamification.leaderboard.map(player => ({
    nickname: player.nickname,
    points: player.totalPoints,
    flights: player.totalFlights,
    countries: player.countriesVisited,
    badges: player.badgeIcons || []
  }))
})

const topThree = computed(() => leaderboard.value.slice(0, 3))

function isCurrentUser(player) {
  return auth.nickname && player.nickname.toLowerCase() === auth.nickname.toLowerCase()
}
</script>
