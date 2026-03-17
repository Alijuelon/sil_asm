<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-sky-400">Penilaian Topik Kustom</h1>
        <p class="text-sm text-gray-400 mt-1">Kelola berbagai jenis penilaian secara fleksibel (Khusus Kelas 6-7)</p>
      </div>
    </div>

    <div class="bg-sky-900/20 border border-sky-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col xl:flex-row gap-4 xl:items-end">
      
      <div class="flex flex-col gap-2 w-full xl:w-32">
        <label class="font-medium text-sky-300 text-sm">Hari:</label>
        <select 
          v-model="selectedDay" 
          @change="handleDayChange"
          class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-sky-500 focus:outline-none transition font-bold"
        >
          <option v-for="day in 7" :key="day" :value="day">H - {{ day }}</option>
        </select>
      </div>

      <div class="flex-1 flex flex-col gap-2 w-full">
        <label class="font-medium text-sky-300 text-sm">Pilih Topik Penilaian:</label>
        <div class="flex flex-col sm:flex-row gap-3">
          
          <select 
            v-model="selectedMode"
            class="sm:w-1/2 bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-sky-500 focus:outline-none transition font-bold"
          >
            <option value="">-- Pilih Topik Tersimpan --</option>
            <option v-for="topik in availableTopics" :key="topik" :value="topik">📁 {{ topik }}</option>
            <option value="BARU" class="bg-sky-900 font-bold">➕ Buat Topik Baru...</option>
          </select>

          <input 
            v-if="selectedMode === 'BARU'"
            v-model="newTopicName" 
            type="text" 
            placeholder="Ketik topik baru (cth: Tokoh Daud)" 
            class="sm:w-1/2 bg-[#0f172a] border border-sky-500 border-dashed rounded-lg p-2.5 text-white focus:border-sky-400 focus:outline-none transition font-bold placeholder-gray-500"
          >

          <button @click="loadPenilaianData" class="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition whitespace-nowrap flex items-center justify-center gap-2">
            <span>🚀</span> Buka Tabel Nilai
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeTopic" class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col">
      <div class="border-b border-gray-800 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-lg font-bold text-sky-400">Menilai: <span class="text-white border-b-2 border-sky-500 pb-0.5">"{{ activeTopic }}"</span></h2>
          <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded mt-2 inline-block">Hari Ke-{{ selectedDay }} | Kelas 6-7</span>
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button @click="exportToPDF" class="flex-1 sm:flex-none bg-[#0f172a] border border-gray-700 hover:bg-sky-900 text-sky-400 px-4 py-2 rounded-lg transition text-sm font-bold flex items-center justify-center gap-2">
            📄 Cetak PDF
          </button>
          <button @click="markAllA" class="flex-1 sm:flex-none text-xs bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center justify-center gap-2 font-bold">
            ✅ Beri "A" Semua
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
      <div class="w-16 h-16 bg-sky-900/30 rounded-full flex items-center justify-center mb-4 border border-sky-500/30">
        <span class="text-3xl">📂</span>
      </div>
      <h3 class="text-lg font-bold text-gray-400">Ruang Penilaian Kustom</h3>
      <p class="text-sm text-gray-500 mt-2 max-w-md">Pilih topik yang sudah ada atau buat topik baru di panel atas untuk mulai memasukkan nilai anak-anak.</p>
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

// State Panel Kontrol
const selectedDay = ref(1)
const selectedMode = ref('')
const newTopicName = ref('')

// State Data Master
const availableTopics = ref([])
const activeTopic = ref('')
const allStudents = ref([])

// State UI
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

// 1. MENGAMBIL DAFTAR TOPIK YANG SUDAH PERNAH DIBUAT
const loadExistingTopics = async () => {
  // Ambil semua data hafalan untuk anak kelas 6 & 7 saja
  const { data: students } = await supabase.from('students').select('id').in('kelas', [6, 7])
  if (!students) return

  const studentIds = students.map(s => s.id)
  const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan').in('student_id', studentIds)

  if (hafalan) {
    // Saring agar namanya tidak duplikat
    const uniqueTopics = [...new Set(hafalan.map(h => h.jenis_hafalan))]
    
    // PENGAMAN: Jangan masukkan topik wajib milik Kak Ali
    const excludedTopics = ['Titah', 'Hata Haporseaon', 'Doa Bapa Kami']
    availableTopics.value = uniqueTopics.filter(t => !excludedTopics.includes(t))
  }
}

onMounted(() => {
  loadExistingTopics()
})

// 2. MENGAMBIL DATA PENILAIAN BERDASARKAN TOPIK & HARI
const loadPenilaianData = async () => {
  // Validasi Input
  let topicToLoad = ''
  if (selectedMode.value === 'BARU') {
    if (!newTopicName.value.trim()) return alert("Nama topik baru tidak boleh kosong!")
    topicToLoad = newTopicName.value.trim()
  } else if (selectedMode.value !== '') {
    topicToLoad = selectedMode.value
  } else {
    return alert("Silakan pilih topik atau buat topik baru terlebih dahulu!")
  }

  // Kunci topik yang akan dinilai
  activeTopic.value = topicToLoad
  currentPage.value = 1

  // Tambahkan ke dropdown jika itu topik baru dan belum ada di list
  if (selectedMode.value === 'BARU' && !availableTopics.value.includes(topicToLoad)) {
    availableTopics.value.push(topicToLoad)
    selectedMode.value = topicToLoad // Ubah dropdown otomatis ke topik baru tsb
    newTopicName.value = ''
  }

  // Ambil Data Murid
  const { data: students } = await supabase.from('students').select('*').in('kelas', [6, 7]).order('kelas', { ascending: true })
  
  // Ambil Data Nilai (Berdasarkan Topik dan Hari)
  const { data: hafalan } = await supabase
    .from('hafalan')
    .select('*')
    .eq('jenis_hafalan', activeTopic.value)
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

// Jika hari diganti, otomatis muat ulang data jika sedang ada topik aktif
const handleDayChange = () => {
  if (activeTopic.value) {
    loadPenilaianData()
  }
}

// === PAGINASI ===
const totalPages = computed(() => Math.ceil(allStudents.value.length / itemsPerPage))
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allStudents.value.slice(start, start + itemsPerPage)
})

// === FUNGSI SIMPAN KE DATABASE (Aman & Terisolasi) ===
const saveHafalan = async (student, isSilent = false) => {
  const skor = getPoint(student.status_nilai)
  
  const payload = { 
    student_id: student.id, 
    jenis_hafalan: activeTopic.value, // Menyimpan dengan nama Topik Kustom
    hari: selectedDay.value,        
    status_nilai: student.status_nilai, 
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

// Tandai Semua Anak
const markAllA = async () => {
  for (let student of allStudents.value) {
    if (student.status_nilai !== 'A') {
      student.status_nilai = 'A'
      await saveHafalan(student, true)
    }
  }
  showToast(`Semua anak Kelas 6-7 diberi Nilai A!`)
}

// === CETAK PDF ===
const exportToPDF = () => {
  const doc = new jsPDF()
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.text(`Penilaian Kustom: ${activeTopic.value}`, 14, 15)
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
    headStyles: { fillColor: [14, 165, 233] }, // Warna Biru Samuel
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