<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Crea il tuo account</h2>
      <p class="subtitle">Inizia a viaggiare e accumulare punti</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nickname</label>
          <input v-model="nickname" type="text" placeholder="Scegli un nickname" required minlength="3" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Crea una password" required minlength="6" />
        </div>

        <div class="form-group">
          <label>Conferma Password</label>
          <input v-model="confirmPassword" type="password" placeholder="Ripeti la password" required />
        </div>

        <p v-if="error" class="form-error">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </p>

        <p v-if="success" class="form-success">
          <i class="fas fa-check-circle"></i> {{ success }}
        </p>

        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Registrati</span>
        </button>
      </form>

      <p class="auth-footer">
        Hai già un account? <router-link to="/login">Accedi</router-link>
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
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Le password non coincidono'
    return
  }

  loading.value = true
  try {
    await auth.register(nickname.value, password.value)
    success.value = 'Registrazione completata! Reindirizzamento...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    if (e.response?.data) {
      error.value = e.response.data
    } else {
      error.value = 'Errore durante la registrazione'
    }
  } finally {
    loading.value = false
  }
}
</script>
