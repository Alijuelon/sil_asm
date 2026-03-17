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
        <button @click="isSidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">✖</button>
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

        <div v-if="currentUserEmail === 'alijuelonsinaga01@gmail.com'" class="bg-teal-900/10 border border-teal-900/30 rounded-xl p-2 shadow-sm">
          <div class="text-[10px] font-bold text-teal-500 uppercase px-3 mb-2 mt-1 tracking-wider">Fasilitator Kelas 3-5</div>
          <router-link @click="isSidebarOpen = false" to="/absensi" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📋</span> Absensi (3-5)
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/tugas" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📗</span> Wali Kelas Review
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/penilaian" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">📖</span> Penilaian Titah
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/haporseaon" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-teal-400 border-l-4 border-teal-400 font-medium text-white">
            <span class="text-lg">⛪</span> Hata Haporseaon
          </router-link>
        </div>

        <div v-if="currentUserEmail === 'samuelmt@gmail.com'" class="bg-sky-900/10 border border-sky-900/30 rounded-xl p-2 shadow-sm">
          <div class="text-[10px] font-bold text-sky-500 uppercase px-3 mb-2 mt-1 tracking-wider">Fasilitator Kelas 6-7</div>
          <router-link @click="isSidebarOpen = false" to="/absensi-samuel" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-sky-400 border-l-4 border-sky-400 font-medium text-white">
            <span class="text-lg">📋</span> Absensi (6-7)
          </router-link>
         <router-link @click="isSidebarOpen = false" to="/tugas-besar" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-sky-400 border-l-4 border-sky-400 font-medium text-white">
            <span class="text-lg">📘</span> Wali Kelas Review
          </router-link>
          <router-link @click="isSidebarOpen = false" to="/penilaian-samuel" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-sky-400 border-l-4 border-sky-400 font-medium text-white">
            <span class="text-lg">⭐</span> Penilaian
          </router-link>
        </div>

        <div class="bg-[#151e32] border border-gray-800/60 rounded-xl p-2 shadow-sm">
          <router-link @click="isSidebarOpen = false" to="/laporan-akhir" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1e293b] transition duration-200" active-class="bg-[#1e293b] text-red-400 border-l-4 border-red-400 font-medium text-white">
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
        </div>
        
        <div class="flex items-center gap-3 md:gap-6 shrink-0 ml-4">
          <div class="flex items-center gap-2 md:gap-3 border-l border-gray-700 pl-4 md:pl-6">
            <div :class="currentUserEmail === 'samuelmt@gmail.com' ? 'bg-sky-600' : 'bg-teal-600'" class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {{ profileInitials }}
            </div>
            <span class="text-sm font-medium text-gray-200 hidden sm:block">{{ profileName }}</span>
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
        <p class="text-gray-400 text-sm mb-6">Sesi Anda akan diakhiri dan harus login kembali.</p>
        <div class="flex gap-3 w-full">
          <button @click="showLogoutModal = false" class="flex-1 px-4 py-2.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white font-medium transition">Batal</button>
          <button @click="handleLogout" class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-lg shadow-red-600/30">Ya, Keluar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from './supabase'

const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)
const showLogoutModal = ref(false)
const currentUserEmail = ref('')

// Cek rute publik (Login / Landing Page)
const isPublicRoute = computed(() => {
  return ['Login', 'LandingPage'].includes(route.name)
})

// === LOGIKA NAMA & INISIAL DINAMIS ===
const profileName = computed(() => {
  if (!currentUserEmail.value) return 'Memuat...'
  const namePart = currentUserEmail.value.split('@')[0]
  return namePart.charAt(0).toUpperCase() + namePart.slice(1)
})

const profileInitials = computed(() => {
  if (!currentUserEmail.value) return '...'
  const namePart = currentUserEmail.value.split('@')[0]
  return namePart.substring(0, 2).toUpperCase()
})

// === KUNCI PERBAIKAN: onAuthStateChange ===
onMounted(() => {
  // 1. Cek sesi saat halaman pertama kali direfresh
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) {
      // Pastikan selalu huruf kecil agar pengecekan v-if tidak gagal
      currentUserEmail.value = data.session.user.email.toLowerCase() 
    }
  })

  // 2. Pantau perubahan status (Saat baru klik tombol Login)
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      currentUserEmail.value = session.user.email.toLowerCase()
    } else {
      currentUserEmail.value = ''
    }
  })
})

const handleLogout = async () => {
  showLogoutModal.value = false 
  await supabase.auth.signOut() 
  router.push('/login') 
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #334155; }
</style>