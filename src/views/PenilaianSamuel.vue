<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-sky-400">Penilaian Hafalan / Topik Custom</h1>
        <p class="text-sm text-gray-400 mt-1">Buat judul topik sendiri (Contoh: Tokoh Daniel, Kisah Daud)</p>
      </div>
    </div>

    <div class="bg-sky-900/20 border border-sky-800 p-5 rounded-xl shadow-lg">
      <label class="block font-medium text-sky-300 mb-2">Nama Topik Penilaian Saat Ini:</label>
      <div class="flex gap-3">
        <input 
          v-model="customTopic" 
          type="text" 
          placeholder="Ketik topik penilaian (misal: Tokoh Daniel)" 
          class="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition font-bold placeholder-gray-600"
        >
        <button @click="fetchHafalan" class="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition whitespace-nowrap">
          🔍 Muat / Buat Data
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">*Ketik nama topik lalu klik tombol muat. Jika nama topik sama, sistem akan memuat nilai yang sudah disimpan sebelumnya.</p>
    </div>

    <div v-if="customTopicLoaded" class="bg-[#151e32] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
      <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
        <h2 class="text-lg font-bold text-sky-400">Daftar Nilai: <span class="text-white">"{{ customTopicLoaded }}"</span></h2>
        <span class="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded inline-block">Kelas 6 - 7</span>
      </div>
      
      <div class="overflow-x-auto flex-1 custom-scrollbar pb-2">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400">
              <th class="pb-3 font-medium px-2 w-10">No</th>
              <th class="pb-3 font-medium px-2 min-w-[200px]">Nama Lengkap</th>
              <th class="pb-3 font-medium px-2 min-w-[200px]">Status Lulus (Poin Menurun)</th>
              <th class="pb-3 font-medium px-2 w-16 text-center">Skor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in students67" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="py-3 px-2 text-gray-500">{{ index + 1 }}</td>
              <td class="py-3 px-2 text-gray-200 font-medium">{{ student.nama_lengkap }}</td>
              <td class="py-3 px-2">
                <select v-model="student.lulus_hari_ke" @change="saveHafalan(student)" class="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white focus:border-sky-500 focus:outline-none text-xs">
                  <option :value="0">Belum Setor / Gagal</option>
                  <option :value="1">Lancar Hari 1 (100)</option>
                  <option :value="2">Lancar Hari 2 (97)</option>
                  <option :value="3">Lancar Hari 3 (94)</option>
                  <option :value="4">Lancar Hari 4 (91)</option>
                  <option :value="5">Lancar Hari 5 (88)</option>
                  <option :value="6">Lancar Hari 6 (85)</option>
                  <option :value="7">Lancar Hari 7 (82)</option>
                </select>
              </td>
              <td class="py-3 px-2 text-center font-bold text-sky-400 text-base bg-[#0f172a]/30">{{ getHafalanScore(student.lulus_hari_ke) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="bg-[#151e32] border border-gray-800 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
      <span class="text-4xl mb-3 opacity-50">📂</span>
      <h3 class="text-lg font-bold text-gray-400">Belum ada topik yang dipilih</h3>
      <p class="text-sm text-gray-500 mt-1">Silakan masukkan nama topik penilaian di atas untuk mulai menilai.</p>
    </div>

    <div v-if="toastMsg" class="fixed bottom-6 right-6 bg-sky-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold">
      <span>💾</span> {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const customTopic = ref('')
const customTopicLoaded = ref('') // Menyimpan nama topik yang sedang aktif dinilai
const students67 = ref([])
const toastMsg = ref('')

const showToast = (message) => {
  toastMsg.value = message
  setTimeout(() => toastMsg.value = '', 2000)
}

const getHafalanScore = (hariKe) => {
  const scores = { 1: 100, 2: 97, 3: 94, 4: 91, 5: 88, 6: 85, 7: 82 }
  return scores[hariKe] || 0
}

const fetchHafalan = async () => {
  if (!customTopic.value.trim()) {
    alert("Nama topik tidak boleh kosong!")
    return
  }
  
  // Kunci nama topik agar tabel muncul
  customTopicLoaded.value = customTopic.value

  // Ambil hanya murid kelas 6 & 7
  const { data: students } = await supabase.from('students').select('*').in('kelas', [6, 7]).order('kelas', { ascending: true })
  
  // Ambil data nilai berdasarkan Topik Custom yang diketik Bang Samuel
  const { data: hafalan } = await supabase.from('hafalan').select('*').eq('jenis_hafalan', customTopicLoaded.value)

  if (students) {
    students67.value = students.map(s => {
      const exist = hafalan?.find(h => h.student_id === s.id)
      return {
        ...s,
        lulus_hari_ke: exist ? exist.lulus_hari_ke : 0,
        hafalan_id: exist ? exist.id : null
      }
    })
  }
}

const saveHafalan = async (student) => {
  const skor = getHafalanScore(student.lulus_hari_ke)
  
  // Jika diubah menjadi 0, hapus dari database
  if (student.lulus_hari_ke === 0) {
    if (student.hafalan_id) {
      await supabase.from('hafalan').delete().eq('id', student.hafalan_id)
      student.hafalan_id = null
    }
    return
  }

  // Simpan nilai dengan NAMA TOPIK yang dibuat Bang Samuel
  const payload = { 
    student_id: student.id, 
    jenis_hafalan: customTopicLoaded.value, // <--- Ini kunci rahasianya!
    lulus_hari_ke: student.lulus_hari_ke, 
    skor: skor 
  }

  if (student.hafalan_id) {
    await supabase.from('hafalan').update(payload).eq('id', student.hafalan_id)
  } else {
    const { data } = await supabase.from('hafalan').insert(payload).select()
    if (data && data.length > 0) student.hafalan_id = data[0].id
  }

  showToast(`Tersimpan: ${student.nama_lengkap} (${skor} pt)`)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #0369a1; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #0284c7; }
</style>