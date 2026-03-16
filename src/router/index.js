import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase' // PENTING: Import supabase

// Sesuaikan dengan jalur import yang berhasil (pakai ../ atau @/)
import Dashboard from '../views/Dashboard.vue'
import Absensi from '../views/Absensi.vue'
import Penilaian from '../views/Penilaian.vue'
import Login from '../views/Login.vue' // Import komponen Login baru

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true } // Tandai halaman ini butuh login
  },
  { 
    path: '/absensi', 
    name: 'Absensi', 
    component: Absensi,
    meta: { requiresAuth: true }
  },
  { 
    path: '/penilaian', 
    name: 'Penilaian', 
    component: Penilaian,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// === LOGIKA GEMBOK (ROUTE GUARD) ===
router.beforeEach(async (to, from, next) => {
  // Cek apakah user sedang login di Supabase
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    // Jika halaman butuh login TAPI belum login -> Lempar ke /login
    next({ name: 'Login' })
  } else if (to.name === 'Login' && session) {
    // Jika sudah login TAPI mencoba buka halaman login -> Lempar ke Dashboard
    next({ name: 'Dashboard' })
  } else {
    // Sisanya, biarkan lewat
    next()
  }
})

export default router