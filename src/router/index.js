import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../supabase";

// Import semua komponen
import LandingPage from "../views/LandingPage.vue"; 
import Dashboard from "../views/Dashboard.vue";
import Absensi from "../views/Absensi.vue";
import Penilaian from "../views/Penilaian.vue";
import Haporseaon from "../views/Haporseaon.vue";
import LaporanAkhir from "../views/LaporanAkhir.vue";
import Login from "../views/Login.vue";
import KelolaASM from "../views/KelolaASM.vue";
import Tugas from "../views/Tugas.vue";

// Import Komponen Khusus Bang Samuel
// PASTIKAN Kakak sudah membuat file bernama WaliKelas67.vue di folder views!
import WaliKelas67 from "../views/WaliKelas67.vue"; 
import AbsensiSamuel from '../views/AbsensiSamuel.vue';
import PenilaianSamuel from '../views/PenilaianSamuel.vue';

const routes = [
  // === RUTE PUBLIK ===
  { 
    path: "/", 
    name: "LandingPage", 
    component: LandingPage 
  },
  { 
    path: "/login", 
    name: "Login", 
    component: Login 
  },
  
  // === RUTE PRIVAT (BUTUH LOGIN) ===
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/kelola-asm",
    name: "KelolaASM",
    component: KelolaASM,
    meta: { requiresAuth: true },
  },
  
  // -- Rute Kelas 3-5 (Kak Ali) --
  {
    path: "/absensi",
    name: "Absensi",
    component: Absensi,
    meta: { requiresAuth: true },
  },
  {
    path: "/tugas",
    name: "Tugas",
    component: Tugas,
    meta: { requiresAuth: true },
  },
  {
    path: "/penilaian",
    name: "Penilaian",
    component: Penilaian,
    meta: { requiresAuth: true },
  },
  {
    path: "/haporseaon",
    name: "Haporseaon",
    component: Haporseaon,
    meta: { requiresAuth: true },
  },

  // -- Rute Kelas 6-7 (Bang Samuel) --
  {
    path: "/absensi-samuel",
    name: "AbsensiSamuel",
    component: AbsensiSamuel,
    meta: { requiresAuth: true },
  },
  // INI SUDAH SAYA AKTIFKAN KEMBALI 🚀
  {
    path: "/tugas-besar",
    name: "WaliKelas67",
    component: WaliKelas67,
    meta: { requiresAuth: true },
  },
  {
    path: "/penilaian-samuel",
    name: "PenilaianSamuel",
    component: PenilaianSamuel,
    meta: { requiresAuth: true },
  },

  // -- Rute Umum --
  {
    path: "/laporan-akhir",
    name: "LaporanAkhir",
    component: LaporanAkhir,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// === LOGIKA GEMBOK (ROUTE GUARD) ===
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (to.meta.requiresAuth && !session) {
    next({ name: "Login" });
  } 
  else if ((to.name === "Login" || to.name === "LandingPage") && session) {
    next({ name: "Dashboard" });
  } 
  else {
    next();
  }
});

export default router;