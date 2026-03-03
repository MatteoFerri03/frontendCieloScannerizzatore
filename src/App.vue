<template>
  <div id="app-root">
    <Navbar />
    <router-view />
    <footer class="footer">
      <p>&copy; 2025 CieloScannerizzatore </p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
