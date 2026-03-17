<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Laporan Akhir SIL HKBP 2026</h1>
        <p class="text-sm text-gray-400 mt-1">Rekapitulasi Nilai Semua Kelas (3 - 7) Selama 7 Hari Kegiatan</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
        <div class="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <span class="text-lg">📊</span>
          <span class="font-bold text-teal-400 text-sm">Total Data: {{ aggregatedStudents.length }} Anak</span>
        </div>
        
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
              <th class="p-3 font-semibold rounded-tl-lg border-r border-gray-800 w-10 text-center">No</th>
              <th class="p-3 font-semibold border-r border-gray-800 min-w-[150px]">Nama Lengkap</th>
              <th class="p-3 font-semibold text-center border-r border-gray-800 w-20">Kelas</th>
              
              <th class="p-3 font-semibold text-center text-blue-300">Rerata<br>Hadir</th>
              <th class="p-3 font-semibold text-center text-teal-300">Rerata<br>Tugas</th>
              <th class="p-3 font-semibold text-center text-teal-300">Rerata<br>Bacaan</th>
              <th class="p-3 font-semibold text-center text-teal-300">Rerata<br>Kuis</th>
              <th class="p-3 font-semibold text-center text-teal-300 border-r border-gray-800">Rerata<br>Tontonan</th>
              
              <th class="p-3 font-semibold text-center text-sky-300">Hafalan<br>Titah</th>
              <th class="p-3 font-semibold text-center text-sky-300 border-r border-gray-800">Hata<br>Haporseaon</th>
              
              <th class="p-3 font-bold text-white text-center rounded-tr-lg bg-teal-600 w-24">NILAI<br>AKHIR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="aggregatedStudents.length === 0">
              <td colspan="11" class="text-center py-8 text-gray-500">Memuat data atau belum ada data masuk...</td>
            </tr>
            <tr v-for="(student, index) in aggregatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500 border-r border-gray-800/50 text-center">{{ index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium border-r border-gray-800/50">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center border-r border-gray-800/50">
                <span :class="student.kelas <= 5 ? 'bg-teal-900/50 text-teal-300 border-teal-800/30' : 'bg-sky-900/50 text-sky-300 border-sky-800/30'" class="px-2 py-1 rounded text-xs font-bold border">
                  Kls {{ student.kelas }}
                </span>
              </td>
              
              <td class="p-3 text-center font-bold text-blue-400 bg-blue-900/10">{{ student.rerata_hadir }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_tugas }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_bacaan }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_kuis }}</td>
              <td class="p-3 text-center text-teal-400 bg-teal-900/10 border-r border-gray-800/50">{{ student.rerata_tontonan }}</td>
              
              <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10">{{ student.skor_titah || '-' }}</td>
              <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10 border-r border-gray-800/50">{{ student.skor_haporseaon || '-' }}</td>
              
              <td class="p-3 text-center font-black text-white bg-teal-600/80 text-base shadow-inner border border-teal-700/50">
                {{ student.nilai_akhir }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const aggregatedStudents = ref([])

// Helper: Konversi Huruf ke Angka untuk Tugas Harian
const getPoint = (grade) => {
  if (grade === 'A') return 95
  if (grade === 'B') return 85
  if (grade === 'C') return 70
  return 0
}

// === FUNGSI PENGAMBIL DAN PENGHITUNG DATA (SEMUA KELAS 3 - 7) ===
const fetchAggregatedData = async () => {
  // 1. Ambil murid Kelas 3, 4, 5, 6, 7
  const { data: students } = await supabase.from('students').select('*').in('kelas', [3, 4, 5, 6, 7]).order('kelas', { ascending: true })
  
  if (!students) return
  
  const studentIds = students.map(s => s.id)

  // 2. Ambil seluruh data 7 hari untuk murid-murid tersebut
  const { data: attendance } = await supabase.from('attendance').select('student_id, skor').in('student_id', studentIds)
  const { data: tugas } = await supabase.from('tugas').select('*').in('student_id', studentIds)
  const { data: hafalan } = await supabase.from('hafalan').select('student_id, jenis_hafalan, skor').in('student_id', studentIds)

  aggregatedStudents.value = students.map(student => {
    
    // -- RERATA KEHADIRAN (Dibagi 7) --
    const studentAttendance = attendance?.filter(a => a.student_id === student.id) || []
    let totalAbsen = 0
    studentAttendance.forEach(a => totalAbsen += a.skor)
    const rerataHadir = Math.round(totalAbsen / 7) 

    // -- RERATA TUGAS HARIAN (Dibagi 7) --
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

    // -- HAFALAN WAJIB (Titah & Haporseaon) --
    const studentHafalan = hafalan?.filter(h => h.student_id === student.id) || []
    const titah = studentHafalan.find(h => h.jenis_hafalan === 'Titah')
    const haporseaon = studentHafalan.find(h => h.jenis_hafalan === 'Hata Haporseaon')
    
    const skorTitah = titah ? titah.skor : 0
    const skorHaporseaon = haporseaon ? haporseaon.skor : 0

    // -- KALKULASI NILAI AKHIR (Rata-rata dari 7 Komponen) --
    // Komponen: 1 Absen + 4 Tugas + 2 Hafalan
    const totalSemua = rerataHadir + rerataTugas + rerataBacaan + rerataKuis + rerataTontonan + skorTitah + skorHaporseaon
    const nilaiAkhir = Math.round(totalSemua / 7) // Dibagi 7 komponen

    return {
      ...student,
      rerata_hadir: rerataHadir,
      rerata_tugas: rerataTugas,
      rerata_bacaan: rerataBacaan,
      rerata_kuis: rerataKuis,
      rerata_tontonan: rerataTontonan,
      skor_titah: skorTitah,
      skor_haporseaon: skorHaporseaon,
      nilai_akhir: nilaiAkhir
    }
  })
}

onMounted(() => { fetchAggregatedData() })

// === EXPORT PDF ===
const exportToPDF = () => {
  if (aggregatedStudents.value.length === 0) return alert("Belum ada data untuk dicetak!")

  const doc = new jsPDF('landscape')
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(`REKAPITULASI PENILAIAN SIL HKBP BENGKALIS 2026`, 14, 15)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Kategori: Semua Kelas (3 - 7) | Dicetak: ${tanggalSekarang}`, 14, 22)
  
  const headTabel = [['No', 'Nama Anak', 'Kelas', 'Hadir', 'Tugas', 'Bacaan', 'Kuis', 'Tontonan', 'Titah', 'Haporseaon', 'NILAI AKHIR']]
  
  const bodyData = aggregatedStudents.value.map((s, idx) => [
    idx + 1, 
    s.nama_lengkap, 
    `Kls ${s.kelas}`, 
    s.rerata_hadir.toString(), 
    s.rerata_tugas.toString(), 
    s.rerata_bacaan.toString(), 
    s.rerata_kuis.toString(), 
    s.rerata_tontonan.toString(), 
    s.skor_titah.toString(), 
    s.skor_haporseaon.toString(), 
    s.nilai_akhir.toString()
  ])
  
  autoTable(doc, {
    startY: 28,
    head: headTabel,
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], halign: 'center', fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 45 },
      2: { halign: 'center', cellWidth: 15 },
      // Rata tengah untuk semua kolom angka
      3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' },
      6: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' },
      9: { halign: 'center' }, 
      10: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } // Highlight Nilai Akhir
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