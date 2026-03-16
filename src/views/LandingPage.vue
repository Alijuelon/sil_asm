<template>
  <div class="min-h-screen bg-[#0f172a] text-gray-200 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
    
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-tr from-teal-400 to-blue-500 p-2 rounded-xl shadow-lg shadow-teal-500/30 animate-pulse text-xl">
          ⛪
        </div>
        <span class="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">
          SIL HKBP 2026
        </span>
      </div>
      <button @click="goToLogin" class="group relative px-6 py-2.5 font-bold text-white rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:-translate-y-1">
        Masuk Sistem 🚀
      </button>
    </nav>

    <header class="relative container mx-auto px-6 pt-12 pb-20 text-center">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-600/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      
      <span class="inline-block py-1.5 px-4 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 font-semibold text-sm mb-6 animate-bounce">
        ✨ 16 - 21 Maret 2026 ✨
      </span>
      <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
        Sekolah Injil Libur <br/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">HKBP Bengkalis</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
        "Aku, Anak Sekolah Minggu. Anak Terang, Anak Teladan"
      </p>
      
      <div class="flex flex-wrap justify-center gap-4">
        <button @click="scrollToSection('info')" class="px-8 py-3.5 rounded-full bg-[#1e293b] border border-gray-700 hover:border-teal-500 hover:bg-gray-800 text-white font-bold transition duration-300 flex items-center gap-2">
          📖 Mulai Penjelajahan
        </button>
      </div>
    </header>

    <section id="info" class="container mx-auto px-6 py-16 border-t border-gray-800/50">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Kenapa Harus Ikut SIL? 🤔</h2>
          <ul class="space-y-4 text-gray-400">
            <li class="flex items-start gap-3">
              <span class="text-teal-400 text-xl">🎯</span>
              <p>Mengisi waktu liburan sekolah anak selama +/- 10 hari dengan hal yang sangat positif.</p>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-teal-400 text-xl">🎯</span>
              <p>Membantu anak-anak menghafal 10 Titah, Doa Bapa Kami, Tangiang Hatopan, Pengakuan Iman Rasuli, dan Hata Haporseaon.</p>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-teal-400 text-xl">🎯</span>
              <p>Agar anak mengenal lebih dalam Tokoh-Tokoh Alkitab dan pesannya.</p>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-teal-400 text-xl">🎯</span>
              <p>Membiasakan anak membaca komik Alkitab dan mereviu video cerita.</p>
            </li>
          </ul>
        </div>
        
        <div class="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 rounded-3xl border border-gray-700 shadow-2xl relative">
          <div class="absolute -top-6 -right-6 text-6xl drop-shadow-2xl animate-bounce-slow">🤝</div>
          <h3 class="text-2xl font-bold text-sky-400 mb-6">Peran Kerja Sama</h3>
          <div class="space-y-4">
            <div class="bg-[#151e32] p-4 rounded-xl border border-gray-800">
              <h4 class="font-bold text-teal-300">👩‍🏫 GSM / Fasilitator</h4>
              <p class="text-sm text-gray-400">Mendampingi anak, mendorong ngerjain tugas, dan menghadirkan suasana ceria.</p>
            </div>
            <div class="bg-[#151e32] p-4 rounded-xl border border-gray-800">
              <h4 class="font-bold text-blue-300">👦👧 Anak Sekolah Minggu</h4>
              <p class="text-sm text-gray-400">Hadir tepat waktu, serius ikut kegiatan, dan mengulang hafalan di rumah.</p>
            </div>
            <div class="bg-[#151e32] p-4 rounded-xl border border-gray-800">
              <h4 class="font-bold text-purple-300">👨‍👩‍👦 Orang Tua</h4>
              <p class="text-sm text-gray-400">Mendampingi anak tugas di rumah dan memotivasi mereka untuk semangat.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-6 py-16 border-t border-gray-800/50">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white mb-4">🌟 Tim Hebat SIL HKBP Bengkalis</h2>
        <p class="text-gray-400">Kenalan dulu yuk sama inang, amang, dan kakak-kakak pengajar kita!</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="(member, index) in teamMembers" :key="index" class="bg-[#151e32] border border-gray-800 rounded-2xl p-4 text-center hover:border-teal-500 hover:bg-[#1e293b] transition duration-300 group">
          <div class="w-16 h-16 mx-auto bg-gradient-to-tr from-teal-500 to-sky-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg group-hover:scale-110 transition">
            {{ getInitials(member.name) }}
          </div>
          <h4 class="font-bold text-gray-200 text-sm mb-1 leading-tight">{{ member.name }}</h4>
          <span class="text-xs font-medium text-teal-400 bg-teal-900/30 px-2 py-1 rounded-full">{{ member.role }}</span>
        </div>
      </div>
    </section>

    <section id="jadwal" class="container mx-auto px-4 py-16 mb-12 border-t border-gray-800/50">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-4">⏰ Time Schedule SIL</h2>
        <p class="text-gray-400">Jadwal lengkap kegiatan dari awal pembukaan hingga penutupan.</p>
      </div>

      <div class="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-white group cursor-pointer" @click="isTableVisible = true">
        
        <div v-if="!isTableVisible" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f172a]/60 backdrop-blur-[2px] transition-all duration-500">
          <div class="bg-[#151e32] p-6 rounded-2xl border border-teal-500/50 shadow-2xl shadow-teal-500/20 text-center transform group-hover:scale-105 transition duration-300">
            <span class="text-5xl block mb-4 animate-bounce">📅</span>
            <h3 class="text-xl font-bold text-white mb-2">Jadwal Dirahasiakan!</h3>
            <p class="text-gray-400 text-sm mb-4">Ssst.. Klik tombol di bawah untuk mengungkap jadwal lengkap SIL.</p>
            <button class="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition">
              Buka Jadwal Lengkap 👁️
            </button>
          </div>
        </div>

        <div class="overflow-x-auto p-2 md:p-4 transition-all duration-700 ease-in-out" :class="!isTableVisible ? 'blur-md pointer-events-none select-none opacity-50' : 'blur-0 opacity-100'">
          <table class="w-full min-w-[1100px] text-sm text-center border-collapse border-2 border-gray-900 text-gray-900">
            <tbody>
              <tr class="bg-[#78d5e3] border-b border-gray-900">
                <td rowspan="4" class="font-bold border border-gray-900 p-2 w-24 text-base">Kelas 1 - 2</td>
                <td rowspan="2" class="border border-gray-900 p-2 w-16">Sesi 1</td>
                <td class="border border-gray-900 p-1"></td>
                <td class="border border-gray-900 p-1">Perjanjian Lama</td>
                <td class="border border-gray-900 p-1">Tokoh Daniel</td>
                <td class="border border-gray-900 p-1">Perjanjian Baru</td>
                <td class="border border-gray-900 p-1 leading-tight">Baca Komik<br>(2)</td>
                <td class="border border-gray-900 p-1">Tokoh Yesus</td>
                <td class="border border-gray-900 p-1">Evaluasi</td>
              </tr>
              <tr class="bg-[#78d5e3] border-b border-gray-900">
                <td class="border border-gray-900 p-1"></td>
                <td class="border border-gray-900 p-1">GSM 2</td>
                <td class="border border-gray-900 p-1">Pdt - RM</td>
                <td class="border border-gray-900 p-1">GSM 2</td>
                <td class="border border-gray-900 p-1">GSM 2</td>
                <td class="border border-gray-900 p-1">BDS</td>
                <td class="border border-gray-900 p-1"></td>
              </tr>
              <tr class="bg-[#78d5e3] border-b border-gray-900">
                <td rowspan="2" class="border border-gray-900 p-2">Sesi 2</td>
                <td class="border border-gray-900 p-1">Pembukaan</td>
                <td class="border border-gray-900 p-1">Baca Komik</td>
                <td class="border border-gray-900 p-1 leading-tight">Nonton<br>Superbook (2)</td>
                <td class="border border-gray-900 p-1 leading-tight">Belajar Lagu<br>Baca Komik<br>(2)</td>
                <td class="border border-gray-900 p-1">Tokoh Nuh</td>
                <td class="border border-gray-900 p-1 leading-tight">Nonton<br>Superbook (2)</td>
                <td class="border border-gray-900 p-1">Penutupan</td>
              </tr>
              <tr class="bg-[#78d5e3] border-b-2 border-gray-900">
                <td class="border border-gray-900 p-1">GSM</td>
                <td class="border border-gray-900 p-1">GSM 2</td>
                <td class="border border-gray-900 p-1">GSM 1</td>
                <td class="border border-gray-900 p-1">SS - GSM2</td>
                <td class="border border-gray-900 p-1">ER - RM</td>
                <td class="border border-gray-900 p-1">GSM 1</td>
                <td class="border border-gray-900 p-1"></td>
              </tr>

              <tr class="bg-[#f0b1f0] border-b border-gray-900">
                <td rowspan="4" class="font-bold border border-gray-900 p-2 w-24 text-base">Kelas 3 - 5</td>
                <td rowspan="2" class="border border-gray-900 p-2">Sesi 1</td>
                <td class="border border-gray-900 p-1"></td>
                <td class="border border-gray-900 p-1">Titah</td>
                <td class="border border-gray-900 p-1 leading-tight">Belajar Lagu<br>Baca Komik<br>Tangiang</td>
                <td class="border border-gray-900 p-1 leading-tight">Tokoh<br>Timotius</td>
                <td class="border border-gray-900 p-1">Tokoh Daud</td>
                <td class="border border-gray-900 p-1">Tokoh Nuh</td>
                <td class="border border-gray-900 p-1">Evaluasi</td>
              </tr>
              <tr class="bg-[#f0b1f0] border-b border-gray-900">
                <td class="border border-gray-900 p-1"></td>
                <td class="border border-gray-900 p-1">AS - RM</td>
                <td class="border border-gray-900 p-1">SS-AS-GSM2</td>
                <td class="border border-gray-900 p-1">Pdt - SS</td>
                <td class="border border-gray-900 p-1">Pdt - SS</td>
                <td class="border border-gray-900 p-1">ER - TS</td>
                <td class="border border-gray-900 p-1"></td>
              </tr>
              <tr class="bg-[#f0b1f0] border-b border-gray-900">
                <td rowspan="2" class="border border-gray-900 p-2">Sesi 2</td>
                <td class="border border-gray-900 p-1">Pembukaan</td>
                <td class="border border-gray-900 p-1">Tokoh Daniel</td>
                <td class="border border-gray-900 p-1">Tokoh Ester</td>
                <td class="border border-gray-900 p-1 leading-tight">Reviu Titah<br>Nonton<br>Superbook (2)</td>
                <td class="border border-gray-900 p-1 leading-tight">Reviu Hapalan<br>Baca Komik<br>(3)</td>
                <td class="border border-gray-900 p-1 leading-tight">Nonton<br>Bareng</td>
                <td class="border border-gray-900 p-1">Penutupan</td>
              </tr>
              <tr class="bg-[#f0b1f0] border-b-2 border-gray-900">
                <td class="border border-gray-900 p-1">GSM</td>
                <td class="border border-gray-900 p-1">SS - SH</td>
                <td class="border border-gray-900 p-1">ER - SH</td>
                <td class="border border-gray-900 p-1">AS - GSM 1</td>
                <td class="border border-gray-900 p-1">GSM 2</td>
                <td class="border border-gray-900 p-1">GSM 1</td>
                <td class="border border-gray-900 p-1"></td>
              </tr>

              <tr class="bg-[#72e086] border-b border-gray-900">
                <td rowspan="4" class="font-bold border border-gray-900 p-2 w-24 text-base">Kelas 6 - 7</td>
                <td rowspan="2" class="border border-gray-900 p-2">Sesi 1</td>
                <td class="border border-gray-900 p-1"></td>
                <td class="border border-gray-900 p-1">Tokoh Daniel</td>
                <td class="border border-gray-900 p-1">Tokoh Ester</td>
                <td class="border border-gray-900 p-1 leading-tight">Reviu Titah<br>Nonton<br>Superbook (2)</td>
                <td class="border border-gray-900 p-1 leading-tight">Reviu Hapalan<br>Baca Komik<br>(3)</td>
                <td class="border border-gray-900 p-1">Tokoh Nuh</td>
                <td class="border border-gray-900 p-1">Evaluasi</td>
              </tr>
              <tr class="bg-[#72e086] border-b border-gray-900">
                <td class="border border-gray-900 p-1"></td>
                <td class="border border-gray-900 p-1">SS - SH</td>
                <td class="border border-gray-900 p-1">ER - SH</td>
                <td class="border border-gray-900 p-1">AS - GSM 1</td>
                <td class="border border-gray-900 p-1">GSM 2</td>
                <td class="border border-gray-900 p-1">ER - TS</td>
                <td class="border border-gray-900 p-1"></td>
              </tr>
              <tr class="bg-[#72e086] border-b border-gray-900">
                <td rowspan="2" class="border border-gray-900 p-2">Sesi 2</td>
                <td class="border border-gray-900 p-1">Pembukaan</td>
                <td class="border border-gray-900 p-1">Titah</td>
                <td class="border border-gray-900 p-1 leading-tight">Belajar Lagu<br>Baca Komik<br>Tangiang</td>
                <td class="border border-gray-900 p-1 leading-tight">Tokoh<br>Timotius</td>
                <td class="border border-gray-900 p-1">Tokoh Daud</td>
                <td class="border border-gray-900 p-1 leading-tight">Nonton<br>Bareng</td>
                <td class="border border-gray-900 p-1">Penutupan</td>
              </tr>
              <tr class="bg-[#72e086] border-b-2 border-gray-900">
                <td class="border border-gray-900 p-1">GSM</td>
                <td class="border border-gray-900 p-1">AS - RM</td>
                <td class="border border-gray-900 p-1">SS-AS-GSM2</td>
                <td class="border border-gray-900 p-1">Pdt - BDS</td>
                <td class="border border-gray-900 p-1">Pdt - SS</td>
                <td class="border border-gray-900 p-1">GSM 1</td>
                <td class="border border-gray-900 p-1"></td>
              </tr>

              <tr class="bg-[#4a5ca8] text-white border-gray-900 font-bold">
                <td colspan="2" class="border border-gray-900 p-3 text-left">Dresscode</td>
                <td class="border border-gray-900 p-2 bg-[#4a5ca8]"></td>
                <td class="border border-gray-900 p-2">Merah/Hijau</td>
                <td class="border border-gray-900 p-2 text-white">Putih</td>
                <td class="border border-gray-900 p-2 text-white">Biru</td>
                <td class="border border-gray-900 p-2 text-white">Kuning</td>
                <td class="border border-gray-900 p-2 text-white">Merah/Hijau</td>
                <td class="border border-gray-900 p-2 text-white">Ungu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-800 text-center py-8 mt-auto">
      <p class="text-sm text-gray-500">© 2026 Sistem Auto-Save SIL HKBP Bengkalis. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Variabel untuk interaksi tabel jadwal
const isTableVisible = ref(false)

const goToLogin = () => {
  router.push('/login')
}

const scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}

// Data Array untuk Tim Pengajar
const teamMembers = [
  { name: 'Pdt. A.Y. Manullang', role: 'Pendeta Resort' },
  { name: 'Bane Doli Simanjuntak', role: 'Kls 6-7' },
  { name: 'Samuel Sianturi', role: 'Kls 1-2' },
  { name: 'Ali Sinaga', role: 'Kls 3-5' },
  { name: 'Tessa Sitompul', role: 'Kls 1-2' },
  { name: 'Septyani Hutabarat', role: 'Calon GSM' },
  { name: 'Rika Manurung', role: 'Pendamping GSM' },
  { name: 'Refael Panjaitan', role: 'Pendamping GSM' },
  { name: 'Joyce Sianturi', role: 'Pendamping GSM' },
  { name: 'Hilkia Simorangkir', role: 'Pendamping GSM' },
  { name: 'E. br. Rajagukguk', role: 'Tim Pengajar' }
]

// Fungsi untuk mendapatkan inisial dari nama
const getInitials = (name) => {
  const parts = name.replace('Pdt. ', '').replace(' br. ', ' ').split(' ')
  let initials = ''
  if (parts.length > 0) initials += parts[0][0]
  if (parts.length > 1) initials += parts[1][0]
  return initials.toUpperCase()
}
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(5%); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

/* Transisi halus saat tabel digeser horizontal */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>