<template>
  <div class="space-y-6 text-gray-300 pb-10">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Laporan Akhir SIL HKBP 2026</h1>
        <p class="text-sm text-teal-400 mt-1 font-medium">Rekapitulasi Harian & Nilai Akhir - Fasilitator: Ali Sinaga</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
        <div class="flex flex-col gap-1 w-full sm:w-auto">
          <label class="font-medium text-gray-400 text-xs">Pilih Kategori Kelas:</label>
          <select 
            v-model="filterCategory" 
            @change="handleCategoryChange"
            class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition text-sm font-bold shadow-inner"
          >
            <option value="3-5">Kelas 3 - 5 (Wali Kelas & Pemateri)</option>
            <option value="6-7">Kelas 6 - 7 (Khusus Nilai Pemateri & Kustom)</option>
          </select>
        </div>

        <div class="flex flex-col gap-1 w-full sm:w-auto">
          <label class="font-medium text-gray-400 text-xs">Tinjau Rincian (H1-H7):</label>
          <select 
            v-model="selectedDetailView"
            class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-teal-400 focus:border-teal-500 focus:outline-none transition text-sm font-bold shadow-inner"
          >
            <template v-if="filterCategory === '3-5'">
              <option value="absensi">Absensi Tepat Waktu</option>
              <option value="tugas_harian">Tugas Harian</option>
              <option value="reviu_bacaan">Reviu Bacaan</option>
              <option value="kuis">Kuis / Extra</option>
              <option value="reviu_tontonan">Reviu Tontonan</option>
            </template>
            <template v-else>
              <option v-if="dynamicTopics.length === 0" value="">-- Belum ada topik kustom --</option>
              <option v-for="topic in dynamicTopics" :key="topic" :value="topic">Topik: {{ topic }}</option>
            </template>
          </select>
        </div>
      </div>

      <div class="flex gap-2 w-full xl:w-auto">
        <button @click="fetchAggregatedData" class="flex-1 xl:flex-none bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-medium flex items-center justify-center gap-2">
          <span>🔄</span> Segarkan
        </button>
        <button @click="exportDetailPDF" class="flex-1 xl:flex-none bg-teal-900/40 border border-teal-700 hover:bg-teal-900 text-teal-300 px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-bold flex items-center justify-center gap-2">
          📄 Cetak Rincian
        </button>
        <button @click="exportSummaryPDF" class="flex-1 xl:flex-none bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-bold flex items-center justify-center gap-2">
          📑 Cetak Rekap Akhir
        </button>
      </div>
    </div>

    <div v-if="selectedDetailView" class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg overflow-hidden flex flex-col border-t-2 border-t-sky-500">
      <div class="mb-4">
        <h2 class="text-lg font-bold text-sky-400">🔍 Rincian Harian: {{ getDetailLabel(selectedDetailView) }}</h2>
        <p class="text-xs text-gray-500 mt-1">Data ditarik secara spesifik dari Hari ke-1 hingga Hari ke-7.</p>
      </div>

      <div class="overflow-x-auto custom-scrollbar pb-2">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-700 text-gray-400 bg-[#0f172a]">
              <th class="p-2 font-semibold rounded-tl-lg w-10 text-center">No</th>
              <th class="p-2 font-semibold border-r border-gray-800 min-w-[150px]">Nama Lengkap</th>
              <th class="p-2 font-semibold text-center border-r border-gray-800 w-16">Kelas</th>
              <th class="p-2 font-semibold text-center text-sky-300">H1</th>
              <th class="p-2 font-semibold text-center text-sky-300">H2</th>
              <th class="p-2 font-semibold text-center text-sky-300">H3</th>
              <th class="p-2 font-semibold text-center text-sky-300">H4</th>
              <th class="p-2 font-semibold text-center text-sky-300">H5</th>
              <th class="p-2 font-semibold text-center text-sky-300">H6</th>
              <th class="p-2 font-semibold text-center text-sky-300 border-r border-gray-800">H7</th>
              <th class="p-2 font-bold text-white text-center rounded-tr-lg bg-sky-600/80 w-20">RERATA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="aggregatedStudents.length === 0">
              <td colspan="11" class="text-center py-6 text-gray-500">Belum ada data.</td>
            </tr>
            <tr v-for="(student, index) in aggregatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-2 text-gray-500 border-r border-gray-800/50 text-center">{{ index + 1 }}</td>
              <td class="p-2 text-gray-200 font-medium border-r border-gray-800/50 truncate max-w-[150px]">{{ student.nama_lengkap }}</td>
              <td class="p-2 text-center border-r border-gray-800/50 text-sky-400 font-bold">Kls {{ student.kelas }}</td>
              
              <td v-for="d in 7" :key="d" class="p-2 text-center text-gray-300 bg-sky-900/10 border-r border-gray-800/30">
                {{ student.detail[selectedDetailView]?.[`h${d}`] || '-' }}
              </td>
              
              <td class="p-2 text-center font-bold text-sky-300 bg-sky-900/30 border-l border-sky-800/50">
                {{ student.detail[selectedDetailView]?.rata || '0' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 sm:p-5 shadow-lg overflow-hidden flex flex-col border-t-2 border-t-teal-500">
      <div class="mb-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-teal-400">🏆 Rekapitulasi Rata-rata & Nilai Akhir</h2>
          <p class="text-xs text-gray-500 mt-1">Menggabungkan seluruh rata-rata komponen menjadi satu Nilai Akhir.</p>
        </div>
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
              <th class="p-3 font-semibold text-center border-r border-gray-800 w-16">Kelas</th>
              
              <template v-if="filterCategory === '3-5'">
                <th class="p-3 font-semibold text-center text-teal-300" title="Rerata Kehadiran">Absen</th>
                <th class="p-3 font-semibold text-center text-teal-300" title="Rerata Tugas">Tugas</th>
                <th class="p-3 font-semibold text-center text-teal-300" title="Rerata Bacaan">Bacaan</th>
                <th class="p-3 font-semibold text-center text-teal-300" title="Rerata Kuis">Kuis</th>
                <th class="p-3 font-semibold text-center text-teal-300 border-r border-gray-800" title="Rerata Tontonan">Tonton</th>
                <th class="p-3 font-semibold text-center text-emerald-300">Titah</th>
                <th class="p-3 font-semibold text-center text-emerald-300">Haporseaon</th>
                <th class="p-3 font-semibold text-center text-emerald-300 border-r border-gray-800">Doa</th>
              </template>

              <template v-else>
                <th class="p-3 font-semibold text-center text-emerald-300">Titah</th>
                <th class="p-3 font-semibold text-center text-emerald-300 border-r border-gray-800">Haporseaon</th>
                <th v-for="topic in dynamicTopics" :key="topic" class="p-3 font-semibold text-center text-orange-300 border-r border-gray-800" :title="'Rerata '+topic">
                  Rrt. {{ topic.substring(0,6) }}..
                </th>
              </template>
              
              <th class="p-3 font-bold text-white text-center rounded-tr-lg bg-teal-600 w-24">NILAI AKHIR</th>
            </tr>
          </thead>
          
          <tbody>
            <tr v-if="aggregatedStudents.length === 0">
              <td colspan="15" class="text-center py-8 text-gray-500">Belum ada data masuk...</td>
            </tr>
            <tr v-for="(student, index) in aggregatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500 border-r border-gray-800/50 text-center">{{ index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium border-r border-gray-800/50">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center border-r border-gray-800/50">
                <span class="bg-teal-900/50 text-teal-300 border-teal-800/30 px-2 py-1 rounded text-xs font-bold border">Kls {{ student.kelas }}</span>
              </td>
              
              <template v-if="filterCategory === '3-5'">
                <td class="p-3 text-center font-bold text-teal-400 bg-teal-900/10">{{ student.detail.absensi.rata }}</td>
                <td class="p-3 text-center text-teal-300 bg-teal-900/10">{{ student.detail.tugas_harian.rata }}</td>
                <td class="p-3 text-center text-teal-300 bg-teal-900/10">{{ student.detail.reviu_bacaan.rata }}</td>
                <td class="p-3 text-center text-teal-300 bg-teal-900/10">{{ student.detail.kuis.rata }}</td>
                <td class="p-3 text-center text-teal-300 bg-teal-900/10 border-r border-gray-800/50">{{ student.detail.reviu_tontonan.rata }}</td>
                
                <td class="p-3 text-center font-bold text-emerald-400 bg-emerald-900/10">{{ student.skor_titah }}</td>
                <td class="p-3 text-center font-bold text-emerald-400 bg-emerald-900/10">{{ student.skor_haporseaon }}</td>
                <td class="p-3 text-center font-bold text-emerald-400 bg-emerald-900/10 border-r border-gray-800/50">{{ student.skor_doa }}</td>
              </template>

              <template v-else>
                <td class="p-3 text-center font-bold text-emerald-400 bg-emerald-900/10">{{ student.skor_titah }}</td>
                <td class="p-3 text-center font-bold text-emerald-400 bg-emerald-900/10 border-r border-gray-800/50">{{ student.skor_haporseaon }}</td>
                <td v-for="topic in dynamicTopics" :key="topic" class="p-3 text-center font-bold text-orange-400 bg-orange-900/10 border-r border-gray-800/50">
                  {{ student.detail[topic]?.rata || '0' }}
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
const selectedDetailView = ref('absensi') // Default awal
const aggregatedStudents = ref([])
const dynamicTopics = ref([]) 

// Helper Konversi Nilai
const getPoint = (val) => {
  if (typeof val === 'number') return val
  if (!val || val === 'Belum') return 0
  switch (val) {
    case 'Hari 1': return 100; case 'Hari 2': return 97; case 'Hari 3': return 94;
    case 'Hari 4': return 91; case 'Hari 5': return 88; case 'Hari 6': return 85; case 'Hari 7': return 82;
    case 'A': return 95; case 'B': return 85; case 'C': return 70; case 'D': return 65;
    default: return 0
  }
}

// Format Label Dropdown
const getDetailLabel = (key) => {
  const labels = {
    absensi: 'Absensi Tepat Waktu',
    tugas_harian: 'Tugas Harian',
    reviu_bacaan: 'Reviu Bacaan',
    kuis: 'Kuis / Extra',
    reviu_tontonan: 'Reviu Tontonan'
  }
  return labels[key] || `Topik Kustom: ${key}`
}

const handleCategoryChange = () => {
  if (filterCategory.value === '3-5') {
    selectedDetailView.value = 'absensi'
  } else {
    selectedDetailView.value = dynamicTopics.value.length > 0 ? dynamicTopics.value[0] : ''
  }
  fetchAggregatedData()
}

const fetchAggregatedData = async () => {
  const targetKelasArr = filterCategory.value === '3-5' ? [3, 4, 5] : [6, 7]

  const { data: students } = await supabase.from('students').select('*').in('kelas', targetKelasArr).order('kelas', { ascending: true })
  if (!students || students.length === 0) {
    aggregatedStudents.value = []; dynamicTopics.value = []
    return
  }
  
  const studentIds = students.map(s => s.id)

  const { data: hafalan } = await supabase.from('hafalan').select('*').in('student_id', studentIds)
  
  let attendance = []
  let tugas = []
  
  if (filterCategory.value === '3-5') {
    const resA = await supabase.from('attendance').select('*').in('student_id', studentIds)
    attendance = resA.data || []
    const resT = await supabase.from('tugas').select('*').in('student_id', studentIds)
    tugas = resT.data || []
  } else {
    const foundTopics = new Set()
    hafalan?.forEach(h => {
      if (!['Titah', 'Hata Haporseaon', 'Doa Bapa Kami'].includes(h.jenis_hafalan)) foundTopics.add(h.jenis_hafalan)
    })
    dynamicTopics.value = Array.from(foundTopics)
    if (dynamicTopics.value.length > 0 && !dynamicTopics.value.includes(selectedDetailView.value)) {
      selectedDetailView.value = dynamicTopics.value[0]
    }
  }

  // OLAH DATA MATRIX H1-H7
  aggregatedStudents.value = students.map(student => {
    const sAbsen = attendance.filter(a => a.student_id === student.id)
    const sTugas = tugas.filter(t => t.student_id === student.id)
    const sHafalan = hafalan?.filter(h => h.student_id === student.id) || []
    
    // Objek Matrix H1-H7
    const detail = {
      absensi: { rata: 0 }, tugas_harian: { rata: 0 }, reviu_bacaan: { rata: 0 }, 
      kuis: { rata: 0 }, reviu_tontonan: { rata: 0 }
    }

    // Isi Matrix Kelas 3-5
    if (filterCategory.value === '3-5') {
      let tAbs = 0, tTug = 0, tBac = 0, tKui = 0, tTon = 0;
      for(let d = 1; d <= 7; d++) {
        let recA = sAbsen.find(a => a.hari === d)
        detail.absensi[`h${d}`] = recA ? recA.skor : 0
        tAbs += detail.absensi[`h${d}`]

        let recT = sTugas.find(t => t.hari === d)
        detail.tugas_harian[`h${d}`] = recT ? getPoint(recT.tugas_harian) : 0
        detail.reviu_bacaan[`h${d}`] = recT ? getPoint(recT.reviu_bacaan) : 0
        detail.kuis[`h${d}`] = recT ? getPoint(recT.kuis) : 0
        detail.reviu_tontonan[`h${d}`] = recT ? getPoint(recT.reviu_tontonan) : 0
        
        tTug += detail.tugas_harian[`h${d}`]; tBac += detail.reviu_bacaan[`h${d}`];
        tKui += detail.kuis[`h${d}`]; tTon += detail.reviu_tontonan[`h${d}`];
      }
      detail.absensi.rata = Math.round(tAbs / 7)
      detail.tugas_harian.rata = Math.round(tTug / 7)
      detail.reviu_bacaan.rata = Math.round(tBac / 7)
      detail.kuis.rata = Math.round(tKui / 7)
      detail.reviu_tontonan.rata = Math.round(tTon / 7)
    }

    // Isi Matrix Kelas 6-7 (Topik Kustom)
    if (filterCategory.value === '6-7') {
      dynamicTopics.value.forEach(topic => {
        detail[topic] = { rata: 0 }
        let tKus = 0
        for(let d = 1; d <= 7; d++) {
          let recH = sHafalan.find(h => h.hari === d && h.jenis_hafalan === topic)
          detail[topic][`h${d}`] = recH ? getPoint(recH.status_nilai) : 0
          tKus += detail[topic][`h${d}`]
        }
        detail[topic].rata = Math.round(tKus / 7)
      })
    }

    // Hitung Single Score Wajib
    const titah = sHafalan.find(h => h.jenis_hafalan === 'Titah')
    const haporseaon = sHafalan.find(h => h.jenis_hafalan === 'Hata Haporseaon')
    const doa = sHafalan.find(h => h.jenis_hafalan === 'Doa Bapa Kami')
    const skorTitah = titah ? titah.skor : 0
    const skorHaporseaon = haporseaon ? haporseaon.skor : 0
    const skorDoa = doa ? doa.skor : 0

    // Hitung Nilai Akhir
    let nilaiAkhir = 0
    if (filterCategory.value === '3-5') {
      let sum = detail.absensi.rata + detail.tugas_harian.rata + detail.reviu_bacaan.rata + detail.kuis.rata + detail.reviu_tontonan.rata + skorTitah + skorHaporseaon + skorDoa
      nilaiAkhir = Math.round(sum / 8)
    } else {
      let sumKustom = 0
      dynamicTopics.value.forEach(t => sumKustom += detail[t].rata)
      let pembagi = 2 + dynamicTopics.value.length
      nilaiAkhir = pembagi > 0 ? Math.round((skorTitah + skorHaporseaon + sumKustom) / pembagi) : 0
    }

    return { ...student, detail, skor_titah: skorTitah, skor_haporseaon: skorHaporseaon, skor_doa: skorDoa, nilai_akhir: nilaiAkhir }
  })
}

onMounted(() => { fetchAggregatedData() })

// =========================================================
// CETAK PDF 1: RINCIAN H1-H7
// =========================================================
const exportDetailPDF = () => {
  if (!selectedDetailView.value) return alert("Pilih rincian yang ingin dicetak!")
  const doc = new jsPDF('landscape')
  doc.setFontSize(16); doc.text(`Rincian 7 Hari: ${getDetailLabel(selectedDetailView.value)}`, 14, 15)
  doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Fasilitator: Ali Sinaga | Kelas: ${filterCategory.value}`, 14, 22)
  
  const bodyData = aggregatedStudents.value.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kls ${s.kelas}`,
    s.detail[selectedDetailView.value]?.h1 || '0', s.detail[selectedDetailView.value]?.h2 || '0', s.detail[selectedDetailView.value]?.h3 || '0',
    s.detail[selectedDetailView.value]?.h4 || '0', s.detail[selectedDetailView.value]?.h5 || '0', s.detail[selectedDetailView.value]?.h6 || '0',
    s.detail[selectedDetailView.value]?.h7 || '0', s.detail[selectedDetailView.value]?.rata || '0'
  ])
  
  autoTable(doc, {
    startY: 28, head: [['No', 'Nama Anak', 'Kls', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'RERATA']], body: bodyData,
    theme: 'grid', headStyles: { fillColor: [14, 165, 233], halign: 'center' },
    columnStyles: { 0:{halign:'center'}, 2:{halign:'center'}, 3:{halign:'center'}, 4:{halign:'center'}, 5:{halign:'center'}, 6:{halign:'center'}, 7:{halign:'center'}, 8:{halign:'center'}, 9:{halign:'center'}, 10:{halign:'center', fontStyle:'bold'} }
  })
  window.open(URL.createObjectURL(doc.output('blob')), '_blank')
}

// =========================================================
// CETAK PDF 2: REKAPITULASI AKHIR (SUMMARY)
// =========================================================
const exportSummaryPDF = () => {
  if (aggregatedStudents.value.length === 0) return alert("Belum ada data untuk dicetak!")
  const doc = new jsPDF('landscape')
  doc.setFontSize(16); doc.text(`REKAPITULASI PENILAIAN SIL HKBP BENGKALIS 2026`, 14, 15)
  doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Fasilitator: Ali Sinaga | Kategori: Kelas ${filterCategory.value}`, 14, 22)
  
  let headTabel = []; let bodyData = []; let pdfStyles = { 0: { halign: 'center', cellWidth: 10 }, 2: { halign: 'center', cellWidth: 15 } }

  if (filterCategory.value === '3-5') {
    headTabel = [['No', 'Nama Anak', 'Kelas', 'Absen', 'Tugas', 'Bacaan', 'Kuis', 'Tontonan', 'Titah', 'Haporseaon', 'Doa', 'NILAI AKHIR']]
    bodyData = aggregatedStudents.value.map((s, idx) => [
      idx + 1, s.nama_lengkap, `Kls ${s.kelas}`, 
      s.detail.absensi.rata.toString(), s.detail.tugas_harian.rata.toString(), s.detail.reviu_bacaan.rata.toString(), 
      s.detail.kuis.rata.toString(), s.detail.reviu_tontonan.rata.toString(), 
      s.skor_titah.toString(), s.skor_haporseaon.toString(), s.skor_doa.toString(), s.nilai_akhir.toString()
    ])
    for (let i=3; i<=10; i++) pdfStyles[i] = { halign: 'center' }
    pdfStyles[11] = { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] }
  } else {
    const dynamicHeaders = [...dynamicTopics.value]
    headTabel = [['No', 'Nama Anak', 'Kelas', 'Titah', 'Haporseaon', ...dynamicHeaders, 'NILAI AKHIR']]
    bodyData = aggregatedStudents.value.map((s, idx) => {
      const row = [idx + 1, s.nama_lengkap, `Kls ${s.kelas}`, s.skor_titah.toString(), s.skor_haporseaon.toString()]
      dynamicHeaders.forEach(topic => row.push(s.detail[topic]?.rata.toString() || '0'))
      row.push(s.nilai_akhir.toString())
      return row
    })
    for (let i=3; i<headTabel[0].length-1; i++) pdfStyles[i] = { halign: 'center' }
    pdfStyles[headTabel[0].length - 1] = { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] }
  }
  
  autoTable(doc, {
    startY: 28, head: headTabel, body: bodyData, theme: 'grid',
    headStyles: { fillColor: [20, 184, 166], halign: 'center', fontSize: 9 }, bodyStyles: { fontSize: 8 }, columnStyles: pdfStyles
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