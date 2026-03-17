<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Laporan Akhir SIL HKBP 2026</h1>
        <p class="text-sm text-teal-400 mt-1 font-medium">Rekapitulasi Nilai Akhir - Fasilitator: Ali Sinaga</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
        <label class="font-medium text-gray-400 text-sm">Pilih Kategori Laporan:</label>
        <select 
          v-model="filterCategory" 
          @change="fetchAggregatedData"
          class="flex-1 sm:flex-none bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition text-sm font-bold shadow-inner"
        >
          <option value="3-5">Kelas 3 - 5 (Wali Kelas & Pemateri)</option>
          <option value="6-7">Kelas 6 - 7 (Khusus Nilai Pemateri & Kustom)</option>
        </select>
        
        <button @click="fetchAggregatedData" class="w-full sm:w-auto bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-medium flex items-center justify-center gap-2">
          <span>🔄</span> Segarkan Data
        </button>
      </div>

      <button @click="exportToPDF" class="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg transition shadow-lg text-sm font-bold flex items-center justify-center gap-2">
        <span>📄</span> Cetak Laporan PDF
      </button>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg overflow-hidden flex flex-col">
      <div class="mb-3">
        <span class="bg-teal-900/50 text-teal-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-800/30">
          Total: {{ aggregatedStudents.length }} Anak
        </span>
      </div>

      <div class="overflow-x-auto custom-scrollbar pb-3">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-700 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-semibold rounded-tl-lg border-r border-gray-800 w-10 text-center">No</th>
              <th class="p-3 font-semibold border-r border-gray-800 min-w-[150px]">Nama Lengkap</th>
              <th class="p-3 font-semibold text-center border-r border-gray-800 w-20">Kelas</th>
              
              <template v-if="filterCategory === '3-5'">
                <th class="p-3 font-semibold text-center text-blue-300">Rerata<br>Hadir</th>
                <th class="p-3 font-semibold text-center text-teal-300">Tugas<br>Harian</th>
                <th class="p-3 font-semibold text-center text-teal-300">Reviu<br>Bacaan</th>
                <th class="p-3 font-semibold text-center text-teal-300">Kuis /<br>Extra</th>
                <th class="p-3 font-semibold text-center text-teal-300 border-r border-gray-800">Reviu<br>Tontonan</th>
                
                <th class="p-3 font-semibold text-center text-sky-300">Hafalan<br>Titah</th>
                <th class="p-3 font-semibold text-center text-sky-300">Hata<br>Haporseaon</th>
                <th class="p-3 font-semibold text-center text-sky-300 border-r border-gray-800">Doa Bapa<br>Kami</th>
              </template>

              <template v-else>
                <th class="p-3 font-semibold text-center text-sky-300">Hafalan<br>Titah</th>
                <th class="p-3 font-semibold text-center text-sky-300 border-r border-gray-800">Hata<br>Haporseaon</th>
                
                <th v-for="topic in dynamicTopics" :key="topic" class="p-3 font-semibold text-center text-orange-300 border-r border-gray-800">
                  {{ topic }}
                </th>
              </template>
              
              <th class="p-3 font-bold text-white text-center rounded-tr-lg bg-teal-600 w-24">NILAI<br>AKHIR</th>
            </tr>
          </thead>
          
          <tbody>
            <tr v-if="aggregatedStudents.length === 0">
              <td colspan="15" class="text-center py-8 text-gray-500">Memuat data atau belum ada data masuk...</td>
            </tr>
            <tr v-for="(student, index) in aggregatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500 border-r border-gray-800/50 text-center">{{ index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium border-r border-gray-800/50">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center border-r border-gray-800/50">
                <span class="bg-teal-900/50 text-teal-300 border-teal-800/30 px-2 py-1 rounded text-xs font-bold border">
                  Kls {{ student.kelas }}
                </span>
              </td>
              
              <template v-if="filterCategory === '3-5'">
                <td class="p-3 text-center font-bold text-blue-400 bg-blue-900/10">{{ student.rerata_hadir }}</td>
                <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_tugas }}</td>
                <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_bacaan }}</td>
                <td class="p-3 text-center text-teal-400 bg-teal-900/10">{{ student.rerata_kuis }}</td>
                <td class="p-3 text-center text-teal-400 bg-teal-900/10 border-r border-gray-800/50">{{ student.rerata_tontonan }}</td>
                <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10">{{ student.skor_titah || '0' }}</td>
                <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10">{{ student.skor_haporseaon || '0' }}</td>
                <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10 border-r border-gray-800/50">{{ student.skor_doa || '0' }}</td>
              </template>

              <template v-else>
                <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10">{{ student.skor_titah || '0' }}</td>
                <td class="p-3 text-center font-bold text-sky-400 bg-sky-900/10 border-r border-gray-800/50">{{ student.skor_haporseaon || '0' }}</td>
                
                <td v-for="topic in dynamicTopics" :key="topic" class="p-3 text-center font-bold text-orange-400 bg-orange-900/10 border-r border-gray-800/50">
                  {{ student.hafalan_scores[topic] }}
                </td>
              </template>
              
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

const filterCategory = ref('3-5')
const aggregatedStudents = ref([])
const dynamicTopics = ref([]) 

const getPoint = (grade) => {
  if (grade === 'A') return 95
  if (grade === 'B') return 85
  if (grade === 'C') return 70
  return 0
}

const fetchAggregatedData = async () => {
  const targetKelasArr = filterCategory.value === '3-5' ? [3, 4, 5] : [6, 7]

  const { data: students } = await supabase.from('students').select('*').in('kelas', targetKelasArr).order('kelas', { ascending: true })
  if (!students || students.length === 0) {
    aggregatedStudents.value = []
    dynamicTopics.value = []
    return
  }
  
  const studentIds = students.map(s => s.id)

  // Ambil Data Nilai 
  const { data: hafalan } = await supabase.from('hafalan').select('student_id, jenis_hafalan, skor').in('student_id', studentIds)
  
  let attendance = []
  let tugas = []
  
  // Jika Kelas 3-5, barulah kita ambil absen dan tugas harian
  if (filterCategory.value === '3-5') {
    const resA = await supabase.from('attendance').select('student_id, skor').in('student_id', studentIds)
    attendance = resA.data || []
    const resT = await supabase.from('tugas').select('*').in('student_id', studentIds)
    tugas = resT.data || []
  }

  // Jika Kelas 6-7, cari nama-nama Topik Kustom yang ada di Database
  if (filterCategory.value === '6-7' && hafalan) {
    const foundTopics = new Set()
    hafalan.forEach(h => {
      if (!['Titah', 'Hata Haporseaon', 'Doa Bapa Kami'].includes(h.jenis_hafalan)) {
        foundTopics.add(h.jenis_hafalan)
      }
    })
    dynamicTopics.value = Array.from(foundTopics)
  } else {
    dynamicTopics.value = []
  }

  // OLAH DATA UNTUK DITAMPILKAN
  aggregatedStudents.value = students.map(student => {
    const studentHafalan = hafalan?.filter(h => h.student_id === student.id) || []
    
    // Ambil Titah dan Haporseaon (Berlaku untuk 3-5 dan 6-7)
    const titah = studentHafalan.find(h => h.jenis_hafalan === 'Titah')
    const haporseaon = studentHafalan.find(h => h.jenis_hafalan === 'Hata Haporseaon')
    const skorTitah = titah ? titah.skor : 0
    const skorHaporseaon = haporseaon ? haporseaon.skor : 0

    let nilaiAkhir = 0

    // ===== LOGIKA KELAS 3-5 =====
    if (filterCategory.value === '3-5') {
      const studentAttendance = attendance.filter(a => a.student_id === student.id)
      let totalAbsen = 0
      studentAttendance.forEach(a => totalAbsen += a.skor)
      const rerataHadir = Math.round(totalAbsen / 7) 

      const studentTugas = tugas.filter(t => t.student_id === student.id)
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

      const doa = studentHafalan.find(h => h.jenis_hafalan === 'Doa Bapa Kami')
      const skorDoa = doa ? doa.skor : 0

      // Total 8 Komponen
      const totalSemua = rerataHadir + rerataTugas + rerataBacaan + rerataKuis + rerataTontonan + skorTitah + skorHaporseaon + skorDoa
      nilaiAkhir = Math.round(totalSemua / 8) 

      return {
        ...student, rerata_hadir: rerataHadir, rerata_tugas: rerataTugas,
        rerata_bacaan: rerataBacaan, rerata_kuis: rerataKuis, rerata_tontonan: rerataTontonan,
        skor_titah: skorTitah, skor_haporseaon: skorHaporseaon, skor_doa: skorDoa, nilai_akhir: nilaiAkhir
      }
    } 
    // ===== LOGIKA KELAS 6-7 =====
    else {
      const hafalanScores = {}
      let totalDynamicScore = 0

      dynamicTopics.value.forEach(topic => {
        const barisNilai = studentHafalan.filter(h => h.jenis_hafalan === topic)
        let sum = 0
        barisNilai.forEach(b => sum += b.skor)
        const finalScore = barisNilai.length > 0 ? Math.round(sum / 7) : 0 // Rata-rata 7 hari
        
        hafalanScores[topic] = finalScore
        totalDynamicScore += finalScore
      })

      // Total Komponen = Titah (1) + Haporseaon (1) + Jumlah Topik Kustom
      const pembagi = 2 + dynamicTopics.value.length
      const totalSemua = skorTitah + skorHaporseaon + totalDynamicScore
      nilaiAkhir = pembagi > 0 ? Math.round(totalSemua / pembagi) : 0

      return {
        ...student,
        skor_titah: skorTitah, skor_haporseaon: skorHaporseaon,
        hafalan_scores: hafalanScores, nilai_akhir: nilaiAkhir
      }
    }
  })
}

onMounted(() => { fetchAggregatedData() })

// === EXPORT PDF CERDAS ===
const exportToPDF = () => {
  if (aggregatedStudents.value.length === 0) return alert("Belum ada data untuk dicetak!")

  const doc = new jsPDF('landscape')
  const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(`REKAPITULASI PENILAIAN SIL HKBP BENGKALIS 2026`, 14, 15)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Fasilitator: Ali Sinaga | Kategori: Kelas ${filterCategory.value} | Dicetak: ${tanggal}`, 14, 22)
  
  let headTabel = []
  let bodyData = []
  let pdfStyles = { 0: { halign: 'center', cellWidth: 10 }, 2: { halign: 'center', cellWidth: 15 } }

  if (filterCategory.value === '3-5') {
    headTabel = [['No', 'Nama Anak', 'Kelas', 'Hadir', 'Tugas', 'Bacaan', 'Kuis', 'Tontonan', 'Titah', 'Haporseaon', 'Doa', 'NILAI AKHIR']]
    bodyData = aggregatedStudents.value.map((s, idx) => [
      idx + 1, s.nama_lengkap, `Kls ${s.kelas}`, 
      s.rerata_hadir.toString(), s.rerata_tugas.toString(), s.rerata_bacaan.toString(), s.rerata_kuis.toString(), s.rerata_tontonan.toString(), 
      s.skor_titah.toString(), s.skor_haporseaon.toString(), s.skor_doa.toString(), s.nilai_akhir.toString()
    ])
    // Styling Kolom Tengah (Rata Tengah)
    for (let i = 3; i <= 10; i++) pdfStyles[i] = { halign: 'center' }
    pdfStyles[11] = { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] }
  } else {
    // Mode PDF 6-7 (Dinamis Topik)
    const baseHeaders = ['No', 'Nama Anak', 'Kelas', 'Titah', 'Haporseaon']
    const dynamicHeaders = [...dynamicTopics.value]
    headTabel = [[...baseHeaders, ...dynamicHeaders, 'NILAI AKHIR']]
    
    bodyData = aggregatedStudents.value.map((s, idx) => {
      const row = [idx + 1, s.nama_lengkap, `Kls ${s.kelas}`, s.skor_titah.toString(), s.skor_haporseaon.toString()]
      dynamicHeaders.forEach(topic => row.push(s.hafalan_scores[topic].toString()))
      row.push(s.nilai_akhir.toString())
      return row
    })

    for (let i = 3; i < headTabel[0].length - 1; i++) pdfStyles[i] = { halign: 'center' }
    pdfStyles[headTabel[0].length - 1] = { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] }
  }
  
  autoTable(doc, {
    startY: 28,
    head: headTabel,
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166], halign: 'center', fontSize: 9 }, // Tema Ali Sinaga
    bodyStyles: { fontSize: 8 },
    columnStyles: pdfStyles
  })
  
  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #14b8a6; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #0d9488; }
</style>