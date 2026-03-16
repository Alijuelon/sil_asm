<template>
  <div class="min-h-screen bg-[#0f172a] text-gray-200 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
    
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-tr from-teal-400 to-blue-500 p-2 rounded-xl shadow-lg shadow-teal-500/30 animate-pulse">
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

    <header class="relative container mx-auto px-6 pt-16 pb-24 text-center">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-600/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      
      <span class="inline-block py-1.5 px-4 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 font-semibold text-sm mb-6 animate-bounce">
        ✨ 16 - 21 Maret 2026 ✨
      </span>
      <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
        Sekolah Injil Libur <br/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">HKBP Bengkalis</span>
      </h1>
      <p class="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
        "Aku, Anak Sekolah Minggu. Anak Terang, Anak Teladan"
      </p>
      
      <div class="flex flex-wrap justify-center gap-4">
        <button @click="scrollToSection('info')" class="px-8 py-3.5 rounded-full bg-[#1e293b] border border-gray-700 hover:border-teal-500 hover:bg-gray-800 text-white font-bold transition duration-300 flex items-center gap-2">
          👇 Lihat Kegiatan
        </button>
      </div>
    </header>

    <section id="info" class="container mx-auto px-6 py-16">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Serunya Belajar Firman Tuhan! 📖</h2>
        <p class="text-gray-400 max-w-2xl mx-auto">Mengisi waktu libur sekolah dengan aktivitas positif, mengenal tokoh Alkitab, dan menghafal Firman Tuhan bersama teman-teman.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-[#151e32] border border-gray-800 p-6 rounded-2xl hover:-translate-y-2 transition duration-300 shadow-xl hover:shadow-teal-900/20 group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition transform">🦸‍♂️</div>
          <h3 class="text-xl font-bold text-teal-400 mb-2">Tokoh Alkitab</h3>
          <p class="text-sm text-gray-400">Mengenal kisah hebat Daud, Daniel, Nuh, Ester, Timotius, dan Tuhan Yesus.</p>
        </div>
        <div class="bg-[#151e32] border border-gray-800 p-6 rounded-2xl hover:-translate-y-2 transition duration-300 shadow-xl hover:shadow-sky-900/20 group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition transform">🧠</div>
          <h3 class="text-xl font-bold text-sky-400 mb-2">Hafalan Firman</h3>
          <p class="text-sm text-gray-400">Menghafal 10 Titah, Doa Bapa Kami, Pengakuan Iman Rasuli & Hata Haporseaon.</p>
        </div>
        <div class="bg-[#151e32] border border-gray-800 p-6 rounded-2xl hover:-translate-y-2 transition duration-300 shadow-xl hover:shadow-purple-900/20 group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition transform">📚</div>
          <h3 class="text-xl font-bold text-purple-400 mb-2">Komik Alkitab</h3>
          <p class="text-sm text-gray-400">Membaca dan mereviu cerita bergambar yang seru dari Alkitab setiap harinya.</p>
        </div>
        <div class="bg-[#151e32] border border-gray-800 p-6 rounded-2xl hover:-translate-y-2 transition duration-300 shadow-xl hover:shadow-pink-900/20 group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition transform">🎬</div>
          <h3 class="text-xl font-bold text-pink-400 mb-2">Nonton Superbook</h3>
          <p class="text-sm text-gray-400">Menonton animasi Superbook yang mendidik dan menjawab kuis interaktif.</p>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-6 py-16 mb-12">
      <div class="bg-gradient-to-br from-[#151e32] to-[#0f172a] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div class="md:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">⏰ Jadwal Kegiatan (Time Schedule)</h2>
            <p class="text-gray-400 mb-6">Kegiatan SIL dibagi menjadi dua sesi setiap harinya. Pastikan anak-anak hadir tepat waktu untuk mengikuti ibadah pembuka!</p>
            <ul class="space-y-4">
              <li class="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl border border-gray-700/50">
                <div class="bg-teal-500/20 text-teal-400 p-3 rounded-lg font-bold">14.00 - 15.30</div>
                <div>
                  <h4 class="font-bold text-gray-200">Sesi 1</h4>
                  <p class="text-sm text-gray-400">Belajar Tokoh Alkitab & Bernyanyi</p>
                </div>
              </li>
              <li class="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl border border-gray-700/50">
                <div class="bg-sky-500/20 text-sky-400 p-3 rounded-lg font-bold">15.45 - 17.15</div>
                <div>
                  <h4 class="font-bold text-gray-200">Sesi 2</h4>
                  <p class="text-sm text-gray-400">Hafalan, Baca Komik & Superbook</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="md:w-1/2 flex justify-center">
            <div class="relative w-64 h-64 animate-bounce-slow">
              <div class="absolute inset-0 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-full opacity-20 blur-2xl"></div>
              <div class="text-[150px] leading-none text-center drop-shadow-2xl">👦👧</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-800 text-center py-8">
      <p class="text-sm text-gray-500">© 2026 Sistem Auto-Save SIL HKBP Bengkalis. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { useRouter } from 'vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* Tambahan animasi santai untuk gambar ilustrasi */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(5%); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}
</style>