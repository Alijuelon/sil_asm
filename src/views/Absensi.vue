<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-2">
      <div>
        <h1 class="text-2xl font-bold text-teal-400">Absensi Kelas Kecil</h1>
        <p class="text-sm text-gray-400 mt-1">Fasilitator: Ali (Khusus Kelas 3 - 5)</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col w-full overflow-hidden gap-5">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800 pb-3">
        <div>
          <h2 class="text-lg font-bold text-teal-400">👦👧 Daftar Anak Kelas 3 - 5</h2>
          <span class="text-xs bg-teal-900/50 text-teal-300 px-2 py-1 rounded mt-1 inline-block border border-teal-800/50">Total: {{ filteredStudents.length }} Anak</span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <label class="font-medium text-gray-400 text-sm whitespace-nowrap">Hari:</label>
            <select 
              v-model="selectedDay" 
              @change="fetchStudents"
              class="flex-1 sm:flex-none bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition font-bold text-sm"
            >
              <option v-for="day in 7" :key="day" :value="day">Hari {{ day }}</option>
            </select>
          </div>
          
          <button 
            @click="toggleSort" 
            class="w-full sm:w-auto bg-[#0f172a] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <span class="text-sm">↕️ Urutkan: </span>
            <span class="font-bold text-teal-400 text-sm">{{ sortDesc ? 'Besar ke Kecil' : 'Kecil ke Besar' }}</span>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <button @click="markAllOnTime" class="w-full sm:w-auto bg-teal-900/40 hover:bg-teal-900/80 border border-teal-700 text-teal-300 px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm font-bold">
            ✅ Hadir Tepat Waktu Semua
          </button>
          
          <button @click="export7DaysPDF" class="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg transition shadow-lg text-sm font-bold whitespace-nowrap flex items-center justify-center gap-2">
            📑 Cetak Rekap 7 Hari
          </button>
        </div>
      </div>

      <div class="overflow-x-auto custom-scrollbar flex-1 pb-2">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-medium rounded-tl-lg w-10">No</th>
              <th class="p-3 font-medium min-w-[140px]">Nama Lengkap</th>
              <th class="p-3 font-medium text-center w-24">Kelas</th>
              <th class="p-3 font-medium min-w-[150px]">Status Kehadiran</th>
              <th class="p-3 font-medium text-center rounded-tr-lg w-16">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedStudents.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-500">Tidak ada data kelas 3-5.</td>
            </tr>
            <tr v-for="(student, index) in paginatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium truncate max-w-[150px]" :title="student.nama_lengkap">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center"><span class="text-teal-400 font-bold bg-teal-900/30 px-2 py-1 rounded border border-teal-800">Kls {{ student.kelas }}</span></td>
              <td class="p-3">
                <select v-model="student.status" @change="saveAttendance(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="">-- Pilih Status --</option>
                  <option value="Tepat Waktu">Tepat Waktu (100)</option>
                  <option value="Telat <5m">Telat &lt; 5m (95)</option>
                  <option value="Telat >5m">Telat &gt; 5m (90)</option>
                  <option value="Sakit">Sakit (70)</option>
                  <option value="Izin">Izin (50)</option>
                  <option value="Tanpa Izin">Tanpa Izin (0)</option>
                </select>
              </td>
              <td class="p-3 text-center font-bold text-teal-400 bg-[#0f172a]/30">{{ student.status ? getSkor(student.status) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">Sebelumnya</button>
        <span class="text-sm text-gray-500 font-medium">Halaman {{ currentPage }} dari {{ totalPages || 1 }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages || totalPages === 0" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">Selanjutnya</button>
      </div>
    </div>

    <div v-if="toastMsg" class="fixed bottom-6 right-6 bg-teal-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold">
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

const currentPage = ref(1)
const itemsPerPage = 10 

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => { toastMsg.value = '' }, 2000)
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
  currentPage.value = 1
  
  const { data: students, error: err1 } = await supabase.from('students').select('*').in('kelas', [3, 4, 5])

  if (err1) {
    console.error("Gagal mengambil data murid:", err1)
    return
  }

  const studentIds = students.map(s => s.id)

  const { data: attendance, error: err2 } = await supabase
    .from('attendance')
    .select('*')
    .eq('hari', selectedDay.value)
    .in('student_id', studentIds)

  if (err2) {
    console.error("Gagal mengambil data absensi:", err2)
  }

  if (!err1 && !err2) {
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

const toggleSort = () => { sortDesc.value = !sortDesc.value }

const filteredStudents = computed(() => {
  let filtered = [...allStudents.value]
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredStudents.value.slice(start, start + itemsPerPage)
})

const saveAttendance = async (student, isSilent = false) => {
  if (!student.status) return
  
  const skor = getSkor(student.status)
  const payload = { 
    student_id: student.id, 
    hari: selectedDay.value, 
    status: student.status, 
    skor: skor 
  }

  if (student.attendance_id) {
    const { error } = await supabase.from('attendance').update(payload).eq('id', student.attendance_id)
    if (error) console.error("Error Update Absen:", error)
  } else {
    const { data, error } = await supabase.from('attendance').insert(payload).select()
    if (error) console.error("Error Insert Absen:", error)
    if (data && data.length > 0) student.attendance_id = data[0].id
  }

  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap} (${skor} pt)`)
}

const markAllOnTime = async () => {
  for (let student of filteredStudents.value) {
    if (student.status !== 'Tepat Waktu') {
      student.status = 'Tepat Waktu'
      await saveAttendance(student, true) 
    }
  }
  showToast(`Semua anak kelas 3-5 ditandai Tepat Waktu!`)
}

// === FUNGSI EKSPOR PDF 7 HARI ===
const export7DaysPDF = async () => {
  const studentIds = filteredStudents.value.map(s => s.id)
  
  if (studentIds.length === 0) return alert("Belum ada data murid untuk dicetak!")

  // Tarik SEMUA data absen dari hari 1 sampai 7 untuk murid kelas 3-5
  const { data: allAttendance, error } = await supabase
    .from('attendance')
    .select('student_id, hari, skor')
    .in('student_id', studentIds)

  if (error) {
    alert("Gagal mengambil data dari server!")
    return
  }

  const doc = new jsPDF('landscape') // Landscape agar muat banyak kolom
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.text(`Rekapitulasi Absensi 7 Hari SIL HKBP 2026`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Fasilitator: Ali Sinaga | Kategori: Kelas 3-5 | Dicetak: ${tanggal}`, 14, 22)

  // Susun baris data untuk tiap murid
  const bodyData = filteredStudents.value.map((student, idx) => {
    let row = [idx + 1, student.nama_lengkap, `Kls ${student.kelas}`]
    let totalSkor = 0

    // Looping dari Hari 1 ke Hari 7
    for (let d = 1; d <= 7; d++) {
      let record = allAttendance.find(a => a.student_id === student.id && a.hari === d)
      let skorHariIni = record ? record.skor : 0
      
      row.push(skorHariIni.toString())
      totalSkor += skorHariIni
    }

    // Hitung Rata-rata akhir (dibagi 7)
    let rataRata = Math.round(totalSkor / 7)
    row.push(rataRata.toString())

    return row
  })
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Lengkap', 'Kelas', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'Rata-rata']], 
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166], halign: 'center' }, // Tema warna Teal Kak Ali
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      2: { halign: 'center', cellWidth: 15 },
      // Rata tengah semua kolom H1 - H7
      3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' },
      6: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' },
      9: { halign: 'center' },
      10: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } // Rata-rata di-bold
    }
  })

  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #14b8a6; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #0d9488; }
</style>