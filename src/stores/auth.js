import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const nickname = ref(localStorage.getItem('nickname') || '')
  const isLoggedIn = computed(() => !!token.value)

  async function login(nick, password) {
    const res = await api.post('/api/auth/login', {
      nickname: nick,
      password: password
    })
    token.value = res.data.token
    nickname.value = nick
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('nickname', nick)
  }

  async function register(nick, password) {
    await api.post('/api/auth/register', {
      nickname: nick,
      password: password
    })
  }

  function logout() {
    token.value = ''
    nickname.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('nickname')
  }

  return { token, nickname, isLoggedIn, login, register, logout }
})
