<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Bentornato!</h2>
      <p class="subtitle">Accedi al tuo account CieloScannerizzatore</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Nickname</label>
          <input v-model="nickname" type="text" placeholder="Il tuo nickname" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="La tua password" required />
        </div>

        <p v-if="error" class="form-error">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </p>

        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Accedi</span>
        </button>
      </form>

      <p class="auth-footer">
        Non hai un account? <router-link to="/register">Registrati</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const nickname = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(nickname.value, password.value)
    router.push('/')
  } catch (e) {
    if (e.response?.status === 401 || e.response?.status === 403) {
      error.value = 'Nickname o password errati'
    } else if (e.response?.data) {
      error.value = e.response.data
    } else {
      error.value = 'Errore di connessione al server'
    }
  } finally {
    loading.value = false
  }
}
</script>
