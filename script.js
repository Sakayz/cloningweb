// script.js — VERSI FINAL LENGKAP (17 Nov 2025)
// Semua fitur + fix login admin + galeri online ImgBB

const IMGBB_API_KEY = '25d031ae01247b7fa78ffc8e9d129f69'; // <<< WAJIB GANTI INI DULU !!!

const GALLERY_KEY = 'khd_gallery_2025';
const ALBUMS = [
  { id: 'perkemahan', name: 'Perkemahan' },
  { id: 'lomba', name: 'Lomba Pramuka' },
  { id: 'pelantikan', name: 'Pelantikan' },
  { id: 'kegiatan-sosial', name: 'Kegiatan Sosial' },
  { id: 'latgab', name: 'Latihan Gabungan' },
  { id: 'upacara', name: 'Upacara Bendera' },
  { id: 'hari-besar', name: 'Hari Besar Nasional' },
  { id: 'kreativitas', name: 'Kreativitas Anggota' },
  { id: 'lainnya', name: 'Lainnya' }
];

// === ANIMASI KETIK "Ki Hajar Dewantara" → "Welcome!" ===
function startTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const text1 = "Ki Hajar Dewantara";
  const text2 = "Welcome!";
  let i = 0, isDeleting = false, currentText = text1;

  function typeWriter() {
    const fullText = currentText;
    if (isDeleting) {
      i--;
    } else {
      i++;
    }

    const displayed = fullText.substring(0, i);
    el.innerHTML = displayed + '<span class="animate-blink">|</span>';

    if (!isDeleting && i === fullText.length) {
      // Selesai ketik, tunggu 1.5 detik lalu hapus
      setTimeout(() => {
        isDeleting = true;
        currentText = text2;
        i = fullText.length;
      }, 1500);
    } else if (isDeleting && i === 0) {
      // Selesai hapus, ganti teks dan mulai ketik lagi
      isDeleting = false;
      currentText = currentText === text1 ? text2 : text1;
      setTimeout(typeWriter, 500);
      return;
    }

    const speed = isDeleting ? 80 : 120;
    setTimeout(typeWriter, speed);
  }
  typeWriter();
}

// === GALERI (LOAD & LIGHTBOX) ===
function getGallery() {
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY)) || {};
  } catch {
    return {};
  }
}

function saveGallery(data) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(data));
}

function loadGallery() {
  const container = document.getElementById('masonry');
  if (!container) return;
  container.innerHTML = '';

  const data = getGallery();
  let hasImages = false;

  ALBUMS.forEach(album => {
    const images = data[album.id] || [];
    if (images.length > 0) {
      hasImages = true;
      const albumDiv = document.createElement('div');
      albumDiv.className = 'mb-8';
      albumDiv.innerHTML = `
        <h3 class="text-2xl font-bold text-maroon mb-6 text-center dark:text-gold">${album.name}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${images.slice(0, 12).map(src => `
            <div class="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer" onclick="openLightbox('${src}')">
              <img src="${src}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110">
            </div>
          `).join('')}
        </div>
        ${images.length > 12 ? `<p class="text-center mt-4 text-sm text-gray-500">+${images.length - 12} foto lagi</p>` : ''}
      `;
      container.appendChild(albumDiv);
    }
  });

  if (!hasImages) {
    container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Belum ada foto kegiatan. Upload dari admin ya!</p></div>';
  }
}

function openLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
  overlay.onclick = () => overlay.remove();
  const img = document.createElement('img');
  img.src = src;
  img.className = 'max-w-full max-h-full rounded-2xl shadow-2xl';
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

// === BIDANG INTI (KLIK = PREVIEW) ===
function loadBidangInti() {
  const container = document.getElementById('anggota-inti-container');
  if (!container) return;

  const bidangList = [
    { nama: 'Kerani', img: '/lhd web 4/assets/kerani.jpg' },
    { nama: 'Giatop', img: '/lhd web 4/assets/giatop.jpg' },
    { nama: 'Bangkert', img: '/lhd web 4/assets/bangkert.jpg' },
    { nama: 'Latdik', img: '/lhd web 4/assets/latdik.jpg' },
    { nama: 'Humcit', img: '/lhd web 4/assets/humcit.jpg' },
    { nama: 'Evbang', img: '/lhd web 4/assets/evbang.jpg' },
  ];

  container.innerHTML = bidangList.map(b => `
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition cursor-pointer"
         onclick="openLightbox('${b.img}')">
      <img src="${b.img}" alt="${b.nama}" class="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-md">
      <h4 class="text-xl font-bold text-maroon dark:text-gold">${b.nama}</h4>
      <p class="text-xs text-gray-600 dark:text-gray-400">Ketua Bidang</p>
    </div>
  `).join('');
}

// === ADMIN FUNCTIONS (LOGIN + UPLOAD + HAPUS) ===
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'admin' && password === 'admin') {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadAdminImages();
    alert('Login berhasil! Selamat datang, Admin Pramuka KHD.');
  } else {
    alert('Username atau password salah! Coba lagi: admin / admin');
  }
}

function logout() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('fileInput').value = '';
  alert('Logout berhasil. Sampai jumpa!');
}

async function uploadFiles() {
  if (IMGBB_API_KEY.includes('GANTI_DENGAN')) {
    return alert('⚠️ Ganti dulu API Key ImgBB di script.js (baris pertama)! Cara: Buka https://api.imgbb.com setelah login ImgBB.');
  }

  const input = document.getElementById('fileInput');
  const albumId = document.getElementById('albumSelect').value;
  const files = input.files;

  if (!files.length) return alert('Pilih foto dulu!');

  const data = getGallery();
  if (!data[albumId]) data[albumId] = [];

  let uploadedCount = 0;
  for (let file of files) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const json = await response.json();
      if (json.success) {
        data[albumId].unshift(json.data.url);
        uploadedCount++;
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  }

  if (uploadedCount > 0) {
    saveGallery(data);
    input.value = '';
    loadGallery(); // Refresh galeri utama
    loadAdminImages(); // Refresh list admin
    alert(`${uploadedCount} foto berhasil di-upload & sudah online permanen! Semua orang bisa lihat sekarang.`);
  } else {
    alert('Gagal upload. Cek koneksi internet atau API key.');
  }
}

function loadAdminImages() {
  const list = document.getElementById('imageList');
  if (!list) return;
  list.innerHTML = '';

  const data = getGallery();
  let hasImages = false;

  ALBUMS.forEach(album => {
    const images = data[album.id] || [];
    if (images.length > 0) {
      hasImages = true;
      const albumTitle = document.createElement('h4');
      albumTitle.className = 'col-span-full text-xl font-bold text-maroon mt-8 mb-4 dark:text-gold';
      albumTitle.textContent = album.name;
      list.appendChild(albumTitle);

      images.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = 'relative group mb-4';
        div.innerHTML = `
          <img src="${src}" class="w-full h-32 object-cover rounded-xl shadow-lg">
          <button onclick="deleteImage('${album.id}', ${index})" 
                  class="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition">
            Hapus
          </button>
        `;
        list.appendChild(div);
      });
    }
  });

  if (!hasImages) {
    list.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">Belum ada foto. Upload dulu!</p>';
  }
}

function deleteImage(albumId, index) {
  if (confirm('Yakin hapus foto ini?')) {
    const data = getGallery();
    data[albumId].splice(index, 1);
    saveGallery(data);
    loadAdminImages();
    loadGallery(); // Refresh galeri utama
    alert('Foto dihapus!');
  }
}

// === CONTACT FORM ===
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !email || !message) return alert('Isi semua kolom dulu!');

  const subject = encodeURIComponent(`Pesan dari ${name} - Pramuka KHD`);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);
  window.location.href = `mailto:hasilkorupsi1000@gmail.com?subject=${subject}&body=${body}`;

  this.reset();
  alert('Pesan terkirim! Cek email admin ya.');
});

// === INIT (JALANKAN SEMUA SAAT HALAMAN LOADING) ===
document.addEventListener('DOMContentLoaded', () => {
  startTyping();
  loadGallery();
  loadBidangInti();

  // Event listener untuk form login (kalau di admin.html)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Dark mode persist
  const isDark = localStorage.getItem('darkMode') === 'true' || 
                 (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  }

  // Navbar active link (opsional)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('text-gold'));
      link.classList.add('text-gold');
    });
  });
});