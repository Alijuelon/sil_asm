<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Laporan Akhir SIL HKBP 2026</h1>
        <p class="text-sm text-gray-400 mt-1">Rekapitulasi Nilai Keseluruhan (Absensi H1-H7, Titah, Hata Haporseaon)</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <label class="font-medium text-gray-400">Filter Kategori:</label>
        <select 
          v-model="filterCategory" 
          class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition"
        >
          <option value="all">Semua Kelas (3 - 7)</option>
          <option value="3-5">Kelas 3 - 5</option>
          <option value="6-7">Kelas 6 - 7</option>
        </select>
        <button @click="fetchAggregatedData" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-medium flex items-center gap-2">
          <span>🔄</span> Segarkan Data
        </button>
      </div>

      <button @click="exportToPDF" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition shadow-lg text-sm font-medium flex items-center gap-2">
        <span>📄</span> Unduh Laporan PDF
      </button>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-700 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-semibold rounded-tl-lg">No</th>
              <th class="p-3 font-semibold">Nama Lengkap</th>
              <th class="p-3 font-semibold text-center">Kelas</th>
              <th class="p-3 font-semibold text-center border-l border-gray-700">Rerata Hadir</th>
              <th class="p-3 font-semibold text-center">Skor Titah</th>
              <th class="p-3 font-semibold text-center">Skor Haporseaon</th>
              <th class="p-3 font-bold text-teal-400 text-center rounded-tr-lg bg-[#1e293b]">NILAI AKHIR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500">Memuat data atau tidak ada data tersedia...</td>
            </tr>
            <tr v-for="(student, index) in filteredStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500">{{ index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center"><span class="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">Kls {{ student.kelas }}</span></td>
              <td class="p-3 text-center border-l border-gray-800">{{ student.rerata_hadir }}</td>
              <td class="p-3 text-center">{{ student.skor_titah }}</td>
              <td class="p-3 text-center">{{ student.skor_haporseaon }}</td>
              <td class="p-3 text-center font-bold text-teal-400 bg-[#0f172a]/50">{{ student.nilai_akhir }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const filterCategory = ref('all')
const aggregatedStudents = ref([])

// Fungsi Mengambil & Menghitung Semua Data
const fetchAggregatedData = async () => {
  // 1. Ambil data murid
  const { data: students } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  // 2. Ambil data absensi
  const { data: attendance } = await supabase.from('attendance').select('*')
  // 3. Ambil data hafalan
  const { data: hafalan } = await supabase.from('hafalan').select('*')

  if (students) {
    aggregatedStudents.value = students.map(student => {
      // Hitung Rerata Absensi Harian (Maksimal 7 Hari)
      const studentAttendance = attendance?.filter(a => a.student_id === student.id) || []
      let totalAbsen = 0
      studentAttendance.forEach(a => totalAbsen += a.skor)
      // Dibagi 7 hari kegiatan
      const rerataHadir = studentAttendance.length > 0 ? Math.round(totalAbsen / 7) : 0 

      // Ambil Skor Titah & Haporseaon
      const studentHafalan = hafalan?.filter(h => h.student_id === student.id) || []
      const titah = studentHafalan.find(h => h.jenis_hafalan === 'Titah')
      const haporseaon = studentHafalan.find(h => h.jenis_hafalan === 'Hata Haporseaon')
      
      const skorTitah = titah ? titah.skor : 0
      const skorHaporseaon = haporseaon ? haporseaon.skor : 0

      // Hitung Nilai Akhir (Rata-rata dari ketiganya)
      const nilaiAkhir = Math.round((rerataHadir + skorTitah + skorHaporseaon) / 3)

      return {
        ...student,
        rerata_hadir: rerataHadir,
        skor_titah: skorTitah,
        skor_haporseaon: skorHaporseaon,
        nilai_akhir: nilaiAkhir
      }
    })
  }
}

onMounted(() => {
  fetchAggregatedData()
})

// Filter data berdasarkan Dropdown
const filteredStudents = computed(() => {
  if (filterCategory.value === '3-5') {
    return aggregatedStudents.value.filter(s => [3, 4, 5].includes(s.kelas))
  } else if (filterCategory.value === '6-7') {
    return aggregatedStudents.value.filter(s => [6, 7].includes(s.kelas))
  }
  return aggregatedStudents.value
})

// === FUNGSI EXPORT PDF FINAL ===
const exportToPDF = () => {
  const doc = new jsPDF()
  
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(`Laporan Akhir Nilai SIL HKBP Bengkalis 2026`, 14, 15)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  let textFilter = filterCategory.value === 'all' ? 'Semua Kelas (3-7)' : `Kelas ${filterCategory.value}`
  doc.text(`Kategori: ${textFilter} | Dicetak: ${tanggalSekarang} WIB`, 14, 22)
  
  // Mapping data untuk PDF
  const bodyData = filteredStudents.value.map((s, idx) => [
    idx + 1, 
    s.nama_lengkap, 
    `Kelas ${s.kelas}`, 
    s.rerata_hadir.toString(),
    s.skor_titah.toString(),
    s.skor_haporseaon.toString(),
    s.nilai_akhir.toString()
  ])
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Rerata Hadir', 'Skor Titah', 'Haporseaon', 'NILAI AKHIR']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] }, // Dark Slate color
    columnStyles: {
      0: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } // Highlight Nilai Akhir
    }
  })
  
  const formatTanggalFile = new Date().toISOString().split('T')[0] 
  doc.save(`Laporan_Akhir_SIL_${textFilter}_${formatTanggalFile}.pdf`)
}
</script>