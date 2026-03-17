<template>
  <div class="space-y-6 pb-10">
    
    <div class="bg-gradient-to-r from-[#151e32] to-[#0f172a] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
          Horas, <span class="text-teal-400">{{ dynamicUserName }}</span>! 👋
        </h1>
        <p class="text-gray-400">Pusat Analitik Perkembangan Anak - <span class="text-white font-bold">{{ classLabel }}</span></p>
      </div>
      <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl">⛪</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex items-center gap-5 transition-all">
        <div :class="selectedClassFilter === '3-5' ? 'bg-teal-500/20 text-teal-400' : 'bg-sky-500/20 text-sky-400'" class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner transition-colors">
          👥
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium mb-1">Total Anak Asuhan</p>
          <p class="text-3xl font-bold text-white">{{ stats.totalAnak }} <span class="text-sm font-normal text-gray-500">anak</span></p>
        </div>
      </div>
      
      <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg flex flex-col justify-center gap-3">
        <div>
          <p class="text-gray-400 text-sm font-medium mb-2">Filter Data Penilaian:</p>
          <select v-model="selectedClassFilter" @change="fetchDashboardData" :class="selectedClassFilter === '3-5' ? 'focus:border-teal-500' : 'focus:border-sky-500'" class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none transition font-bold text-base shadow-inner cursor-pointer">
            <option value="3-5">Kategori Kelas 3 - 5</option>
            <option value="6-7">Kategori Kelas 6 - 7</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="selectedClassFilter === '3-5'" class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold mb-6 flex items-center gap-2 text-teal-400">
        <span>📊</span> Grafik Kehadiran 7 Hari 
      </h2>
      
      <div v-if="stats.totalAnak === 0" class="flex items-center justify-center h-48 border border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
        Data anak tidak tersedia.
      </div>

      <div v-else class="flex items-end justify-between h-48 gap-2 sm:gap-4 mt-4">
        <div v-for="(count, index) in attendanceChartData" :key="index" class="flex-1 flex flex-col items-center h-full">
          <span class="text-xs text-gray-300 font-bold mb-2">{{ count > 0 ? count : '' }}</span>
          
          <div class="w-full bg-[#0f172a] rounded-t-md relative flex-1 flex items-end justify-center overflow-hidden border-b border-gray-700">
            <div 
              class="w-full rounded-t-md transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-gradient-to-t from-teal-800 to-teal-400"
              :style="{ height: stats.totalAnak ? `${(count / stats.totalAnak) * 100}%` : '0%' }"
            ></div>
          </div>
          
          <span class="text-xs text-gray-400 font-bold mt-2">H{{ index + 1 }}</span>
        </div>
      </div>
    </div>

    <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 :class="selectedClassFilter === '3-5' ? 'text-teal-400' : 'text-sky-400'" class="text-lg font-bold mb-4 flex items-center gap-2 transition-colors">
        <span>📖</span> Progres Penilaian Hafalan (7 Hari)
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl">
          <h3 class="font-bold text-white mb-4 flex justify-between items-center">
            Hafalan Titah
            <span class="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded">{{ totalLulusTitah }} Lulus</span>
          </h3>
          <div class="flex items-end justify-between h-32 gap-1 sm:gap-2">
            <div v-for="(count, index) in titahChartData" :key="index" class="flex-1 flex flex-col items-center h-full">
              <span class="text-[10px] text-gray-400 font-bold mb-1">{{ count > 0 ? count : '' }}</span>
              <div class="w-full bg-[#151e32] rounded-t-sm relative flex-1 flex items-end justify-center overflow-hidden">
                <div class="w-full rounded-t-sm transition-all duration-1000 bg-gradient-to-t"
                     :class="selectedClassFilter === '3-5' ? 'from-teal-800 to-teal-400' : 'from-sky-800 to-sky-400'"
                     :style="{ height: stats.totalAnak ? `${(count / stats.totalAnak) * 100}%` : '0%' }"></div>
              </div>
              <span class="text-[10px] text-gray-600 font-bold mt-1">H{{ index + 1 }}</span>
            </div>
          </div>
        </div>

        <div class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl">
          <h3 class="font-bold text-white mb-4 flex justify-between items-center">
            Hata Haporseaon
            <span class="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded">{{ totalLulusHaporseaon }} Lulus</span>
          </h3>
          <div class="flex items-end justify-between h-32 gap-1 sm:gap-2">
            <div v-for="(count, index) in haporseaonChartData" :key="index" class="flex-1 flex flex-col items-center h-full">
              <span class="text-[10px] text-gray-400 font-bold mb-1">{{ count > 0 ? count : '' }}</span>
              <div class="w-full bg-[#151e32] rounded-t-sm relative flex-1 flex items-end justify-center overflow-hidden">
                <div class="w-full rounded-t-sm transition-all duration-1000 bg-gradient-to-t"
                     :class="selectedClassFilter === '3-5' ? 'from-teal-800 to-teal-400' : 'from-sky-800 to-sky-400'"
                     :style="{ height: stats.totalAnak ? `${(count / stats.totalAnak) * 100}%` : '0%' }"></div>
              </div>
              <span class="text-[10px] text-gray-600 font-bold mt-1">H{{ index + 1 }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="customTopicsCharts.length > 0" class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 :class="selectedClassFilter === '3-5' ? 'text-teal-400' : 'text-sky-400'" class="text-lg font-bold mb-4 flex items-center gap-2 transition-colors">
        <span>⭐</span> Progres Topik Kustom (7 Hari)
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="topic in customTopicsCharts" :key="topic.nama" class="bg-[#0f172a] border border-gray-700 p-5 rounded-xl">
          <h3 class="font-bold text-white mb-4 text-sm truncate flex justify-between items-center" :title="topic.nama">
            {{ topic.nama }}
            <span class="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded ml-2">{{ topic.totalCount }} Anak</span>
          </h3>
          
          <div class="flex items-end justify-between h-28 gap-1">
            <div v-for="(count, index) in topic.data" :key="index" class="flex-1 flex flex-col items-center h-full">
              <span class="text-[9px] text-gray-400 font-bold mb-1">{{ count > 0 ? count : '' }}</span>
              <div class="w-full bg-[#151e32] rounded-t-sm relative flex-1 flex items-end justify-center overflow-hidden">
                <div class="w-full rounded-t-sm transition-all duration-1000 bg-gradient-to-t"
                     :class="selectedClassFilter === '3-5' ? 'from-teal-800 to-teal-400' : 'from-sky-800 to-sky-400'"
                     :style="{ height: stats.totalAnak ? `${(count / stats.totalAnak) * 100}%` : '0%' }"></div>
              </div>
              <span class="text-[9px] text-gray-600 font-bold mt-1">H{{ index + 1 }}</span>
            </div>
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
const selectedClassFilter = ref('3-5') // Default: Tampilkan Kelas 3-5

const stats = ref({ totalAnak: 0 })

// State Data Grafik (Array 7 elemen untuk H1 sampai H7)
const attendanceChartData = ref([0, 0, 0, 0, 0, 0, 0])
const titahChartData = ref([0, 0, 0, 0, 0, 0, 0])
const haporseaonChartData = ref([0, 0, 0, 0, 0, 0, 0])
const customTopicsCharts = ref([]) 

// Computed Logika Tampilan & Filter
const dynamicUserName = computed(() => {
  if (!currentUserEmail.value) return 'Admin'
  const namePart = currentUserEmail.value.split('@')[0]
  return namePart.charAt(0).toUpperCase() + namePart.slice(1)
})

const classLabel = computed(() => {
  if (selectedClassFilter.value === '3-5') return 'Kelas 3-5'
  if (selectedClassFilter.value === '6-7') return 'Kelas 6-7'
  return ''
})

const targetFilter = computed(() => {
  if (selectedClassFilter.value === '3-5') return [3, 4, 5]
  if (selectedClassFilter.value === '6-7') return [6, 7]
  return []
})

// Total Hitungan Kelulusan untuk Label
const totalLulusTitah = computed(() => titahChartData.value.reduce((a, b) => a + b, 0))
const totalLulusHaporseaon = computed(() => haporseaonChartData.value.reduce((a, b) => a + b, 0))

// ==========================================
// FUNGSI PENGAMBIL DATA UTAMA
// ==========================================
const fetchDashboardData = async () => {
  // 1. Ambil Data Anak Sesuai Filter
  const { data: students } = await supabase.from('students').select('id').in('kelas', targetFilter.value)
  if (!students) return
  
  const studentIds = students.map(s => s.id)
  stats.value.totalAnak = students.length

  // Reset semua grafik
  attendanceChartData.value = [0, 0, 0, 0, 0, 0, 0]
  titahChartData.value = [0, 0, 0, 0, 0, 0, 0]
  haporseaonChartData.value = [0, 0, 0, 0, 0, 0, 0]
  customTopicsCharts.value = []

  if (studentIds.length === 0) return

  // 2. Ambil Data Kehadiran (KHUSUS KELAS 3-5)
  if (selectedClassFilter.value === '3-5') {
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('hari, status')
      .in('student_id', studentIds)

    if (attendanceData) {
      const statusHadir = ['Tepat Waktu', 'Telat <5m', 'Telat >5m']
      let attData = [0, 0, 0, 0, 0, 0, 0]
      
      attendanceData.forEach(a => {
        if (a.hari >= 1 && a.hari <= 7 && statusHadir.includes(a.status)) {
          attData[a.hari - 1] += 1
        }
      })
      attendanceChartData.value = attData
    }
  }

  // 3. Ambil Data Penilaian Hafalan & Kustom
  const { data: hafalan } = await supabase
    .from('hafalan')
    .select('jenis_hafalan, hari, lulus_hari_ke, status_nilai')
    .in('student_id', studentIds)
  
  if (hafalan) {
    let tData = [0, 0, 0, 0, 0, 0, 0]
    let hData = [0, 0, 0, 0, 0, 0, 0]
    const customMap = {}

    hafalan.forEach(h => {
      // Grafik Titah
      if (h.jenis_hafalan === 'Titah') {
        if (h.lulus_hari_ke >= 1 && h.lulus_hari_ke <= 7) tData[h.lulus_hari_ke - 1] += 1
      } 
      // Grafik Haporseaon
      else if (h.jenis_hafalan === 'Hata Haporseaon') {
        if (h.lulus_hari_ke >= 1 && h.lulus_hari_ke <= 7) hData[h.lulus_hari_ke - 1] += 1
      } 
      // Grafik Topik Kustom (Abaikan Doa Bapa Kami jika ada)
      else if (h.jenis_hafalan !== 'Doa Bapa Kami') {
        if (h.status_nilai && h.status_nilai !== 'Belum' && h.hari >= 1 && h.hari <= 7) {
          if (!customMap[h.jenis_hafalan]) customMap[h.jenis_hafalan] = [0, 0, 0, 0, 0, 0, 0]
          customMap[h.jenis_hafalan][h.hari - 1] += 1
        }
      }
    })

    titahChartData.value = tData
    haporseaonChartData.value = hData

    // Susun Array untuk Looping Grafik Kustom
    const cTopics = []
    for (const [nama, dataArr] of Object.entries(customMap)) {
      const totalCount = dataArr.reduce((a, b) => a + b, 0)
      cTopics.push({ nama, data: dataArr, totalCount })
    }
    customTopicsCharts.value = cTopics
  }
}

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) {
      currentUserEmail.value = data.session.user.email.toLowerCase()
      fetchDashboardData()
    }
  })
})
</script>