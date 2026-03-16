<template>
  <div v-if="$route.name === 'Login'">
    <router-view></router-view>
  </div>

  <div v-else class="flex h-screen w-full bg-[#0b1121] text-gray-300 font-sans overflow-hidden">
    
    <aside class="w-64 bg-[#0f172a] border-r border-gray-800 flex flex-col flex-shrink-0">
      <div class="p-6 flex items-center gap-3 border-b border-gray-800">
        <div class="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">SIL</div>
        <div>
          <h2 class="text-white font-bold tracking-widest text-lg">HKBP APP</h2>
          <p class="text-xs text-teal-400">ADMIN</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <router-link to="/" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
          <span class="text-lg">🏠</span> Dashboard
        </router-link>
        
        <router-link to="/absensi" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
          <span class="text-lg">📋</span> Absensi Harian
        </router-link>
        
        <router-link to="/penilaian" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
          <span class="text-lg">📖</span> Penilaian Titah
        </router-link>

        <router-link to="/haporseaon" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
          <span class="text-lg">⛪</span> Hata Haporseaon
        </router-link>
      </nav>
      
      <div class="p-4 border-t border-gray-800 space-y-2">
        <button class="flex items-center gap-3 px-4 py-2 w-full text-left rounded hover:bg-[#1e293b] transition">
          ⚙️ Settings
        </button>
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-2 w-full text-left rounded hover:bg-red-900/50 text-red-400 transition">
          🚪 Logout
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      
      <header class="h-16 flex items-center justify-between px-8 border-b border-gray-800 bg-[#0b1121]">
        <div class="flex items-center bg-[#0f172a] rounded-full px-4 py-2 w-96 border border-gray-700 focus-within:border-teal-500">
          <span class="text-gray-500">🔍</span>
          <input type="text" placeholder="Cari nama anak, kelas..." class="bg-transparent border-none outline-none text-sm text-gray-300 ml-2 w-full placeholder-gray-600">
        </div>
        
        <div class="flex items-center gap-6">
          <button class="relative text-gray-400 hover:text-white">
            🔔 <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div class="flex items-center gap-3 border-l border-gray-700 pl-6">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">AS</div>
            <span class="text-sm font-medium text-gray-200">Ali Sinaga </span>
          </div>
        </div>
      </header>

      <main class="flex-1 p-8 overflow-y-auto">
        <router-view></router-view> 
      </main>
    </div>

  </div>
</template>

<script setup>
import { supabase } from './supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push({ name: 'Login' })
}
</script>