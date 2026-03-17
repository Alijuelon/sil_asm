<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-sky-400">Penilaian Topik Kustom</h1>
        <p class="text-sm text-gray-400 mt-1">Buat dan kelola jenis penilaian tambahan (Aman dari data utama)</p>
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

    <div v-if="activeTopic">
      <div class="bg-[#151e32] border border-gray-800 p-4 rounded-xl shadow-lg mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h2 class="text-lg font-bold text-sky-400">Menilai: <span class="text-white border-b border-sky-500">"{{ activeTopic }}"</span> <span class="text-gray-500 text-sm ml-2">(Hari Ke-{{ selectedDay }})</span></h2>
        
        <div class="flex gap-2 w-full sm:w-auto">
          <button @click="exportToPDF('left')" class="bg-[#0f172a] border border-gray-700 hover:bg-sky-900 text-sky-400 px-3 py-1.5 rounded transition text-sm font-medium">📄 Kls 3-5</button>
          <button @click="exportToPDF('right')" class="bg-[#0f172a] border border-gray-700 hover:bg-sky-900 text-sky-400 px-3 py-1.5 rounded transition text-sm font-medium">📄 Kls 6-7</button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-bold text-teal-400">👦👧 Kategori Kelas 3 - 5</h2>
              <span class="text-xs bg-teal-900/50 text-teal-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredLeft.length }} Anak</span>
            </div>
            <button @click="markAllA('left')" class="text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg shadow transition font-bold">
              ✅ Beri Nilai A
            </button>
          </div>

          <div class="overflow-x-auto custom-scrollbar flex-1 pb-2">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr class="border-b border-gray-800 text-gray-400">
                  <th class="pb-3 font-medium px-2 min-w-[140px]">Nama Lengkap</th>
                  <th class="pb-3 font-medium px-2 min-w-[70px] text-center">Kelas</th>
                  <th class="pb-3 font-medium px-2 min-w-[120px]">Nilai</th>
                  <th class="pb-3 font-medium px-2 min-w-[50px] text-center">Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedLeft.length === 0">
                  <td colspan="4" class="text-center py-6 text-gray-500">Tidak ada data.</td>
                </tr>
                <tr v-for="student in paginatedLeft" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
                  <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
                  <td class="py-3 px-2 text-center"><span class="text-teal-400 font-bold bg-teal-900/30 px-2 py-1 rounded">Kls {{ student.kelas }}</span></td>
                  <td class="py-3 px-2">
                    <select v-model="student.status_nilai" @change="saveHafalan(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-1.5 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                      <option value="Belum">Belum Dinilai</option>
                      <option value="A">Nilai A (95)</option>
                      <option value="B">Nilai B (85)</option>
                      <option value="C">Nilai C (70)</option>
                    </select>
                  </td>
                  <td class="py-3 px-2 text-center font-bold text-teal-400">{{ getPoint(student.status_nilai) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
            <button @click="pageLeft--" :disabled="pageLeft === 1" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Prev</button>
            <span class="text-xs text-gray-500">Hal {{ pageLeft }} dari {{ totalPagesLeft || 1 }}</span>
            <button @click="pageLeft++" :disabled="pageLeft === totalPagesLeft || totalPagesLeft === 0" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Next</button>
          </div>
        </div>

        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-bold text-sky-400">🧑👩 Kategori Kelas 6 - 7</h2>
              <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredRight.length }} Anak</span>
            </div>
            <button @click="markAllA('right')" class="text-xs bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg shadow transition font-bold">
              ✅ Beri Nilai A
            </button>
          </div>

          <div class="overflow-x-auto custom-scrollbar flex-1 pb-2">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr class="border-b border-gray-800 text-gray-400">
                  <th class="pb-3 font-medium px-2 min-w-[140px]">Nama Lengkap</th>
                  <th class="pb-3 font-medium px-2 min-w-[70px] text-center">Kelas</th>
                  <th class="pb-3 font-medium px-2 min-w-[120px]">Nilai</th>
                  <th class="pb-3 font-medium px-2 min-w-[50px] text-center">Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedRight.length === 0">
                  <td colspan="4" class="text-center py-6 text-gray-500">Tidak ada data.</td>
                </tr>
                <tr v-for="student in paginatedRight" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
                  <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
                  <td class="py-3 px-2 text-center"><span class="text-sky-400 font-bold bg-sky-900/30 px-2 py-1 rounded">Kls {{ student.kelas }}</span></td>
                  <td class="py-3 px-2">
                    <select v-model="student.status_nilai" @change="saveHafalan(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-1.5 text-white focus:border-sky-500 focus:outline-none text-xs transition">
                      <option value="Belum">Belum Dinilai</option>
                      <option value="A">Nilai A (95)</option>
                      <option value="B">Nilai B (85)</option>
                      <option value="C">Nilai C (70)</option>
                    </select>
                  </td>
                  <td class="py-3 px-2 text-center font-bold text-sky-400">{{ getPoint(student.status_nilai) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
            <button @click="pageRight--" :disabled="pageRight === 1" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Prev</button>
            <span class="text-xs text-gray-500">Hal {{ pageRight }} dari {{ totalPagesRight || 1 }}</span>
            <button @click="pageRight++" :disabled="pageRight === totalPagesRight || totalPagesRight === 0" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Next</button>
          </div>
        </div>

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

// State Panel
const selectedDay = ref(1)
const selectedMode = ref('')
const newTopicName = ref('')

// State Data Master
const availableTopics = ref([])
const activeTopic = ref('')
const allStudents = ref([])

// State UI
const toastMsg = ref('')
const pageLeft = ref(1)
const pageRight = ref(1)
const itemsPerPage = 10 

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => toastMsg.value = '', 2000)
}

const getPoint = (grade) => {
  if (grade === 'A') return 95
  if (grade === 'B') return 85
  if (grade === 'C') return 70
  return 0
}

// 1. AMBIL DAFTAR TOPIK CUSTOM YANG SUDAH PERNAH ADA
const loadExistingTopics = async () => {
  // Ambil SEMUA data hafalan (Pagar pengaman adalah membuang nama topik utama)
  const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan')

  if (hafalan) {
    const uniqueTopics = [...new Set(hafalan.map(h => h.jenis_hafalan))]
    // INI PAGAR PENGAMANNYA: Jangan masukkan Titah, Haporseaon, Doa Bapa Kami
    const excludedTopics = ['Titah', 'Hata Haporseaon', 'Doa Bapa Kami']
    availableTopics.value = uniqueTopics.filter(t => !excludedTopics.includes(t))
  }
}

onMounted(() => loadExistingTopics())

// 2. MUAT DATA MURID KIRI & KANAN (Aman karena nama topik kustom)
const loadPenilaianData = async () => {
  let topicToLoad = ''
  if (selectedMode.value === 'BARU') {
    if (!newTopicName.value.trim()) return alert("Nama topik baru tidak boleh kosong!")
    
    // Pagar Pengaman Ekstra: Cegah Bang Samuel bikin topik dengan nama "Titah"
    const forbidden = ['titah', 'hata haporseaon', 'doa bapa kami']
    if (forbidden.includes(newTopicName.value.trim().toLowerCase())) {
      return alert("Nama topik dilarang! Topik ini sudah dipakai sistem.")
    }
    
    topicToLoad = newTopicName.value.trim()
  } else if (selectedMode.value !== '') {
    topicToLoad = selectedMode.value
  } else {
    return alert("Silakan pilih topik atau buat topik baru terlebih dahulu!")
  }

  activeTopic.value = topicToLoad
  pageLeft.value = 1
  pageRight.value = 1

  if (selectedMode.value === 'BARU' && !availableTopics.value.includes(topicToLoad)) {
    availableTopics.value.push(topicToLoad)
    selectedMode.value = topicToLoad 
    newTopicName.value = ''
  }

  // Tarik SEMUA murid
  const { data: students } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  
  // Tarik nilai berdasarkan TOPIK KUSTOM dan HARI
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

const handleDayChange = () => {
  if (activeTopic.value) loadPenilaianData()
}

// === COMPUTED KELAS KIRI (3-5) ===
const filteredLeft = computed(() => allStudents.value.filter(s => [3, 4, 5].includes(s.kelas)))
const totalPagesLeft = computed(() => Math.ceil(filteredLeft.value.length / itemsPerPage))
const paginatedLeft = computed(() => {
  const start = (pageLeft.value - 1) * itemsPerPage
  return filteredLeft.value.slice(start, start + itemsPerPage)
})

// === COMPUTED KELAS KANAN (6-7) ===
const filteredRight = computed(() => allStudents.value.filter(s => [6, 7].includes(s.kelas)))
const totalPagesRight = computed(() => Math.ceil(filteredRight.value.length / itemsPerPage))
const paginatedRight = computed(() => {
  const start = (pageRight.value - 1) * itemsPerPage
  return filteredRight.value.slice(start, start + itemsPerPage)
})

// === FUNGSI SIMPAN AMAN ===
const saveHafalan = async (student, isSilent = false) => {
  const skor = getPoint(student.status_nilai)
  
  const payload = { 
    student_id: student.id, 
    jenis_hafalan: activeTopic.value, 
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

// === TANDAI A SEMUA PER KOLOM ===
const markAllA = async (section) => {
  const listToUpdate = section === 'left' ? filteredLeft.value : filteredRight.value
  for (let student of listToUpdate) {
    if (student.status_nilai !== 'A') {
      student.status_nilai = 'A'
      await saveHafalan(student, true)
    }
  }
  showToast(`Semua anak Kelas ${section === 'left' ? '3-5' : '6-7'} diberi Nilai A!`)
}

// === EXPORT PDF ===
const exportToPDF = (mode) => {
  const doc = new jsPDF()
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.text(`Penilaian Kustom: ${activeTopic.value}`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  
  let labelKelas = mode === 'left' ? 'Kelas 3-5' : 'Kelas 6-7'
  let targetData = mode === 'left' ? filteredLeft.value : filteredRight.value
  
  doc.text(`Kategori: ${labelKelas} | Kegiatan Hari Ke-${selectedDay.value}`, 14, 22)
  doc.text(`Dicetak pada: ${tanggal}`, 14, 27)
  
  const bodyData = targetData.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, s.status_nilai, getPoint(s.status_nilai)
  ])
  
  autoTable(doc, {
    startY: 32,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Nilai Huruf', 'Skor Angka']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: mode === 'left' ? [20, 184, 166] : [14, 165, 233] }, 
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
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #475569; }
</style>