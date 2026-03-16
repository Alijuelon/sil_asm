<template>
  <div class="flex h-screen items-center justify-center bg-gray-200 font-sans">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-blue-900">Login SIL 2026</h2>
        <p class="text-gray-500 mt-2">HKBP Bengkalis - Sistem Absensi & Nilai</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-5">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email Fasilitator</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="ali.sinaga@hkbp.com"
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="********"
          >
        </div>

        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex justify-center items-center"
        >
          <span v-if="loading">Memeriksa...</span>
          <span v-else>Masuk ke Dashboard</span>
        </button>

        <p v-if="errorMessage" class="mt-4 text-red-500 text-center text-sm font-medium bg-red-50 p-2 rounded">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  // Menggunakan fungsi bawaan Supabase untuk Login
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMessage.value = "Email atau Password salah!"
  } else {
    // Jika berhasil, arahkan ke Dashboard
    router.push('/')
  }
  
  loading.value = false
}
</script>