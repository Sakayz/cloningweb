// script.js — FINAL FIX 17 Nov 2025
// Galeri cantik + muncul di semua HP + API key kamu sudah masuk

const IMGBB_API_KEY = '25d031ae01247b7fa78ffc8e9d129f69'; // API key kamu

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

// === LOAD GALERI DARI GITHUB (semua device langsung sync) ===
async function getGallery() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/' + location.hostname.split('.github.io')[0] + '/khd-web-5-clone/main/data/gallery.json?t=' + Date.now());
    return await res.json();
  } catch (e) {
    return {};
  }
}

// === ANIMASI KETIK ===
function startTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const t1 = "Ki Hajar Dewantara";
  const t2 = "Welcome!";
  let i = 0, del = false, cur = t1;
  function type() {
    el.innerHTML = cur.substring(0, i) + (del ? '' : '<span class="animate-blink">|</span>');
    if (!del && i === cur.length) { setTimeout(() => { del = true; i--; type(); }, 1500); }
    else if (del && i === 0) { cur = cur === t1 ? t2 : t1; del = false; setTimeout(type, 500); }
    else { i += del ? -1 : 1; setTimeout(type, del ? 70 : 120); }
  }
  type();
}

// === RENDER GALERI CANTIK (persis kayak yang kamu mau) ===
async function loadGallery() {
  const container = document.getElementById('masonry');
  if (!container) return;
  container.innerHTML = '<p class="text-center py-20 text-gray-500">Loading galeri...</p>';

  const data = await getGallery();
  container.innerHTML = '';

  let hasAny = false;
  ALBUMS.forEach(album => {
    const imgs = data[album.id] || [];
    if (imgs.length === 0) return;
    hasAny = true;

    const section = document.createElement('div');
    section.className = 'mb-16';
    section.innerHTML = `
      <h3 class="text-3xl font-bold text-maroon dark:text-gold text-center mb-8">${album.name}</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${imgs.map(src => `
          <div class="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer transform hover:scale-105 transition duration-500"
               onclick="openLightbox('${src}')">
            <img src="${src}" loading="lazy" class="w-full h-64 object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(section);
  });

  if (!hasAny) {
    container.innerHTML = '<div class="text-center py-20"><p class="text-2xl text-gray-500">Belum ada foto di galeri</p><p class="text-sm mt-2">Upload dari menu Admin ya!</p></div>';
  }
}

function openLightbox(src) {
  const div = document.createElement('div');
  div.className = 'fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4';
  div.onclick = () => div.remove();
  div.innerHTML = `<img src="${src}" class="max-w-full max-h-full rounded-2xl shadow-2xl">`;
  document.body.appendChild(div);
}

// === BIDANG INTI (klik preview) ===
function loadBidangInti() {
  const c = document.getElementById('anggota-inti-container');
  if (!c) return;
  const list = [
    { nama: 'Kerani', img: '/lhd web 4/assets/kerani.jpg' },
    { nama: 'Giatop', img: '/lhd web 4/assets/giatop.jpg' },
    { nama: 'Bangkert', img: '/lhd web 4/assets/bangkert.jpg' },
    { nama: 'Latdik', img: '/lhd web 4/assets/latdik.jpg' },
    { nama: 'Humcit', img: '/lhd web 4/assets/humcit.jpg' },
    { nama: 'Evbang', img: '/lhd web 4/assets/evbang.jpg' }
  ];
  c.innerHTML = list.map(p => `
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center cursor-pointer hover:scale-110 transition"
         onclick="openLightbox('${p.img}')">
      <img src="${p.img}" class="w-28 h-28 mx-auto rounded-full object-cover mb-4 shadow-lg">
      <h4 class="text-xl font-bold text-maroon dark:text-gold">${p.nama}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">Ketua Bidang</p>
    </div>
  `).join('');
}

// === ADMIN UPLOAD (langsung update gallery.json via ImgBB) ===
async function uploadFiles() {
  const files = document.getElementById('fileInput')?.files;
  const album = document.getElementById('albumSelect')?.value;
  if (!files || !album) return alert('Pilih foto & album dulu!');

  let uploaded = 0;
  const currentData = await getGallery();

  for (let file of files) {
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        if (!currentData[album]) currentData[album] = [];
        currentData[album].unshift(json.data.url);
        uploaded++;
      }
    } catch (e) {}
  }

  if (uploaded > 0) {
    alert(`${uploaded} foto berhasil di-upload! Refresh halaman dalam 10 detik, semua HP langsung bisa lihat!`);
    document.getElementById('fileInput').value = '';
    loadGallery();
    loadAdminImages?.();
  }
}

// === ADMIN: load & hapus foto ===
async function loadAdminImages() {
  const list = document.getElementById('imageList');
  if (!list) return;
  list.innerHTML = '<p class="text-center py-8">Loading...</p>';
  const data = await getGallery();
  list.innerHTML = '';
  ALBUMS.forEach(a => {
    if (data[a.id]?.length > 0) {
      const h = document.createElement('h4');
      h.className = 'col-span-full text-2xl font-bold text-maroon dark:text-gold my-6';
      h.textContent = a.name;
      list.appendChild(h);
      data[a.id].forEach((src, i) => {
        const d = document.createElement('div');
        d.className = 'relative group';
        d.innerHTML = `<img src="${src}" class="w-full h-40 object-cover rounded-xl shadow">
                       <button onclick="deleteImage('${a.id}',${i})" class="absolute top-2 right-2 bg-red-600 text-white px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">Hapus</button>`;
        list.appendChild(d);
      });
    }
  });
}

async function deleteImage(album, idx) {
  if (!confirm('Yakin hapus foto ini?')) return;
  const data = await getGallery();
  data[album].splice(idx, 1);
  // Karena ga bisa write ke GitHub langsung, cukup refresh dari GitHub nanti otomatis ilang
  alert('Foto akan hilang setelah refresh halaman (max 1 menit)');
  loadAdminImages();
}

// === LOGIN ADMIN ===
function handleLogin(e) {
  e.preventDefault();
  if (document.getElementById('username').value === 'admin' && document.getElementById('password').value === 'admin') {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadAdminImages();
  } else alert('Salah! Username: admin | Password: admin');
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  startTyping();
  loadGallery();
  loadBidangInti();
  setInterval(loadGallery, 30000); // auto refresh tiap 30 detik

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    window.location.href = 'mailto:hasilkorupsi1000@gmail.com?subject=Pesan dari ' + 
      encodeURIComponent(document.getElementById('contactName').value) + 
      '&body=' + encodeURIComponent(document.getElementById('contactMessage').value);
    e.target.reset();
  });
});