<template>
  <div class="space-y-6 pb-10">
    <div class="bg-gradient-to-r from-[#151e32] to-[#0f172a] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
          Horas, <span :class="isSamuel ? 'text-sky-400' : 'text-teal-400'">{{ dynamicUserName }}</span>! 👋
        </h1>
        <p class="text-gray-400">Selamat bertugas menggembalakan anak-anak <span class="text-white font-bold">{{ targetKelas }}</span> hari ini.</p>
      </div>
      <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl">⛪</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <div class="bg-[#151e32] rounded-2xl p-5 border border-gray-800 shadow-lg flex items-center gap-4">
        <div :class="isSamuel ? 'bg-sky-500/20 text-sky-400' : 'bg-teal-500/20 text-teal-400'" class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner">👥</div>
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Total Anak Asuhan</p>
          <p class="text-2xl font-bold text-white">{{ stats.totalAnak }}</p>
        </div>
      </div>

      <div class="bg-[#151e32] rounded-2xl p-5 border border-gray-800 shadow-lg flex flex-col justify-center">
        <p class="text-gray-400 text-xs font-medium mb-2">Tinjau Hari Kegiatan:</p>
        <select v-model="selectedDay" @change="fetchDashboardData" :class="isSamuel ? 'focus:border-sky-500' : 'focus:border-teal-500'" class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none transition font-bold text-sm">
          <option v-for="day in 7" :key="day" :value="day">Kegiatan Hari {{ day }}</option>
        </select>
      </div>

      <div class="bg-[#151e32] rounded-2xl p-5 border border-gray-800 shadow-lg flex flex-col justify-center relative overflow-hidden">
        <p class="text-gray-400 text-xs font-medium mb-1 relative z-10">Absensi Tepat Waktu</p>
        <div class="flex items-end gap-1 relative z-10">
          <p class="text-2xl font-bold text-white">{{ stats.hadirHariIni }}</p>
          <p class="text-xs text-gray-500 mb-1">/ {{ stats.totalAnak }}</p>
        </div>
        <div class="absolute right-[-10px] bottom-[-10px] text-5xl opacity-10">✅</div>
      </div>

      <div class="bg-[#151e32] rounded-2xl p-5 border border-gray-800 shadow-lg flex flex-col justify-center relative overflow-hidden">
        <p class="text-gray-400 text-xs font-medium mb-1 relative z-10">Penilaian Tugas Harian</p>
        <div class="flex items-end gap-1 relative z-10">
          <p class="text-2xl font-bold text-white">{{ stats.tugasSelesai }}</p>
          <p class="text-xs text-gray-500 mb-1">/ {{ stats.totalAnak }}</p>
        </div>
        <div class="absolute right-[-10px] bottom-[-10px] text-5xl opacity-10">📗</div>
      </div>
    </div>

    <div v-if="isSamuel" class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg mt-6">
      <h2 class="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2"><span>⭐</span> Progres Topik Kustom (Hari {{ selectedDay }})</h2>
      
      <div v-if="customTopics.length === 0" class="text-center py-6 text-gray-500 border border-dashed border-gray-700 rounded-xl">
        Belum ada topik kustom yang dinilai pada hari ini.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="topik in customTopics" :key="topik.nama" class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl border-t-2 border-t-sky-500">
          <h3 class="font-bold text-white mb-3 text-base">{{ topik.nama }}</h3>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Telah Dinilai:</span>
            <span class="text-sky-400 font-bold text-lg">{{ topik.jumlahDinilai }} <span class="text-gray-500 text-sm">/ {{ stats.totalAnak }}</span></span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div class="bg-sky-500 h-2 rounded-full transition-all duration-500" :style="{ width: `${(topik.jumlahDinilai / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg mt-6">
      <h2 class="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2"><span>📖</span> Progres Hafalan Wajib (Kumulatif 7 Hari)</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl border-t-2 border-t-teal-500">
          <h3 class="font-bold text-white mb-3 text-base">Hafalan Titah</h3>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Sudah Lulus:</span>
            <span class="text-teal-400 font-bold text-lg">{{ stats.lulusTitah }} <span class="text-gray-500 text-sm">/ {{ stats.totalAnak }}</span></span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2">
            <div class="bg-teal-500 h-2 rounded-full transition-all duration-500" :style="{ width: `${(stats.lulusTitah / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>

        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl border-t-2 border-t-teal-500">
          <h3 class="font-bold text-white mb-3 text-base">Hata Haporseaon</h3>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Sudah Lulus:</span>
            <span class="text-teal-400 font-bold text-lg">{{ stats.lulusHaporseaon }} <span class="text-gray-500 text-sm">/ {{ stats.totalAnak }}</span></span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2">
            <div class="bg-teal-500 h-2 rounded-full transition-all duration-500" :style="{ width: `${(stats.lulusHaporseaon / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>

        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl border-t-2 border-t-teal-500">
          <h3 class="font-bold text-white mb-3 text-base">Doa Bapa Kami</h3>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Sudah Lulus:</span>
            <span class="text-teal-400 font-bold text-lg">{{ stats.lulusDoa }} <span class="text-gray-500 text-sm">/ {{ stats.totalAnak }}</span></span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2">
            <div class="bg-teal-500 h-2 rounded-full transition-all duration-500" :style="{ width: `${(stats.lulusDoa / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const currentUserEmail = ref('')
const selectedDay = ref(1)

const stats = ref({
  totalAnak: 0,
  hadirHariIni: 0,
  tugasSelesai: 0, // Tambahan Baru!
  lulusTitah: 0,
  lulusHaporseaon: 0,
  lulusDoa: 0      // Tambahan Baru!
})

const customTopics = ref([]) 

// === IDENTIFIKASI USER ===
const isSamuel = computed(() => currentUserEmail.value.toLowerCase() === 'samuelmt@gmail.com')
const targetKelas = computed(() => isSamuel.value ? 'Kelas 6-7' : 'Kelas 3-5')
const targetFilter = computed(() => isSamuel.value ? [6, 7] : [3, 4, 5])

const dynamicUserName = computed(() => {
  if (!currentUserEmail.value) return 'Admin'
  const namePart = currentUserEmail.value.split('@')[0]
  return namePart.charAt(0).toUpperCase() + namePart.slice(1)
})

const fetchDashboardData = async () => {
  // 1. Ambil Data Anak (Hanya kelas miliknya sendiri)
  const { data: students } = await supabase.from('students').select('id').in('kelas', targetFilter.value)
  if (!students) return

  const studentIds = students.map(s => s.id)
  stats.value.totalAnak = students.length

  // 2. Hitung Kehadiran Tepat Waktu (Hari ini)
  const { data: attendance } = await supabase
    .from('attendance')
    .select('id')
    .eq('hari', selectedDay.value)
    .in('student_id', studentIds)
    .eq('status', 'Tepat Waktu')
  
  stats.value.hadirHariIni = attendance ? attendance.length : 0

  // 3. Hitung Progres Tugas Harian (Wali Kelas Review) Hari ini
  const { data: tugas } = await supabase
    .from('tugas')
    .select('id')
    .eq('hari', selectedDay.value)
    .in('student_id', studentIds)
    // Asumsi tugas dinilai jika tidak kosong
  stats.value.tugasSelesai = tugas ? tugas.length : 0

  // 4. Tarik Data Penilaian Berdasarkan Fasilitator
  if (isSamuel.value) {
    // --- LOGIKA SAMUEL: Hitung topik kustom per hari ---
    const { data: hafalan } = await supabase
      .from('hafalan')
      .select('jenis_hafalan, status_nilai')
      .in('student_id', studentIds)
      .eq('hari', selectedDay.value)
      
    if (hafalan) {
      // Pagar Pengaman: Abaikan jika ada data Titah/Haporseaon nyasar
      const forbidden = ['Titah', 'Hata Haporseaon', 'Doa Bapa Kami']
      const filteredHafalan = hafalan.filter(h => !forbidden.includes(h.jenis_hafalan) && h.status_nilai && h.status_nilai !== 'Belum')

      const topicCounts = {}
      filteredHafalan.forEach(h => {
        topicCounts[h.jenis_hafalan] = (topicCounts[h.jenis_hafalan] || 0) + 1
      })
      
      customTopics.value = Object.keys(topicCounts).map(key => ({
        nama: key,
        jumlahDinilai: topicCounts[key]
      }))
    }
  } else {
    // --- LOGIKA ALI: Hitung 3 Hafalan Wajib (Kumulatif semua hari) ---
    const { data: hafalan } = await supabase
      .from('hafalan')
      .select('jenis_hafalan')
      .in('student_id', studentIds)
      // Karena Kak Ali pakai logika: jika gagal nilainya diubah jadi 0 & dihapus dari DB, 
      // maka semua data yang ada di DB otomatis adalah anak yang sudah LULUS.
      
    if (hafalan) {
      stats.value.lulusTitah = hafalan.filter(h => h.jenis_hafalan === 'Titah').length
      stats.value.lulusHaporseaon = hafalan.filter(h => h.jenis_hafalan === 'Hata Haporseaon').length
      stats.value.lulusDoa = hafalan.filter(h => h.jenis_hafalan === 'Doa Bapa Kami').length
    }
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    currentUserEmail.value = user.email
    await fetchDashboardData()
  }
})
</script>