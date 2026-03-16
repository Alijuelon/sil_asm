<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Input Absensi Harian</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center gap-4">
      <label class="font-semibold text-gray-700">Pilih Hari Kegiatan:</label>
      <select v-model="selectedDay" class="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500">
        <option v-for="day in 7" :key="day" :value="day">Hari {{ day }}</option>
      </select>
      <button @click="fetchStudents" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tampilkan Data</button>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-4 border-b">Nama Lengkap</th>
            <th class="p-4 border-b">Kelas</th>
            <th class="p-4 border-b">Status Kehadiran</th>
            <th class="p-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 border-b">
            <td class="p-4">{{ student.nama_lengkap }}</td>
            <td class="p-4"><span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Kelas {{ student.kelas }}</span></td>
            <td class="p-4">
              <select v-model="student.status" class="border border-gray-300 rounded p-1 w-full">
                <option value="">-- Pilih Status --</option>
                <option value="Tepat Waktu">Tepat Waktu (100)</option>
                <option value="Telat <5m">Telat < 5m (95)</option>
                <option value="Telat >5m">Telat > 5m (90)</option>
                <option value="Sakit">Sakit (70)</option>
                <option value="Izin">Izin (50)</option>
                <option value="Tanpa Izin">Tanpa Izin (0)</option>
              </select>
            </td>
            <td class="p-4">
              <button @click="saveAttendance(student)" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">Simpan</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const selectedDay = ref(1)
const students = ref([])

const fetchStudents = async () => {
  // Mengambil data murid dari Supabase
  const { data, error } = await supabase.from('students').select('*').order('kelas', { ascending: true })
  if (error) {
    console.error(error)
  } else {
    // Menambahkan properti status untuk form binding
    students.value = data.map(s => ({ ...s, status: '' }))
  }
}

const saveAttendance = async (student) => {
  if (!student.status) return alert("Pilih status kehadiran terlebih dahulu!")
  
  // Logika skor berdasarkan aturan
  let skor = 0
  if (student.status === 'Tepat Waktu') skor = 100
  else if (student.status === 'Telat <5m') skor = 95
  else if (student.status === 'Telat >5m') skor = 90
  else if (student.status === 'Sakit') skor = 70
  else if (student.status === 'Izin') skor = 50

  const { error } = await supabase.from('attendance').insert([
    { student_id: student.id, hari: selectedDay.value, status: student.status, skor: skor }
  ])

  if (error) alert("Gagal menyimpan data!")
  else alert(`Absensi ${student.nama_lengkap} berhasil disimpan!`)
}
</script>