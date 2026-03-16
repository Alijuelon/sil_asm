<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end mb-6">
      <div>
        <p class="text-teal-400 text-sm font-semibold tracking-wide uppercase">DASHBOARD / Welcome, Ali Sinaga</p>
      </div>
      <div class="text-sm text-gray-400">
        16 - 21 Maret 2026 | SIL HKBP Bengkalis
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <div class="col-span-1 grid grid-cols-2 gap-4">
        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-teal-500/50 transition">
          <div class="flex justify-between text-sm text-gray-400">
            <span>Total Anak</span>
            <span class="text-teal-400">+15%</span>
          </div>
          <div class="text-3xl font-bold text-white mt-2">124</div>
        </div>
        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-teal-500/50 transition">
          <div class="flex justify-between text-sm text-gray-400">
            <span>Hadir H1</span>
            <span class="text-teal-400">+8%</span>
          </div>
          <div class="text-3xl font-bold text-white mt-2">112</div>
        </div>
        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-teal-500/50 transition">
          <div class="flex justify-between text-sm text-gray-400">
            <span>Lulus Titah</span>
            <span class="text-teal-400">+12%</span>
          </div>
          <div class="text-3xl font-bold text-white mt-2">45</div>
        </div>
        <div class="bg-[#151e32] border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-teal-500/50 transition">
          <div class="flex justify-between text-sm text-gray-400">
            <span>Haporseaon</span>
            <span class="text-teal-400">+5%</span>
          </div>
          <div class="text-3xl font-bold text-white mt-2">30</div>
        </div>
      </div>

      <div class="col-span-2 bg-[#151e32] border border-gray-800 rounded-xl p-5 relative overflow-hidden flex flex-col">
        <div class="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 class="text-white font-medium text-lg">Aktivitas Kehadiran</h3>
            <p class="text-xs text-gray-500 mt-1">Overview Kehadiran 7 Hari</p>
          </div>
          <button class="text-gray-500 hover:text-white">•••</button>
        </div>
        <div class="flex-1 w-full relative mt-4">
          <svg viewBox="0 0 100 40" class="w-full h-full overflow-visible drop-shadow-lg" preserveAspectRatio="none">
             <line x1="0" y1="10" x2="100" y2="10" stroke="#1f2937" stroke-width="0.5" />
             <line x1="0" y1="20" x2="100" y2="20" stroke="#1f2937" stroke-width="0.5" />
             <line x1="0" y1="30" x2="100" y2="30" stroke="#1f2937" stroke-width="0.5" />
             <polyline fill="none" stroke="#2dd4bf" stroke-width="1.5" points="0,35 15,20 30,25 45,15 60,20 75,5 100,10" />
             <polyline fill="none" stroke="#3b82f6" stroke-width="1.5" points="0,38 15,25 30,30 45,10 60,15 75,18 100,2" />
          </svg>
        </div>
        <div class="flex justify-center gap-4 text-xs text-gray-400 mt-2">
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-blue-500"></div> Tepat Waktu</span>
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-teal-400"></div> Terlambat</span>
        </div>
      </div>

      <div class="col-span-1 bg-[#151e32] border border-gray-800 rounded-xl p-5 flex flex-col">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-white font-medium text-lg">Persentase Kelas</h3>
          <button class="text-gray-500 hover:text-white">•••</button>
        </div>
        <div class="flex-1 flex items-center justify-center relative">
          <svg viewBox="0 0 36 36" class="w-32 h-32 transform -rotate-90">
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#1e293b" stroke-width="4"></circle>
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3b82f6" stroke-width="4" stroke-dasharray="35 100" stroke-dashoffset="0"></circle>
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="15 100" stroke-dashoffset="-35"></circle>
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#06b6d4" stroke-width="4" stroke-dasharray="18 100" stroke-dashoffset="-50"></circle>
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#2dd4bf" stroke-width="4" stroke-dasharray="29 100" stroke-dashoffset="-68"></circle>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center rounded-full">
            <span class="text-xl font-bold text-white">124</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-4">
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-blue-500"></div> Kelas 3</span>
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-sky-500"></div> Kelas 4</span>
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-cyan-500"></div> Kelas 5</span>
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-teal-400"></div> Kelas 6 & 7</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="col-span-2 bg-[#151e32] border border-gray-800 rounded-xl p-5">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-white font-medium text-lg">Capaian Hafalan Terbaru</h3>
          <button class="text-gray-500 hover:text-white">•••</button>
        </div>
        <table class="w-full text-left text-sm text-gray-400">
          <thead>
            <tr class="border-b border-gray-800 text-gray-500">
              <th class="pb-3 font-medium">Nama Anak</th>
              <th class="pb-3 font-medium">Kelas</th>
              <th class="pb-3 font-medium">Kategori</th>
              <th class="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="py-3 text-gray-200">Trisha Amora Marito</td>
              <td class="py-3">Kelas 3</td>
              <td class="py-3">Titah 1-10</td>
              <td class="py-3"><span class="text-teal-400">Lulus Hari 1</span></td>
            </tr>
            <tr class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="py-3 text-gray-200">Daniel Lumbantoruan</td>
              <td class="py-3">Kelas 4</td>
              <td class="py-3">Titah 1-10</td>
              <td class="py-3"><span class="text-teal-400">Lulus Hari 2</span></td>
            </tr>
            <tr class="border-b border-gray-800/50 hover:bg-[#1e293b] transition">
              <td class="py-3 text-gray-200">Agustinus L.</td>
              <td class="py-3">Kelas 7</td>
              <td class="py-3">Haporseaon</td>
              <td class="py-3"><span class="text-teal-400">Lulus Hari 1</span></td>
            </tr>
            <tr class="hover:bg-[#1e293b] transition">
              <td class="py-3 text-gray-200">Sion Felix Pakpahan</td>
              <td class="py-3">Kelas 7</td>
              <td class="py-3">Haporseaon</td>
              <td class="py-3"><span class="text-gray-500">Belum Lulus</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-1 bg-[#151e32] border border-gray-800 rounded-xl p-5 flex flex-col">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-white font-medium text-lg">Sebaran Skor Kuis</h3>
            <p class="text-xs text-gray-500 mt-1">Rata-rata Nilai Harian</p>
          </div>
          <button class="text-gray-500 hover:text-white">•••</button>
        </div>
        <div class="flex-1 flex items-end justify-between gap-2 px-2 mt-4 border-b border-gray-700 pb-2">
          <div class="w-1/4 bg-teal-400 rounded-t-sm h-[60%] flex items-end justify-center"><span class="text-[10px] text-white font-bold mb-1 opacity-0 hover:opacity-100">60%</span></div>
          <div class="w-1/4 bg-blue-500 rounded-t-sm h-[45%] flex items-end justify-center"><span class="text-[10px] text-white font-bold mb-1 opacity-0 hover:opacity-100">45%</span></div>
          <div class="w-1/4 bg-sky-500 rounded-t-sm h-[80%] flex items-end justify-center"><span class="text-[10px] text-white font-bold mb-1 opacity-0 hover:opacity-100">80%</span></div>
          <div class="w-1/4 bg-blue-700 rounded-t-sm h-[30%] flex items-end justify-center"><span class="text-[10px] text-white font-bold mb-1 opacity-0 hover:opacity-100">30%</span></div>
        </div>
        <div class="flex justify-between mt-2 text-[10px] text-gray-500 px-1">
          <span>Nilai A</span>
          <span>Nilai B</span>
          <span>Nilai C</span>
          <span>Remedial</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Komponen UI murni Tailwind
</script>