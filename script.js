document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeSidebar');
  const searchIcon = document.getElementById('searchIcon');
  const searchBar = document.getElementById('searchBar');
  const musicIcon = document.getElementById('musicIcon');
  const userIcon = document.getElementById('userIcon');
  const musicPopup = document.getElementById('musicPopup');
  const userPopup = document.getElementById('userPopup');

  // ✅ Sidebar buka/tutup
  menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
  closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

  // ✅ Search bar toggle
  searchIcon.addEventListener('click', () => searchBar.classList.toggle('active'));

  /*Music login*/
  function togglePopup(popup) {
  const allPopups = [musicPopup, userPopup];

  allPopups.forEach(p => {
    if (p !== popup && p.classList.contains('active')) {
      p.classList.remove('active');
      p.classList.add('hide');
      setTimeout(() => p.classList.remove('hide'), 300);
    }
  });

  if (popup.classList.contains('active')) {
    popup.classList.remove('active');
    popup.classList.add('hide');
    setTimeout(() => popup.classList.remove('hide'), 300);
  } else {
    popup.classList.add('active');
    popup.classList.remove('hide');
  }
}

musicIcon.addEventListener('click', e => {
  e.stopPropagation();
  togglePopup(musicPopup);
});

userIcon.addEventListener('click', e => {
  e.stopPropagation();
  togglePopup(userPopup);
});

// klik luar popup
document.addEventListener('click', e => {
  [musicPopup, userPopup].forEach(p => {
    if (!p.contains(e.target) &&
        !musicIcon.contains(e.target) &&
        !userIcon.contains(e.target) &&
        p.classList.contains('active')) {
      p.classList.remove('active');
      p.classList.add('hide');
      setTimeout(() => p.classList.remove('hide'), 300);
    }
  });
});


  // ✅ Scroll ke trending
  const beliBtn = document.getElementById('beliBtn');
  if (beliBtn) {
    beliBtn.addEventListener('click', () => {
      const trending = document.getElementById('trending');
      const offset = trending.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  }

  document.getElementById('trending').addEventListener('click', (e) => {
  const card = e.target.closest('.card-game');
  if (!card) return;

  let gameId = card.dataset.game;
  if (!gameId) {
    const p = card.querySelector('p');
    gameId = p ? p.textContent.trim().replace(/\s+/g, '-').toLowerCase() : '';
  }

  if (gameId) {
    window.location.href = `topup.html?game=${encodeURIComponent(gameId)}`;
  }
});



  /* =============================
     ✅ PEMUTAR MUSIK
  ==============================*/
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const defaultMusicSelect = document.getElementById('defaultMusicSelect');
const bgMusic = document.getElementById('bgMusic');

lucide.createIcons();

// MAINKAN MUSIK SESUAI YANG DIPILIH
playBtn.addEventListener('click', () => {

  // Kalau belum ada musik → ambil dari dropdown
  if (!bgMusic.src || bgMusic.src === '' || bgMusic.src.includes('null')) {
    bgMusic.src = defaultMusicSelect.value;
    localStorage.setItem('bgMusicSrc', bgMusic.src);
  }

  // PLAY / PAUSE
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    playBtn.innerHTML = '<i data-lucide="pause"></i>';
  } else {
    bgMusic.pause();
    playBtn.innerHTML = '<i data-lucide="play"></i>';
  }

  lucide.createIcons();
});


// STOP
stopBtn.addEventListener('click', () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  playBtn.innerHTML = '<i data-lucide="play"></i>';
  lucide.createIcons();
});


// GANTI LAGU SAAT DROPDOWN DIGANTI
defaultMusicSelect.addEventListener('change', () => {
  bgMusic.src = defaultMusicSelect.value;
  localStorage.setItem('bgMusicSrc', bgMusic.src);

  bgMusic.play().catch(() => {});
  playBtn.innerHTML = '<i data-lucide="pause"></i>';
  lucide.createIcons();
});


// LOAD LAGU TERAKHIR
const savedMusic = localStorage.getItem('bgMusicSrc');
if (savedMusic) {
  bgMusic.src = savedMusic;
}


  /* =============================
     ✅ LOGIN / LOGOUT USER
  ==============================*/
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginForm = document.getElementById('loginForm');
  const logoutSection = document.getElementById('logoutSection');
  const userDisplay = document.getElementById('userDisplay');

  loginBtn.addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    if (user) {
      localStorage.setItem('loggedUser', user);
      updateUserState();
      userPopup.classList.remove('active'); // tutup popup setelah login
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    updateUserState();
  });

  function updateUserState() {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      loginForm.style.display = 'none';
      logoutSection.style.display = 'block';
      userDisplay.textContent = user;
    } else {
      loginForm.style.display = 'block';
      logoutSection.style.display = 'none';
    }
  }
  updateUserState();

  /* =============================
     ✅ KATEGORI + SEARCH TERPADU
  ==============================*/
  const catBtns = document.querySelectorAll('.cat-btn');
  const categoriesSection = document.getElementById('categories');
  const categoryContent = document.getElementById('category-content');
  const searchInput = document.getElementById('searchBar');

  const dataKategori = {
    game: [
    { nama: 'Mobile Legends', img: 'assets/game/ml.png', id: 'ml' },
    { nama: 'Free Fire', img: 'assets/game/ff.png', id: 'ff' },
    { nama: 'Genshin Impact', img: 'assets/game/genshin.png', id: 'genshin' },
    { nama: 'PUBG Mobile', img: 'assets/game/pubg.png', id: 'pubg' },
    { nama: 'Roblox', img: 'assets/game/roblox.png', id: 'roblox' },
    { nama: 'Honor of Kings', img: 'assets/game/hok.png', id: 'hok' },
    { nama: 'Call of Duty Mobile', img: 'assets/game/codm.png', id: 'codm' },
    { nama: 'Valorant', img: 'assets/game/valorant.png', id: 'valorant' },
    { nama: 'Point Blank', img: 'assets/game/pb.png', id: 'pb' },
    { nama: 'Clash of Clans', img: 'assets/game/coc.png', id: 'coc' },
    { nama: 'Clash Royale', img: 'assets/game/cr.png', id: 'cr' },
    { nama: 'UmaMusume: Pretty Derby', img: 'assets/game/umamusume.png', id: 'umamusume' },
    { nama: 'Apex Legends Mobile', img: 'assets/game/apex.png', id: 'apex' },
    { nama: 'League of Legends Wild Rift', img: 'assets/game/wildrift.png', id: 'wildrift' },
    { nama: 'Dota 2', img: 'assets/game/dota2.png', id: 'dota2' },
    { nama: 'Arena of Valor', img: 'assets/game/aov.png', id: 'aov' },
    { nama: 'Stumble Guys', img: 'assets/game/stumble.png', id: 'stumble' },
    { nama: 'Honkai Star Rail', img: 'assets/game/hsr.png', id: 'hsr' },
    { nama: 'Honkai Impact 3', img: 'assets/game/hi3.png', id: 'hi3' },
    { nama: 'Minecraft', img: 'assets/game/minecraft.png', id: 'minecraft' },
    { nama: 'Fortnite', img: 'assets/game/fortnite.png', id: 'fortnite' },
    { nama: 'EA FC Mobile', img: 'assets/game/fcmobile.png', id: 'fcmobile' },
    { nama: 'eFootball', img: 'assets/game/efootball.png', id: 'efootball' },
    { nama: 'Ragnarok X', img: 'assets/game/rox.png', id: 'rox' },
    { nama: 'Ragnarok M', img: 'assets/game/rom.png', id: 'rom' },
    { nama: 'Tower of Fantasy', img: 'assets/game/tof.png', id: 'tof' },
    { nama: 'Zepeto', img: 'assets/game/zepeto.png', id: 'zepeto' },
    { nama: 'Super Sus', img: 'assets/game/supersus.png', id: 'supersus' },
    { nama: 'Life After', img: 'assets/game/lifeafter.png', id: 'lifeafter' },
    { nama: 'Lords Mobile', img: 'assets/game/lordsmobile.png', id: 'lordsmobile' },
    { nama: 'State of Survival', img: 'assets/game/sos.png', id: 'sos' },
    { nama: 'Marvel Super War', img: 'assets/game/msw.png', id: 'msw' },
    { nama: 'One Punch Man: The Strongest', img: 'assets/game/opm.png', id: 'opm' },
    { nama: 'BLEACH Brave Souls', img: 'assets/game/bleach.png', id: 'bleach' },
    { nama: 'The Sims Mobile', img: 'assets/game/sims.png', id: 'sims' },
    { nama: 'Sausage Man', img: 'assets/game/sausageman.png', id: 'sausageman' },
    { nama: 'Naruto Slugfest', img: 'assets/game/naruto.png', id: 'naruto' },
    { nama: 'Ultraman Legend of Heroes', img: 'assets/game/ultraman.png', id: 'ultraman' },
    { nama: 'Growtopia', img: 'assets/game/growtopia.png', id: 'growtopia' },
    { nama: 'Dragon Nest M', img: 'assets/game/dragonnestm.png', id: 'dragonnestm' },
    { nama: 'Cookie Run Kingdom', img: 'assets/game/cookierun.png', id: 'cookierun' },
    { nama: 'Goddess of Victory: Nikke', img: 'assets/game/nikke.png', id: 'nikke' },
    { nama: 'Wuthering Waves', img: 'assets/game/wutheringwaves.png', id: 'wutheringwaves' },
    { nama: 'Identity V', img: 'assets/game/identityv.png', id: 'identityv' },
    { nama: 'Azur Lane', img: 'assets/game/azurlane.png', id: 'azurlane' },
    { nama: 'Arknights', img: 'assets/game/arknights.png', id: 'arknights' },
    { nama: 'Blue Archive', img: 'assets/game/bluearchive.png', id: 'bluearchive' },
  ],

  // ===========================
  //           JOKI
  // ===========================
  joki: [
    { nama: 'Joki Rank Mobile Legends', img: 'assets/game/ml.png', id: 'joki-ml' },
    { nama: 'Joki Rank Free Fire', img: 'assets/game/ff.png', id: 'joki-ff' },
    { nama: 'Joki Genshin Impact', img: 'assets/game/genshin.png', id: 'joki-genshin' },
    { nama: 'Joki PUBG Rank', img: 'assets/game/pubg.png', id: 'joki-pubg' },
    { nama: 'Joki Roblox Quest', img: 'assets/game/roblox.png', id: 'joki-roblox' },
    { nama: 'Joki Honor of Kings', img: 'assets/game/hok.png', id: 'joki-hok' },
    { nama: 'Joki COD Mobile', img: 'assets/game/codm.png', id: 'joki-codm' },
    { nama: 'Joki Valorant Rank', img: 'assets/game/valorant.png', id: 'joki-valorant' },
    { nama: 'Joki Point Blank', img: 'assets/game/pb.png', id: 'joki-pb' },
    { nama: 'Joki Stumble Guys', img: 'assets/game/stumble.png', id: 'joki-stumble' },
    { nama: 'Joki Clash Royale', img: 'assets/game/cr.png', id: 'joki-cr' },
    { nama: 'Joki Wild Rift', img: 'assets/game/wildrift.png', id: 'joki-wildrift' },
    { nama: 'Joki Dota 2 Rank', img: 'assets/game/dota2.png', id: 'joki-dota2' },
    { nama: 'Joki Apex Legends', img: 'assets/game/apex.png', id: 'joki-apex' },
  ],

  // ===========================
  //          VOUCHER
  // ===========================
  voucher: [
    { nama: 'Google Play Voucher', img: 'assets/voucher/gplay.png', id: 'gplay' },
    { nama: 'Steam Wallet', img: 'assets/voucher/steam.png', id: 'steam' },
    { nama: 'PlayStation Voucher', img: 'assets/voucher/psn.png', id: 'psn' },
    { nama: 'Garena Shell', img: 'assets/voucher/shell.png', id: 'shell' },
    { nama: 'UniPin Voucher', img: 'assets/voucher/unipin.png', id: 'unipin' },
    { nama: 'Razer Gold', img: 'assets/voucher/razer.png', id: 'razer' },
    { nama: 'Xbox Gift Card', img: 'assets/voucher/xbox.png', id: 'xbox' },
    { nama: 'Nintendo eShop Card', img: 'assets/voucher/nintendo.png', id: 'nintendo' },
    { nama: 'Battle.net Balance', img: 'assets/voucher/battlenet.png', id: 'battlenet' },
    { nama: 'Codashop Voucher', img: 'assets/voucher/codashop.png', id: 'codashop' },
  ],

  // ===========================
  //           PULSA
  // ===========================
  pulsa: [
    { nama: 'Telkomsel', img: 'assets/pulsa/telkomsel.png', id: 'telkomsel' },
    { nama: 'XL', img: 'assets/pulsa/xl.png', id: 'xl' },
    { nama: 'Indosat', img: 'assets/pulsa/indosat.png', id: 'indosat' },
    { nama: 'Axis', img: 'assets/pulsa/axis.png', id: 'axis' },
    { nama: 'Smartfren', img: 'assets/pulsa/smartfren.png', id: 'smartfren' },
    { nama: 'Tri 3', img: 'assets/pulsa/tri.png', id: 'tri' },
    { nama: 'by.U', img: 'assets/pulsa/byu.png', id: 'byu' },
  ],

  // ===========================
  //         STREAMING
  // ===========================
  Streaming: [
    { nama: 'Netflix', img: 'assets/streaming/netflix.png', id: 'netflix' },
    { nama: 'YouTube Premium', img: 'assets/streaming/ytprem.png', id: 'ytprem' },
    { nama: 'Spotify', img: 'assets/streaming/spotify.png', id: 'spotify' },
    { nama: 'Vidio', img: 'assets/streaming/vidio.png', id: 'vidio' },
    { nama: 'Disney+ Hotstar', img: 'assets/streaming/disney.png', id: 'disney' },
    { nama: 'Amazon Prime Video', img: 'assets/streaming/prime.png', id: 'prime' },
    { nama: 'WeTV', img: 'assets/streaming/wetv.png', id: 'wetv' },
    { nama: 'iQIYI', img: 'assets/streaming/iqiyi.png', id: 'iqiyi' },
    { nama: 'Bstation', img: 'assets/streaming/bstation.png', id: 'bstation' },
    { nama: 'Apple TV+', img: 'assets/streaming/appletv.png', id: 'appletv' },
    { nama: 'Crunchyroll', img: 'assets/streaming/crunchyroll.png', id: 'crunchyroll' },
    { nama: 'JOOX VIP', img: 'assets/streaming/joox.png', id: 'joox' },
  ]
  };

  let currentCategory = 'game';
const catBtn = document.querySelectorAll('.cat-btn');

catBtns.forEach(btn => {
  // Hover masuk → kuning
  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#ffb700';
    btn.style.color = '#0a1822';
  });

  // Hover keluar → kembali ke aktif atau default
  btn.addEventListener('mouseleave', () => {
    if (btn.classList.contains('active')) {
      btn.style.background = '#00aaff';
      btn.style.color = '#0a1822';
    } else {
      btn.style.background = '#15243c';
      btn.style.color = 'white';
    }
  });

  // Klik → set aktif
  btn.addEventListener('click', () => {
    setActiveCategory(btn.dataset.cat);
  });
});

// Fungsi setActiveCategory tetap sama
function setActiveCategory(catName) {
  catBtns.forEach(btn => {
    if (btn.dataset.cat === catName) {
      btn.classList.add('active');
      btn.style.background = '#00aaff';
      btn.style.color = '#0a1822';
    } else {
      btn.classList.remove('active');
      btn.style.background = '#15243c';
      btn.style.color = 'white';
    }
  });
}

  function createGameCard(item) {
    const div = document.createElement('div');
    div.className = 'game-card';
    div.dataset.game = item.id || item.nama.replace(/\s+/g, '-').toLowerCase();
    div.innerHTML = `<img src="${item.img}" alt="${item.nama}"><p>${item.nama}</p>`;
    div.addEventListener('click', () => {
      window.location.href = `topup.html?game=${encodeURIComponent(div.dataset.game)}`;
    });
    return div;
  }

  function tampilkanKategori(kategori) {
    currentCategory = kategori;
    setActiveCategory(kategori);
    categoryContent.innerHTML = '';
    dataKategori[kategori].forEach(item => categoryContent.appendChild(createGameCard(item)));
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tampilkanKategori(btn.dataset.cat);
      searchInput.value = '';
    });
  });

  tampilkanKategori('game');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const y = categoriesSection.getBoundingClientRect().top + window.scrollY - 80;
window.scrollTo({ top: y, behavior: 'smooth' });

    if (!query) {
      tampilkanKategori(currentCategory);
      return;
    }

    categoryContent.innerHTML = '';
    Object.values(dataKategori).flat().forEach(item => {
      if (item.nama.toLowerCase().includes(query)) {
        categoryContent.appendChild(createGameCard(item));
      }
    });

    if (!categoryContent.children.length) {
      categoryContent.innerHTML = `<p style="color:#ff7777;">Tidak ditemukan hasil untuk "<b>${query}</b>"</p>`;
    }

    // reset tombol kategori
    catBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = '#15243c';
      btn.style.color = 'white';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const announcementPopup = document.getElementById('announcementPopup');
  const closeBtn = document.getElementById('closeAnnouncement');

  // Muncul otomatis
  setTimeout(() => {
    announcementPopup.classList.add('active');
  }, 500);

  // Tutup popup saat klik tombol X
  closeBtn.addEventListener('click', () => {
    announcementPopup.classList.remove('active');
    announcementPopup.classList.add('hide');
    setTimeout(() => announcementPopup.classList.remove('hide'), 300);
  });

  // Tutup popup jika klik di luar
  document.addEventListener('click', (e) => {
    if (!announcementPopup.contains(e.target) && !closeBtn.contains(e.target)) {
      if (announcementPopup.classList.contains('active')) {
        announcementPopup.classList.remove('active');
        announcementPopup.classList.add('hide');
        setTimeout(() => announcementPopup.classList.remove('hide'), 300);
      }
    }
  });
});

const announcementPopup = document.querySelector('.announcement-popup');
const announcementOverlay = document.querySelector('.announcement-overlay');
const closeBtn = document.querySelector('.announcement-close');

// buka popup saat load
window.addEventListener('load', () => {
  setTimeout(() => {
    announcementPopup.classList.add('active');
    announcementOverlay.classList.add('active');
  }, 500); // delay biar smooth
});

// tutup popup
function closeAnnouncement() {
  announcementPopup.classList.remove('active');
  announcementPopup.classList.add('hide');

  announcementOverlay.classList.remove('active');
  announcementOverlay.classList.add('hide');

  // hapus class hide setelah animasi selesai
  setTimeout(() => {
    announcementPopup.classList.remove('hide');
    announcementOverlay.classList.remove('hide');
  }, 300);
}

// klik close atau overlay
closeBtn.addEventListener('click', closeAnnouncement);
announcementOverlay.addEventListener('click', closeAnnouncement);

const closeBtn2 = document.querySelector('.announcement-close');
const dontShowToday = document.getElementById('dontShowToday');

// ❗ Cek apakah boleh tampil hari ini
function canShowAnnouncement() {
  const hideUntil = localStorage.getItem('hideAnnouncementUntil');
  if (!hideUntil) return true;
  return Date.now() > parseInt(hideUntil);
}

// ❗ Simpan pilihan user
function saveDontShowToday() {
  if (dontShowToday.checked) {
    const expireTime = Date.now() + (24 * 60 * 60 * 1000); // 24 jam
    localStorage.setItem('hideAnnouncementUntil', expireTime);
  }
}

// ❗ Buka popup
window.addEventListener('load', () => {
  if (!canShowAnnouncement()) return; // ❌ jangan tampilkan

  setTimeout(() => {
    announcementPopup.classList.add('active');
    announcementOverlay.classList.add('active');
  }, 500);
});

// ❗ Tutup popup function
function closeAnnouncement() {
  saveDontShowToday(); // simpan status checkbox

  announcementPopup.classList.remove('active');
  announcementPopup.classList.add('hide');

  announcementOverlay.classList.remove('active');
  announcementOverlay.classList.add('hide');

  setTimeout(() => {
    announcementPopup.classList.remove('hide');
    announcementOverlay.classList.remove('hide');
  }, 300);
}

// ❗ Klik tombol X
closeBtn2.addEventListener('click', closeAnnouncement);

// ❗ Klik overlay
announcementOverlay.addEventListener('click', closeAnnouncement);
