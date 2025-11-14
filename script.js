// === GALERI DENGAN ALBUM ===
const GALLERY_KEY = 'pramuka_gallery_albums_v2';

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

function getGallery() {
  try {
    const data = JSON.parse(localStorage.getItem(GALLERY_KEY));
    if (!data || typeof data !== 'object') throw new Error();
    // Inisialisasi album kosong jika belum ada
    ALBUMS.forEach(album => {
      if (!data[album.id]) data[album.id] = [];
    });
    return data;
  } catch {
    const empty = {};
    ALBUMS.forEach(album => empty[album.id] = []);
    return empty;
  }
}

function saveGallery(data) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(data));
}

// === Load Galeri Utama (Tampilkan Album) ===
function loadGalleryToPage() {
  const container = document.getElementById('masonry');
  if (!container) return;
  container.innerHTML = '';

  const data = getGallery();
  let hasImages = false;

  ALBUMS.forEach(album => {
    const images = data[album.id] || [];
    if (images.length > 0) {
      hasImages = true;
      // Kolom untuk setiap album
      const albumCol = document.createElement('div');
      albumCol.className = 'bg-white p-4 rounded-xl shadow-lg dark:bg-gray-800';

      // Judul Album
      const title = document.createElement('h3');
      title.className = 'text-2xl font-bold text-maroon mb-4 dark:text-gold';
      title.textContent = album.name;
      albumCol.appendChild(title);

      // Grid gambar (2 kolom mobile, 3 kolom desktop)
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-2 md:grid-cols-3 gap-4';
      images.forEach((src, index) => {
        const imgDiv = addImageToGrid(grid, src);
        if (index >= 7) {
          imgDiv.classList.add('hidden');
        }
      });
      albumCol.appendChild(grid);

      // Tombol Show More jika >7 gambar
      if (images.length > 7) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'mt-4 bg-maroon text-white px-4 py-2 rounded-full font-bold hover:bg-maroon/90 transition dark:bg-gold dark:text-maroon dark:hover:bg-gold/90';
        showMoreBtn.textContent = 'Lihat Semua';
        showMoreBtn.onclick = () => {
          grid.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
          showMoreBtn.remove();
        };
        albumCol.appendChild(showMoreBtn);
      }

      container.appendChild(albumCol);
    }
  });

  if (!hasImages) {
    const placeholders = ['assets/placeholder3.svg', 'assets/placeholder4.svg', 'assets/placeholder5.svg'];
    placeholders.forEach(src => addImageToMasonry(src));
  }
}

function addImageToGrid(parent, src) {
  const div = document.createElement('div');
  div.className = 'relative overflow-hidden rounded-xl shadow-lg group cursor-pointer';
  const img = document.createElement('img');
  img.src = src;
  img.className = 'w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110';
  img.onclick = () => openLightbox(src);
  div.appendChild(img);
  parent.appendChild(div);
  return div;
}

function addImageToMasonry(src) {
  const container = document.getElementById('masonry');
  const div = document.createElement('div');
  div.className = 'relative overflow-hidden rounded-xl shadow-lg group cursor-pointer';
  const img = document.createElement('img');
  img.src = src;
  img.className = 'w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110';
  img.onclick = () => openLightbox(src);
  div.appendChild(img);
  container.appendChild(div);
}

function openLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
  overlay.onclick = () => overlay.remove();
  const img = document.createElement('img');
  img.src = src;
  img.className = 'max-w-full max-h-full rounded-xl shadow-2xl';
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

// === LOAD ANGGOTA INTI ===
function loadAnggotaInti() {
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
    <div class="bg-white p-5 rounded-xl shadow-lg text-center transform hover:scale-105 transition dark:bg-gray-800">
      <img src="${b.img}" alt="${b.nama}" class="w-20 h-20 mx-auto rounded-full object-cover mb-3 shadow-md">
      <h4 class="font-bold text-maroon text-sm dark:text-gold">${b.nama}</h4>
      <p class="text-xs text-gray-600 dark:text-gray-400">Ketua Bidang</p>
    </div>
  `).join('');
}

// === ADMIN FUNCTIONS ===
function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (u === 'admin' && p === 'admin') {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadAdminImages();
  } else {
    alert('Username atau password salah!');
  }
}

function logout() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function uploadFiles() {
  const input = document.getElementById('fileInput');
  const albumId = document.getElementById('albumSelect')?.value || 'lainnya';
  const files = input.files;
  if (!files.length) return alert('Pilih gambar dulu!');

  const data = getGallery();
  let loaded = 0;

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!data[albumId]) data[albumId] = [];
      data[albumId].unshift(e.target.result);
      loaded++;
      if (loaded === files.length) {
        saveGallery(data);
        loadAdminImages();
        input.value = '';
        alert('Upload selesai!');
      }
    };
    reader.readAsDataURL(file);
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
      const title = document.createElement('h4');
      title.className = 'col-span-full text-lg font-bold text-maroon mt-6 mb-2 dark:text-gold';
      title.textContent = album.name;
      list.appendChild(title);

      images.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'relative group';
        const img = document.createElement('img');
        img.src = src;
        img.className = 'w-full h-32 object-cover rounded-lg shadow';
        const btn = document.createElement('button');
        btn.textContent = 'Hapus';
        btn.className = 'absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition';
        btn.onclick = () => {
          if (confirm('Hapus gambar ini?')) {
            data[album.id].splice(i, 1);
            saveGallery(data);
            loadAdminImages();
          }
        };
        div.appendChild(img);
        div.appendChild(btn);
        list.appendChild(div);
      });
    }
  });

  if (!hasImages) {
    list.innerHTML = '<p class="col-span-full text-center text-gray-500">Belum ada gambar.</p>';
  }
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  loadGalleryToPage();
  loadAnggotaInti();

  // Smooth active nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('text-gold'));
      link.classList.add('text-gold');
    });
  });

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Pesan terkirim! (Simulasi)');
      form.reset();
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Dark mode sync
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }

  document.querySelectorAll('[x-data] button').forEach(btn => {
    if (btn.innerHTML.includes('fa-moon') || btn.innerHTML.includes('fa-sun')) {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark ? 'false' : 'true');
      });
    }
  });
});

// refresions
// https://grok.com/share/c2hhcmQtMg%3D%3D_e31a1483-9cd7-4898-9ff1-91b0f07aa919

// === CONTACT FORM - Kirim ke Gmail ===
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !email || !message) {
    alert('Harap isi semua kolom!');
    return;
  }

  // GANTI DENGAN EMAIL KAMU SENDIRI
  const yourEmail = 'hasilkorupsi1000@gmail.com'; // <-- UBAH DI SINI

  const subject = encodeURIComponent(`Pesan dari ${name} - Pramuka KHD`);
  const body = encodeURIComponent(
    `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
  );

  const mailtoLink = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
  
  // Buka aplikasi email default
  window.location.href = mailtoLink;

  // Optional: Reset form setelah klik
  setTimeout(() => {
    document.getElementById('contactForm').reset();
  }, 1000);
});