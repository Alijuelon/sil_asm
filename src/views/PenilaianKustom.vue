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
        <label class="font-medium text-sky-300 text-sm">Hari Kegiatan:</label>
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
            placeholder="Ketik topik (cth: Tokoh Daud)" 
            class="sm:w-1/2 bg-[#0f172a] border border-sky-500 border-dashed rounded-lg p-2.5 text-white focus:border-sky-400 focus:outline-none transition font-bold placeholder-gray-500"
          >

          <button @click="loadPenilaianData" class="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition whitespace-nowrap flex items-center justify-center gap-2">
            <span>🚀</span> Buka Tabel Nilai
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeTopic">
      
      <div class="bg-[#151e32] border border-gray-800 p-4 rounded-xl shadow-lg mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div class="flex items-center flex-wrap gap-3">
          <h2 class="text-lg font-bold text-sky-400">
            Menilai: <span class="text-white border-b border-sky-500">"{{ activeTopic }}"</span> 
            <span class="text-gray-500 text-sm ml-2">(H-{{ selectedDay }})</span>
          </h2>
          <button @click="deleteTopic" class="text-xs bg-red-900/40 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg border border-red-800/50 transition flex items-center gap-1 font-bold">
            🗑️ Hapus Topik
          </button>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div class="flex flex-wrap gap-1 bg-[#0f172a] border border-gray-700 p-1.5 rounded-lg">
            <span class="text-xs text-gray-500 font-bold px-2 py-1.5">Kls 3-5:</span>
            <button @click="exportToPDF('left')" class="bg-teal-900/30 text-teal-400 hover:bg-teal-800 px-3 py-1.5 rounded transition text-xs font-medium">📄 H-{{ selectedDay }}</button>
            <button @click="export7DaysPDF('left')" class="bg-teal-600 text-white hover:bg-teal-700 px-3 py-1.5 rounded transition text-xs font-bold shadow-md">📑 Rekap 7 Hari</button>
          </div>
          
          <div class="flex flex-wrap gap-1 bg-[#0f172a] border border-gray-700 p-1.5 rounded-lg">
            <span class="text-xs text-gray-500 font-bold px-2 py-1.5">Kls 6-7:</span>
            <button @click="exportToPDF('right')" class="bg-sky-900/30 text-sky-400 hover:bg-sky-800 px-3 py-1.5 rounded transition text-xs font-medium">📄 H-{{ selectedDay }}</button>
            <button @click="export7DaysPDF('right')" class="bg-sky-600 text-white hover:bg-sky-700 px-3 py-1.5 rounded transition text-xs font-bold shadow-md">📑 Rekap 7 Hari</button>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg font-bold text-teal-400">👦👧 Kelas 3 - 5</h2>
              <span class="text-xs bg-teal-900/50 text-teal-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredLeft.length }} Anak</span>
            </div>
            <button @click="markAllToday('left')" class="text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg shadow transition font-bold text-center">
              ✅ Set Hapal Hari {{ selectedDay }}
            </button>
          </div>

          <div class="overflow-x-auto custom-scrollbar flex-1 pb-2">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
                  <th class="p-2 font-medium rounded-tl-lg min-w-[140px]">Nama Lengkap</th>
                  <th class="p-2 font-medium min-w-[60px] text-center">Kelas</th>
                  <th class="p-2 font-medium min-w-[160px]">Status Penilaian</th>
                  <th class="p-2 font-medium rounded-tr-lg min-w-[50px] text-center">Skor</th>
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
                      <option value="Belum">-- Pilih Nilai --</option>
                      <optgroup label="Sesuai Hari Setor (Hafalan)">
                        <option value="Hari 1">Lancar Hari 1 (100)</option>
                        <option value="Hari 2">Lancar Hari 2 (97)</option>
                        <option value="Hari 3">Lancar Hari 3 (94)</option>
                        <option value="Hari 4">Lancar Hari 4 (91)</option>
                        <option value="Hari 5">Lancar Hari 5 (88)</option>
                        <option value="Hari 6">Lancar Hari 6 (85)</option>
                        <option value="Hari 7">Lancar Hari 7 (82)</option>
                      </optgroup>
                      <optgroup label="Indikator Huruf (Tugas)">
                        <option value="A">Nilai A (95)</option>
                        <option value="B">Nilai B (85)</option>
                        <option value="C">Nilai C (75)</option>
                        <option value="D">Nilai D (65)</option>
                      </optgroup>
                    </select>
                  </td>
                  <td class="py-3 px-2 text-center font-bold text-teal-400 bg-[#0f172a]/30">{{ getPoint(student.status_nilai) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
            <button @click="pageLeft--" :disabled="pageLeft === 1" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Sebelumnya</button>
            <span class="text-xs text-gray-500 font-medium">Halaman {{ pageLeft }} dari {{ totalPagesLeft || 1 }}</span>
            <button @click="pageLeft++" :disabled="pageLeft === totalPagesLeft || totalPagesLeft === 0" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Selanjutnya</button>
          </div>
        </div>

        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg font-bold text-sky-400">🧑👩 Kelas 6 - 7</h2>
              <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded mt-1 inline-block">Total: {{ filteredRight.length }} Anak</span>
            </div>
            <button @click="markAllToday('right')" class="text-xs bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-lg shadow transition font-bold text-center">
              ✅ Set Hapal Hari {{ selectedDay }}
            </button>
          </div>

          <div class="overflow-x-auto custom-scrollbar flex-1 pb-2">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
                  <th class="p-2 font-medium rounded-tl-lg min-w-[140px]">Nama Lengkap</th>
                  <th class="p-2 font-medium min-w-[60px] text-center">Kelas</th>
                  <th class="p-2 font-medium min-w-[160px]">Status Penilaian</th>
                  <th class="p-2 font-medium rounded-tr-lg min-w-[50px] text-center">Skor</th>
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
                      <option value="Belum">-- Pilih Nilai --</option>
                      <optgroup label="Sesuai Hari Setor (Hafalan)">
                        <option value="Hari 1">Lancar Hari 1 (100)</option>
                        <option value="Hari 2">Lancar Hari 2 (97)</option>
                        <option value="Hari 3">Lancar Hari 3 (94)</option>
                        <option value="Hari 4">Lancar Hari 4 (91)</option>
                        <option value="Hari 5">Lancar Hari 5 (88)</option>
                        <option value="Hari 6">Lancar Hari 6 (85)</option>
                        <option value="Hari 7">Lancar Hari 7 (82)</option>
                      </optgroup>
                      <optgroup label="Indikator Huruf (Tugas)">
                        <option value="A">Nilai A (95)</option>
                        <option value="B">Nilai B (85)</option>
                        <option value="C">Nilai C (75)</option>
                        <option value="D">Nilai D (65)</option>
                      </optgroup>
                    </select>
                  </td>
                  <td class="py-3 px-2 text-center font-bold text-sky-400 bg-[#0f172a]/30">{{ getPoint(student.status_nilai) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 flex flex-wrap items-center justify-between border-t border-gray-800 pt-4 gap-2">
            <button @click="pageRight--" :disabled="pageRight === 1" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Sebelumnya</button>
            <span class="text-xs text-gray-500 font-medium">Halaman {{ pageRight }} dari {{ totalPagesRight || 1 }}</span>
            <button @click="pageRight++" :disabled="pageRight === totalPagesRight || totalPagesRight === 0" class="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm">Selanjutnya</button>
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
      <span>{{ toastIcon }}</span> {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const selectedDay = ref(1)
const selectedMode = ref('')
const newTopicName = ref('')

const availableTopics = ref([])
const activeTopic = ref('')
const allStudents = ref([])

const toastMsg = ref('')
const toastIcon = ref('💾')
const pageLeft = ref(1)
const pageRight = ref(1)
const itemsPerPage = 10 

const showToast = (message, icon = '💾') => {
  toastMsg.value = message
  toastIcon.value = icon
  setTimeout(() => toastMsg.value = '', 3000)
}

const getPoint = (grade) => {
  switch (grade) {
    case 'Hari 1': return 100
    case 'Hari 2': return 97
    case 'Hari 3': return 94
    case 'Hari 4': return 91
    case 'Hari 5': return 88
    case 'Hari 6': return 85
    case 'Hari 7': return 82
    case 'A': return 95
    case 'B': return 85
    case 'C': return 75
    case 'D': return 65
    default: return 0
  }
}

const loadExistingTopics = async () => {
  const { data: hafalan } = await supabase.from('hafalan').select('jenis_hafalan')

  if (hafalan) {
    const uniqueTopics = [...new Set(hafalan.map(h => h.jenis_hafalan))]
    const excludedTopics = ['Titah', 'Hata Haporseaon', 'Doa Bapa Kami']
    availableTopics.value = uniqueTopics.filter(t => !excludedTopics.includes(t))
  }
}

onMounted(() => loadExistingTopics())

const loadPenilaianData = async () => {
  let topicToLoad = ''
  if (selectedMode.value === 'BARU') {
    if (!newTopicName.value.trim()) return alert("Nama topik baru tidak boleh kosong!")
    
    const forbidden = ['titah', 'hata haporseaon', 'doa bapa kami']
    if (forbidden.includes(newTopicName.value.trim().toLowerCase())) {
      return alert("Nama topik dilarang! Topik ini sudah dipakai oleh sistem utama.")
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

  const { data: students } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  
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

// === FITUR HAPUS TOPIK ===
const deleteTopic = async () => {
  if (!activeTopic.value) return
  
  const confirmDelete = confirm(`⚠️ PERINGATAN!\n\nApakah Anda yakin ingin menghapus topik "${activeTopic.value}"?\nSeluruh data nilai anak-anak di topik ini (dari Hari 1 sampai 7) akan hilang permanen!`)
  
  if (confirmDelete) {
    // Hapus dari database Supabase
    const { error } = await supabase.from('hafalan').delete().eq('jenis_hafalan', activeTopic.value)
    
    if (error) {
      alert("Gagal menghapus topik: " + error.message)
      return
    }

    // Update UI
    availableTopics.value = availableTopics.value.filter(t => t !== activeTopic.value)
    activeTopic.value = ''
    selectedMode.value = ''
    showToast('Topik berhasil dihapus!', '🗑️')
  }
}

const filteredLeft = computed(() => allStudents.value.filter(s => [3, 4, 5].includes(s.kelas)))
const totalPagesLeft = computed(() => Math.ceil(filteredLeft.value.length / itemsPerPage))
const paginatedLeft = computed(() => {
  const start = (pageLeft.value - 1) * itemsPerPage
  return filteredLeft.value.slice(start, start + itemsPerPage)
})

const filteredRight = computed(() => allStudents.value.filter(s => [6, 7].includes(s.kelas)))
const totalPagesRight = computed(() => Math.ceil(filteredRight.value.length / itemsPerPage))
const paginatedRight = computed(() => {
  const start = (pageRight.value - 1) * itemsPerPage
  return filteredRight.value.slice(start, start + itemsPerPage)
})

const saveHafalan = async (student, isSilent = false) => {
  if (student.status_nilai === 'Belum') return

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

const markAllToday = async (section) => {
  const targetGrade = `Hari ${selectedDay.value}`
  const listToUpdate = section === 'left' ? filteredLeft.value : filteredRight.value
  
  for (let student of listToUpdate) {
    if (student.status_nilai !== targetGrade) {
      student.status_nilai = targetGrade
      await saveHafalan(student, true)
    }
  }
  showToast(`Semua anak otomatis ditandai Lancar Hari ${selectedDay.value}!`)
}

// === CETAK PDF PER HARI ===
const exportToPDF = (mode) => {
  const doc = new jsPDF()
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.text(`Penilaian: ${activeTopic.value}`, 14, 15)
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
    head: [['No', 'Nama Lengkap', 'Kelas', 'Nilai/Hari', 'Skor Angka']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: mode === 'left' ? [20, 184, 166] : [14, 165, 233] }, 
    columnStyles: {
      0: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center', fontStyle: 'bold' }
    }
  })
  
  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}

// === CETAK PDF REKAP 7 HARI ===
const export7DaysPDF = async (mode) => {
  const doc = new jsPDF()
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  // Ambil semua data dari hari 1-7 khusus topik ini
  const { data: allHafalan, error } = await supabase
    .from('hafalan')
    .select('*')
    .eq('jenis_hafalan', activeTopic.value)

  if (error) {
    alert("Gagal mengambil rekap data!")
    return
  }

  doc.setFontSize(16)
  doc.text(`Rekap 7 Hari Penilaian: ${activeTopic.value}`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  
  let labelKelas = mode === 'left' ? 'Kelas 3-5' : 'Kelas 6-7'
  let targetData = mode === 'left' ? filteredLeft.value : filteredRight.value
  
  doc.text(`Kategori: ${labelKelas} | Seluruh Hari Kegiatan`, 14, 22)
  doc.text(`Dicetak pada: ${tanggal}`, 14, 27)
  
  // Mapping matrix data untuk 7 hari
  const bodyData = targetData.map((student, idx) => {
    let row = [idx + 1, student.nama_lengkap, `Kls ${student.kelas}`]
    
    // Looping mencari skor hari ke 1 sampai 7
    for(let d = 1; d <= 7; d++) {
      let record = allHafalan.find(h => h.student_id === student.id && h.hari === d)
      row.push(record ? record.skor : '-')
    }
    return row
  })
  
  autoTable(doc, {
    startY: 32,
    head: [['No', 'Nama', 'Kls', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: mode === 'left' ? [20, 184, 166] : [14, 165, 233] }, 
    columnStyles: {
      0: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' },
      6: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' },
      9: { halign: 'center' }
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