<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Input & Rekap Absensi</h1>
        <p class="text-sm text-gray-400 mt-1">Sistem Absensi Otomatis (Auto-Save)</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <label class="font-medium text-gray-400">Hari Kegiatan:</label>
        <select 
          v-model="selectedDay" 
          @change="fetchStudents"
          class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition"
        >
          <option v-for="day in 7" :key="day" :value="day">Hari {{ day }}</option>
        </select>
        
        <button 
          @click="toggleSort" 
          class="bg-[#0f172a] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
        >
          <span class="text-sm">↕️ Urutkan: </span>
          <span class="font-bold text-teal-400">{{ sortDesc ? 'Kelas Besar-Kecil' : 'Kelas Kecil-Besar' }}</span>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button @click="exportToPDF('left')" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg transition shadow-lg text-sm font-medium">📄 Kls 3-5</button>
        <button @click="exportToPDF('right')" class="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg transition shadow-lg text-sm font-medium">📄 Kls 6-7</button>
        <button @click="exportToPDF('all')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition shadow-lg text-sm font-medium">📄 Ekspor Semua</button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-teal-400">👦👧 Kategori Kelas 3 - 5</h2>
            <span class="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredLeft.length }} Anak</span>
          </div>
          <button @click="markAllOnTime('left')" class="text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg shadow transition flex items-center gap-1 font-bold">
            ✅ Hadir Semua
          </button>
        </div>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400">
                <th class="pb-3 font-medium px-2">Nama Lengkap</th>
                <th class="pb-3 font-medium px-2 w-16">Kelas</th>
                <th class="pb-3 font-medium px-2 w-48">Status (Auto-Save)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedLeft.length === 0">
                <td colspan="3" class="text-center py-6 text-gray-500">Tidak ada data.</td>
              </tr>
              <tr v-for="student in paginatedLeft" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
                <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
                <td class="py-3 px-2"><span class="text-blue-400 font-bold">{{ student.kelas }}</span></td>
                <td class="py-3 px-2">
                  <select v-model="student.status" @change="saveAttendance(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                    <option value="">-- Status --</option>
                    <option value="Tepat Waktu">Tepat Waktu</option>
                    <option value="Telat <5m">Telat &lt; 5m</option>
                    <option value="Telat >5m">Telat &gt; 5m</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Izin">Izin</option>
                    <option value="Tanpa Izin">Tanpa Izin</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
          <button @click="pageLeft--" :disabled="pageLeft === 1" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Prev</button>
          <span class="text-xs text-gray-500">Hal {{ pageLeft }} dari {{ totalPagesLeft || 1 }}</span>
          <button @click="pageLeft++" :disabled="pageLeft === totalPagesLeft || totalPagesLeft === 0" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Next</button>
        </div>
      </div>

      <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-sky-400">🧑👩 Kategori Kelas 6 - 7</h2>
            <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredRight.length }} Anak</span>
          </div>
          <button @click="markAllOnTime('right')" class="text-xs bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg shadow transition flex items-center gap-1 font-bold">
            ✅ Hadir Semua
          </button>
        </div>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400">
                <th class="pb-3 font-medium px-2">Nama Lengkap</th>
                <th class="pb-3 font-medium px-2 w-16">Kelas</th>
                <th class="pb-3 font-medium px-2 w-48">Status (Auto-Save)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedRight.length === 0">
                <td colspan="3" class="text-center py-6 text-gray-500">Tidak ada data.</td>
              </tr>
              <tr v-for="student in paginatedRight" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
                <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
                <td class="py-3 px-2"><span class="text-sky-400 font-bold">{{ student.kelas }}</span></td>
                <td class="py-3 px-2">
                  <select v-model="student.status" @change="saveAttendance(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-sky-500 focus:outline-none text-xs transition">
                    <option value="">-- Status --</option>
                    <option value="Tepat Waktu">Tepat Waktu</option>
                    <option value="Telat <5m">Telat &lt; 5m</option>
                    <option value="Telat >5m">Telat &gt; 5m</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Izin">Izin</option>
                    <option value="Tanpa Izin">Tanpa Izin</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
          <button @click="pageRight--" :disabled="pageRight === 1" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Prev</button>
          <span class="text-xs text-gray-500">Hal {{ pageRight }} dari {{ totalPagesRight || 1 }}</span>
          <button @click="pageRight++" :disabled="pageRight === totalPagesRight || totalPagesRight === 0" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Next</button>
        </div>
      </div>

    </div>

    <div 
      v-if="toastMsg" 
      class="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold"
    >
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
const sortDesc = ref(false)
const toastMsg = ref('')

const pageLeft = ref(1)
const pageRight = ref(1)
const itemsPerPage = 8 

// === MENAMPILKAN TOAST ===
const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => {
    toastMsg.value = ''
  }, 2000)
}

// === FUNGSI MENGAMBIL DATA ===
const fetchStudents = async () => {
  pageLeft.value = 1
  pageRight.value = 1
  
  const { data: students, error: err1 } = await supabase.from('students').select('*')
  const { data: attendance, error: err2 } = await supabase.from('attendance').select('*').eq('hari', selectedDay.value)

  if (!err1 && !err2) {
    allStudents.value = students.map(student => {
      const existingAbsen = attendance.find(a => a.student_id === student.id)
      return {
        ...student,
        status: existingAbsen ? existingAbsen.status : '',
        attendance_id: existingAbsen ? existingAbsen.id : null // Menyimpan ID absensi jika sudah ada
      }
    })
  }
}

onMounted(() => {
  fetchStudents()
})

const toggleSort = () => {
  sortDesc.value = !sortDesc.value
}

// === FILTER KELAS ===
const filteredLeft = computed(() => {
  let filtered = allStudents.value.filter(s => [3, 4, 5].includes(s.kelas))
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})
const totalPagesLeft = computed(() => Math.ceil(filteredLeft.value.length / itemsPerPage))
const paginatedLeft = computed(() => {
  const start = (pageLeft.value - 1) * itemsPerPage
  return filteredLeft.value.slice(start, start + itemsPerPage)
})

const filteredRight = computed(() => {
  let filtered = allStudents.value.filter(s => [6, 7].includes(s.kelas))
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})
const totalPagesRight = computed(() => Math.ceil(filteredRight.value.length / itemsPerPage))
const paginatedRight = computed(() => {
  const start = (pageRight.value - 1) * itemsPerPage
  return filteredRight.value.slice(start, start + itemsPerPage)
})


// === FUNGSI AUTO-SAVE ===
const getSkor = (status) => {
  if (status === 'Tepat Waktu') return 100
  if (status === 'Telat <5m') return 95
  if (status === 'Telat >5m') return 90
  if (status === 'Sakit') return 70
  if (status === 'Izin') return 50
  return 0
}

const saveAttendance = async (student, isSilent = false) => {
  if (!student.status) return
  
  const payload = { 
    student_id: student.id, 
    hari: selectedDay.value, 
    status: student.status, 
    skor: getSkor(student.status) 
  }

  // Jika murid sudah pernah di-absen sebelumnya (Update)
  if (student.attendance_id) {
    await supabase.from('attendance').update(payload).eq('id', student.attendance_id)
  } 
  // Jika belum pernah diabsen (Insert)
  else {
    const { data } = await supabase.from('attendance').insert(payload).select()
    if (data && data.length > 0) student.attendance_id = data[0].id
  }

  // Tampilkan toast jika bukan proses batch (tandai semua)
  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap}`)
}

// === FUNGSI TANDAI SEMUA HADIR ===
const markAllOnTime = async (section) => {
  const listToUpdate = section === 'left' ? filteredLeft.value : filteredRight.value
  
  for (let student of listToUpdate) {
    if (student.status !== 'Tepat Waktu') {
      student.status = 'Tepat Waktu'
      await saveAttendance(student, true) // isSilent = true
    }
  }
  showToast(`Semua anak kelas ${section === 'left' ? '3-5' : '6-7'} berhasil ditandai hadir!`)
}

// === FUNGSI EXPORT PDF DINAMIS (VERSI VITE AMAN) ===
const exportToPDF = (mode) => {
  // Pastikan huruf j dan PDF sesuai dengan import { jsPDF }
  const doc = new jsPDF() 
  
  doc.setFontSize(16)
  doc.text(`Laporan Absensi SIL HKBP - Hari ${selectedDay.value}`, 14, 15)
  
  let currentY = 25

  // Render Tabel Kiri (Kelas 3-5)
  if (mode === 'all' || mode === 'left') {
    doc.setFontSize(12)
    doc.text('Kategori Kelas 3 - 5', 14, currentY)
    
   // MENGUBAH STATUS MENJADI SKOR
    const bodyLeft = filteredLeft.value.map((s, idx) => [
      idx + 1, 
      s.nama_lengkap, 
      `Kelas ${s.kelas}`, 
      s.status ? getSkor(s.status) : '0' // Memanggil fungsi getSkor
    ])
    
    autoTable(doc, {
      startY: currentY + 5,
      // MENGUBAH JUDUL KOLOM
      head: [['No', 'Nama Lengkap', 'Kelas', 'Nilai Kehadiran']], 
      body: bodyLeft,
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] }
    })
  }

  // Cek apakah sisa halaman muat
  if (currentY > 250 && mode === 'all') {
    doc.addPage()
    currentY = 15
  }

  // Render Tabel Kanan (Kelas 6-7)
  if (mode === 'all' || mode === 'right') {
    doc.setFontSize(12)
    if (mode === 'right') currentY = 25 
    
    doc.text('Kategori Kelas 6 - 7', 14, currentY)
    
   const bodyRight = filteredRight.value.map((s, idx) => [
      idx + 1, 
      s.nama_lengkap, 
      `Kelas ${s.kelas}`, 
      s.status ? getSkor(s.status) : '0' // Memanggil fungsi getSkor
    ])
    
    autoTable(doc, {
      startY: currentY + 5,
      // MENGUBAH JUDUL KOLOM
      head: [['No', 'Nama Lengkap', 'Kelas', 'Nilai Kehadiran']], 
      body: bodyRight,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] }
    })
  }

  let fileName = `Absensi_SIL_Hari_${selectedDay.value}`
  if (mode === 'left') fileName += `_Kls3-5`
  else if (mode === 'right') fileName += `_Kls6-7`
  else fileName += `_SemuaKelas`
  
  doc.save(`${fileName}.pdf`)
}
</script>