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
        <select v-model="selectedDay" @change="fetchDashboardData" :class="isSamuel ? 'focus:border-sky-500' : 'focus:border-teal-500'" class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none transition font-bold">
          <option v-for="day in 7" :key="day" :value="day">Kegiatan Hari {{ day }}</option>
        </select>
      </div>
    </div>

    <div class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold mb-6 flex items-center gap-2" :class="isSamuel ? 'text-sky-400' : 'text-teal-400'">
        <span>📊</span> Grafik Kehadiran 7 Hari
      </h2>
      
      <div class="flex items-end justify-between h-48 gap-2 sm:gap-4 mt-4">
        <div v-for="(count, index) in attendanceChartData" :key="index" class="flex-1 flex flex-col items-center h-full">
          <span class="text-xs text-gray-300 font-bold mb-2">{{ count }}</span>
          
          <div class="w-full bg-[#0f172a] rounded-t-md relative flex-1 flex items-end justify-center overflow-hidden border-b border-gray-700">
            <div 
              class="w-full rounded-t-md transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              :class="isSamuel ? 'bg-gradient-to-t from-sky-800 to-sky-400' : 'bg-gradient-to-t from-teal-800 to-teal-400'"
              :style="{ height: stats.totalAnak ? `${(count / stats.totalAnak) * 100}%` : '0%' }"
            ></div>
          </div>
          
          <span class="text-xs text-gray-500 font-bold mt-2">H{{ index + 1 }}</span>
        </div>
      </div>
    </div>

    <div v-if="isSamuel" class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2"><span>⭐</span> Topik Penilaian Kustom Anda (Hari {{ selectedDay }})</h2>
      <div v-if="customTopics.length === 0" class="text-center py-6 text-gray-500 border border-dashed border-gray-700 rounded-xl">
        Belum ada topik kustom yang dinilai hari ini.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="topik in customTopics" :key="topik.nama" class="bg-[#0f172a] border border-gray-700 p-4 rounded-xl hover:border-sky-500/50 transition">
          <h3 class="font-bold text-white mb-2 text-sm">{{ topik.nama }}</h3>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-400">Dinilai:</span>
            <span class="text-sky-400 font-bold">{{ topik.jumlahDinilai }} / {{ stats.totalAnak }}</span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div class="bg-sky-500 h-2 rounded-full" :style="{ width: `${(topik.jumlahDinilai / (stats.totalAnak || 1)) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-[#151e32] rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 class="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2"><span>📖</span> Progres Hafalan Wajib (Kelas 3-5)</h2>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const currentUserEmail = ref('')
const selectedDay = ref(1)
const stats = ref({ totalAnak: 0, hadirHariIni: 0, lulusTitah: 0, lulusHaporseaon: 0 })
const customTopics = ref([])
const attendanceChartData = ref([0, 0, 0, 0, 0, 0, 0]) // Data untuk H1 sampai H7

const isSamuel = computed(() => currentUserEmail.value === 'samuelmt@gmail.com')
const targetKelas = computed(() => isSamuel.value ? 'Kelas 6-7' : 'Kelas 3-5')
const targetFilter = computed(() => isSamuel.value ? [6, 7] : [3, 4, 5])

const dynamicUserName = computed(() => {
  if (!currentUserEmail.value) return 'Admin'
  const namePart = currentUserEmail.value.split('@')[0]
  return namePart.charAt(0).toUpperCase() + namePart.slice(1)
})

const fetchDashboardData = async () => {
  if (!currentUserEmail.value) return

  // 1. Ambil Data Anak
  const { data: students } = await supabase.from('students').select('id').in('kelas', targetFilter.value)
  if (!students) return
  const studentIds = students.map(s => s.id)
  stats.value.totalAnak = students.length

  // 2. Ambil SEMUA Data Kehadiran 7 Hari untuk anak-anak ini
  const { data: allAttendance } = await supabase
    .from('attendance')
    .select('hari, status')
    .in('student_id', studentIds)

  if (allAttendance) {
    // Definisi Hadir = Tepat Waktu atau Telat
    const statusHadir = ['Tepat Waktu', 'Telat <5m', 'Telat >5m']
    
    // Hitung kehadiran HARI INI saja
    stats.value.hadirHariIni = allAttendance.filter(a => 
      a.hari === selectedDay.value && statusHadir.includes(a.status)
    ).length

    // Hitung kehadiran GRAFIK 7 HARI
    let chartData = [0, 0, 0, 0, 0, 0, 0]
    allAttendance.forEach(a => {
      if (a.hari >= 1 && a.hari <= 7 && statusHadir.includes(a.status)) {
        chartData[a.hari - 1] += 1
      }
    })
    attendanceChartData.value = chartData
  }

  // 3. Tarik Data Penilaian
  if (isSamuel.value) {
    const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan').in('student_id', studentIds).eq('hari', selectedDay.value)
    if (hafalan) {
      const topicCounts = {}
      hafalan.filter(h => !['Titah', 'Hata Haporseaon'].includes(h.jenis_hafalan)).forEach(h => {
        topicCounts[h.jenis_hafalan] = (topicCounts[h.jenis_hafalan] || 0) + 1
      })
      customTopics.value = Object.keys(topicCounts).map(key => ({ nama: key, jumlahDinilai: topicCounts[key] }))
    }
  } else {
    // Ali: Ambil semua hari untuk melihat total kelulusan wajib
    const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan').in('student_id', studentIds)
    if (hafalan) {
      stats.value.lulusTitah = hafalan.filter(h => h.jenis_hafalan === 'Titah').length
      stats.value.lulusHaporseaon = hafalan.filter(h => h.jenis_hafalan === 'Hata Haporseaon').length
    }
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