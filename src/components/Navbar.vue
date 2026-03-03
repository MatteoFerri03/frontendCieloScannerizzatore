<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-brand">
      <i class="fas fa-plane"></i>
      CieloScannerizzatore
    </router-link>

    <div class="navbar-links">
      <router-link to="/">Home</router-link>
      <router-link to="/leaderboard">
        <i class="fas fa-trophy"></i> Classifica
      </router-link>

      <template v-if="auth.isLoggedIn">
        <router-link to="/profilo">
          <i class="fas fa-user"></i> {{ auth.nickname }}
        </router-link>
        <button @click="handleLogout">Esci</button>
      </template>

      <template v-else>
        <router-link to="/login">Accedi</router-link>
        <router-link to="/register" class="btn-accent">Registrati</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
