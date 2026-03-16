import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../supabase";

// Import semua komponen
import Dashboard from "../views/Dashboard.vue";
import Absensi from "../views/Absensi.vue";
import Penilaian from "../views/Penilaian.vue";
import Haporseaon from "../views/Haporseaon.vue";
import LaporanAkhir from "../views/LaporanAkhir.vue";
import Login from "../views/Login.vue";
import KelolaASM from "../views/KelolaASM.vue";
import Tugas from "../views/Tugas.vue"; // INI YANG KETINGGALAN KAK! 😊

const routes = [
  { path: "/login", name: "Login", component: Login },
  {
    path: "/",
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
  {
    path: "/tugas",
    name: "Tugas",
    component: Tugas,
    meta: { requiresAuth: true },
  },
  {
    path: "/absensi",
    name: "Absensi",
    component: Absensi,
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
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (to.meta.requiresAuth && !session) {
    next({ name: "Login" });
  } else if (to.name === "Login" && session) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;