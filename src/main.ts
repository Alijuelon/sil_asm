import { createApp } from 'vue'
import './style.css' // Pastikan ini ada agar Tailwind CSS berfungsi
import App from './App.vue'
import router from './router' // Mengambil konfigurasi router dari folder router/index.js

const app = createApp(App)

// INI BAGIAN PALING PENTING: Mendaftarkan router ke aplikasi
app.use(router) 

app.mount('#app')