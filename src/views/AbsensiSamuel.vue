<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-2">
      <div>
        <h1 class="text-2xl font-bold text-sky-400">Absensi Kelas Besar</h1>
        <p class="text-sm text-gray-400 mt-1">Fasilitator: Samuel (Khusus Kelas 6 & 7)</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <label class="font-medium text-gray-400 text-sm whitespace-nowrap">Hari:</label>
        <select 
          v-model="selectedDay" 
          @change="fetchStudents"
          class="flex-1 sm:flex-none bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-sky-500 focus:outline-none transition font-bold"
        >
          <option v-for="day in 7" :key="day" :value="day">Hari {{ day }}</option>
        </select>
      </div>
      
      <button @click="exportToPDF" class="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-medium whitespace-nowrap">
        📄 Cetak Absen (H{{ selectedDay }})
      </button>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col w-full overflow-hidden">
      <div class="border-b border-gray-800 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-lg font-bold text-sky-400">🧑👩 Daftar Anak Kelas 6 - 7</h2>
          <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredRight.length }} Anak</span>
        </div>
        <button @click="markAllOnTime" class="w-full sm:w-auto text-xs bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-lg shadow transition flex items-center justify-center gap-1 font-bold">
          ✅ Hadir Tepat Waktu Semua
        </button>
      </div>

      <div class="overflow-x-auto custom-scrollbar flex-1 pb-2">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400">
              <th class="pb-3 font-medium px-2 min-w-[140px]">Nama Lengkap</th>
              <th class="pb-3 font-medium px-2 min-w-[70px] text-center">Kelas</th>
              <th class="pb-3 font-medium px-2 min-w-[150px]">Status Kehadiran</th>
              <th class="pb-3 font-medium px-2 min-w-[50px] text-center">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedRight.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">Tidak ada data.</td>
            </tr>
            <tr v-for="student in paginatedRight" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]" :title="student.nama_lengkap">{{ student.nama_lengkap }}</td>
              <td class="py-3 px-2 text-center"><span class="text-sky-400 font-bold bg-sky-900/30 px-2 py-1 rounded">Kls {{ student.kelas }}</span></td>
              <td class="py-3 px-2">
                <select v-model="student.status" @change="saveAttendance(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-sky-500 focus:outline-none text-xs transition">
                  <option value="">-- Pilih Status --</option>
                  <option value="Tepat Waktu">Tepat Waktu (100)</option>
                  <option value="Telat <5m">Telat &lt; 5m (95)</option>
                  <option value="Telat >5m">Telat &gt; 5m (90)</option>
                  <option value="Sakit">Sakit (70)</option>
                  <option value="Izin">Izin (50)</option>
                  <option value="Tanpa Izin">Tanpa Izin (0)</option>
                </select>
              </td>
              <td class="py-3 px-2 text-center font-bold text-sky-400">{{ student.status ? getSkor(student.status) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
        <button @click="pageRight--" :disabled="pageRight === 1" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">Prev</button>
        <span class="text-xs text-gray-500 font-medium">Hal {{ pageRight }} dari {{ totalPagesRight || 1 }}</span>
        <button @click="pageRight++" :disabled="pageRight === totalPagesRight || totalPagesRight === 0" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">Next</button>
      </div>
    </div>

    <div v-if="toastMsg" class="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold">
      <span>💾</span> {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const selectedDay = ref(1)
const allStudents = ref([])
const toastMsg = ref('')
const pageRight = ref(1)
const itemsPerPage = 10 

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => toastMsg.value = '', 2000)
}

const getSkor = (status) => {
  switch (status) {
    case 'Tepat Waktu': return 100
    case 'Telat <5m': return 95
    case 'Telat >5m': return 90
    case 'Sakit': return 70
    case 'Izin': return 50
    case 'Tanpa Izin': return 0
    default: return 0
  }
}

const fetchStudents = async () => {
  pageRight.value = 1
  
  // HANYA AMBIL KELAS 6 & 7
  const { data: students } = await supabase.from('students').select('*').in('kelas', [6, 7])
  const { data: attendance } = await supabase.from('attendance').select('*').eq('hari', selectedDay.value)

  if (students) {
    allStudents.value = students.map(student => {
      const existingAbsen = attendance?.find(a => a.student_id === student.id)
      return {
        ...student,
        status: existingAbsen ? existingAbsen.status : '',
        attendance_id: existingAbsen ? existingAbsen.id : null 
      }
    })
  }
}

onMounted(() => fetchStudents())

const filteredRight = computed(() => {
  return [...allStudents.value].sort((a, b) => a.kelas - b.kelas)
})

const totalPagesRight = computed(() => Math.ceil(filteredRight.value.length / itemsPerPage))
const paginatedRight = computed(() => {
  const start = (pageRight.value - 1) * itemsPerPage
  return filteredRight.value.slice(start, start + itemsPerPage)
})

const saveAttendance = async (student, isSilent = false) => {
  if (!student.status) return
  
  const skor = getSkor(student.status)
  const payload = { student_id: student.id, hari: selectedDay.value, status: student.status, skor: skor }

  if (student.attendance_id) {
    await supabase.from('attendance').update(payload).eq('id', student.attendance_id)
  } else {
    const { data } = await supabase.from('attendance').insert(payload).select()
    if (data && data.length > 0) student.attendance_id = data[0].id
  }

  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap}`)
}

const markAllOnTime = async () => {
  for (let student of filteredRight.value) {
    if (student.status !== 'Tepat Waktu') {
      student.status = 'Tepat Waktu'
      await saveAttendance(student, true) 
    }
  }
  showToast(`Semua anak kelas 6-7 ditandai Tepat Waktu!`)
}

const exportToPDF = () => {
  const doc = new jsPDF() 
  doc.setFontSize(16)
  doc.text(`Laporan Absensi SIL HKBP - Hari ${selectedDay.value}`, 14, 15)
  doc.setFontSize(12)
  doc.text('Fasilitator: Samuel (Kelas 6 - 7)', 14, 25)
  
  const bodyRight = filteredRight.value.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, s.status ? getSkor(s.status) : '0'
  ])
  
  autoTable(doc, {
    startY: 30,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Nilai Kehadiran']], 
    body: bodyRight,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] }
  })

  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #0284c7; }
</style>