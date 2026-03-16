<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Penilaian Hafalan (Titah & Hata Haporseaon)</h1>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden p-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-blue-100 text-blue-900">
            <th class="p-4 border-b">Nama & Kelas</th>
            <th class="p-4 border-b">Lulus Titah (Hari Ke-)</th>
            <th class="p-4 border-b">Lulus Hata Haporseaon (Hari Ke-)</th>
            <th class="p-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id" class="border-b hover:bg-gray-50">
            <td class="p-4 font-medium">{{ student.nama_lengkap }} <span class="text-xs text-gray-500 block">Kelas {{ student.kelas }}</span></td>
            
            <td class="p-4">
              <select v-model="student.lulus_titah" class="border p-2 rounded w-full">
                <option value="">Belum Lulus</option>
                <option v-for="d in 7" :key="'titah'+d" :value="d">Hari {{ d }}</option>
              </select>
            </td>

            <td class="p-4">
              <select v-model="student.lulus_haporseaon" class="border p-2 rounded w-full">
                <option value="">Belum Lulus</option>
                <option v-for="d in 7" :key="'hata'+d" :value="d">Hari {{ d }}</option>
              </select>
            </td>

            <td class="p-4">
              <button @click="saveGrades(student)" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan Nilai</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const students = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  if (!error) {
    students.value = data.map(s => ({ ...s, lulus_titah: '', lulus_haporseaon: '' }))
  }
})

const hitungSkor = (hari) => {
  if (!hari) return null
  const poin = {1:100, 2:97, 3:94, 4:91, 5:88, 6:85, 7:82}
  return poin[hari] || 0
}

const saveGrades = async (student) => {
  const skorTitah = hitungSkor(student.lulus_titah)
  const skorHaporseaon = hitungSkor(student.lulus_haporseaon)

  // Menyimpan Titah
  if (skorTitah) {
    await supabase.from('hafalan').insert([
      { student_id: student.id, jenis_hafalan: 'Titah', lulus_hari_ke: student.lulus_titah, skor: skorTitah }
    ])
  }

  // Menyimpan Hata Haporseaon
  if (skorHaporseaon) {
    await supabase.from('hafalan').insert([
      { student_id: student.id, jenis_hafalan: 'Hata Haporseaon', lulus_hari_ke: student.lulus_haporseaon, skor: skorHaporseaon }
    ])
  }

  alert(`Data hafalan ${student.nama_lengkap} tersimpan!`)
}
</script>