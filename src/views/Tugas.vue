<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Wali Kelas Review</h1>
        <p class="text-sm text-gray-400 mt-1">Review Komik, Tugas Harian & Titah Akhir (Khusus Kelas 3-5)</p>
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
        <button @click="markAllDone" class="text-xs bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2 font-bold">
          ✅ Selesai Semua
        </button>
      </div>

      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-medium rounded-tl-lg w-12">No</th>
              <th class="p-3 font-medium">Nama Lengkap</th>
              <th class="p-3 font-medium text-center w-20">Kelas</th>
              <th class="p-3 font-medium w-40">Review Komik</th>
              <th class="p-3 font-medium w-40">Tugas Harian</th>
              <th class="p-3 font-medium w-40">Review Titah Akhir</th>
              <th class="p-3 font-medium text-center w-16 rounded-tr-lg">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedStudents.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500">Tidak ada data kelas 3-5.</td>
            </tr>
            <tr v-for="(student, index) in paginatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center"><span class="text-blue-400 font-bold bg-blue-900/30 px-2 py-1 rounded border border-blue-800">Kls {{ student.kelas }}</span></td>
              
              <td class="p-3">
                <select v-model="student.status_komik" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="Selesai">✅ Selesai</option>
                </select>
              </td>
              
              <td class="p-3">
                <select v-model="student.status_tugas" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="Selesai">✅ Selesai</option>
                </select>
              </td>

              <td class="p-3">
                <select v-model="student.review_titah" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum</option>
                  <option value="Selesai">✅ Selesai</option>
                </select>
              </td>

              <td class="p-3 text-center font-bold text-teal-400 text-base">
                {{ calculateDailyScore(student.status_komik, student.status_tugas, student.review_titah) }}
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
const itemsPerPage = 10 // Bisa menampung 10 anak sekaligus per halaman

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => toastMsg.value = '', 2000)
}

// === HITUNG SKOR BEDA BOBOT ===
// Komik (30) + Tugas (30) + Titah Akhir (40) = 100
const calculateDailyScore = (komik, tugas, titah) => {
  let score = 0
  if (komik === 'Selesai') score += 30
  if (tugas === 'Selesai') score += 30
  if (titah === 'Selesai') score += 40
  return score
}

// === FUNGSI MENGAMBIL DATA KHUSUS KELAS 3-5 ===
const fetchStudents = async () => {
  currentPage.value = 1
  
  // 1. Ambil murid khusus kelas 3, 4, 5
  const { data: students, error: err1 } = await supabase
    .from('students')
    .select('*')
    .in('kelas', [3, 4, 5])
    
  if (err1) return console.error(err1)

  // 2. Ambil data Tugas Harian
  const { data: tugasDB, error: err2 } = await supabase
    .from('tugas')
    .select('*')
    .eq('hari', selectedDay.value)

  if (err2) {
    console.warn("Tabel tugas bermasalah/belum diupdate.", err2)
  }

  allStudents.value = students.map(student => {
    const existingTugas = tugasDB?.find(t => t.student_id === student.id)
    return {
      ...student,
      status_komik: existingTugas?.status_komik || 'Belum',
      status_tugas: existingTugas?.status_tugas || 'Belum',
      review_titah: existingTugas?.review_titah || 'Belum', // Kolom baru
      tugas_id: existingTugas?.id || null
    }
  })
}

onMounted(() => fetchStudents())

const toggleSort = () => {
  sortDesc.value = !sortDesc.value
}

// === FILTER & PAGINASI ===
const filteredStudents = computed(() => {
  let filtered = [...allStudents.value]
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredStudents.value.slice(start, start + itemsPerPage)
})

// === FUNGSI AUTO-SAVE ===
const saveTugas = async (student, isSilent = false) => {
  const skor = calculateDailyScore(student.status_komik, student.status_tugas, student.review_titah)
  
  const payload = { 
    student_id: student.id, 
    hari: selectedDay.value, 
    status_komik: student.status_komik, 
    status_tugas: student.status_tugas, 
    review_titah: student.review_titah, // Disimpan ke DB
    skor_harian: skor 
  }

  if (student.tugas_id) {
    await supabase.from('tugas').update(payload).eq('id', student.tugas_id)
  } else {
    const { data } = await supabase.from('tugas').insert(payload).select()
    if (data && data.length > 0) student.tugas_id = data[0].id
  }

  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap} (Skor: ${skor})`)
}

// === TANDAI SEMUA SELESAI ===
const markAllDone = async () => {
  for (let student of filteredStudents.value) {
    let changed = false
    if (student.status_komik !== 'Selesai') { student.status_komik = 'Selesai'; changed = true }
    if (student.status_tugas !== 'Selesai') { student.status_tugas = 'Selesai'; changed = true }
    if (student.review_titah !== 'Selesai') { student.review_titah = 'Selesai'; changed = true }
    
    if (changed) await saveTugas(student, true) // Simpan diam-diam (silent)
  }
  showToast(`Semua anak Kelas 3-5 berhasil ditandai selesai!`)
}

// === FUNGSI BANTUAN TANGGAL CETAK ===
const getTanggalCetak = () => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
const formatTanggalFile = new Date().toISOString().split('T')[0] 

// === EXPORT 1: PDF HARIAN ===
const exportDailyPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(`Laporan Wali Kelas Review - Hari ${selectedDay.value}`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Kategori: Kelas 3 - 5 | Dicetak pada: ${getTanggalCetak()} WIB`, 14, 22)
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  
  const bodyData = filteredStudents.value.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, s.status_komik, s.status_tugas, s.review_titah, calculateDailyScore(s.status_komik, s.status_tugas, s.review_titah)
  ])
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Komik', 'Tugas', 'Titah Akhir', 'Total']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] }
  })
  
  doc.save(`WaliKelas_Hari_${selectedDay.value}_${formatTanggalFile}.pdf`)
}

// === EXPORT 2: PDF REKAP 7 HARI ===
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
    const rerata = Math.round(totalSkor / 7)
    
    return [idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, `${totalSkor} / 700`, rerata]
  })
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Total Skor Terkumpul', 'NILAI RATA-RATA']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: { 4: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } }
  })
  
  doc.save(`Laporan_WaliKelas_7Hari_${formatTanggalFile}.pdf`)
}
</script>