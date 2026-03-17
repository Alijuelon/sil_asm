<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Wali Kelas Review</h1>
        <p class="text-sm text-gray-400 mt-1">Sistem Penilaian 4 Kategori (Khusus Kelas 3-5)</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <label class="font-medium text-gray-400">Hari Kegiatan:</label>
        <select 
          v-model="selectedDay" 
          @change="fetchStudents"
          class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition font-bold"
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
        <button @click="exportDailyPDF" class="bg-[#0f172a] border border-gray-700 hover:bg-teal-900 text-teal-400 px-4 py-2.5 rounded-lg transition text-sm font-medium">
          📄 Cetak Harian (H{{ selectedDay }})
        </button>
        <button @click="exportFinal7DaysPDF" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-bold shadow-teal-600/30 flex items-center gap-2">
          🏆 Rekap Akhir (7 Hari)
        </button>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
      <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-teal-400">Daftar Anak Kategori Kelas 3 - 5</h2>
          <span class="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredStudents.length }} Anak</span>
        </div>
        <button @click="markAllA" class="text-xs bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2 font-bold">
          ✅ Beri Nilai "A" Semua
        </button>
      </div>

      <div class="overflow-x-auto flex-1 custom-scrollbar pb-4">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-medium rounded-tl-lg w-10">No</th>
              <th class="p-3 font-medium min-w-[150px]">Nama Lengkap</th>
              <th class="p-3 font-medium text-center">Kelas</th>
              <th class="p-3 font-medium min-w-[130px]">Tugas Harian</th>
              <th class="p-3 font-medium min-w-[130px]">Reviu Bacaan</th>
              <th class="p-3 font-medium min-w-[130px]">Kuis / Extra</th>
              <th class="p-3 font-medium min-w-[130px]">Reviu Tontonan</th>
              <th class="p-3 font-medium text-center rounded-tr-lg">Rerata</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedStudents.length === 0">
              <td colspan="8" class="text-center py-8 text-gray-500">Tidak ada data kelas 3-5.</td>
            </tr>
            <tr v-for="(student, index) in paginatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium truncate max-w-[180px]" :title="student.nama_lengkap">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center"><span class="text-blue-400 font-bold bg-blue-900/30 px-2 py-1 rounded border border-blue-800">Kls {{ student.kelas }}</span></td>
              
              <td class="p-3">
                <select v-model="student.tugas_harian" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="A">A (95)</option>
                  <option value="B">B (85)</option>
                  <option value="C">C (70)</option>
                </select>
              </td>
              
              <td class="p-3">
                <select v-model="student.reviu_bacaan" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="A">A (95)</option>
                  <option value="B">B (85)</option>
                  <option value="C">C (70)</option>
                </select>
              </td>

              <td class="p-3">
                <select v-model="student.kuis" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="A">A (95)</option>
                  <option value="B">B (85)</option>
                  <option value="C">C (70)</option>
                </select>
              </td>

              <td class="p-3">
                <select v-model="student.reviu_tontonan" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="A">A (95)</option>
                  <option value="B">B (85)</option>
                  <option value="C">C (70)</option>
                </select>
              </td>

              <td class="p-3 text-center font-bold text-teal-400 text-base bg-[#0f172a]/50">
                {{ calculateDailyScore(student.tugas_harian, student.reviu_bacaan, student.kuis, student.reviu_tontonan) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition">Sebelumnya</button>
        <span class="text-sm text-gray-500 font-medium">Halaman {{ currentPage }} dari {{ totalPages || 1 }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages || totalPages === 0" class="px-4 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition">Selanjutnya</button>
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
const sortDesc = ref(false)
const toastMsg = ref('')

const currentPage = ref(1)
const itemsPerPage = 10 

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => toastMsg.value = '', 2000)
}

// === HITUNG SKOR BERDASARKAN HURUF ===
const getPoint = (grade) => {
  if (grade === 'A') return 95
  if (grade === 'B') return 85
  if (grade === 'C') return 70
  return 0 // Jika 'Belum', poin 0
}

const calculateDailyScore = (tugas, bacaan, kuis, tontonan) => {
  if (tugas === 'Belum' && bacaan === 'Belum' && kuis === 'Belum' && tontonan === 'Belum') return 0
  
  const totalPoints = getPoint(tugas) + getPoint(bacaan) + getPoint(kuis) + getPoint(tontonan)
  // Dibagi 4 sesuai jumlah kategori
  return Math.round(totalPoints / 4)
}

// === FUNGSI MENGAMBIL DATA KHUSUS KELAS 3-5 ===
const fetchStudents = async () => {
  currentPage.value = 1
  
  const { data: students, error: err1 } = await supabase
    .from('students')
    .select('*')
    .in('kelas', [3, 4, 5])
    
  if (err1) return console.error(err1)

  const { data: tugasDB, error: err2 } = await supabase
    .from('tugas')
    .select('*')
    .eq('hari', selectedDay.value)

  if (err2) console.warn("Tabel tugas bermasalah.", err2)

  allStudents.value = students.map(student => {
    const existingTugas = tugasDB?.find(t => t.student_id === student.id)
    return {
      ...student,
      tugas_harian: existingTugas?.tugas_harian || 'Belum',
      reviu_bacaan: existingTugas?.reviu_bacaan || 'Belum',
      kuis: existingTugas?.kuis || 'Belum',
      reviu_tontonan: existingTugas?.reviu_tontonan || 'Belum',
      tugas_id: existingTugas?.id || null
    }
  })
}

onMounted(() => fetchStudents())

const toggleSort = () => {
  sortDesc.value = !sortDesc.value
}

const filteredStudents = computed(() => {
  let filtered = [...allStudents.value]
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredStudents.value.slice(start, start + itemsPerPage)
})

// === FUNGSI AUTO-SAVE (MENGIRIM 4 KOLOM BARU) ===
const saveTugas = async (student, isSilent = false) => {
  const skor = calculateDailyScore(student.tugas_harian, student.reviu_bacaan, student.kuis, student.reviu_tontonan)
  
  const payload = { 
    student_id: student.id, 
    hari: selectedDay.value, 
    tugas_harian: student.tugas_harian, 
    reviu_bacaan: student.reviu_bacaan, 
    kuis: student.kuis, 
    reviu_tontonan: student.reviu_tontonan, 
    skor_harian: skor 
  }

  if (student.tugas_id) {
    const { error } = await supabase.from('tugas').update(payload).eq('id', student.tugas_id)
    if (error) {
      console.error("Gagal Update:", error)
      return alert("Gagal menyimpan data! Pastikan SQL Alter Table sudah dijalankan.")
    }
  } else {
    const { data, error } = await supabase.from('tugas').insert(payload).select()
    if (error) {
      console.error("Gagal Insert:", error)
      return alert("Gagal menyimpan data baru! Pastikan SQL Alter Table sudah dijalankan.")
    }
    if (data && data.length > 0) student.tugas_id = data[0].id
  }

  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap} (Rerata: ${skor})`)
}

// === TANDAI NILAI "A" SEMUA (4 KOLOM) ===
const markAllA = async () => {
  for (let student of filteredStudents.value) {
    let changed = false
    if (student.tugas_harian !== 'A') { student.tugas_harian = 'A'; changed = true }
    if (student.reviu_bacaan !== 'A') { student.reviu_bacaan = 'A'; changed = true }
    if (student.kuis !== 'A') { student.kuis = 'A'; changed = true }
    if (student.reviu_tontonan !== 'A') { student.reviu_tontonan = 'A'; changed = true }
    
    if (changed) await saveTugas(student, true)
  }
  showToast(`Semua anak Kelas 3-5 diberi Nilai A!`)
}

// === EXPORT PDF ===
const getTanggalCetak = () => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
const formatTanggalFile = new Date().toISOString().split('T')[0] 

const exportDailyPDF = () => {
  const doc = new jsPDF('landscape') // Landscape agar 4 kolom muat dengan lega
  doc.setFontSize(16)
  doc.text(`Laporan Wali Kelas Review - Hari ${selectedDay.value}`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Kategori: Kelas 3 - 5 | Dicetak pada: ${getTanggalCetak()} WIB`, 14, 22)
  
  const bodyData = filteredStudents.value.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, 
    s.tugas_harian, s.reviu_bacaan, s.kuis, s.reviu_tontonan, 
    calculateDailyScore(s.tugas_harian, s.reviu_bacaan, s.kuis, s.reviu_tontonan)
  ])
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Tugas Harian', 'Reviu Bacaan', 'Kuis', 'Reviu Tontonan', 'Rerata']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] }
  })
  
  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}

const exportFinal7DaysPDF = async () => {
  const { data: allTugas } = await supabase.from('tugas').select('*')
  
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(`Rekap Akhir Wali Kelas (7 Hari Kegiatan)`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Kategori: Kelas 3 - 5 | Dicetak pada: ${getTanggalCetak()} WIB`, 14, 22)
  
  const bodyData = filteredStudents.value.map((s, idx) => {
    const tugasAnak = allTugas?.filter(t => t.student_id === s.id) || []
    let totalSkor = 0
    tugasAnak.forEach(t => totalSkor += t.skor_harian)
    const rerataAkhir = Math.round(totalSkor / 7)
    
    return [idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, totalSkor.toString(), rerataAkhir]
  })
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Total Rerata Harian', 'NILAI RATA-RATA AKHIR']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: { 4: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } }
  })
  
  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}
</script>

<style scoped>
/* Agar tabel bisa di-scroll dengan mulus di HP */
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #334155; }
</style>