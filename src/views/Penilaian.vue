<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Penilaian Hafalan Titah</h1>
        <p class="text-sm text-gray-400 mt-1">Sistem Penilaian Otomatis (Auto-Save) - SIL HKBP Bengkalis</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button 
          @click="toggleSort" 
          class="bg-[#0f172a] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
        >
          <span class="text-sm">↕️ Urutkan: </span>
          <span class="font-bold text-teal-400">{{ sortDesc ? 'Kelas Besar-Kecil' : 'Kelas Kecil-Besar' }}</span>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button @click="exportToPDF('left')" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg transition shadow-lg text-sm font-medium">📄 Ekspor Kls 3-5</button>
        <button @click="exportToPDF('right')" class="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg transition shadow-lg text-sm font-medium">📄 Ekspor Kls 6-7</button>
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
        </div>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400">
                <th class="pb-3 font-medium px-2">Nama Lengkap</th>
                <th class="pb-3 font-medium px-2 w-16">Kelas</th>
                <th class="pb-3 font-medium px-2 w-32">Lulus Hari Ke-</th>
                <th class="pb-3 font-medium px-2 w-16 text-right">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedLeft.length === 0">
                <td colspan="4" class="text-center py-6 text-gray-500">Tidak ada data.</td>
              </tr>
              <tr v-for="student in paginatedLeft" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
                <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
                <td class="py-3 px-2"><span class="text-blue-400 font-bold">{{ student.kelas }}</span></td>
                <td class="py-3 px-2">
                  <select v-model="student.lulus_titah" @change="saveGrade(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs transition">
                    <option value="">Belum Lulus</option>
                    <option v-for="d in 7" :key="'titah'+d" :value="d">Hari {{ d }}</option>
                  </select>
                </td>
                <td class="py-3 px-2 text-right font-bold text-teal-400">
                  {{ hitungSkor(student.lulus_titah) || '-' }}
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
        </div>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400">
                <th class="pb-3 font-medium px-2">Nama Lengkap</th>
                <th class="pb-3 font-medium px-2 w-16">Kelas</th>
                <th class="pb-3 font-medium px-2 w-32">Lulus Hari Ke-</th>
                <th class="pb-3 font-medium px-2 w-16 text-right">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedRight.length === 0">
                <td colspan="4" class="text-center py-6 text-gray-500">Tidak ada data.</td>
              </tr>
              <tr v-for="student in paginatedRight" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
                <td class="py-3 px-2 text-gray-200 font-medium truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
                <td class="py-3 px-2"><span class="text-sky-400 font-bold">{{ student.kelas }}</span></td>
                <td class="py-3 px-2">
                  <select v-model="student.lulus_titah" @change="saveGrade(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-sky-500 focus:outline-none text-xs transition">
                    <option value="">Belum Lulus</option>
                    <option v-for="d in 7" :key="'titah'+d" :value="d">Hari {{ d }}</option>
                  </select>
                </td>
                <td class="py-3 px-2 text-right font-bold text-sky-400">
                  {{ hitungSkor(student.lulus_titah) || '-' }}
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

// === HITUNG SKOR BERDASARKAN ATURAN ===
// Hari 1=100, 2=97, 3=94, 4=91, 5=88, 6=85, 7=82
const hitungSkor = (hari) => {
  if (!hari) return null
  const poin = {1:100, 2:97, 3:94, 4:91, 5:88, 6:85, 7:82}
  return poin[hari] || 0
}

// === FUNGSI MENGAMBIL DATA ===
const fetchStudents = async () => {
  pageLeft.value = 1
  pageRight.value = 1
  
  // Ambil Data Murid
  const { data: students, error: err1 } = await supabase.from('students').select('*')
  
  // Ambil Data Hafalan khusus 'Titah'
  const { data: hafalan, error: err2 } = await supabase
    .from('hafalan')
    .select('*')
    .eq('jenis_hafalan', 'Titah')

  if (!err1 && !err2) {
    allStudents.value = students.map(student => {
      // Cari apakah murid ini sudah punya nilai Titah
      const existingHafalan = hafalan.find(h => h.student_id === student.id)
      return {
        ...student,
        lulus_titah: existingHafalan ? existingHafalan.lulus_hari_ke : '',
        hafalan_id: existingHafalan ? existingHafalan.id : null
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

// === FILTER KELAS 3,4,5 (KIRI) ===
const filteredLeft = computed(() => {
  let filtered = allStudents.value.filter(s => [3, 4, 5].includes(s.kelas))
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})
const totalPagesLeft = computed(() => Math.ceil(filteredLeft.value.length / itemsPerPage))
const paginatedLeft = computed(() => {
  const start = (pageLeft.value - 1) * itemsPerPage
  return filteredLeft.value.slice(start, start + itemsPerPage)
})

// === FILTER KELAS 6,7 (KANAN) ===
const filteredRight = computed(() => {
  let filtered = allStudents.value.filter(s => [6, 7].includes(s.kelas))
  return filtered.sort((a, b) => sortDesc.value ? b.kelas - a.kelas : a.kelas - b.kelas)
})
const totalPagesRight = computed(() => Math.ceil(filteredRight.value.length / itemsPerPage))
const paginatedRight = computed(() => {
  const start = (pageRight.value - 1) * itemsPerPage
  return filteredRight.value.slice(start, start + itemsPerPage)
})

// === FUNGSI AUTO-SAVE PENILAIAN ===
const saveGrade = async (student) => {
  const skor = hitungSkor(student.lulus_titah)
  
  // Jika diubah menjadi "Belum Lulus", kita bisa menghapus atau mengosongkan nilainya
  if (!student.lulus_titah) {
      if (student.hafalan_id) {
          await supabase.from('hafalan').delete().eq('id', student.hafalan_id)
          student.hafalan_id = null
          showToast(`Nilai dihapus: ${student.nama_lengkap}`)
      }
      return
  }

  const payload = { 
    student_id: student.id, 
    jenis_hafalan: 'Titah', 
    lulus_hari_ke: student.lulus_titah, 
    skor: skor 
  }

  // Jika sudah ada (Update)
  if (student.hafalan_id) {
    await supabase.from('hafalan').update(payload).eq('id', student.hafalan_id)
  } 
  // Jika belum ada (Insert)
  else {
    const { data } = await supabase.from('hafalan').insert(payload).select()
    if (data && data.length > 0) student.hafalan_id = data[0].id
  }

  showToast(`Tersimpan: ${student.nama_lengkap} (Skor: ${skor})`)
}

// === FUNGSI EXPORT PDF DINAMIS (DENGAN PREVIEW TAB BARU) ===
const exportToPDF = (mode) => {
  const doc = new jsPDF()
  
  // 1. MENDAPATKAN TANGGAL SAAT INI (Otomatis)
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // Judul Utama Dokumen
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0) // Hitam
  doc.text(`Rekap Penilaian Hafalan Titah - SIL HKBP`, 14, 15)
  
  // 2. MENAMBAHKAN TANGGAL CETAK DI BAWAH JUDUL
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100) // Warna abu-abu agar elegan
  doc.text(`Dicetak pada: ${tanggalSekarang} WIB`, 14, 22)
  
  let currentY = 30 

  // Render Tabel Kiri (Kelas 3-5)
  if (mode === 'all' || mode === 'left') {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0) // Kembalikan ke warna hitam
    doc.text('Kategori Kelas 3 - 5', 14, currentY)
    
    const bodyLeft = filteredLeft.value.map((s, idx) => [
      idx + 1, 
      s.nama_lengkap, 
      `Kelas ${s.kelas}`, 
      s.lulus_titah ? `Hari ${s.lulus_titah}` : 'Belum Lulus',
      hitungSkor(s.lulus_titah) || '0'
    ])
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['No', 'Nama Lengkap', 'Kelas', 'Lulus Hari Ke-', 'Nilai Akhir']],
      body: bodyLeft,
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] } // Warna Teal
    })
    
    // Update currentY agar tabel berikutnya berada di bawah tabel ini (jika mode 'all')
    currentY = doc.lastAutoTable.finalY + 15
  }

  // Render Tabel Kanan (Kelas 6-7)
  if (mode === 'all' || mode === 'right') {
    
    // Jika hanya klik 'right', paksa posisi teks mulai dari atas
    if (mode === 'right') {
      currentY = 30 
    } 
    // Jika mode 'all', pastikan sisa halamannya cukup. Jika mepet batas bawah (>270), buat halaman baru.
    else if (currentY > 270) {
      doc.addPage()
      currentY = 15
    }

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0) // Kembalikan ke warna hitam
    doc.text('Kategori Kelas 6 - 7', 14, currentY)
    
    const bodyRight = filteredRight.value.map((s, idx) => [
      idx + 1, 
      s.nama_lengkap, 
      `Kelas ${s.kelas}`, 
      s.lulus_titah ? `Hari ${s.lulus_titah}` : 'Belum Lulus',
      hitungSkor(s.lulus_titah) || '0'
    ])
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['No', 'Nama Lengkap', 'Kelas', 'Lulus Hari Ke-', 'Nilai Akhir']],
      body: bodyRight,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] } // Warna Sky Blue
    })
  }

  // 3. MENGUBAH NAMA FILE AGAR ADA TANGGALNYA
  const formatTanggalFile = new Date().toISOString().split('T')[0] 
  let fileName = `Nilai_Titah_SIL_${formatTanggalFile}`
  
  if (mode === 'left') fileName += `_Kls3-5`
  else if (mode === 'right') fileName += `_Kls6-7`
  else fileName += `_SemuaKelas`
  
  // === PREVIEW MODE: Buka PDF di Tab Baru ===
  // Mengubah data PDF menjadi format Blob
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  
  // Membuka tab baru yang berisi tampilan PDF
  window.open(pdfUrl, '_blank')
}
</script>