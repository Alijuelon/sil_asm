<template>
  <div v-if="isPublicRoute" class="w-full min-h-screen">
    <router-view></router-view>
  </div>

  <div v-else class="flex h-screen w-full bg-[#0b1121] text-gray-300 font-sans overflow-hidden relative">
    
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
    ></div>

    <aside 
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0"
    >
      <div class="p-6 flex items-center justify-between border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/30">SIL</div>
          <div>
            <h2 class="text-white font-bold tracking-widest text-lg">ASM HKBP BENGKALIS</h2>
            <p class="text-[10px] text-teal-400 font-bold tracking-wider">Sekolah Injil Libur</p>
          </div>
        </div>
        <button @click="isSidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">
          ✖
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        
        <div class="bg-[#151e32] border border-gray-800/60 rounded-xl p-2 shadow-sm">
          <div class="text-[10px] font-bold text-gray-500 uppercase px-3 mb-2 mt-1 tracking-wider">Menu Utama</div>
          <router-link @click="isSidebarOpen = false" to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">🏠</span> Dashboard
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/kelola-asm" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">👥</span> Kelola ASM
          </router-link>
        </div>

        <div class="bg-[#151e32] border border-gray-800/60 rounded-xl p-2 shadow-sm">
          <div class="text-[10px] font-bold text-gray-500 uppercase px-3 mb-2 mt-1 tracking-wider">Aktivitas Harian</div>
          <router-link @click="isSidebarOpen = false" to="/absensi" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📋</span> Absensi Kehadiran
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/tugas" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📚</span> Wali Kelas Review
          </router-link>
        </div>

        <div class="bg-[#151e32] border border-gray-800/60 rounded-xl p-2 shadow-sm">
          <div class="text-[10px] font-bold text-gray-500 uppercase px-3 mb-2 mt-1 tracking-wider">Penilaian Hafalan</div>
          <router-link @click="isSidebarOpen = false" to="/penilaian" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📖</span> Penilaian Titah
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/haporseaon" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">⛪</span> Hata Haporseaon
          </router-link>
          <div class="border-t border-gray-800 my-2"></div>
          <router-link @click="isSidebarOpen = false" to="/laporan-akhir" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📑</span> Laporan Akhir
          </router-link>
        </div>
      </nav>
      
      <div class="p-4 border-t border-gray-800 bg-[#0b1121]/50">
        <button @click="showLogoutModal = true" class="flex items-center justify-center gap-3 px-4 py-2.5 w-full text-center rounded-lg bg-red-900/20 border border-red-900/50 hover:bg-red-600 text-red-400 hover:text-white transition font-medium">
          🚪 Keluar
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      
      <header class="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-800 bg-[#0b1121] shrink-0">
        <div class="flex items-center gap-4 w-full">
          <button @click="isSidebarOpen = true" class="lg:hidden text-gray-300 hover:text-white focus:outline-none">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

          <div class="hidden sm:flex items-center bg-[#0f172a] rounded-full px-4 py-2 w-full max-w-xs border border-gray-700 focus-within:border-teal-500">
            <span class="text-gray-500">🔍</span>
            <input type="text" placeholder="Cari data..." class="bg-transparent border-none outline-none text-sm text-gray-300 ml-2 w-full placeholder-gray-600">
          </div>
        </div>
        
        <div class="flex items-center gap-3 md:gap-6 shrink-0 ml-4">
          <div class="flex items-center gap-2 md:gap-3 border-l border-gray-700 pl-4 md:pl-6">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">AS</div>
            <span class="text-sm font-medium text-gray-200 hidden sm:block">Ali Sinaga</span>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8 overflow-y-auto w-full relative">
        <router-view></router-view> 
      </main>
    </div>

    <div v-if="showLogoutModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div class="bg-[#151e32] border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center transform transition-all">
        <div class="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
          <span class="text-3xl">⚠️</span>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">Yakin ingin keluar?</h2>
        <p class="text-gray-400 text-sm mb-6">Anda harus login kembali untuk mengakses data absensi dan penilaian SIL.</p>
        <div class="flex gap-3 w-full">
          <button @click="showLogoutModal = false" class="flex-1 px-4 py-2.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white font-medium transition">Batal</button>
          <button @click="handleLogout" class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-lg shadow-red-600/30">Ya, Keluar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue' // Tambahkan computed
import { supabase } from './supabase'
import { useRouter, useRoute } from 'vue-router' // Tambahkan useRoute

const router = useRouter()
const route = useRoute() // Panggil useRoute

const showLogoutModal = ref(false)
const isSidebarOpen = ref(false)

// Cek apakah halaman yang dibuka adalah Landing Page ATAU Login
const isPublicRoute = computed(() => {
  return route.name === 'LandingPage' || route.name === 'Login'
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  showLogoutModal.value = false
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #334155; }
</style>