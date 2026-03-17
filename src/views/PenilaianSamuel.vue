<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-sky-400">Penilaian Topik Custom (Harian)</h1>
        <p class="text-sm text-gray-400 mt-1">Buat topik sendiri & nilai per hari (A/B/C) - Khusus Kelas 6-7</p>
      </div>
    </div>

    <div class="bg-sky-900/20 border border-sky-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col xl:flex-row gap-4 xl:items-end">
      
      <div class="flex items-center gap-3">
        <label class="font-medium text-sky-300 whitespace-nowrap">Hari Kegiatan:</label>
        <select 
          v-model="selectedDay" 
          @change="fetchHafalan"
          class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-sky-500 focus:outline-none transition font-bold"
        >
          <option v-for="day in 7" :key="day" :value="day">Hari {{ day }}</option>
        </select>
      </div>

      <div class="flex-1 w-full">
        <label class="block font-medium text-sky-300 mb-2">Nama Topik Penilaian:</label>
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            v-model="customTopic" 
            type="text" 
            placeholder="Ketik topik (misal: Tokoh Daniel, Kisah Daud)" 
            class="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition font-bold placeholder-gray-600"
          >
          <button @click="fetchHafalan" class="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition whitespace-nowrap flex items-center justify-center gap-2">
            <span>🔍</span> Buka Daftar Nilai
          </button>
        </div>
      </div>
    </div>

    <div v-if="customTopicLoaded" class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col">
      <div class="border-b border-gray-800 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-lg font-bold text-sky-400">Topik: <span class="text-white">"{{ customTopicLoaded }}"</span></h2>
          <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded mt-1 inline-block">Menampilkan data Hari {{ selectedDay }}</span>
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button @click="exportToPDF" class="flex-1 sm:flex-none bg-[#0f172a] border border-gray-700 hover:bg-sky-900 text-sky-400 px-4 py-2 rounded-lg transition text-sm font-bold">
            📄 Cetak PDF
          </button>
          <button @click="markAllA" class="flex-1 sm:flex-none text-xs bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center justify-center gap-2 font-bold">
            ✅ Beri Nilai "A" Semua
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto flex-1 custom-scrollbar pb-2">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-medium rounded-tl-lg w-10">No</th>
              <th class="p-3 font-medium min-w-[200px]">Nama Lengkap</th>
              <th class="p-3 font-medium text-center w-24">Kelas</th>
              <th class="p-3 font-medium min-w-[150px]">Nilai (A/B/C)</th>
              <th class="p-3 font-medium text-center rounded-tr-lg w-16">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedStudents.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-500">Tidak ada data kelas 6-7.</td>
            </tr>
            <tr v-for="(student, index) in paginatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center"><span class="text-sky-400 font-bold bg-sky-900/30 px-2 py-1 rounded border border-sky-800">Kls {{ student.kelas }}</span></td>
              
              <td class="p-3">
                <select v-model="student.status_nilai" @change="saveHafalan(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-sky-500 focus:outline-none text-xs transition">
                  <option value="Belum">Belum Dinilai</option>
                  <option value="A">Nilai A (95)</option>
                  <option value="B">Nilai B (85)</option>
                  <option value="C">Nilai C (70)</option>
                </select>
              </td>
              
              <td class="p-3 text-center font-bold text-sky-400 text-base bg-[#0f172a]/30">
                {{ getPoint(student.status_nilai) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">Sebelumnya</button>
        <span class="text-sm text-gray-500 font-medium">Halaman {{ currentPage }} dari {{ totalPages || 1 }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages || totalPages === 0" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">Selanjutnya</button>
      </div>
    </div>

    <div v-else class="bg-[#151e32] border border-gray-800 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
      <span class="text-4xl mb-3 opacity-50">📂</span>
      <h3 class="text-lg font-bold text-gray-400">Belum ada topik yang dipilih</h3>
      <p class="text-sm text-gray-500 mt-1">Ketik nama topik di atas lalu klik "Buka Daftar Nilai".</p>
    </div>

    <div v-if="toastMsg" class="fixed bottom-6 right-6 bg-sky-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold">
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
const customTopic = ref('')
const customTopicLoaded = ref('')
const allStudents = ref([])
const toastMsg = ref('')

const currentPage = ref(1)
const itemsPerPage = 10 

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => toastMsg.value = '', 2000)
}

// Konversi Huruf ke Angka
const getPoint = (grade) => {
  if (grade === 'A') return 95
  if (grade === 'B') return 85
  if (grade === 'C') return 70
  return 0
}

const fetchHafalan = async () => {
  if (!customTopic.value.trim()) {
    alert("Nama topik tidak boleh kosong!")
    return
  }
  
  currentPage.value = 1
  customTopicLoaded.value = customTopic.value.trim()

  const { data: students } = await supabase.from('students').select('*').in('kelas', [6, 7]).order('kelas', { ascending: true })
  
  // Ambil data nilai berdasarkan Topik DAN Hari yang dipilih
  const { data: hafalan } = await supabase
    .from('hafalan')
    .select('*')
    .eq('jenis_hafalan', customTopicLoaded.value)
    .eq('hari', selectedDay.value)

  if (students) {
    allStudents.value = students.map(s => {
      const exist = hafalan?.find(h => h.student_id === s.id)
      return {
        ...s,
        status_nilai: exist ? exist.status_nilai : 'Belum',
        hafalan_id: exist ? exist.id : null
      }
    })
  }
}

const totalPages = computed(() => Math.ceil(allStudents.value.length / itemsPerPage))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allStudents.value.slice(start, start + itemsPerPage)
})

const saveHafalan = async (student, isSilent = false) => {
  const skor = getPoint(student.status_nilai)
  
  const payload = { 
    student_id: student.id, 
    jenis_hafalan: customTopicLoaded.value, 
    hari: selectedDay.value,        // Menyimpan data Hari
    status_nilai: student.status_nilai, // Menyimpan Huruf A/B/C
    skor: skor 
  }

  if (student.hafalan_id) {
    await supabase.from('hafalan').update(payload).eq('id', student.hafalan_id)
  } else {
    const { data } = await supabase.from('hafalan').insert(payload).select()
    if (data && data.length > 0) student.hafalan_id = data[0].id
  }

  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap} (${skor} pt)`)
}

const markAllA = async () => {
  for (let student of allStudents.value) {
    if (student.status_nilai !== 'A') {
      student.status_nilai = 'A'
      await saveHafalan(student, true)
    }
  }
  showToast(`Semua anak Kelas 6-7 diberi Nilai A!`)
}

// === FITUR CETAK PDF ===
const exportToPDF = () => {
  const doc = new jsPDF()
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.text(`Laporan Penilaian: ${customTopicLoaded.value}`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Fasilitator: Samuel | Kelas 6-7 | Kegiatan Hari Ke-${selectedDay.value}`, 14, 22)
  doc.text(`Dicetak pada: ${tanggal}`, 14, 27)
  
  const bodyData = allStudents.value.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, s.status_nilai, getPoint(s.status_nilai)
  ])
  
  autoTable(doc, {
    startY: 32,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Nilai Huruf', 'Skor Angka']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] }, // Warna Sky Blue
    columnStyles: {
      3: { halign: 'center' },
      4: { halign: 'center', fontStyle: 'bold' }
    }
  })
  
  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #0369a1; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #0284c7; }
</style>