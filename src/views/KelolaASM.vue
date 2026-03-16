<template>
  <div class="space-y-6 text-gray-300">
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-2xl font-bold text-white">Manajemen Data ASM</h1>
        <p class="text-sm text-gray-400 mt-1">Kelola data peserta SIL HKBP Bengkalis</p>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      
      <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <div class="relative w-full md:w-64">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama anak..." 
            class="w-full bg-[#0f172a] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-teal-500 focus:outline-none transition text-sm"
          >
        </div>

        <select 
          v-model="filterClass" 
          class="bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none transition text-sm"
        >
          <option value="all">Semua Kelas</option>
          <option value="3">Kelas 3</option>
          <option value="4">Kelas 4</option>
          <option value="5">Kelas 5</option>
          <option value="6">Kelas 6</option>
          <option value="7">Kelas 7</option>
        </select>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto justify-end">
        <button @click="deleteAllStudents" class="bg-red-900/40 border border-red-800 hover:bg-red-600 text-red-300 hover:text-white px-4 py-2.5 rounded-lg font-medium transition shadow-lg flex items-center gap-2 text-sm">
          <span>⚠️</span> Hapus Semua
        </button>
        <button @click="openModal()" class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-lg flex items-center gap-2 text-sm">
          <span>➕</span> Tambah Anak
        </button>
      </div>
    </div>

    <div class="bg-[#151e32] border border-gray-800 rounded-xl p-5 overflow-hidden shadow-lg flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400">
              <th class="pb-3 font-medium px-4 w-12">No</th>
              <th class="pb-3 font-medium px-4">Nama Lengkap</th>
              <th class="pb-3 font-medium px-4 w-32 text-center">Kelas</th>
              <th class="pb-3 font-medium px-4 text-right w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedStudents.length === 0">
              <td colspan="4" class="text-center py-8 text-gray-500">
                {{ students.length === 0 ? 'Belum ada data anak.' : 'Tidak ditemukan anak dengan kriteria tersebut.' }}
              </td>
            </tr>
            <tr v-for="(student, index) in paginatedStudents" :key="student.id" class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="py-3 px-4 text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="py-3 px-4 text-gray-200 font-medium">{{ student.nama_lengkap }}</td>
              <td class="py-3 px-4 text-center">
                <span class="bg-blue-900/50 text-blue-300 px-3 py-1 rounded text-xs border border-blue-800 font-bold">Kelas {{ student.kelas }}</span>
              </td>
              <td class="py-3 px-4 text-right space-x-3">
                <button @click="editStudent(student)" class="text-sky-400 hover:text-sky-300 transition font-medium">✏️ Edit</button>
                <button @click="deleteStudent(student.id, student.nama_lengkap)" class="text-red-400 hover:text-red-300 transition font-medium">🗑️ Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
        <span class="text-sm text-gray-500">
          Menampilkan {{ paginatedStudents.length }} dari total {{ filteredStudents.length }} anak
        </span>
        <div class="flex items-center gap-4">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm transition">Sebelumnya</button>
          <span class="text-sm text-gray-400 font-medium">Hal {{ currentPage }} / {{ totalPages || 1 }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages || totalPages === 0" class="px-3 py-1 rounded bg-[#0f172a] border border-gray-700 hover:bg-gray-800 disabled:opacity-50 text-sm transition">Selanjutnya</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-[#151e32] border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>{{ isEditing ? '✏️' : '➕' }}</span> {{ isEditing ? 'Edit Data Anak' : 'Tambah Anak Baru' }}
        </h2>
        
        <form @submit.prevent="saveStudent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Nama Lengkap</label>
            <input v-model="form.nama_lengkap" type="text" required class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition" placeholder="Masukkan nama...">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Kelas Tingkat</label>
            <select v-model="form.kelas" required class="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition">
              <option value="3">Kelas 3</option>
              <option value="4">Kelas 4</option>
              <option value="5">Kelas 5</option>
              <option value="6">Kelas 6</option>
              <option value="7">Kelas 7</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition text-sm font-medium">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition text-sm font-medium flex items-center gap-2">
              💾 Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>

    <div 
      v-if="toastMsg" 
      class="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all z-50 font-bold"
    >
      <span>✅</span> {{ toastMsg }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../supabase'

// State Data & UI
const students = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, nama_lengkap: '', kelas: '3' })
const toastMsg = ref('')

// State Filter & Paginasi
const searchQuery = ref('')
const filterClass = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10) // Tampilkan 10 data per halaman

// === FUNGSI TOAST NOTIFIKASI ===
const showToast = (msg) => {
  toastMsg.value = msg
  setTimeout(() => toastMsg.value = '', 3000)
}

// === FETCH DATA ===
const fetchStudents = async () => {
  const { data, error } = await supabase.from('students').select('*').order('kelas', { ascending: true }).order('nama_lengkap', { ascending: true })
  if (!error) students.value = data
}

onMounted(() => {
  fetchStudents()
})

// === LOGIKA FILTER & PENCARIAN ===
const filteredStudents = computed(() => {
  let result = students.value

  // Filter Berdasarkan Kelas
  if (filterClass.value !== 'all') {
    result = result.filter(s => s.kelas.toString() === filterClass.value)
  }

  // Filter Berdasarkan Pencarian Nama
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => s.nama_lengkap.toLowerCase().includes(query))
  }

  return result
})

// === LOGIKA PAGINASI ===
const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage.value))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredStudents.value.slice(start, start + itemsPerPage.value)
})

// Reset ke halaman 1 jika user mengetik di pencarian atau mengubah filter
watch([searchQuery, filterClass], () => {
  currentPage.value = 1
})

// === LOGIKA MODAL FORM ===
const openModal = () => {
  isEditing.value = false
  form.value = { id: null, nama_lengkap: '', kelas: '3' }
  showModal.value = true
}

const editStudent = (student) => {
  isEditing.value = true
  form.value = { id: student.id, nama_lengkap: student.nama_lengkap, kelas: student.kelas }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// === LOGIKA CRUD ===
const saveStudent = async () => {
  if (isEditing.value) {
    const { error } = await supabase.from('students').update({ 
      nama_lengkap: form.value.nama_lengkap, 
      kelas: form.value.kelas 
    }).eq('id', form.value.id)
    
    if (error) alert("Gagal mengupdate data!")
    else showToast("Data anak berhasil diperbarui!")
  } else {
    const { error } = await supabase.from('students').insert([
      { nama_lengkap: form.value.nama_lengkap, kelas: form.value.kelas }
    ])
    
    if (error) alert("Gagal menambah data!")
    else showToast("Anak baru berhasil ditambahkan!")
  }
  closeModal()
  fetchStudents()
}

const deleteStudent = async (id, nama) => {
  if (confirm(`Hapus data ${nama}? \n\nSemua nilai dan absensi anak ini juga akan terhapus permanen.`)) {
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (!error) {
      showToast(`Data ${nama} berhasil dihapus.`)
      fetchStudents()
    } else {
      alert("Gagal menghapus data!")
    }
  }
}

// === LOGIKA HAPUS SEMUA DATA (DANGER ZONE) ===
const deleteAllStudents = async () => {
  if (students.value.length === 0) {
    alert("Data sudah kosong.")
    return
  }

  const peringatan1 = confirm("⚠️ PERINGATAN KERAS! ⚠️\n\nAnda yakin ingin menghapus SEMUA data anak?\nTindakan ini TIDAK BISA dibatalkan.")
  
  if (peringatan1) {
    const peringatan2 = confirm("Ini akan menghapus SELURUH daftar nama, riwayat absensi, dan nilai hafalan dari database.\n\nKlik OK jika Anda benar-benar yakin.")
    
    if (peringatan2) {
      // Menggunakan trik .not('id', 'is', null) untuk menghapus semua baris di Supabase
      const { error } = await supabase.from('students').delete().not('id', 'is', null)
      
      if (!error) {
        showToast("💥 Seluruh data berhasil dikosongkan.")
        fetchStudents() // Refresh tabel jadi kosong
      } else {
        alert("Terjadi kesalahan saat menghapus semua data. Pastikan hak akses database Anda mengizinkan penghapusan massal.")
        console.error(error)
      }
    }
  }
}
</script>