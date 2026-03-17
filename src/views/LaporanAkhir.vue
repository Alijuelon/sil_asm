<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Laporan Akhir SIL HKBP 2026</h1>
        <p class="text-sm text-gray-400 mt-1">Rekapitulasi 8 Kategori Nilai Sesuai Format Resmi Panitia</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
        <label class="font-medium text-gray-400 text-sm">Filter Kelas:</label>
        <select 
          v-model="filterCategory" 
          class="flex-1 sm:flex-none bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition text-sm"
        >
          <option value="all">Semua Kelas (3 - 7)</option>
          <option value="3-5">Kelas 3 - 5</option>
          <option value="6-7">Kelas 6 - 7</option>
        </select>
        <button @click="fetchAggregatedData" class="w-full sm:w-auto bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-medium flex items-center justify-center gap-2">
          <span>🔄</span> Segarkan Data
        </button>
      </div>

      <button @click="exportToPDF" class="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition shadow-lg text-sm font-bold flex items-center justify-center gap-2">
        <span>📄</span> Cetak Laporan PDF
      </button>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg overflow-hidden flex flex-col">
      <div class="overflow-x-auto custom-scrollbar pb-3">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-700 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-semibold rounded-tl-lg border-r border-gray-800">No</th>
              <th class="p-3 font-semibold border-r border-gray-800">Nama Lengkap</th>
              <th class="p-3 font-semibold text-center border-r border-gray-800">Kelas</th>
              <th class="p-3 font-semibold text-center text-blue-300">Rerata<br>Hadir</th>
              <th class="p-3 font-semibold text-center text-teal-300">Rerata<br>Tugas</th>
              <th class="p-3 font-semibold text-center text-teal-300">Rerata<br>Bacaan</th>
              <th class="p-3 font-semibold text-center text-teal-300">Rerata<br>Kuis</th>
              <th class="p-3 font-semibold text-center text-teal-300 border-r border-gray-800">Rerata<br>Tontonan</th>
              <th class="p-3 font-semibold text-center text-sky-300">Doa Bapa<br>Kami</th>
              <th class="p-3 font-semibold text-center text-sky-300">Iman<br>Rasuli</th>
              <th class="p-3 font-semibold text-center text-sky-300 border-r border-gray-800">Titah</th>
              <th class="p-3 font-bold text-white text-center rounded-tr-lg bg-teal-600">NILAI<br>AKHIR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="12" class="text-center py-8 text-gray-500">Memuat data atau tidak ada data tersedia...</td>
            </tr>
            <tr v-for="(student, index) in filteredStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500 border-r border-gray-800/50">{{ index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium border-r border-gray-800/50">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center border-r border-gray-800/50"><span class="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">Kls {{ student.kelas }}</span></td>
              
              <td class="p-3 text-center font-bold text-blue-400 bg-blue-900/10">{{ student.rerata_hadir }}</td>
              
              <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_tugas }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_bacaan }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_kuis }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10 border-r border-gray-800/50">{{ student.rerata_tontonan }}</td>
              
              <td class="p-3 text-center text-sky-400 bg-sky-900/10">{{ student.skor_doa }}</td>
              <td class="p-3 text-center text-sky-400 bg-sky-900/10">{{ student.skor_haporseaon }}</td>
              <td class="p-3 text-center text-sky-400 bg-sky-900/10 border-r border-gray-800/50">{{ student.skor_titah }}</td>
              
              <td class="p-3 text-center font-black text-white bg-teal-600/80 text-base shadow-inner">{{ student.nilai_akhir }}</td>
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

// Helper: Konversi Nilai Huruf ke Angka untuk Tugas Harian
const getPoint = (grade) => {
  if (grade === 'A') return 95
  if (grade === 'B') return 85
  if (grade === 'C') return 70
  return 0
}

// === FUNGSI MASTER PENGAMBIL DATA ===
const fetchAggregatedData = async () => {
  const { data: students } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  const { data: attendance } = await supabase.from('attendance').select('*')
  const { data: tugas } = await supabase.from('tugas').select('*')
  const { data: hafalan } = await supabase.from('hafalan').select('*')

  if (students) {
    aggregatedStudents.value = students.map(student => {
      
      // 1. HITUNG RERATA ABSENSI (Dibagi 7 Hari)
      const studentAttendance = attendance?.filter(a => a.student_id === student.id) || []
      let totalAbsen = 0
      studentAttendance.forEach(a => totalAbsen += a.skor)
      const rerataHadir = Math.round(totalAbsen / 7) 

      // 2. HITUNG RERATA 4 TUGAS HARIAN (Dibagi 7 Hari)
      const studentTugas = tugas?.filter(t => t.student_id === student.id) || []
      let sTugas = 0, sBacaan = 0, sKuis = 0, sTontonan = 0
      
      studentTugas.forEach(t => {
        sTugas += getPoint(t.tugas_harian)
        sBacaan += getPoint(t.reviu_bacaan)
        sKuis += getPoint(t.kuis)
        sTontonan += getPoint(t.reviu_tontonan)
      })

      const rerataTugas = Math.round(sTugas / 7)
      const rerataBacaan = Math.round(sBacaan / 7)
      const rerataKuis = Math.round(sKuis / 7)
      const rerataTontonan = Math.round(sTontonan / 7)

      // 3. AMBIL SKOR 3 HAFALAN
      const studentHafalan = hafalan?.filter(h => h.student_id === student.id) || []
      const doa = studentHafalan.find(h => h.jenis_hafalan === 'Doa Bapa Kami')
      const haporseaon = studentHafalan.find(h => h.jenis_hafalan === 'Hata Haporseaon')
      const titah = studentHafalan.find(h => h.jenis_hafalan === 'Titah')
      
      const skorDoa = doa ? doa.skor : 0
      const skorHaporseaon = haporseaon ? haporseaon.skor : 0
      const skorTitah = titah ? titah.skor : 0

      // 4. HITUNG NILAI AKHIR (Rata-rata dari 8 Komponen)
      const totalSemua = rerataHadir + rerataTugas + rerataBacaan + rerataKuis + rerataTontonan + skorDoa + skorHaporseaon + skorTitah
      const nilaiAkhir = Math.round(totalSemua / 8)

      return {
        ...student,
        rerata_hadir: rerataHadir,
        rerata_tugas: rerataTugas,
        rerata_bacaan: rerataBacaan,
        rerata_kuis: rerataKuis,
        rerata_tontonan: rerataTontonan,
        skor_doa: skorDoa,
        skor_haporseaon: skorHaporseaon,
        skor_titah: skorTitah,
        nilai_akhir: nilaiAkhir
      }
    })
  }
}

onMounted(() => {
  fetchAggregatedData()
})

const filteredStudents = computed(() => {
  if (filterCategory.value === '3-5') {
    return aggregatedStudents.value.filter(s => [3, 4, 5].includes(s.kelas))
  } else if (filterCategory.value === '6-7') {
    return aggregatedStudents.value.filter(s => [6, 7].includes(s.kelas))
  }
  return aggregatedStudents.value
})

// === FUNGSI EXPORT PDF FINAL (LANDSCAPE UNTUK 12 KOLOM) ===
const exportToPDF = () => {
  // Menggunakan orientasi 'landscape' agar semua kolom muat
  const doc = new jsPDF('landscape')
  
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(`FORMAT REKAP PENILAIAN SIL HKBP BENGKALIS 2026`, 14, 15)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  let textFilter = filterCategory.value === 'all' ? 'Semua Kelas (3-7)' : `Kategori: Kelas ${filterCategory.value}`
  doc.text(`${textFilter} | Dicetak: ${tanggalSekarang}`, 14, 22)
  
  // Mapping data untuk PDF
  const bodyData = filteredStudents.value.map((s, idx) => [
    idx + 1, 
    s.nama_lengkap, 
    `Kls ${s.kelas}`, 
    s.rerata_hadir.toString(),
    s.rerata_tugas.toString(),
    s.rerata_bacaan.toString(),
    s.rerata_kuis.toString(),
    s.rerata_tontonan.toString(),
    s.skor_doa.toString(),
    s.skor_haporseaon.toString(),
    s.skor_titah.toString(),
    s.nilai_akhir.toString()
  ])
  
  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Anak', 'Kelas', 'Kehadiran', 'Tugas Harian', 'Reviu Bacaan', 'Kuis', 'Reviu Tontonan', 'Doa Bapa Kami', 'Iman Rasuli', 'Titah', 'NILAI AKHIR']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], halign: 'center', fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 40 }, // Nama butuh ruang ekstra
      2: { halign: 'center', cellWidth: 15 },
      // Set semua kolom nilai ke rata tengah
      3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' },
      6: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' },
      9: { halign: 'center' }, 10: { halign: 'center' },
      11: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } // Highlight Nilai Akhir
    }
  })
  
  const formatTanggalFile = new Date().toISOString().split('T')[0] 
  const fileName = `Rekap_Penilaian_SIL_${filterCategory.value}_${formatTanggalFile}`
  
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #475569; }
</style>