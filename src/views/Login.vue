<template>
  <div class="flex h-screen items-center justify-center bg-[#0b1121] font-sans px-4 relative overflow-hidden">
    
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

    <div class="w-full max-w-md bg-[#151e32] border border-gray-800 rounded-2xl shadow-2xl p-8 z-10 backdrop-blur-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-teal-500/20">
          SIL
        </div>
        <h2 class="text-3xl font-bold text-white tracking-tight">Login Admin</h2>
        <p class="text-gray-400 mt-2 text-sm font-medium uppercase tracking-widest">HKBP BENGKALIS 2026</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Email Fasilitator</label>
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-teal-400 transition">📧</span>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="w-full bg-[#0b1121] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-300 placeholder-gray-600" 
              placeholder="masukkan email..."
            >
          </div>
        </div>
        
        <div>
          <label class="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Password</label>
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-teal-400 transition">🔒</span>
            <input 
              v-model="password" 
              type="password" 
              required 
              class="w-full bg-[#0b1121] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-300 placeholder-gray-600" 
              placeholder="********"
            >
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 px-4 rounded-xl transition duration-300 flex justify-center items-center shadow-lg shadow-teal-900/40 active:scale-[0.98] disabled:opacity-50"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memeriksa...
          </span>
          <span v-else>Masuk ke Dashboard</span>
        </button>

        <transition name="fade">
          <p v-if="errorMessage" class="mt-4 text-red-400 text-center text-sm font-semibold bg-red-900/20 border border-red-900/50 py-3 rounded-xl backdrop-blur-sm">
            ❌ {{ errorMessage }}
          </p>
        </transition>
      </form>

      <div class="mt-10 pt-6 border-t border-gray-800 text-center">
        <p class="text-gray-500 text-[11px] uppercase tracking-[0.2em]">Developed with ❤️ by</p>
        <p class="text-teal-400 font-bold text-sm mt-1">ALI SINAGA</p>
      </div>
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
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = "Email atau Password salah!"
    } else {
      router.push('/')
    }
  } catch (e) {
    errorMessage.value = "Terjadi gangguan koneksi."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>