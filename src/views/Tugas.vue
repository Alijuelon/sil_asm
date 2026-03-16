<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Review Komik & Tugas Harian</h1>
        <p class="text-sm text-gray-400 mt-1">Sistem Auto-Save - SIL HKBP Bengkalis</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <label class="font-medium text-gray-400">Hari Kegiatan:</label>
        <select v-model="selectedDay" @change="fetchStudents" class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition">
          <option v-for="day in 7" :key="day" :value="day">Hari {{ day }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button @click="exportDailyPDF" class="bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium">📄 Laporan Hari {{ selectedDay }}</button>
        <button @click="exportFinal7DaysPDF" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg transition shadow-lg text-sm font-medium shadow-teal-600/30">🏆 Cetak Laporan Akhir (7 Hari)</button>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
      <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
        <h2 class="text-lg font-bold text-teal-400">Daftar Anak (Semua Kelas)</h2>
        <button @click="markAllDone" class="text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg shadow transition font-bold">✅ Tandai Selesai Semua</button>
      </div>

      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400 bg-[#0f172a]">
              <th class="p-3 font-medium rounded-tl-lg w-12">No</th>
              <th class="p-3 font-medium">Nama Lengkap</th>
              <th class="p-3 font-medium text-center w-24">Kelas</th>
              <th class="p-3 font-medium w-48">Review Komik</th>
              <th class="p-3 font-medium w-48">Tugas Harian</th>
              <th class="p-3 font-medium text-center w-24 rounded-tr-lg">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="allStudents.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500">Tidak ada data.</td>
            </tr>
            <tr v-for="(student, index) in allStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="p-3 text-gray-500">{{ index + 1 }}</td>
              <td class="p-3 text-gray-200 font-medium">{{ student.nama_lengkap }}</td>
              <td class="p-3 text-center"><span class="text-blue-400 font-bold bg-blue-900/30 px-2 py-1 rounded">Kls {{ student.kelas }}</span></td>
              
              <td class="p-3">
                <select v-model="student.status_komik" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs">
                  <option value="Belum">Belum Review</option>
                  <option value="Selesai">✅ Selesai</option>
                </select>
              </td>
              
              <td class="p-3">
                <select v-model="student.status_tugas" @change="saveTugas(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none text-xs">
                  <option value="Belum">Belum Dikerjakan</option>
                  <option value="Selesai">✅ Selesai</option>
                </select>
              </td>

              <td class="p-3 text-center font-bold text-teal-400">
                {{ calculateDailyScore(student.status_komik, student.status_tugas) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="toastMsg" class="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold">
      <span>💾</span> {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const selectedDay = ref(1)
const allStudents = ref([])
const toastMsg = ref('')

const showToast = (msg) => {
  toastMsg.value = msg
  setTimeout(() => toastMsg.value = '', 2000)
}

// Menghitung Skor: Komik(50) + Tugas(50)
const calculateDailyScore = (komik, tugas) => {
  let score = 0
  if (komik === 'Selesai') score += 50
  if (tugas === 'Selesai') score += 50
  return score
}

const fetchStudents = async () => {
  const { data: students } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  const { data: tugasDB } = await supabase.from('tugas').select('*').eq('hari', selectedDay.value)

  if (students) {
    allStudents.value = students.map(s => {
      const exist = tugasDB?.find(t => t.student_id === s.id)
      return {
        ...s,
        status_komik: exist ? exist.status_komik : 'Belum',
        status_tugas: exist ? exist.status_tugas : 'Belum',
        tugas_id: exist ? exist.id : null
      }
    })
  }
}

onMounted(() => fetchStudents())

// AUTO SAVE
const saveTugas = async (student, isSilent = false) => {
  const skor = calculateDailyScore(student.status_komik, student.status_tugas)
  
  const payload = { 
    student_id: student.id, 
    hari: selectedDay.value, 
    status_komik: student.status_komik, 
    status_tugas: student.status_tugas, 
    skor_harian: skor 
  }

  if (student.tugas_id) {
    await supabase.from('tugas').update(payload).eq('id', student.tugas_id)
  } else {
    const { data } = await supabase.from('tugas').insert(payload).select()
    if (data && data.length > 0) student.tugas_id = data[0].id
  }

  if (!isSilent) showToast(`Tersimpan: ${student.nama_lengkap} (Skor: ${skor})`)
}

// Tandai Selesai Semua
const markAllDone = async () => {
  for (let s of allStudents.value) {
    if (s.status_komik !== 'Selesai' || s.status_tugas !== 'Selesai') {
      s.status_komik = 'Selesai'
      s.status_tugas = 'Selesai'
      await saveTugas(s, true)
    }
  }
  showToast("Semua anak ditandai selesai!")
}

// === EXPORT 1: PDF HARIAN ===
const exportDailyPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(`Laporan Tugas & Komik - Hari ${selectedDay.value}`, 14, 15)
  
  const bodyData = allStudents.value.map((s, idx) => [
    idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, s.status_komik, s.status_tugas, calculateDailyScore(s.status_komik, s.status_tugas)
  ])
  
  autoTable(doc, {
    startY: 25,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Review Komik', 'Tugas Harian', 'Skor']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] }
  })
  
  doc.save(`Tugas_Harian_${selectedDay.value}.pdf`)
}

// === EXPORT 2: PDF REKAP 7 HARI (FITUR KHUSUS) ===
const exportFinal7DaysPDF = async () => {
  // Ambil semua data tugas dari H1 - H7
  const { data: allTugas } = await supabase.from('tugas').select('*')
  
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(`Laporan Akhir Tugas & Komik (Rekap 7 Hari)`, 14, 15)
  
  // Hitung rata-rata per anak
  const bodyData = allStudents.value.map((s, idx) => {
    const tugasAnak = allTugas?.filter(t => t.student_id === s.id) || []
    let totalSkor = 0
    tugasAnak.forEach(t => totalSkor += t.skor_harian)
    const rataRata = Math.round(totalSkor / 7) // Dibagi 7 hari
    
    return [idx + 1, s.nama_lengkap, `Kelas ${s.kelas}`, `${totalSkor} / 700`, rataRata]
  })
  
  autoTable(doc, {
    startY: 25,
    head: [['No', 'Nama Lengkap', 'Kelas', 'Total Skor Terkumpul', 'NILAI RATA-RATA 7 HARI']],
    body: bodyData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: { 4: { halign: 'center', fontStyle: 'bold', textColor: [20, 184, 166] } }
  })
  
  doc.save(`Laporan_Akhir_Tugas_7Hari.pdf`)
}
</script>