<template>
  <div class="space-y-6 pb-10">
    
    <div class="bg-gradient-to-r from-[#151e32] to-[#0f172a] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
          Horas, <span class="text-teal-400">{{ dynamicUserName }}</span>! 👋
        </h1>
        <p class="text-gray-400">Selamat bertugas menggembalakan anak-anak <span class="text-white font-bold">{{ classLabel }}</span> hari ini.</p>
      </div>
      <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl">⛪</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex items-center gap-5 transition-all">
        <div class="bg-teal-500/20 text-teal-400 w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner">
          👥
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium mb-1">Total Anak Asuhan</p>
          <p class="text-3xl font-bold text-white">{{ stats.totalAnak }}</p>
        </div>
      </div>

      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex items-center gap-5 transition-all">
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
      
      <div class="bg-[#151e32] rounded-2xl p-5 border border-gray-800 shadow-lg flex flex-col justify-center gap-3">
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Filter Kategori Kelas:</p>
          <select v-model="selectedClassFilter" @change="fetchDashboardData" class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition font-bold text-sm">
            <option value="all">Semua Kelas (3 - 7)</option>
            <option value="3-5">Kelas 3 - 5</option>
            <option value="6-7">Kelas 6 - 7</option>
          </select>
        </div>
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Tinjau Hari Kegiatan:</p>
          <select v-model="selectedDay" @change="fetchDashboardData" class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition font-bold text-sm">
            <option v-for="day in 7" :key="day" :value="day">Kegiatan Hari {{ day }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold mb-6 flex items-center gap-2 text-teal-400">
        <span>📊</span> Grafik Kehadiran 7 Hari <span class="text-sm text-gray-500 font-normal ml-2">({{ classLabel }})</span>
      </h2>
      
      <div class="flex items-end justify-between h-48 gap-2 sm:gap-4 mt-4">
        <div v-for="(count, index) in attendanceChartData" :key="index" class="flex-1 flex flex-col items-center h-full">
          <span class="text-xs text-gray-300 font-bold mb-2">{{ count }}</span>
          
          <div class="w-full bg-[#0f172a] rounded-t-md relative flex-1 flex items-end justify-center overflow-hidden border-b border-gray-700">
            <div 
              class="w-full rounded-t-md transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-gradient-to-t from-teal-800 to-teal-400"
              :style="{ height: stats.totalAnak ? `${(count / stats.totalAnak) * 100}%` : '0%' }"
            ></div>
          </div>
          
          <span class="text-xs text-gray-500 font-bold mt-2">H{{ index + 1 }}</span>
        </div>
      </div>
    </div>

    <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2">
        <span>📖</span> Progres Hafalan Wajib <span class="text-sm text-gray-500 font-normal ml-2">({{ classLabel }})</span>
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl hover:border-teal-500/50 transition">
          <h3 class="font-bold text-white mb-3">Hafalan Titah</h3>
          <p class="text-teal-400 font-bold text-2xl mb-2">{{ stats.lulusTitah }} <span class="text-gray-500 text-sm">Anak Sudah Setor</span></p>
          <div class="w-full bg-gray-800 rounded-full h-2.5">
            <div class="bg-teal-500 h-2.5 rounded-full transition-all" :style="{ width: `${(stats.lulusTitah / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>
        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl hover:border-teal-500/50 transition">
          <h3 class="font-bold text-white mb-3">Hata Haporseaon</h3>
          <p class="text-teal-400 font-bold text-2xl mb-2">{{ stats.lulusHaporseaon }} <span class="text-gray-500 text-sm">Anak Sudah Setor</span></p>
          <div class="w-full bg-gray-800 rounded-full h-2.5">
            <div class="bg-teal-500 h-2.5 rounded-full transition-all" :style="{ width: `${(stats.lulusHaporseaon / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2">
        <span>⭐</span> Topik Penilaian Kustom <span class="text-sm text-gray-500 font-normal ml-2">(Hari {{ selectedDay }} • {{ classLabel }})</span>
      </h2>
      
      <div v-if="customTopics.length === 0" class="text-center py-6 text-gray-500 border border-dashed border-gray-700 rounded-xl">
        Belum ada topik kustom yang dinilai pada hari ini untuk kelas yang dipilih.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="topik in customTopics" :key="topik.nama" class="bg-[#0f172a] border border-gray-700 p-4 rounded-xl hover:border-sky-500/50 transition">
          <h3 class="font-bold text-white mb-2 text-sm">{{ topik.nama }}</h3>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-400">Dinilai:</span>
            <span class="text-sky-400 font-bold">{{ topik.jumlahDinilai }} / {{ stats.totalAnak }}</span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div class="bg-sky-500 h-2 rounded-full transition-all" :style="{ width: `${(topik.jumlahDinilai / (stats.totalAnak || 1)) * 100}%` }"></div>
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
const selectedClassFilter = ref('all') // Default: Tampilkan Semua Kelas

const stats = ref({ 
  totalAnak: 0, 
  hadirHariIni: 0, 
  lulusTitah: 0, 
  lulusHaporseaon: 0 
})
const customTopics = ref([])
const attendanceChartData = ref([0, 0, 0, 0, 0, 0, 0])

const dynamicUserName = computed(() => {
  if (!currentUserEmail.value) return 'Admin'
  const namePart = currentUserEmail.value.split('@')[0]
  return namePart.charAt(0).toUpperCase() + namePart.slice(1)
})

// Dinamis Label Kelas
const classLabel = computed(() => {
  if (selectedClassFilter.value === 'all') return 'Semua Kelas (3-7)'
  if (selectedClassFilter.value === '3-5') return 'Kelas 3-5'
  if (selectedClassFilter.value === '6-7') return 'Kelas 6-7'
  return ''
})

// Dinamis Array Kelas untuk Filter Database
const targetFilter = computed(() => {
  if (selectedClassFilter.value === 'all') return [3, 4, 5, 6, 7]
  if (selectedClassFilter.value === '3-5') return [3, 4, 5]
  if (selectedClassFilter.value === '6-7') return [6, 7]
  return []
})

const fetchDashboardData = async () => {
  if (!currentUserEmail.value) return

  // 1. Ambil Data Anak Sesuai Filter
  const { data: students } = await supabase.from('students').select('id').in('kelas', targetFilter.value)
  
  if (!students) return
  const studentIds = students.map(s => s.id)
  stats.value.totalAnak = students.length

  // Jika tidak ada anak di kategori tersebut, reset semua stats
  if (studentIds.length === 0) {
    stats.value.hadirHariIni = 0
    stats.value.lulusTitah = 0
    stats.value.lulusHaporseaon = 0
    attendanceChartData.value = [0, 0, 0, 0, 0, 0, 0]
    customTopics.value = []
    return
  }

  // 2. Data Kehadiran 7 Hari
  const { data: allAttendance } = await supabase
    .from('attendance')
    .select('hari, status')
    .in('student_id', studentIds)

  if (allAttendance) {
    const statusHadir = ['Tepat Waktu', 'Telat <5m', 'Telat >5m']
    
    // Kehadiran Hari Ini
    stats.value.hadirHariIni = allAttendance.filter(a => 
      a.hari === selectedDay.value && statusHadir.includes(a.status)
    ).length

    // Rekap Kehadiran 7 Hari
    let chartData = [0, 0, 0, 0, 0, 0, 0]
    allAttendance.forEach(a => {
      if (a.hari >= 1 && a.hari <= 7 && statusHadir.includes(a.status)) {
        chartData[a.hari - 1] += 1
      }
    })
    attendanceChartData.value = chartData
  }

  // 3. Data Penilaian (Wajib & Kustom)
  const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan, hari').in('student_id', studentIds)
  
  if (hafalan) {
    // Hafalan Wajib (Dihitung secara total dari semua hari)
    stats.value.lulusTitah = hafalan.filter(h => h.jenis_hafalan === 'Titah').length
    stats.value.lulusHaporseaon = hafalan.filter(h => h.jenis_hafalan === 'Hata Haporseaon').length

    // Topik Kustom (Hanya dihitung sesuai Hari Kegiatan yang dipilih)
    const topicCounts = {}
    hafalan.filter(h => !['Titah', 'Hata Haporseaon', 'Doa Bapa Kami'].includes(h.jenis_hafalan) && h.hari === selectedDay.value)
      .forEach(h => {
        topicCounts[h.jenis_hafalan] = (topicCounts[h.jenis_hafalan] || 0) + 1
      })
    
    customTopics.value = Object.keys(topicCounts).map(key => ({ 
      nama: key, 
      jumlahDinilai: topicCounts[key] 
    }))
  }
}

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) {
      currentUserEmail.value = data.session.user.email.toLowerCase()
      fetchDashboardData()
    }
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      currentUserEmail.value = session.user.email.toLowerCase()
      fetchDashboardData()
    }
  })
})
</script>