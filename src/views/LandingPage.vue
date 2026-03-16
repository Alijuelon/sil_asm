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
        <button @click="scrollToSection('jadwal')" class="px-8 py-3.5 rounded-full bg-[#1e293b] border border-gray-700 hover:border-teal-500 hover:bg-gray-800 text-white font-bold transition duration-300 flex items-center gap-2">
          📅 Lihat Jadwal Lengkap
        </button>
      </div>
    </header>

    <section id="jadwal" class="container mx-auto px-4 py-16 mb-12">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-4">⏰ Time Schedule SIL</h2>
        <p class="text-gray-400">Jadwal lengkap kegiatan dari awal pembukaan hingga penutupan.</p>
      </div>

      <div class="overflow-x-auto bg-white p-2 md:p-4 rounded-xl shadow-2xl border border-gray-700">
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
    </section>

    <footer class="border-t border-gray-800 text-center py-8 mt-auto">
      <p class="text-sm text-gray-500">© 2026 Sistem Auto-Save SIL HKBP Bengkalis. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* Transisi halus saat tabel digeser horizontal */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>