<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">DASHBOARD / Ringkasan Data</h1>
        <p class="text-sm text-gray-400 mt-1">Pantauan Real-time SIL HKBP 2026</p>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div class="text-sm text-gray-400 font-medium">Total Anak (Kelas 3-7)</div>
        <div class="text-3xl font-bold text-white mt-2">{{ students.length }}</div>
      </div>
      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div class="text-sm text-gray-400 font-medium">Hadir H1 (Semua)</div>
        <div class="text-3xl font-bold text-blue-400 mt-2">{{ hadirHari1 }}</div>
      </div>
      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div class="text-sm text-gray-400 font-medium">Sudah Lulus Titah</div>
        <div class="text-3xl font-bold text-teal-400 mt-2">{{ lulusTitah }}</div>
      </div>
      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div class="text-sm text-gray-400 font-medium">Lulus Haporseaon</div>
        <div class="text-3xl font-bold text-sky-400 mt-2">{{ lulusHaporseaon }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-white font-medium text-lg">Grafik Kehadiran</h3>
            <p class="text-xs text-gray-500 mt-1">H1 s/d H7</p>
          </div>
          <select 
            v-model="filterKelasAbsensi" 
            class="bg-[#0f172a] border border-gray-700 rounded p-1 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="all">Semua Kelas</option>
            <option value="3-5">Kelas 3 - 5</option>
            <option value="6-7">Kelas 6 - 7</option>
          </select>
        </div>

        <div class="flex-1 flex items-end justify-between gap-2 border-b border-gray-700 pb-2 h-48 relative pt-6">
          <div v-for="day in chartAbsensi" :key="day.hari" class="flex flex-col items-center w-full group">
            <span class="text-[10px] text-white font-bold mb-1 opacity-0 group-hover:opacity-100 transition">{{ day.hadir }}</span>
            <div 
              class="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-400"
              :style="`height: ${day.persentase}%; min-height: 4px;`"
            ></div>
            <span class="text-[10px] text-gray-400 mt-2">H{{ day.hari }}</span>
          </div>
        </div>
      </div>

      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col items-center">
        <div class="w-full flex justify-between items-start mb-4">
          <h3 class="text-white font-medium text-lg">Progres Titah</h3>
          <span class="text-xs bg-teal-900/30 text-teal-400 px-2 py-1 rounded">Semua Kelas</span>
        </div>
        
        <div class="relative w-40 h-40 flex items-center justify-center mt-2">
          <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
            <path class="text-gray-700" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="text-teal-400 transition-all duration-1000" :stroke-dasharray="`${persenTitah}, 100`" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-white">{{ persenTitah }}%</span>
            <span class="text-[10px] text-gray-400">Lulus</span>
          </div>
        </div>
        
        <div class="w-full flex justify-between text-sm mt-6 px-4">
          <div class="text-center"><div class="text-white font-bold">{{ lulusTitah }}</div><div class="text-xs text-gray-500">Lulus</div></div>
          <div class="text-center"><div class="text-white font-bold">{{ students.length - lulusTitah }}</div><div class="text-xs text-gray-500">Belum</div></div>
        </div>
      </div>

      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col items-center">
        <div class="w-full flex justify-between items-start mb-4">
          <h3 class="text-white font-medium text-lg">Progres Haporseaon</h3>
          <span class="text-xs bg-sky-900/30 text-sky-400 px-2 py-1 rounded">Semua Kelas</span>
        </div>
        
        <div class="relative w-40 h-40 flex items-center justify-center mt-2">
          <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
            <path class="text-gray-700" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="text-sky-400 transition-all duration-1000" :stroke-dasharray="`${persenHaporseaon}, 100`" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-white">{{ persenHaporseaon }}%</span>
            <span class="text-[10px] text-gray-400">Lulus</span>
          </div>
        </div>
        
        <div class="w-full flex justify-between text-sm mt-6 px-4">
          <div class="text-center"><div class="text-white font-bold">{{ lulusHaporseaon }}</div><div class="text-xs text-gray-500">Lulus</div></div>
          <div class="text-center"><div class="text-white font-bold">{{ students.length - lulusHaporseaon }}</div><div class="text-xs text-gray-500">Belum</div></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

// State Data Mentah
const students = ref([])
const attendance = ref([])
const hafalan = ref([])

// Filter
const filterKelasAbsensi = ref('all')

// === FETCH DATA DARI SUPABASE ===
const fetchData = async () => {
  const { data: st } = await supabase.from('students').select('*')
  if (st) students.value = st

  const { data: att } = await supabase.from('attendance').select('*')
  if (att) attendance.value = att

  const { data: haf } = await supabase.from('hafalan').select('*')
  if (haf) hafalan.value = haf
}

onMounted(() => {
  fetchData()
})

// === LOGIKA KARTU RINGKASAN ===
const hadirHari1 = computed(() => {
  return attendance.value.filter(a => a.hari === 1 && ['Tepat Waktu', 'Telat <5m', 'Telat >5m'].includes(a.status)).length
})
const lulusTitah = computed(() => {
  return hafalan.value.filter(h => h.jenis_hafalan === 'Titah').length
})
const lulusHaporseaon = computed(() => {
  return hafalan.value.filter(h => h.jenis_hafalan === 'Hata Haporseaon').length
})

// === LOGIKA GRAFIK 1: ABSENSI ===
const chartAbsensi = computed(() => {
  // 1. Filter murid berdasarkan dropdown kelas
  let targetStudents = students.value
  if (filterKelasAbsensi.value === '3-5') {
    targetStudents = students.value.filter(s => [3, 4, 5].includes(s.kelas))
  } else if (filterKelasAbsensi.value === '6-7') {
    targetStudents = students.value.filter(s => [6, 7].includes(s.kelas))
  }

  const targetStudentIds = targetStudents.map(s => s.id)
  const totalTarget = targetStudents.length

  // 2. Hitung kehadiran dari Hari 1 s/d Hari 7
  const result = []
  for (let hari = 1; hari <= 7; hari++) {
    const jumlahHadir = attendance.value.filter(a => 
      a.hari === hari && 
      targetStudentIds.includes(a.student_id) && 
      ['Tepat Waktu', 'Telat <5m', 'Telat >5m'].includes(a.status)
    ).length

    // Hitung tinggi persen untuk CSS (max 100%)
    const persentase = totalTarget === 0 ? 0 : Math.round((jumlahHadir / totalTarget) * 100)
    
    result.push({ hari, hadir: jumlahHadir, persentase })
  }
  return result
})

// === LOGIKA GRAFIK 2 & 3: PERSENTASE HAFALAN ===
const persenTitah = computed(() => {
  if (students.value.length === 0) return 0
  return Math.round((lulusTitah.value / students.value.length) * 100)
})

const persenHaporseaon = computed(() => {
  if (students.value.length === 0) return 0
  return Math.round((lulusHaporseaon.value / students.value.length) * 100)
})

</script>