// script.js — FINAL VERSION (17 Nov 2025)
// Semua fitur + galeri online permanen pake ImgBB

const IMGBB_API_KEY = '25d031ae01247b7fa78ffc8e9d129f69'; // <<< WAJIB GANTI INI !!!

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

// === ANIMASI KETIK ===
function startTyping() {
  const el = document.getElementById('typing-text');
  const text1 = "Ki Hajar Dewantara";
  const text2 = "Welcome!";
  let i = 0, dir = 1, current = text1;

  function type() {
    if (dir === 1 && i === text1.length + 10) { current = text2; dir = -1; i = text2.length; }
    if (dir === -1 && i === 0) { current = text1; dir = 1; }
    el.textContent = current.slice(0, i) + "|";
    i += dir;
    setTimeout(type, dir === 1 ? 120 : 80);
  }
  type();
}

// === GALERI ONLINE ===
function getGallery() {
  return JSON.parse(localStorage.getItem('khd_gallery_2025') || '{}');
}
function saveGallery(data) {
  localStorage.setItem('khd_gallery_2025', JSON.stringify(data));
}

function loadGallery() {
  const container = document.getElementById('masonry');
  container.innerHTML = '';
  const data = getGallery();
  let hasImg = false;

  ALBUMS.forEach(album => {
    if (data[album.id] && data[album.id].length > 0) {
      hasImg = true;
      const section = document.createElement('div');
      section.className = 'mb-12';
      section.innerHTML = `<h3 class="text-2xl font-bold text-maroon dark:text-gold mb-6">${album.name}</h3>`;
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      data[album.id].forEach(src => {
        const div = document.createElement('div');
        div.className = 'relative overflow-hidden rounded-xl shadow-lg cursor-pointer group';
        div.innerHTML = `<img src="${src}" class="w-full h-auto object-cover transition group-hover:scale-110" onclick="openLightbox('${src}')">`;
        grid.appendChild(div);
      });
      section.appendChild(grid);
      container.appendChild(section);
    }
  });

  if (!hasImg) container.innerHTML = '<p class="text-center col-span-full text-gray-500">Belum ada foto :(</p>';
}

function openLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
  overlay.innerHTML = `<img src="${src}" class="max-w-full max-h-full rounded-2xl">`;
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

// === BIDANG INTI (klik = preview) ===
function loadBidangInti() {
  const container = document.getElementById('anggota-inti-container');
  const list = [
    { nama: 'Kerani', img: '/lhd web 4/assets/kerani.jpg' },
    { nama: 'Giatop', img: '/lhd web 4/assets/giatop.jpg' },
    { nama: 'Bangkert', img: '/lhd web 4/assets/bangkert.jpg' },
    { nama: 'Latdik', img: '/lhd web 4/assets/latdik.jpg' },
    { nama: 'Humcit', img: '/lhd web 4/assets/humcit.jpg' },
    { nama: 'Evbang', img: '/lhd web 4/assets/evbang.jpg' },
  ];
  container.innerHTML = list.map(p => `
    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg text-center cursor-pointer hover:scale-105 transition"
         onclick="openLightbox('${p.img}')">
      <img src="${p.img}" class="w-24 h-24 mx-auto rounded-full object-cover mb-3 shadow-md">
      <h4 class="font-bold text-maroon dark:text-gold">${p.nama}</h4>
      <p class="text-xs text-gray-600 dark:text-gray-400">Ketua Bidang</p>
    </div>
  `).join('');
}

// === ADMIN UPLOAD (di admin.html) ===
async function uploadFiles() {
  if (IMGBB_API_KEY.includes('GANTI_DENGAN')) return alert('Ganti dulu API Key ImgBB di script.js!');
  const files = document.getElementById('fileInput').files;
  const album = document.getElementById('albumSelect').value;
  if (!files.length) return alert('Pilih foto dulu!');

  let gallery = getGallery();
  if (!gallery[album]) gallery[album] = [];

  for (let file of files) {
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: form });
      const json = await res.json();
      if (json.success) gallery[album].unshift(json.data.url);
    } catch (e) { console.error(e); }
  }
  saveGallery(gallery);
  alert('Upload selesai! Foto sudah online permanen!');
  loadGallery();
  loadAdminImages?.();
}

// === CONTACT FORM ===
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const msg = document.getElementById('contactMessage').value;
  window.location.href = `mailto:hasilkorupsi1000@gmail.com?subject=Pesan dari ${name}&body=Nama: ${name}%0AEmail: ${email}%0A%0A${msg}`;
  this.reset();
});

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  startTyping();
  loadGallery();
  loadBidangInti();

  // Dark mode persist
  if (localStorage.getItem('darkMode') === 'true' || (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
});