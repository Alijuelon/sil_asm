<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-[#151e32] to-[#0f172a] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
          Horas, {{ userName }}! 👋
        </h1>
        <p class="text-gray-400">Selamat bertugas menggembalakan anak-anak <span class="text-teal-400 font-bold">{{ targetKelas }}</span> hari ini.</p>
      </div>
      <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl">⛪</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex items-center gap-5">
        <div :class="isSamuel ? 'bg-sky-500/20 text-sky-400' : 'bg-teal-500/20 text-teal-400'" class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner">
          👥
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium mb-1">Total Anak Asuhan</p>
          <p class="text-3xl font-bold text-white">{{ stats.totalAnak }}</p>
        </div>
      </div>

      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex items-center gap-5">
        <div class="bg-emerald-500/20 text-emerald-400 w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner">
          ✅
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium mb-1">Hadir (Hari {{ selectedDay }})</p>
          <div class="flex items-end gap-2">
            <p class="text-3xl font-bold text-white">{{ stats.hadirHariIni }}</p>
            <p class="text-sm text-gray-500 mb-1">/ {{ stats.totalAnak }} anak</p>
          </div>
        </div>
      </div>
      
      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex flex-col justify-center">
        <p class="text-gray-400 text-sm font-medium mb-3">Tinjau Hari Kegiatan:</p>
        <select v-model="selectedDay" @change="fetchDashboardData" class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition font-bold">
          <option v-for="day in 7" :key="day" :value="day">Kegiatan Hari {{ day }}</option>
        </select>
      </div>

    </div>

    <div v-if="isSamuel" class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2"><span>⭐</span> Topik Penilaian Kustom Anda</h2>
      
      <div v-if="customTopics.length === 0" class="text-center py-6 text-gray-500 border border-dashed border-gray-700 rounded-xl">
        Belum ada topik kustom yang dinilai.
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="topik in customTopics" :key="topik.nama" class="bg-[#0f172a] border border-gray-700 p-4 rounded-xl">
          <h3 class="font-bold text-white mb-2">{{ topik.nama }}</h3>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-400">Telah Dinilai:</span>
            <span class="text-sky-400 font-bold">{{ topik.jumlahDinilai }} / {{ stats.totalAnak }}</span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div class="bg-sky-500 h-2 rounded-full" :style="{ width: `${(topik.jumlahDinilai / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2"><span>📖</span> Progres Hafalan Wajib</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl">
          <h3 class="font-bold text-white mb-3 text-lg">Hafalan Titah</h3>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Anak Lulus:</span>
            <span class="text-teal-400 font-bold text-lg">{{ stats.lulusTitah }} <span class="text-gray-500 text-sm">/ {{ stats.totalAnak }}</span></span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2.5">
            <div class="bg-teal-500 h-2.5 rounded-full transition-all" :style="{ width: `${(stats.lulusTitah / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>

        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl">
          <h3 class="font-bold text-white mb-3 text-lg">Hata Haporseaon</h3>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Anak Lulus:</span>
            <span class="text-teal-400 font-bold text-lg">{{ stats.lulusHaporseaon }} <span class="text-gray-500 text-sm">/ {{ stats.totalAnak }}</span></span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2.5">
            <div class="bg-teal-500 h-2.5 rounded-full transition-all" :style="{ width: `${(stats.lulusHaporseaon / (stats.totalAnak || 1)) * 100}%` }"></div>
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
  lulusTitah: 0,
  lulusHaporseaon: 0
})

const customTopics = ref([]) // Untuk menyimpan list topik milik Samuel

// Identifikasi User
const isSamuel = computed(() => currentUserEmail.value === 'samuelMT@gmail.com')
const userName = computed(() => isSamuel.value ? 'Samuel MT' : 'Ali Sinaga')
const targetKelas = computed(() => isSamuel.value ? 'Kelas 6-7' : 'Kelas 3-5')
const targetFilter = computed(() => isSamuel.value ? [6, 7] : [3, 4, 5])

const fetchDashboardData = async () => {
  // 1. Ambil Data Anak Sesuai Kelas Fasilitator
  const { data: students } = await supabase.from('students').select('id').in('kelas', targetFilter.value)
  if (!students) return

  const studentIds = students.map(s => s.id)
  stats.value.totalAnak = students.length

  // 2. Hitung Kehadiran Tepat Waktu (Hari ini saja)
  const { data: attendance } = await supabase
    .from('attendance')
    .select('id')
    .eq('hari', selectedDay.value)
    .in('student_id', studentIds)
    .eq('status', 'Tepat Waktu')
  
  stats.value.hadirHariIni = attendance ? attendance.length : 0

  // 3. Tarik Data Nilai (Beda Logika untuk Ali dan Samuel)
  if (isSamuel.value) {
    // --- LOGIKA SAMUEL: Kelompokkan berdasarkan topik custom ---
    const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan').in('student_id', studentIds)
    if (hafalan) {
      const topicCounts = {}
      // Hitung ada berapa anak yang sudah dinilai per topik
      hafalan.forEach(h => {
        topicCounts[h.jenis_hafalan] = (topicCounts[h.jenis_hafalan] || 0) + 1
      })
      
      // Ubah ke bentuk array untuk ditampilkan di HTML
      customTopics.value = Object.keys(topicCounts).map(key => ({
        nama: key,
        jumlahDinilai: topicCounts[key]
      }))
    }
  } else {
    // --- LOGIKA ALI: Hitung kelulusan Titah & Haporseaon ---
    const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan').in('student_id', studentIds)
    if (hafalan) {
      stats.value.lulusTitah = hafalan.filter(h => h.jenis_hafalan === 'Titah').length
      stats.value.lulusHaporseaon = hafalan.filter(h => h.jenis_hafalan === 'Hata Haporseaon').length
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