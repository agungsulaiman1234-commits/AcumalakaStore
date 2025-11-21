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

  /* =============================
     ✅ TOGGLE POPUP MUSIC & LOGIN
  ==============================*/
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

  /* =============================
     ✅ PEMUTAR MUSIK
  ==============================*/
  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const defaultMusicSelect = document.getElementById('defaultMusicSelect');
  const bgMusic = document.getElementById('bgMusic');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // MAINKAN MUSIK SESUAI YANG DIPILIH
  playBtn.addEventListener('click', () => {
    if (!bgMusic.src || bgMusic.src === '' || bgMusic.src.includes('null')) {
      bgMusic.src = defaultMusicSelect.value;
      localStorage.setItem('bgMusicSrc', bgMusic.src);
    }

    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      playBtn.innerHTML = '<i data-lucide="pause"></i>';
    } else {
      bgMusic.pause();
      playBtn.innerHTML = '<i data-lucide="play"></i>';
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  stopBtn.addEventListener('click', () => {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    playBtn.innerHTML = '<i data-lucide="play"></i>';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  defaultMusicSelect.addEventListener('change', () => {
    bgMusic.src = defaultMusicSelect.value;
    localStorage.setItem('bgMusicSrc', bgMusic.src);
    bgMusic.play().catch(() => {});
    playBtn.innerHTML = '<i data-lucide="pause"></i>';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

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
      userPopup.classList.remove('active');
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
     ✅ FUNGSI POPUP TOPUP
  ==============================*/
  function showTopupPopup(orderData) {
    const popup = document.getElementById('topupPopup');
    
    const popupContent = `
      <h3>Pesanan Berhasil Dibuat!</h3>
      <hr>
      
      <div class="popup-info">
        <p><strong>Game:</strong> <span>${orderData.game}</span></p>
        <p><strong>ID:</strong> <span>${orderData.userData}</span></p>
        <p><strong>Nominal:</strong> <span class="highlight">${orderData.nominal}</span></p>
        <p><strong>Pembayaran:</strong> <span class="highlight">${orderData.payment}</span></p>
      </div>
      
      <p class="instruction">Silakan lakukan pembayaran sesuai instruksi yang diberikan</p>
      
      <button class="closePopup" onclick="closeTopupPopup()">Mengerti</button>
    `;
    
    popup.innerHTML = popupContent;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Function close popup (dibuat global)
  window.closeTopupPopup = function() {
    const popup = document.getElementById('topupPopup');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  // Close popup dengan ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const popup = document.getElementById('topupPopup');
      if (popup.classList.contains('active')) {
        closeTopupPopup();
      }
    }
  });

  /* =============================
     ✅ GENERATE TOPUP FORM DINAMIS
  ==============================*/
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('game');
  
  const rightPanel = document.getElementById('right-panel');
  const titleEl = document.getElementById('game-title');
  const subtitleEl = document.getElementById('game-subtitle');
  const coverEl = document.getElementById('gameCover');


const games = {
  // ===========================
  //          GAME
  // ===========================
  ml: { 
    name: 'Mobile Legends', 
    cover: 'assets/game/ml.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Moonton • Topup Diamond', 
    nominal: [
      {name:'Weekly Pass', price:'Rp28.000'},
      {name:'3 Diamond', price:'Rp1.500'},
      {name:'5 Diamond', price:'Rp1.800'},
      {name:'12 Diamond', price:'Rp4.000'},
      {name:'19 Diamond', price:'Rp6.000'},
      {name:'28 Diamond', price:'Rp9.000'},
      {name:'36 Diamond', price:'Rp11.000'},
      {name:'44 Diamond', price:'Rp13.000'},
      {name:'53 Diamond', price:'Rp15.000'},
      {name:'59 Diamond', price:'Rp17.000'},
      {name:'74 Diamond', price:'Rp19.000'},
      {name:'86 Diamond', price:'Rp20.000'},
      {name:'112 Diamond', price:'Rp28.000'},
      {name:'172 Diamond', price:'Rp40.000'},
      {name:'185 Diamond', price:'Rp43.000'},
      {name:'222 Diamond', price:'Rp52.000'},
      {name:'257 Diamond', price:'Rp60.000'},
      {name:'296 Diamond', price:'Rp69.000'},
      {name:'344 Diamond', price:'Rp80.000'},
      {name:'370 Diamond', price:'Rp86.000'},
      {name:'429 Diamond', price:'Rp100.000'},
      {name:'514 Diamond', price:'Rp120.000'},
      {name:'568 Diamond', price:'Rp132.000'},
      {name:'600 Diamond', price:'Rp140.000'},
      {name:'706 Diamond', price:'Rp160.000'},
      {name:'792 Diamond', price:'Rp184.000'},
      {name:'878 Diamond', price:'Rp200.000'},
      {name:'963 Diamond', price:'Rp220.000'},
      {name:'1050 Diamond', price:'Rp240.000'},
      {name:'1135 Diamond', price:'Rp260.000'},
      {name:'1222 Diamond', price:'Rp280.000'},
      {name:'1309 Diamond', price:'Rp300.000'},
      {name:'1412 Diamond', price:'Rp320.000'},
      {name:'1584 Diamond', price:'Rp360.000'},
      {name:'1669 Diamond', price:'Rp380.000'},
      {name:'1860 Diamond', price:'Rp420.000'},
      {name:'2010 Diamond', price:'Rp440.000'},
      {name:'2195 Diamond', price:'Rp480.000'},
      {name:'2323 Diamond', price:'Rp520.000'},
      {name:'2539 Diamond', price:'Rp560.000'},
      {name:'2728 Diamond', price:'Rp600.000'},
      {name:'2901 Diamond', price:'Rp640.000'},
      {name:'3073 Diamond', price:'Rp680.000'},
      {name:'3288 Diamond', price:'Rp720.000'},
      {name:'3473 Diamond', price:'Rp760.000'},
      {name:'3688 Diamond', price:'Rp800.000'},
      {name:'4032 Diamond', price:'Rp880.000'},
      {name:'4394 Diamond', price:'Rp960.000'},
      {name:'4830 Diamond', price:'Rp1.040.000'},
      {name:'5532 Diamond', price:'Rp1.200.000'},
      {name:'6238 Diamond', price:'Rp1.360.000'},
      {name:'7050 Diamond', price:'Rp1.520.000'},
      {name:'7862 Diamond', price:'Rp1.680.000'},
      {name:'8613 Diamond', price:'Rp1.840.000'},
      {name:'9288 Diamond', price:'Rp2.000.000'},
      {name:'Twilight Pass', price:'Rp150.000'},
    ] 
  },
  ff: { 
    name: 'Free Fire', 
    cover: 'assets/game/ff.png', 
    fields: ['User ID'], 
    subtitle: 'Garena • Topup Diamond', 
    nominal: [
      {name:'5 Diamond', price:'Rp1.000'},
      {name:'12 Diamond', price:'Rp2.500'},
      {name:'20 Diamond', price:'Rp4.000'},
      {name:'50 Diamond', price:'Rp7.500'},
      {name:'70 Diamond', price:'Rp10.000'},
      {name:'100 Diamond', price:'Rp15.000'},
      {name:'140 Diamond', price:'Rp20.000'},
      {name:'160 Diamond', price:'Rp23.000'},
      {name:'210 Diamond', price:'Rp30.000'},
      {name:'280 Diamond', price:'Rp40.000'},
      {name:'355 Diamond', price:'Rp50.000'},
      {name:'425 Diamond', price:'Rp60.000'},
      {name:'495 Diamond', price:'Rp70.000'},
      {name:'500 Diamond', price:'Rp70.000'},
      {name:'565 Diamond', price:'Rp80.000'},
      {name:'635 Diamond', price:'Rp90.000'},
      {name:'720 Diamond', price:'Rp100.000'},
      {name:'860 Diamond', price:'Rp120.000'},
      {name:'1000 Diamond', price:'Rp140.000'},
      {name:'1075 Diamond', price:'Rp150.000'},
      {name:'1220 Diamond', price:'Rp170.000'},
      {name:'1450 Diamond', price:'Rp200.000'},
      {name:'1510 Diamond', price:'Rp210.000'},
      {name:'1800 Diamond', price:'Rp250.000'},
      {name:'2000 Diamond', price:'Rp280.000'},
      {name:'2180 Diamond', price:'Rp300.000'},
      {name:'2540 Diamond', price:'Rp350.000'},
      {name:'2900 Diamond', price:'Rp400.000'},
      {name:'3270 Diamond', price:'Rp450.000'},
      {name:'3640 Diamond', price:'Rp500.000'},
      {name:'4000 Diamond', price:'Rp550.000'},
      {name:'4350 Diamond', price:'Rp600.000'},
      {name:'5000 Diamond', price:'Rp700.000'},
      {name:'5810 Diamond', price:'Rp800.000'},
      {name:'6540 Diamond', price:'Rp900.000'},
      {name:'7290 Diamond', price:'Rp1.000.000'},
      {name:'Weekly Pass', price:'Rp19.000'},
      {name:'Monthly Pass', price:'Rp75.000'},
      {name:'Level Up Pass', price:'Rp140.000'},
      {name:'Elite Pass', price:'Rp250.000'},
      {name:'Bundle Pass', price:'Rp380.000'},
    ] 
  },
  genshin: { 
    name: 'Genshin Impact', 
    cover: 'assets/game/genshin.png', 
    fields: ['UID', 'Server'], 
    subtitle: 'miHoYo • Topup Genesis Crystal', 
    nominal: [
      {name:'60 Crystal', price:'Rp16.000'},
      {name:'120 Crystal', price:'Rp32.000'},
      {name:'180 Crystal', price:'Rp48.000'},
      {name:'240 Crystal', price:'Rp64.000'},
      {name:'300 Crystal', price:'Rp79.000'},
      {name:'360 Crystal', price:'Rp95.000'},
      {name:'420 Crystal', price:'Rp111.000'},
      {name:'480 Crystal', price:'Rp127.000'},
      {name:'540 Crystal', price:'Rp143.000'},
      {name:'600 Crystal', price:'Rp158.000'},
      {name:'660 Crystal', price:'Rp174.000'},
      {name:'780 Crystal', price:'Rp205.000'},
      {name:'840 Crystal', price:'Rp221.000'},
      {name:'980 Crystal', price:'Rp249.000'},
      {name:'1080 Crystal', price:'Rp276.000'},
      {name:'1200 Crystal', price:'Rp306.000'},
      {name:'1320 Crystal', price:'Rp329.000'},
      {name:'1560 Crystal', price:'Rp386.000'},
      {name:'1680 Crystal', price:'Rp399.000'},
      {name:'1800 Crystal', price:'Rp431.000'},
      {name:'1980 Crystal', price:'Rp479.000'},
      {name:'2280 Crystal', price:'Rp549.000'},
      {name:'2400 Crystal', price:'Rp579.000'},
      {name:'2640 Crystal', price:'Rp639.000'},
      {name:'2880 Crystal', price:'Rp699.000'},
      {name:'3000 Crystal', price:'Rp729.000'},
      {name:'3280 Crystal', price:'Rp799.000'},
      {name:'3600 Crystal', price:'Rp879.000'},
      {name:'3840 Crystal', price:'Rp939.000'},
      {name:'3960 Crystal', price:'Rp959.000'},
      {name:'4200 Crystal', price:'Rp1.019.000'},
      {name:'4560 Crystal', price:'Rp1.109.000'},
      {name:'4920 Crystal', price:'Rp1.199.000'},
      {name:'5400 Crystal', price:'Rp1.319.000'},
      {name:'5760 Crystal', price:'Rp1.409.000'},
      {name:'6000 Crystal', price:'Rp1.469.000'},
      {name:'6480 Crystal', price:'Rp1.599.000'},
      {name:'7200 Crystal', price:'Rp1.769.000'},
      {name:'7680 Crystal', price:'Rp1.889.000'},
      {name:'8080 Crystal', price:'Rp1.999.000'},
      {name:'Welkin Moon', price:'Rp75.000'},
      {name:'BP Gnostic Hymn', price:'Rp159.000'},
      {name:'BP Gnostic Chorus', price:'Rp319.000'},
      {name:'2x Welkin', price:'Rp145.000'},
      {name:'3x Welkin', price:'Rp215.000'},
      {name:'6x Welkin', price:'Rp420.000'},
    ] 
  },
  pubg: { 
    name: 'PUBG Mobile', 
    cover: 'assets/game/pubg.png', 
    fields: ['User ID'], 
    subtitle: 'PUBG Corp • Topup UC', 
    nominal: [
      {name:'16 UC', price:'Rp4.500'},
      {name:'35 UC', price:'Rp9.500'},
      {name:'60 UC', price:'Rp15.000'},
      {name:'90 UC', price:'Rp22.000'},
      {name:'120 UC', price:'Rp29.000'},
      {name:'150 UC', price:'Rp36.000'},
      {name:'180 UC', price:'Rp43.000'},
      {name:'210 UC', price:'Rp50.000'},
      {name:'240 UC', price:'Rp57.000'},
      {name:'270 UC', price:'Rp64.000'},
      {name:'300 UC', price:'Rp69.000'},
      {name:'325 UC', price:'Rp75.000'},
      {name:'360 UC', price:'Rp82.000'},
      {name:'385 UC', price:'Rp89.000'},
      {name:'420 UC', price:'Rp99.000'},
      {name:'480 UC', price:'Rp111.000'},
      {name:'540 UC', price:'Rp125.000'},
      {name:'600 UC', price:'Rp135.000'},
      {name:'660 UC', price:'Rp149.000'},
      {name:'720 UC', price:'Rp165.000'},
      {name:'780 UC', price:'Rp179.000'},
      {name:'840 UC', price:'Rp189.000'},
      {name:'900 UC', price:'Rp199.000'},
      {name:'1050 UC', price:'Rp235.000'},
      {name:'1200 UC', price:'Rp265.000'},
      {name:'1350 UC', price:'Rp299.000'},
      {name:'1500 UC', price:'Rp329.000'},
      {name:'1650 UC', price:'Rp359.000'},
      {name:'1800 UC', price:'Rp379.000'},
      {name:'2100 UC', price:'Rp439.000'},
      {name:'2400 UC', price:'Rp499.000'},
      {name:'2700 UC', price:'Rp559.000'},
      {name:'3000 UC', price:'Rp619.000'},
      {name:'3300 UC', price:'Rp679.000'},
      {name:'3600 UC', price:'Rp729.000'},
      {name:'3850 UC', price:'Rp759.000'},
      {name:'4500 UC', price:'Rp889.000'},
      {name:'5400 UC', price:'Rp1.059.000'},
      {name:'6000 UC', price:'Rp1.179.000'},
      {name:'6750 UC', price:'Rp1.329.000'},
      {name:'7500 UC', price:'Rp1.469.000'},
      {name:'8100 UC', price:'Rp1.519.000'},
      {name:'9000 UC', price:'Rp1.769.000'},
      {name:'Royale Pass', price:'Rp159.000'},
      {name:'RP Elite Plus', price:'Rp399.000'},
      {name:'Prime Plus', price:'Rp19.000'},
      {name:'Prime', price:'Rp9.000'},
    ] 
  },
  roblox: { 
    name: 'Roblox', 
    cover: 'assets/game/roblox.png', 
    fields: ['Username'], 
    subtitle: 'Roblox Corp • Topup Robux', 
    nominal: [
      {name:'40 Robux', price:'Rp7.000'},
      {name:'80 Robux', price:'Rp14.000'},
      {name:'120 Robux', price:'Rp21.000'},
      {name:'160 Robux', price:'Rp28.000'},
      {name:'200 Robux', price:'Rp35.000'},
      {name:'240 Robux', price:'Rp42.000'},
      {name:'280 Robux', price:'Rp49.000'},
      {name:'320 Robux', price:'Rp56.000'},
      {name:'360 Robux', price:'Rp63.000'},
      {name:'400 Robux', price:'Rp70.000'},
      {name:'450 Robux', price:'Rp79.000'},
      {name:'500 Robux', price:'Rp87.500'},
      {name:'550 Robux', price:'Rp96.000'},
      {name:'600 Robux', price:'Rp105.000'},
      {name:'700 Robux', price:'Rp122.500'},
      {name:'800 Robux', price:'Rp140.000'},
      {name:'900 Robux', price:'Rp157.500'},
      {name:'1000 Robux', price:'Rp175.000'},
      {name:'1100 Robux', price:'Rp192.500'},
      {name:'1200 Robux', price:'Rp210.000'},
      {name:'1400 Robux', price:'Rp245.000'},
      {name:'1500 Robux', price:'Rp262.500'},
      {name:'1700 Robux', price:'Rp280.000'},
      {name:'1800 Robux', price:'Rp315.000'},
      {name:'2000 Robux', price:'Rp350.000'},
      {name:'2200 Robux', price:'Rp385.000'},
      {name:'2400 Robux', price:'Rp420.000'},
      {name:'2700 Robux', price:'Rp472.000'},
      {name:'3000 Robux', price:'Rp525.000'},
      {name:'3400 Robux', price:'Rp595.000'},
      {name:'3800 Robux', price:'Rp665.000'},
      {name:'4000 Robux', price:'Rp700.000'},
      {name:'4500 Robux', price:'Rp787.500'},
      {name:'5000 Robux', price:'Rp875.000'},
      {name:'5500 Robux', price:'Rp962.500'},
      {name:'6000 Robux', price:'Rp980.000'},
      {name:'7000 Robux', price:'Rp1.225.000'},
      {name:'8000 Robux', price:'Rp1.400.000'},
      {name:'10000 Robux', price:'Rp1.750.000'},
      {name:'15000 Robux', price:'Rp2.625.000'},
      {name:'22500 Robux', price:'Rp3.937.500'},
      {name:'Premium 450', price:'Rp85.000'},
      {name:'Premium 1000', price:'Rp165.000'},
      {name:'Premium 2200', price:'Rp335.000'},
    ] 
  },
  hok: { 
    name: 'Honor of Kings', 
    cover: 'assets/game/hok.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Tencent • Topup Token', 
    nominal: [
      {name:'8 Token', price:'Rp1.600'},
      {name:'16 Token', price:'Rp3.200'},
      {name:'24 Token', price:'Rp4.800'},
      {name:'32 Token', price:'Rp6.400'},
      {name:'40 Token', price:'Rp8.000'},
      {name:'48 Token', price:'Rp9.600'},
      {name:'56 Token', price:'Rp11.200'},
      {name:'64 Token', price:'Rp12.800'},
      {name:'72 Token', price:'Rp14.400'},
      {name:'80 Token', price:'Rp16.000'},
      {name:'96 Token', price:'Rp19.200'},
      {name:'120 Token', price:'Rp24.000'},
      {name:'144 Token', price:'Rp28.800'},
      {name:'160 Token', price:'Rp32.000'},
      {name:'176 Token', price:'Rp35.200'},
      {name:'200 Token', price:'Rp40.000'},
      {name:'240 Token', price:'Rp48.000'},
      {name:'280 Token', price:'Rp56.000'},
      {name:'320 Token', price:'Rp64.000'},
      {name:'360 Token', price:'Rp72.000'},
      {name:'400 Token', price:'Rp80.000'},
      {name:'480 Token', price:'Rp96.000'},
      {name:'520 Token', price:'Rp104.000'},
      {name:'560 Token', price:'Rp112.000'},
      {name:'600 Token', price:'Rp120.000'},
      {name:'720 Token', price:'Rp144.000'},
      {name:'800 Token', price:'Rp160.000'},
      {name:'880 Token', price:'Rp176.000'},
      {name:'960 Token', price:'Rp192.000'},
      {name:'1040 Token', price:'Rp208.000'},
      {name:'1120 Token', price:'Rp224.000'},
      {name:'1200 Token', price:'Rp240.000'},
      {name:'1400 Token', price:'Rp280.000'},
      {name:'1600 Token', price:'Rp320.000'},
      {name:'1800 Token', price:'Rp360.000'},
      {name:'2000 Token', price:'Rp400.000'},
      {name:'2200 Token', price:'Rp440.000'},
      {name:'2400 Token', price:'Rp480.000'},
      {name:'2800 Token', price:'Rp560.000'},
      {name:'3200 Token', price:'Rp640.000'},
      {name:'3600 Token', price:'Rp720.000'},
      {name:'4000 Token', price:'Rp800.000'},
      {name:'4500 Token', price:'Rp900.000'},
      {name:'5000 Token', price:'Rp1.000.000'},
      {name:'Weekly Pass', price:'Rp29.000'},
      {name:'Monthly Pass', price:'Rp99.000'},
    ] 
  },
  
  valorant: { 
    name: 'Valorant', 
    cover: 'assets/game/valorant.png', 
    fields: ['Riot ID'], 
    subtitle: 'Riot Games • Topup VP', 
    nominal: [
      {name:'125 VP', price:'Rp15.000'},
      {name:'250 VP', price:'Rp30.000'},
      {name:'375 VP', price:'Rp45.000'},
      {name:'420 VP', price:'Rp50.000'},
      {name:'475 VP', price:'Rp57.000'},
      {name:'500 VP', price:'Rp60.000'},
      {name:'625 VP', price:'Rp75.000'},
      {name:'700 VP', price:'Rp80.000'},
      {name:'750 VP', price:'Rp90.000'},
      {name:'840 VP', price:'Rp95.000'},
      {name:'875 VP', price:'Rp105.000'},
      {name:'1000 VP', price:'Rp115.000'},
      {name:'1125 VP', price:'Rp130.000'},
      {name:'1250 VP', price:'Rp145.000'},
      {name:'1375 VP', price:'Rp150.000'},
      {name:'1500 VP', price:'Rp170.000'},
      {name:'1625 VP', price:'Rp180.000'},
      {name:'1700 VP', price:'Rp185.000'},
      {name:'1875 VP', price:'Rp205.000'},
      {name:'2000 VP', price:'Rp215.000'},
      {name:'2050 VP', price:'Rp220.000'},
      {name:'2250 VP', price:'Rp240.000'},
      {name:'2400 VP', price:'Rp250.000'},
      {name:'2625 VP', price:'Rp270.000'},
      {name:'2750 VP', price:'Rp285.000'},
      {name:'2875 VP', price:'Rp295.000'},
      {name:'3000 VP', price:'Rp310.000'},
      {name:'3100 VP', price:'Rp320.000'},
      {name:'3375 VP', price:'Rp345.000'},
      {name:'3500 VP', price:'Rp360.000'},
      {name:'3650 VP', price:'Rp370.000'},
      {name:'3875 VP', price:'Rp390.000'},
      {name:'4000 VP', price:'Rp400.000'},
      {name:'4500 VP', price:'Rp450.000'},
      {name:'5000 VP', price:'Rp500.000'},
      {name:'5350 VP', price:'Rp540.000'},
      {name:'6000 VP', price:'Rp600.000'},
      {name:'7000 VP', price:'Rp700.000'},
      {name:'8150 VP', price:'Rp800.000'},
      {name:'9000 VP', price:'Rp900.000'},
      {name:'11000 VP', price:'Rp1.100.000'},
      {name:'14500 VP', price:'Rp1.400.000'},
      {name:'Battle Pass', price:'Rp150.000'},
      {name:'Radiant Pack', price:'Rp300.000'},
    ] 
  },

  codm: { 
    name: 'Call of Duty Mobile', 
    cover: 'assets/game/codm.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Activision • Topup CP', 
    nominal: [
      {name:'42 CP', price:'Rp5.000'},
      {name:'84 CP', price:'Rp10.000'},
      {name:'126 CP', price:'Rp15.000'},
      {name:'168 CP', price:'Rp20.000'},
      {name:'252 CP', price:'Rp30.000'},
      {name:'336 CP', price:'Rp40.000'},
      {name:'420 CP', price:'Rp50.000'},
      {name:'504 CP', price:'Rp60.000'},
      {name:'672 CP', price:'Rp80.000'},
      {name:'840 CP', price:'Rp99.000'},
      {name:'1008 CP', price:'Rp120.000'},
      {name:'1260 CP', price:'Rp149.000'},
      {name:'1680 CP', price:'Rp199.000'},
      {name:'2100 CP', price:'Rp249.000'},
      {name:'2520 CP', price:'Rp299.000'},
      {name:'3360 CP', price:'Rp389.000'},
      {name:'4200 CP', price:'Rp479.000'},
      {name:'5000 CP', price:'Rp569.000'},
      {name:'6720 CP', price:'Rp749.000'},
      {name:'8400 CP', price:'Rp949.000'},
      {name:'10000 CP', price:'Rp1.129.000'},
    ] 
  },
  valorant: { 
    name: 'Valorant', 
    cover: 'assets/game/valorant.png', 
    fields: ['Riot ID'], 
    subtitle: 'Riot Games • Topup VP', 
    nominal: [
      {name:'125 VP', price:'Rp15.000'},
      {name:'250 VP', price:'Rp30.000'},
      {name:'375 VP', price:'Rp45.000'},
      {name:'420 VP', price:'Rp50.000'},
      {name:'500 VP', price:'Rp60.000'},
      {name:'625 VP', price:'Rp75.000'},
      {name:'700 VP', price:'Rp80.000'},
      {name:'840 VP', price:'Rp95.000'},
      {name:'1000 VP', price:'Rp115.000'},
      {name:'1125 VP', price:'Rp130.000'},
      {name:'1375 VP', price:'Rp150.000'},
      {name:'1700 VP', price:'Rp185.000'},
      {name:'2050 VP', price:'Rp220.000'},
      {name:'2400 VP', price:'Rp250.000'},
      {name:'2750 VP', price:'Rp285.000'},
      {name:'3100 VP', price:'Rp320.000'},
      {name:'3650 VP', price:'Rp370.000'},
      {name:'4000 VP', price:'Rp400.000'},
      {name:'5350 VP', price:'Rp540.000'},
      {name:'8150 VP', price:'Rp800.000'},
      {name:'11000 VP', price:'Rp1.100.000'},
      {name:'14500 VP', price:'Rp1.400.000'},
      {name:'Battle Pass', price:'Rp150.000'},
      {name:'Radiant Pack', price:'Rp300.000'},
    ] 
  },
  pb: { 
    name: 'Point Blank', 
    cover: 'assets/game/pb.png', 
    fields: ['Zepetto ID'], 
    subtitle: 'Zepetto • Topup Cash', 
    nominal: [
      {name:'1.200 Cash', price:'Rp10.000'},
      {name:'2.400 Cash', price:'Rp20.000'},
      {name:'6.000 Cash', price:'Rp50.000'},
      {name:'12.000 Cash', price:'Rp100.000'},
      {name:'24.000 Cash', price:'Rp200.000'},
      {name:'36.000 Cash', price:'Rp300.000'},
      {name:'60.000 Cash', price:'Rp500.000'},
    ] 
  },
  coc: { 
    name: 'Clash of Clans', 
    cover: 'assets/game/coc.png', 
    fields: ['Player Tag'], 
    subtitle: 'Supercell • Topup Gems', 
    nominal: [
      {name:'80 Gems', price:'Rp16.000'},
      {name:'500 Gems', price:'Rp79.000'},
      {name:'1200 Gems', price:'Rp159.000'},
      {name:'2500 Gems', price:'Rp319.000'},
      {name:'6500 Gems', price:'Rp799.000'},
      {name:'14000 Gems', price:'Rp1.599.000'},
      {name:'Gold Pass', price:'Rp79.000'},
    ] 
  },
  cr: { 
    name: 'Clash Royale', 
    cover: 'assets/game/cr.png', 
    fields: ['Player Tag'], 
    subtitle: 'Supercell • Topup Gems', 
    nominal: [
      {name:'80 Gems', price:'Rp16.000'},
      {name:'500 Gems', price:'Rp79.000'},
      {name:'1200 Gems', price:'Rp159.000'},
      {name:'2500 Gems', price:'Rp319.000'},
      {name:'6500 Gems', price:'Rp799.000'},
      {name:'14000 Gems', price:'Rp1.599.000'},
      {name:'Royale Pass', price:'Rp79.000'},
    ] 
  },
  umamusume: { 
    name: 'UmaMusume: Pretty Derby', 
    cover: 'assets/game/umamusume.png', 
    fields: ['User ID'], 
    subtitle: 'Cygames • Topup Carats', 
    nominal: [
      {name:'50 Carats', price:'Rp16.000'},
      {name:'275 Carats', price:'Rp79.000'},
      {name:'580 Carats', price:'Rp159.000'},
      {name:'1100 Carats', price:'Rp319.000'},
      {name:'2800 Carats', price:'Rp799.000'},
      {name:'5800 Carats', price:'Rp1.599.000'},
    ] 
  },
  apex: { 
    name: 'Apex Legends Mobile', 
    cover: 'assets/game/apex.png', 
    fields: ['User ID'], 
    subtitle: 'EA • Topup Syndicate Gold', 
    nominal: [
      {name:'60 Syndicate Gold', price:'Rp15.000'},
      {name:'150 Syndicate Gold', price:'Rp35.000'},
      {name:'325 Syndicate Gold', price:'Rp75.000'},
      {name:'660 Syndicate Gold', price:'Rp149.000'},
      {name:'1350 Syndicate Gold', price:'Rp299.000'},
      {name:'2750 Syndicate Gold', price:'Rp599.000'},
    ] 
  },
  wildrift: { 
    name: 'League of Legends Wild Rift', 
    cover: 'assets/game/wildrift.png', 
    fields: ['Riot ID'], 
    subtitle: 'Riot Games • Topup Wild Cores', 
    nominal: [
      {name:'65 Wild Cores', price:'Rp15.000'},
      {name:'130 Wild Cores', price:'Rp29.000'},
      {name:'325 Wild Cores', price:'Rp65.000'},
      {name:'650 Wild Cores', price:'Rp129.000'},
      {name:'1300 Wild Cores', price:'Rp249.000'},
      {name:'2600 Wild Cores', price:'Rp479.000'},
      {name:'5200 Wild Cores', price:'Rp949.000'},
    ] 
  },
  // GAME: DOTA 2
dota2: { 
  name: 'Dota 2', 
  cover: 'assets/game/dota2.png', 
  fields: ['Steam ID'], 
  subtitle: 'Valve • Topup Dota 2 Items', 
  nominal: [
    // Battle Pass & Seasonal
    {name:'Battle Pass Level 1', price:'Rp145.000'},
    {name:'Battle Pass Level 50', price:'Rp435.000'},
    {name:'Battle Pass Level 100', price:'Rp725.000'},
    {name:'24 Battle Pass Levels', price:'Rp145.000'},
    {name:'60 Battle Pass Levels', price:'Rp435.000'},
    {name:'120 Battle Pass Levels', price:'Rp725.000'},
    
    // Dota Plus Subscription
    {name:'Dota Plus 1 Bulan', price:'Rp65.000'},
    {name:'Dota Plus 3 Bulan', price:'Rp185.000'},
    {name:'Dota Plus 6 Bulan', price:'Rp360.000'},
    {name:'Dota Plus 12 Bulan', price:'Rp699.000'},
    
    // Steam Wallet for Dota 2
    {name:'Steam Rp12.000', price:'Rp14.000'},
    {name:'Steam Rp20.000', price:'Rp22.500'},
    {name:'Steam Rp30.000', price:'Rp33.000'},
    {name:'Steam Rp45.000', price:'Rp48.000'},
    {name:'Steam Rp60.000', price:'Rp64.000'},
    {name:'Steam Rp90.000', price:'Rp95.000'},
    {name:'Steam Rp120.000', price:'Rp127.000'},
    {name:'Steam Rp150.000', price:'Rp157.000'},
    {name:'Steam Rp180.000', price:'Rp188.000'},
    {name:'Steam Rp250.000', price:'Rp262.000'},
    {name:'Steam Rp300.000', price:'Rp314.000'},
    {name:'Steam Rp400.000', price:'Rp418.000'},
    {name:'Steam Rp500.000', price:'Rp523.000'},
    {name:'Steam Rp600.000', price:'Rp625.000'},
    {name:'Steam Rp800.000', price:'Rp835.000'},
    {name:'Steam Rp1.000.000', price:'Rp1.040.000'},
    
    // Arcana Bundle (Popular Items)
    {name:'Arcana Bundle Small', price:'Rp250.000'},
    {name:'Arcana Bundle Medium', price:'Rp500.000'},
    {name:'Arcana Bundle Large', price:'Rp1.000.000'},
    
    // Treasure Keys
    {name:'1 Treasure Key', price:'Rp35.000'},
    {name:'5 Treasure Keys', price:'Rp165.000'},
    {name:'10 Treasure Keys', price:'Rp320.000'},
    {name:'20 Treasure Keys', price:'Rp620.000'},
  ] 
},
  aov: { 
    name: 'Arena of Valor', 
    cover: 'assets/game/aov.png', 
    fields: ['User ID'], 
    subtitle: 'Garena • Topup Voucher', 
    nominal: [
      {name:'40 Voucher', price:'Rp7.500'},
      {name:'90 Voucher', price:'Rp15.000'},
      {name:'230 Voucher', price:'Rp37.500'},
      {name:'470 Voucher', price:'Rp75.000'},
      {name:'950 Voucher', price:'Rp150.000'},
      {name:'1900 Voucher', price:'Rp300.000'},
      {name:'4750 Voucher', price:'Rp750.000'},
    ] 
  },
  stumble: { 
    name: 'Stumble Guys', 
    cover: 'assets/game/stumble.png', 
    fields: ['Username'], 
    subtitle: 'Scopely • Topup Gems', 
    nominal: [
      {name:'25 Gems', price:'Rp5.000'},
      {name:'55 Gems', price:'Rp10.000'},
      {name:'125 Gems', price:'Rp22.000'},
      {name:'250 Gems', price:'Rp45.000'},
      {name:'625 Gems', price:'Rp110.000'},
      {name:'1500 Gems', price:'Rp259.000'},
      {name:'3000 Gems', price:'Rp499.000'},
    ] 
  },
  hsr: { 
    name: 'Honkai Star Rail', 
    cover: 'assets/game/hsr.png', 
    fields: ['UID', 'Server'], 
    subtitle: 'miHoYo • Topup Oneiric Shard', 
    nominal: [
      {name:'60 Oneiric Shard', price:'Rp16.000'},
      {name:'300 Oneiric Shard', price:'Rp79.000'},
      {name:'980 Oneiric Shard', price:'Rp249.000'},
      {name:'1980 Oneiric Shard', price:'Rp479.000'},
      {name:'3280 Oneiric Shard', price:'Rp799.000'},
      {name:'6480 Oneiric Shard', price:'Rp1.599.000'},
      {name:'Express Supply Pass', price:'Rp75.000'},
    ] 
  },
  hi3: { 
    name: 'Honkai Impact 3', 
    cover: 'assets/game/hi3.png', 
    fields: ['UID', 'Server'], 
    subtitle: 'miHoYo • Topup B-Chips', 
    nominal: [
      {name:'60 B-Chips', price:'Rp16.000'},
      {name:'330 B-Chips', price:'Rp79.000'},
      {name:'990 B-Chips', price:'Rp249.000'},
      {name:'1980 B-Chips', price:'Rp479.000'},
      {name:'3300 B-Chips', price:'Rp799.000'},
      {name:'6600 B-Chips', price:'Rp1.599.000'},
    ] 
  },
  minecraft: { 
    name: 'Minecraft', 
    cover: 'assets/game/minecraft.png', 
    fields: ['Gamertag / Email'], 
    subtitle: 'Mojang • Topup Minecoins', 
    nominal: [
      {name:'320 Minecoins', price:'Rp27.000'},
      {name:'660 Minecoins', price:'Rp54.000'},
      {name:'1000 Minecoins', price:'Rp78.000'},
      {name:'1720 Minecoins', price:'Rp130.000'},
      {name:'3500 Minecoins', price:'Rp260.000'},
    ] 
  },
  fortnite: { 
    name: 'Fortnite', 
    cover: 'assets/game/fortnite.png', 
    fields: ['Epic ID / Email'], 
    subtitle: 'Epic Games • Topup V-Bucks', 
    nominal: [
      {name:'1000 V-Bucks', price:'Rp125.000'},
      {name:'2800 V-Bucks', price:'Rp315.000'},
      {name:'5000 V-Bucks', price:'Rp535.000'},
      {name:'13500 V-Bucks', price:'Rp1.300.000'},
    ] 
  },
  fcmobile: { 
    name: 'EA FC Mobile', 
    cover: 'assets/game/fcmobile.png', 
    fields: ['User ID'], 
    subtitle: 'EA Sports • Topup FC Points', 
    nominal: [
      {name:'100 FC Points', price:'Rp16.000'},
      {name:'250 FC Points', price:'Rp39.000'},
      {name:'500 FC Points', price:'Rp79.000'},
      {name:'1050 FC Points', price:'Rp159.000'},
      {name:'2200 FC Points', price:'Rp319.000'},
      {name:'5750 FC Points', price:'Rp799.000'},
      {name:'12000 FC Points', price:'Rp1.599.000'},
    ] 
  },
  efootball: { 
    name: 'eFootball', 
    cover: 'assets/game/efootball.png', 
    fields: ['Konami ID'], 
    subtitle: 'Konami • Topup Coins', 
    nominal: [
      {name:'100 Coins', price:'Rp16.000'},
      {name:'250 Coins', price:'Rp39.000'},
      {name:'500 Coins', price:'Rp79.000'},
      {name:'1050 Coins', price:'Rp159.000'},
      {name:'2150 Coins', price:'Rp319.000'},
      {name:'5800 Coins', price:'Rp799.000'},
    ] 
  },
  rox: { 
    name: 'Ragnarok X', 
    cover: 'assets/game/rox.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Nuverse • Topup Crystals', 
    nominal: [
      {name:'60 Crystals', price:'Rp15.000'},
      {name:'198 Crystals', price:'Rp49.000'},
      {name:'330 Crystals', price:'Rp79.000'},
      {name:'660 Crystals', price:'Rp159.000'},
      {name:'1320 Crystals', price:'Rp319.000'},
      {name:'3300 Crystals', price:'Rp799.000'},
    ] 
  },
  rom: { 
    name: 'Ragnarok M', 
    cover: 'assets/game/rom.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Gravity • Topup BCC', 
    nominal: [
      {name:'64 BCC', price:'Rp15.000'},
      {name:'198 BCC', price:'Rp45.000'},
      {name:'336 BCC', price:'Rp75.000'},
      {name:'672 BCC', price:'Rp150.000'},
      {name:'1680 BCC', price:'Rp375.000'},
      {name:'3360 BCC', price:'Rp750.000'},
    ] 
  },
  tof: { 
    name: 'Tower of Fantasy', 
    cover: 'assets/game/tof.png', 
    fields: ['UID', 'Server'], 
    subtitle: 'Level Infinite • Topup Tanium', 
    nominal: [
      {name:'60 Tanium', price:'Rp16.000'},
      {name:'300 Tanium', price:'Rp79.000'},
      {name:'980 Tanium', price:'Rp249.000'},
      {name:'1980 Tanium', price:'Rp479.000'},
      {name:'3280 Tanium', price:'Rp799.000'},
      {name:'6480 Tanium', price:'Rp1.599.000'},
    ] 
  },
  zepeto: { 
    name: 'Zepeto', 
    cover: 'assets/game/zepeto.png', 
    fields: ['Zepeto ID'], 
    subtitle: 'Naver Z • Topup ZEM', 
    nominal: [
      {name:'30 ZEM', price:'Rp7.000'},
      {name:'70 ZEM', price:'Rp15.000'},
      {name:'150 ZEM', price:'Rp30.000'},
      {name:'300 ZEM', price:'Rp60.000'},
      {name:'800 ZEM', price:'Rp150.000'},
      {name:'1700 ZEM', price:'Rp300.000'},
    ] 
  },
  supersus: { 
    name: 'Super Sus', 
    cover: 'assets/game/supersus.png', 
    fields: ['User ID'], 
    subtitle: 'PIProduction • Topup Golden Star', 
    nominal: [
      {name:'60 Golden Star', price:'Rp15.000'},
      {name:'180 Golden Star', price:'Rp45.000'},
      {name:'360 Golden Star', price:'Rp89.000'},
      {name:'720 Golden Star', price:'Rp175.000'},
      {name:'1800 Golden Star', price:'Rp435.000'},
      {name:'3600 Golden Star', price:'Rp865.000'},
    ] 
  },
  lifeafter: { 
    name: 'Life After', 
    cover: 'assets/game/lifeafter.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'NetEase • Topup Fed Credits', 
    nominal: [
      {name:'60 Fed Credits', price:'Rp15.000'},
      {name:'180 Fed Credits', price:'Rp45.000'},
      {name:'300 Fed Credits', price:'Rp75.000'},
      {name:'600 Fed Credits', price:'Rp149.000'},
      {name:'1500 Fed Credits', price:'Rp369.000'},
      {name:'3000 Fed Credits', price:'Rp729.000'},
    ] 
  },
  lordsmobile: { 
    name: 'Lords Mobile', 
    cover: 'assets/game/lordsmobile.png', 
    fields: ['User ID'], 
    subtitle: 'IGG • Topup Diamonds', 
    nominal: [
      {name:'65 Diamonds', price:'Rp16.000'},
      {name:'260 Diamonds', price:'Rp65.000'},
      {name:'650 Diamonds', price:'Rp159.000'},
      {name:'1300 Diamonds', price:'Rp319.000'},
      {name:'3250 Diamonds', price:'Rp799.000'},
      {name:'6500 Diamonds', price:'Rp1.599.000'},
    ] 
  },
  sos: { 
    name: 'State of Survival', 
    cover: 'assets/game/sos.png', 
    fields: ['User ID'], 
    subtitle: 'FunPlus • Topup Biocaps', 
    nominal: [
      {name:'100 Biocaps', price:'Rp16.000'},
      {name:'500 Biocaps', price:'Rp79.000'},
      {name:'1000 Biocaps', price:'Rp159.000'},
      {name:'2000 Biocaps', price:'Rp319.000'},
      {name:'5000 Biocaps', price:'Rp799.000'},
      {name:'10000 Biocaps', price:'Rp1.599.000'},
    ] 
  },
  msw: { 
    name: 'Marvel Super War', 
    cover: 'assets/game/msw.png', 
    fields: ['User ID'], 
    subtitle: 'NetEase • Topup Star Credits', 
    nominal: [
      {name:'50 Star Credits', price:'Rp16.000'},
      {name:'250 Star Credits', price:'Rp79.000'},
      {name:'500 Star Credits', price:'Rp159.000'},
      {name:'1000 Star Credits', price:'Rp319.000'},
      {name:'2500 Star Credits', price:'Rp799.000'},
    ] 
  },
  opm: { 
    name: 'One Punch Man: The Strongest', 
    cover: 'assets/game/opm.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Perfect World • Topup Coupons', 
    nominal: [
      {name:'60 Coupons', price:'Rp16.000'},
      {name:'300 Coupons', price:'Rp79.000'},
      {name:'600 Coupons', price:'Rp159.000'},
      {name:'1200 Coupons', price:'Rp319.000'},
      {name:'3000 Coupons', price:'Rp799.000'},
    ] 
  },
  bleach: { 
    name: 'BLEACH Brave Souls', 
    cover: 'assets/game/bleach.png', 
    fields: ['User ID'], 
    subtitle: 'KLab • Topup Spirit Orbs', 
    nominal: [
      {name:'25 Spirit Orbs', price:'Rp35.000'},
      {name:'65 Spirit Orbs', price:'Rp85.000'},
      {name:'145 Spirit Orbs', price:'Rp175.000'},
      {name:'285 Spirit Orbs', price:'Rp350.000'},
      {name:'585 Spirit Orbs', price:'Rp700.000'},
    ] 
  },
  sims: { 
    name: 'The Sims Mobile', 
    cover: 'assets/game/sims.png', 
    fields: ['Player ID'], 
    subtitle: 'EA • Topup SimCash', 
    nominal: [
      {name:'60 SimCash', price:'Rp16.000'},
      {name:'150 SimCash', price:'Rp39.000'},
      {name:'330 SimCash', price:'Rp79.000'},
      {name:'700 SimCash', price:'Rp159.000'},
      {name:'1700 SimCash', price:'Rp319.000'},
    ] 
  },
  sausageman: { 
    name: 'Sausage Man', 
    cover: 'assets/game/sausageman.png', 
    fields: ['User ID'], 
    subtitle: 'XD Inc • Topup Candy', 
    nominal: [
      {name:'60 Candy', price:'Rp15.000'},
      {name:'180 Candy', price:'Rp45.000'},
      {name:'300 Candy', price:'Rp75.000'},
      {name:'600 Candy', price:'Rp149.000'},
      {name:'1500 Candy', price:'Rp369.000'},
      {name:'3000 Candy', price:'Rp729.000'},
    ] 
  },
  naruto: { 
    name: 'Naruto Slugfest', 
    cover: 'assets/game/naruto.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Cubinet • Topup Gold Ingot', 
    nominal: [
      {name:'60 Gold Ingot', price:'Rp15.000'},
      {name:'180 Gold Ingot', price:'Rp45.000'},
      {name:'360 Gold Ingot', price:'Rp89.000'},
      {name:'720 Gold Ingot', price:'Rp175.000'},
      {name:'1800 Gold Ingot', price:'Rp435.000'},
    ] 
  },
  ultraman: { 
    name: 'Ultraman Legend of Heroes', 
    cover: 'assets/game/ultraman.png', 
    fields: ['User ID'], 
    subtitle: 'Allstar Games • Topup Diamonds', 
    nominal: [
      {name:'60 Diamonds', price:'Rp16.000'},
      {name:'300 Diamonds', price:'Rp79.000'},
      {name:'600 Diamonds', price:'Rp159.000'},
      {name:'1200 Diamonds', price:'Rp319.000'},
      {name:'3000 Diamonds', price:'Rp799.000'},
    ] 
  },
  growtopia: { 
    name: 'Growtopia', 
    cover: 'assets/game/growtopia.png', 
    fields: ['GrowID'], 
    subtitle: 'Ubisoft • Topup Gems', 
    nominal: [
      {name:'2500 Gems', price:'Rp16.000'},
      {name:'7500 Gems', price:'Rp45.000'},
      {name:'15000 Gems', price:'Rp89.000'},
      {name:'50000 Gems', price:'Rp285.000'},
      {name:'135000 Gems', price:'Rp720.000'},
    ] 
  },
  // GAME BARU: DRAGON NEST M
  dragonnestm: { 
    name: 'Dragon Nest M', 
    cover: 'assets/game/dragonnestm.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Eyedentity • Topup Gems', 
    nominal: [
      {name:'60 Gems', price:'Rp16.000'},
      {name:'120 Gems', price:'Rp32.000'},
      {name:'180 Gems', price:'Rp48.000'},
      {name:'300 Gems', price:'Rp79.000'},
      {name:'600 Gems', price:'Rp158.000'},
      {name:'1200 Gems', price:'Rp316.000'},
      {name:'1800 Gems', price:'Rp474.000'},
      {name:'3000 Gems', price:'Rp790.000'},
      {name:'6000 Gems', price:'Rp1.580.000'},
    ] 
  },

  // GAME BARU: COOKIE RUN KINGDOM
  cookierun: { 
    name: 'Cookie Run Kingdom', 
    cover: 'assets/game/cookierun.png', 
    fields: ['User ID'], 
    subtitle: 'Devsisters • Topup Crystals', 
    nominal: [
      {name:'60 Crystals', price:'Rp16.000'},
      {name:'100 Crystals', price:'Rp27.000'},
      {name:'330 Crystals', price:'Rp79.000'},
      {name:'660 Crystals', price:'Rp158.000'},
      {name:'1100 Crystals', price:'Rp263.000'},
      {name:'1650 Crystals', price:'Rp395.000'},
      {name:'2200 Crystals', price:'Rp527.000'},
      {name:'3300 Crystals', price:'Rp790.000'},
      {name:'6600 Crystals', price:'Rp1.580.000'},
    ] 
  },

  // GAME BARU: LINEAGE 2M
  lineage2m: { 
    name: 'Lineage 2M', 
    cover: 'assets/game/lineage2m.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'NCSOFT • Topup Red Diamonds', 
    nominal: [
      {name:'60 Red Diamonds', price:'Rp16.000'},
      {name:'300 Red Diamonds', price:'Rp79.000'},
      {name:'600 Red Diamonds', price:'Rp158.000'},
      {name:'980 Red Diamonds', price:'Rp258.000'},
      {name:'1500 Red Diamonds', price:'Rp395.000'},
      {name:'2400 Red Diamonds', price:'Rp632.000'},
      {name:'3280 Red Diamonds', price:'Rp864.000'},
      {name:'6000 Red Diamonds', price:'Rp1.580.000'},
    ] 
  },

  // GAME BARU: BLACK CLOVER M
  blackcloverm: { 
    name: 'Black Clover M', 
    cover: 'assets/game/blackcloverm.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Garena • Topup Gems', 
    nominal: [
      {name:'50 Gems', price:'Rp16.000'},
      {name:'100 Gems', price:'Rp32.000'},
      {name:'250 Gems', price:'Rp79.000'},
      {name:'500 Gems', price:'Rp158.000'},
      {name:'1000 Gems', price:'Rp316.000'},
      {name:'2000 Gems', price:'Rp632.000'},
      {name:'3500 Gems', price:'Rp1.106.000'},
      {name:'5000 Gems', price:'Rp1.580.000'},
    ] 
  },

  // GAME BARU: NIKKE
  nikke: { 
    name: 'Goddess of Victory: Nikke', 
    cover: 'assets/game/nikke.png', 
    fields: ['User ID'], 
    subtitle: 'Shift Up • Topup Gems', 
    nominal: [
      {name:'60 Gems', price:'Rp16.000'},
      {name:'130 Gems', price:'Rp32.000'},
      {name:'330 Gems', price:'Rp79.000'},
      {name:'660 Gems', price:'Rp158.000'},
      {name:'1320 Gems', price:'Rp316.000'},
      {name:'2200 Gems', price:'Rp527.000'},
      {name:'3300 Gems', price:'Rp790.000'},
      {name:'6600 Gems', price:'Rp1.580.000'},
    ] 
  },

  // GAME BARU: WUTHERING WAVES
  wutheringwaves: { 
    name: 'Wuthering Waves', 
    cover: 'assets/game/wutheringwaves.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Kuro Games • Topup Lunite', 
    nominal: [
      {name:'60 Lunite', price:'Rp16.000'},
      {name:'300 Lunite', price:'Rp79.000'},
      {name:'600 Lunite', price:'Rp158.000'},
      {name:'980 Lunite', price:'Rp258.000'},
      {name:'1980 Lunite', price:'Rp516.000'},
      {name:'3280 Lunite', price:'Rp860.000'},
      {name:'6480 Lunite', price:'Rp1.698.000'},
    ] 
  },

  // GAME BARU: IDENTITY V
  identityv: { 
    name: 'Identity V', 
    cover: 'assets/game/identityv.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'NetEase • Topup Echoes', 
    nominal: [
      {name:'60 Echoes', price:'Rp16.000'},
      {name:'180 Echoes', price:'Rp48.000'},
      {name:'300 Echoes', price:'Rp79.000'},
      {name:'600 Echoes', price:'Rp158.000'},
      {name:'1200 Echoes', price:'Rp316.000'},
      {name:'1800 Echoes', price:'Rp474.000'},
      {name:'3000 Echoes', price:'Rp790.000'},
      {name:'6000 Echoes', price:'Rp1.580.000'},
    ] 
  },

  // GAME BARU: AZUR LANE
  azurlane: { 
    name: 'Azur Lane', 
    cover: 'assets/game/azurlane.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Yostar • Topup Diamonds', 
    nominal: [
      {name:'60 Diamonds', price:'Rp16.000'},
      {name:'120 Diamonds', price:'Rp32.000'},
      {name:'300 Diamonds', price:'Rp79.000'},
      {name:'680 Diamonds', price:'Rp178.000'},
      {name:'1280 Diamonds', price:'Rp336.000'},
      {name:'1980 Diamonds', price:'Rp519.000'},
      {name:'3280 Diamonds', price:'Rp860.000'},
      {name:'6480 Diamonds', price:'Rp1.698.000'},
    ] 
  },

  // GAME BARU: ARKNIGHTS
  arknights: { 
    name: 'Arknights', 
    cover: 'assets/game/arknights.png', 
    fields: ['User ID', 'Server'], 
    subtitle: 'Hypergryph • Topup Originite Prime', 
    nominal: [
      {name:'1 Originite', price:'Rp16.000'},
      {name:'6 Originite', price:'Rp79.000'},
      {name:'20 Originite', price:'Rp258.000'},
      {name:'40 Originite', price:'Rp516.000'},
      {name:'66 Originite', price:'Rp860.000'},
      {name:'130 Originite', price:'Rp1.698.000'},
      {name:'Monthly Card', price:'Rp79.000'},
    ] 
  },

  // GAME BARU: BLUE ARCHIVE
  bluearchive: { 
    name: 'Blue Archive', 
    cover: 'assets/game/bluearchive.png', 
    fields: ['User ID'], 
    subtitle: 'Nexon • Topup Pyroxene', 
    nominal: [
      {name:'60 Pyroxene', price:'Rp16.000'},
      {name:'330 Pyroxene', price:'Rp79.000'},
      {name:'680 Pyroxene', price:'Rp158.000'},
      {name:'1400 Pyroxene', price:'Rp316.000'},
      {name:'2100 Pyroxene', price:'Rp474.000'},
      {name:'3500 Pyroxene', price:'Rp790.000'},
      {name:'7000 Pyroxene', price:'Rp1.580.000'},
    ] 
  },
  // ===========================
  //           JOKI
  // ===========================
  'joki-ml': { 
    name: 'Joki Rank Mobile Legends', 
    cover: 'assets/game/ml.png', 
    fields: ['Email/Moonton', 'Password', 'Login Via'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Warrior → Elite', price:'Rp15.000'},
      {name:'Elite → Master', price:'Rp25.000'},
      {name:'Master → Grandmaster', price:'Rp35.000'},
      {name:'Grandmaster → Epic', price:'Rp50.000'},
      {name:'Epic → Legend', price:'Rp100.000'},
      {name:'Legend → Mythic', price:'Rp200.000'},
      {name:'Mythic → Mythic Honor', price:'Rp350.000'},
      {name:'Mythic → Mythical Glory', price:'Rp500.000'},
    ] 
  },
  'joki-ff': { 
    name: 'Joki Rank Free Fire', 
    cover: 'assets/game/ff.png', 
    fields: ['Email/FB', 'Password', 'Login Via'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Bronze → Silver', price:'Rp15.000'},
      {name:'Silver → Gold', price:'Rp25.000'},
      {name:'Gold → Platinum', price:'Rp40.000'},
      {name:'Platinum → Diamond', price:'Rp60.000'},
      {name:'Diamond → Heroic', price:'Rp100.000'},
      {name:'Heroic → Grandmaster', price:'Rp200.000'},
    ] 
  },
  'joki-genshin': { 
    name: 'Joki Genshin Impact', 
    cover: 'assets/game/genshin.png', 
    fields: ['Email', 'Password'], 
    subtitle: 'Jasa Joki Abyss & Quest', 
    nominal: [
      {name:'Daily Commission (7 Hari)', price:'Rp50.000'},
      {name:'Spiral Abyss Floor 9-10', price:'Rp75.000'},
      {name:'Spiral Abyss Floor 11-12', price:'Rp150.000'},
      {name:'Spiral Abyss Full Clear', price:'Rp200.000'},
      {name:'Story Quest Complete', price:'Rp100.000'},
      {name:'World Quest Complete', price:'Rp75.000'},
    ] 
  },
  'joki-pubg': { 
    name: 'Joki PUBG Rank', 
    cover: 'assets/game/pubg.png', 
    fields: ['Email/FB', 'Password', 'Login Via'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Bronze → Silver', price:'Rp20.000'},
      {name:'Silver → Gold', price:'Rp35.000'},
      {name:'Gold → Platinum', price:'Rp50.000'},
      {name:'Platinum → Diamond', price:'Rp80.000'},
      {name:'Diamond → Crown', price:'Rp150.000'},
      {name:'Crown → Ace', price:'Rp250.000'},
      {name:'Ace → Conqueror', price:'Rp500.000'},
    ] 
  },
  'joki-roblox': { 
    name: 'Joki Roblox Quest', 
    cover: 'assets/game/roblox.png', 
    fields: ['Username', 'Password'], 
    subtitle: 'Jasa Joki Game Roblox', 
    nominal: [
      {name:'Blox Fruits - Level 1-500', price:'Rp50.000'},
      {name:'Blox Fruits - Level 500-1000', price:'Rp75.000'},
      {name:'Blox Fruits - Level 1000-2000', price:'Rp150.000'},
      {name:'Blox Fruits - Level 2000-2550', price:'Rp200.000'},
      {name:'Adopt Me - Neon Pet', price:'Rp100.000'},
      {name:'Pet Simulator X - Farming', price:'Rp75.000'},
    ] 
  },
  'joki-hok': { 
    name: 'Joki Honor of Kings', 
    cover: 'assets/game/hok.png', 
    fields: ['Email', 'Password', 'Login Via'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Bronze → Silver', price:'Rp15.000'},
      {name:'Silver → Gold', price:'Rp25.000'},
      {name:'Gold → Platinum', price:'Rp40.000'},
      {name:'Platinum → Diamond', price:'Rp60.000'},
      {name:'Diamond → King', price:'Rp150.000'},
      {name:'King → High King', price:'Rp300.000'},
    ] 
  },
  'joki-codm': { 
    name: 'Joki COD Mobile', 
    cover: 'assets/game/codm.png', 
    fields: ['Email/Activision', 'Password'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Rookie → Veteran', price:'Rp20.000'},
      {name:'Veteran → Elite', price:'Rp30.000'},
      {name:'Elite → Pro', price:'Rp50.000'},
      {name:'Pro → Master', price:'Rp80.000'},
      {name:'Master → Grandmaster', price:'Rp150.000'},
      {name:'Grandmaster → Legendary', price:'Rp300.000'},
    ] 
  },
  'joki-valorant': { 
    name: 'Joki Valorant Rank', 
    cover: 'assets/game/valorant.png', 
    fields: ['Riot ID', 'Password'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Iron → Bronze', price:'Rp30.000'},
      {name:'Bronze → Silver', price:'Rp50.000'},
      {name:'Silver → Gold', price:'Rp75.000'},
      {name:'Gold → Platinum', price:'Rp100.000'},
      {name:'Platinum → Diamond', price:'Rp200.000'},
      {name:'Diamond → Ascendant', price:'Rp400.000'},
      {name:'Ascendant → Immortal', price:'Rp700.000'},
    ] 
  },
  'joki-pb': { 
    name: 'Joki Point Blank', 
    cover: 'assets/game/pb.png', 
    fields: ['Zepetto ID', 'Password'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Trainee → Rookie', price:'Rp25.000'},
      {name:'Rookie → Veteran', price:'Rp40.000'},
      {name:'Veteran → Expert', price:'Rp60.000'},
      {name:'Expert → Elite', price:'Rp100.000'},
      {name:'Elite → Pro', price:'Rp200.000'},
    ] 
  },
  'joki-stumble': { 
    name: 'Joki Stumble Guys', 
    cover: 'assets/game/stumble.png', 
    fields: ['Username', 'Password'], 
    subtitle: 'Jasa Joki Trophy & Event', 
    nominal: [
      {name:'100 Trophy', price:'Rp15.000'},
      {name:'250 Trophy', price:'Rp30.000'},
      {name:'500 Trophy', price:'Rp50.000'},
      {name:'1000 Trophy', price:'Rp90.000'},
      {name:'Event Pass Complete', price:'Rp75.000'},
    ] 
  },
  'joki-cr': { 
    name: 'Joki Clash Royale', 
    cover: 'assets/game/cr.png', 
    fields: ['Supercell ID', 'Password'], 
    subtitle: 'Jasa Joki Trophy', 
    nominal: [
      {name:'1000-3000 Trophy', price:'Rp30.000'},
      {name:'3000-5000 Trophy', price:'Rp50.000'},
      {name:'5000-6000 Trophy', price:'Rp75.000'},
      {name:'6000-7000 Trophy', price:'Rp100.000'},
      {name:'7000-8000 Trophy', price:'Rp150.000'},
    ] 
  },
  'joki-wildrift': { 
    name: 'Joki Wild Rift', 
    cover: 'assets/game/wildrift.png', 
    fields: ['Riot ID', 'Password'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Iron → Bronze', price:'Rp20.000'},
      {name:'Bronze → Silver', price:'Rp30.000'},
      {name:'Silver → Gold', price:'Rp45.000'},
      {name:'Gold → Platinum', price:'Rp60.000'},
      {name:'Platinum → Emerald', price:'Rp100.000'},
      {name:'Emerald → Diamond', price:'Rp175.000'},
      {name:'Diamond → Master', price:'Rp350.000'},
    ] 
  },
  // JOKI BARU: DOTA 2
  'joki-dota2': { 
    name: 'Joki Dota 2 Rank', 
    cover: 'assets/game/dota2.png', 
    fields: ['Steam ID', 'Password'], 
    subtitle: 'Jasa Joki Push MMR', 
    nominal: [
      {name:'Herald → Guardian', price:'Rp50.000'},
      {name:'Guardian → Crusader', price:'Rp75.000'},
      {name:'Crusader → Archon', price:'Rp100.000'},
      {name:'Archon → Legend', price:'Rp150.000'},
      {name:'Legend → Ancient', price:'Rp250.000'},
      {name:'Ancient → Divine', price:'Rp400.000'},
      {name:'Divine → Immortal', price:'Rp750.000'},
      {name:'+500 MMR', price:'Rp100.000'},
      {name:'+1000 MMR', price:'Rp180.000'},
    ] 
  },

  // JOKI BARU: APEX LEGENDS
  'joki-apex': { 
    name: 'Joki Apex Legends', 
    cover: 'assets/game/apex.png', 
    fields: ['EA Account', 'Password'], 
    subtitle: 'Jasa Joki Push Rank', 
    nominal: [
      {name:'Rookie → Bronze', price:'Rp25.000'},
      {name:'Bronze → Silver', price:'Rp40.000'},
      {name:'Silver → Gold', price:'Rp60.000'},
      {name:'Gold → Platinum', price:'Rp100.000'},
      {name:'Platinum → Diamond', price:'Rp200.000'},
      {name:'Diamond → Master', price:'Rp400.000'},
      {name:'Master → Predator', price:'Rp800.000'},
    ] 
  },

  // ===========================
  //          VOUCHER
  // ===========================
  gplay: { 
    name: 'Google Play Voucher', 
    cover: 'assets/voucher/gplay.png', 
    fields: ['Email Penerima'], 
    subtitle: 'Google • Gift Card', 
    nominal: [
      {name:'Rp20.000', price:'Rp22.000'},
      {name:'Rp50.000', price:'Rp52.000'},
      {name:'Rp100.000', price:'Rp103.000'},
      {name:'Rp150.000', price:'Rp154.000'},
      {name:'Rp300.000', price:'Rp307.000'},
      {name:'Rp500.000', price:'Rp512.000'},
    ] 
  },
  steam: { 
    name: 'Steam Wallet', 
    cover: 'assets/voucher/steam.png', 
    fields: ['Email Steam'], 
    subtitle: 'Valve • Wallet Code IDR', 
    nominal: [
      {name:'Rp12.000', price:'Rp14.000'},
      {name:'Rp45.000', price:'Rp48.000'},
      {name:'Rp60.000', price:'Rp64.000'},
      {name:'Rp90.000', price:'Rp95.000'},
      {name:'Rp120.000', price:'Rp127.000'},
      {name:'Rp250.000', price:'Rp262.000'},
      {name:'Rp400.000', price:'Rp418.000'},
      {name:'Rp600.000', price:'Rp625.000'},
    ] 
  },
  psn: { 
    name: 'PlayStation Voucher', 
    cover: 'assets/voucher/psn.png', 
    fields: ['Akun PSN (Region)'], 
    subtitle: 'Sony • PSN Card', 
    nominal: [
      {name:'$10 (Region US)', price:'Rp165.000'},
      {name:'$20 (Region US)', price:'Rp325.000'},
      {name:'$50 (Region US)', price:'Rp800.000'},
      {name:'$100 (Region US)', price:'Rp1.580.000'},
      {name:'Rp100.000 (Region ID)', price:'Rp105.000'},
      {name:'Rp200.000 (Region ID)', price:'Rp208.000'},
      {name:'Rp400.000 (Region ID)', price:'Rp415.000'},
    ] 
  },
  shell: { 
    name: 'Garena Shell', 
    cover: 'assets/voucher/shell.png', 
    fields: ['User ID Garena'], 
    subtitle: 'Garena • Shell Code', 
    nominal: [
      {name:'33 Shell', price:'Rp5.000'},
      {name:'66 Shell', price:'Rp10.000'},
      {name:'165 Shell', price:'Rp25.000'},
      {name:'330 Shell', price:'Rp50.000'},
      {name:'660 Shell', price:'Rp100.000'},
      {name:'1650 Shell', price:'Rp250.000'},
    ] 
  },
  unipin: { 
    name: 'UniPin Voucher', 
    cover: 'assets/voucher/unipin.png', 
    fields: ['Email'], 
    subtitle: 'UniPin • Universal Credits', 
    nominal: [
      {name:'10.000 UC', price:'Rp11.000'},
      {name:'20.000 UC', price:'Rp22.000'},
      {name:'50.000 UC', price:'Rp53.000'},
      {name:'100.000 UC', price:'Rp105.000'},
      {name:'200.000 UC', price:'Rp208.000'},
      {name:'500.000 UC', price:'Rp515.000'},
    ] 
  },
  razer: { 
    name: 'Razer Gold', 
    cover: 'assets/voucher/razer.png', 
    fields: ['Email Razer'], 
    subtitle: 'Razer • Gold PIN', 
    nominal: [
      {name:'$5', price:'Rp82.000'},
      {name:'$10', price:'Rp163.000'},
      {name:'$20', price:'Rp325.000'},
      {name:'$50', price:'Rp810.000'},
      {name:'$100', price:'Rp1.600.000'},
    ] 
  },
  xbox: { 
    name: 'Xbox Gift Card', 
    cover: 'assets/voucher/xbox.png', 
    fields: ['Email Microsoft'], 
    subtitle: 'Microsoft • Gift Card', 
    nominal: [
      {name:'$10', price:'Rp165.000'},
      {name:'$15', price:'Rp245.000'},
      {name:'$25', price:'Rp405.000'},
      {name:'$50', price:'Rp805.000'},
      {name:'$100', price:'Rp1.600.000'},
    ] 
  },
  nintendo: { 
    name: 'Nintendo eShop Card', 
    cover: 'assets/voucher/nintendo.png', 
    fields: ['Nintendo Account Email'], 
    subtitle: 'Nintendo • eShop', 
    nominal: [
      {name:'$10 (US)', price:'Rp168.000'},
      {name:'$20 (US)', price:'Rp330.000'},
      {name:'$35 (US)', price:'Rp575.000'},
      {name:'$50 (US)', price:'Rp815.000'},
      {name:'¥1500 (Japan)', price:'Rp175.000'},
      {name:'¥3000 (Japan)', price:'Rp345.000'},
      {name:'¥5000 (Japan)', price:'Rp570.000'},
    ] 
  },
// VOUCHER BARU: BLIZZARD BATTLE.NET
  battlenet: { 
    name: 'Battle.net Balance', 
    cover: 'assets/voucher/battlenet.png', 
    fields: ['Battle.net Email'], 
    subtitle: 'Blizzard • Gift Card', 
    nominal: [
      {name:'$10', price:'Rp165.000'},
      {name:'$20', price:'Rp325.000'},
      {name:'$50', price:'Rp805.000'},
      {name:'$100', price:'Rp1.600.000'},
    ] 
  },

  // VOUCHER BARU: CODASHOP VOUCHER
  codashop: { 
    name: 'Codashop Voucher', 
    cover: 'assets/voucher/codashop.png', 
    fields: ['Email'], 
    subtitle: 'Coda • Universal Voucher', 
    nominal: [
      {name:'Rp10.000', price:'Rp11.000'},
      {name:'Rp25.000', price:'Rp26.500'},
      {name:'Rp50.000', price:'Rp52.500'},
      {name:'Rp100.000', price:'Rp104.000'},
      {name:'Rp200.000', price:'Rp207.000'},
      {name:'Rp500.000', price:'Rp515.000'},
    ] 
  },

  // ===========================
  //    PULSA (EXTENDED)
  // ===========================
  telkomsel: { 
    name: 'Telkomsel', 
    cover: 'assets/pulsa/telkomsel.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Pulsa & Paket Data', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp6.500'},
      {name:'Pulsa 10.000', price:'Rp11.500'},
      {name:'Pulsa 15.000', price:'Rp16.500'},
      {name:'Pulsa 20.000', price:'Rp21.500'},
      {name:'Pulsa 25.000', price:'Rp26.500'},
      {name:'Pulsa 30.000', price:'Rp31.500'},
      {name:'Pulsa 40.000', price:'Rp41.500'},
      {name:'Pulsa 50.000', price:'Rp51.000'},
      {name:'Pulsa 75.000', price:'Rp76.000'},
      {name:'Pulsa 100.000', price:'Rp101.000'},
      {name:'Pulsa 150.000', price:'Rp151.500'},
      {name:'Pulsa 200.000', price:'Rp202.000'},
      {name:'Data 1GB 1 Hari', price:'Rp8.000'},
      {name:'Data 2GB 3 Hari', price:'Rp15.000'},
      {name:'Data 3GB 5 Hari', price:'Rp22.000'},
      {name:'Data 6GB 7 Hari', price:'Rp35.000'},
      {name:'Data 10GB 15 Hari', price:'Rp55.000'},
      {name:'Data 15GB 30 Hari', price:'Rp75.000'},
      {name:'Data 25GB 30 Hari', price:'Rp110.000'},
      {name:'Data 50GB 30 Hari', price:'Rp185.000'},
      {name:'Unlimited 1 Hari', price:'Rp12.000'},
      {name:'Unlimited 7 Hari', price:'Rp45.000'},
      {name:'Unlimited 30 Hari', price:'Rp150.000'},
    ] 
  },

  xl: { 
    name: 'XL', 
    cover: 'assets/pulsa/xl.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Pulsa & Paket Data', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp6.300'},
      {name:'Pulsa 10.000', price:'Rp11.200'},
      {name:'Pulsa 15.000', price:'Rp16.000'},
      {name:'Pulsa 20.000', price:'Rp21.000'},
      {name:'Pulsa 25.000', price:'Rp26.000'},
      {name:'Pulsa 30.000', price:'Rp31.000'},
      {name:'Pulsa 50.000', price:'Rp50.500'},
      {name:'Pulsa 100.000', price:'Rp100.500'},
      {name:'Pulsa 150.000', price:'Rp150.500'},
      {name:'Data 1.5GB 3 Hari', price:'Rp12.000'},
      {name:'Data 3GB 7 Hari', price:'Rp25.000'},
      {name:'Data 5GB 7 Hari', price:'Rp35.000'},
      {name:'Data 8GB 15 Hari', price:'Rp45.000'},
      {name:'Data 10GB 30 Hari', price:'Rp55.000'},
      {name:'Data 16GB 30 Hari', price:'Rp75.000'},
      {name:'Data 25GB 30 Hari', price:'Rp100.000'},
      {name:'Data 50GB 30 Hari', price:'Rp175.000'},
    ] 
  },

  indosat: { 
    name: 'Indosat', 
    cover: 'assets/pulsa/indosat.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Pulsa & Paket Data', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp6.200'},
      {name:'Pulsa 10.000', price:'Rp11.100'},
      {name:'Pulsa 15.000', price:'Rp16.000'},
      {name:'Pulsa 20.000', price:'Rp21.000'},
      {name:'Pulsa 25.000', price:'Rp26.000'},
      {name:'Pulsa 30.000', price:'Rp31.000'},
      {name:'Pulsa 50.000', price:'Rp50.500'},
      {name:'Pulsa 100.000', price:'Rp100.500'},
      {name:'Freedom 1GB', price:'Rp10.000'},
      {name:'Freedom 2GB', price:'Rp18.000'},
      {name:'Freedom 3GB', price:'Rp25.000'},
      {name:'Freedom 5GB', price:'Rp38.000'},
      {name:'Freedom 10GB', price:'Rp50.000'},
      {name:'Freedom 20GB', price:'Rp85.000'},
      {name:'Freedom Unlimited 1 Hari', price:'Rp12.000'},
      {name:'Freedom Unlimited 7 Hari', price:'Rp50.000'},
      {name:'Freedom Unlimited 30 Hari', price:'Rp100.000'},
    ] 
  },

  axis: { 
    name: 'Axis', 
    cover: 'assets/pulsa/axis.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Pulsa & Paket Data', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp6.100'},
      {name:'Pulsa 10.000', price:'Rp11.000'},
      {name:'Pulsa 15.000', price:'Rp15.900'},
      {name:'Pulsa 20.000', price:'Rp20.800'},
      {name:'Pulsa 25.000', price:'Rp25.500'},
      {name:'Pulsa 30.000', price:'Rp30.500'},
      {name:'Pulsa 50.000', price:'Rp50.500'},
      {name:'Pulsa 100.000', price:'Rp100.500'},
      {name:'Bronet 1GB', price:'Rp12.000'},
      {name:'Bronet 2GB', price:'Rp20.000'},
      {name:'Bronet 3GB', price:'Rp30.000'},
      {name:'Bronet 5GB', price:'Rp42.000'},
      {name:'Bronet 8GB', price:'Rp55.000'},
      {name:'Bronet 16GB', price:'Rp85.000'},
      {name:'Bronet 25GB', price:'Rp120.000'},
    ] 
  },

  smartfren: { 
    name: 'Smartfren', 
    cover: 'assets/pulsa/smartfren.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Pulsa & Paket Data', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp6.200'},
      {name:'Pulsa 10.000', price:'Rp11.200'},
      {name:'Pulsa 20.000', price:'Rp21.200'},
      {name:'Pulsa 25.000', price:'Rp26.000'},
      {name:'Pulsa 50.000', price:'Rp51.000'},
      {name:'Pulsa 100.000', price:'Rp101.000'},
      {name:'Kuota 2GB', price:'Rp15.000'},
      {name:'Kuota 4GB', price:'Rp25.000'},
      {name:'Kuota 6GB', price:'Rp35.000'},
      {name:'Kuota 10GB', price:'Rp50.000'},
      {name:'Kuota 15GB', price:'Rp65.000'},
      {name:'Kuota 30GB', price:'Rp110.000'},
      {name:'Unlimited 1 Hari', price:'Rp8.000'},
      {name:'Unlimited 3 Hari', price:'Rp18.000'},
      {name:'Unlimited 7 Hari', price:'Rp30.000'},
      {name:'Unlimited 30 Hari', price:'Rp100.000'},
      {name:'Unlimited 60 Hari', price:'Rp185.000'},
    ] 
  },

  tri: { 
    name: 'Tri 3', 
    cover: 'assets/pulsa/tri.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Pulsa & Paket Data', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp5.800'},
      {name:'Pulsa 10.000', price:'Rp10.800'},
      {name:'Pulsa 15.000', price:'Rp15.700'},
      {name:'Pulsa 20.000', price:'Rp20.500'},
      {name:'Pulsa 30.000', price:'Rp30.500'},
      {name:'Pulsa 50.000', price:'Rp50.500'},
      {name:'Pulsa 75.000', price:'Rp75.500'},
      {name:'Pulsa 100.000', price:'Rp100.500'},
      {name:'Always On 1GB', price:'Rp15.000'},
      {name:'Always On 2GB', price:'Rp25.000'},
      {name:'Always On 4GB', price:'Rp40.000'},
      {name:'Always On 6GB', price:'Rp50.000'},
      {name:'Always On 10GB', price:'Rp70.000'},
      {name:'Always On 14GB', price:'Rp90.000'},
      {name:'Always On 20GB', price:'Rp115.000'},
      {name:'Always On 30GB', price:'Rp150.000'},
      {name:'Always On 50GB', price:'Rp220.000'},
    ] 
  },

  // PULSA BARU: BY.U
  byu: { 
    name: 'by.U', 
    cover: 'assets/pulsa/byu.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Telkomsel • Pulsa & Paket', 
    nominal: [
      {name:'Pulsa 5.000', price:'Rp6.000'},
      {name:'Pulsa 10.000', price:'Rp11.000'},
      {name:'Pulsa 20.000', price:'Rp21.000'},
      {name:'Pulsa 50.000', price:'Rp51.000'},
      {name:'Pulsa 100.000', price:'Rp101.000'},
      {name:'Paket 1GB', price:'Rp10.000'},
      {name:'Paket 3GB', price:'Rp25.000'},
      {name:'Paket 5GB', price:'Rp40.000'},
      {name:'Paket 10GB', price:'Rp65.000'},
      {name:'Paket 20GB', price:'Rp100.000'},
    ] 
  },

// ===========================
  //   STREAMING (EXTENDED)
  // ===========================
  netflix: { 
    name: 'Netflix', 
    cover: 'assets/streaming/netflix.png', 
    fields: ['Email Netflix'], 
    subtitle: 'Streaming • Premium Account', 
    nominal: [
      {name:'Mobile 1 Bulan', price:'Rp54.000'},
      {name:'Mobile 3 Bulan', price:'Rp155.000'},
      {name:'Basic 1 Bulan', price:'Rp65.000'},
      {name:'Basic 3 Bulan', price:'Rp185.000'},
      {name:'Standard 1 Bulan', price:'Rp120.000'},
      {name:'Standard 3 Bulan', price:'Rp345.000'},
      {name:'Premium 1 Bulan', price:'Rp186.000'},
      {name:'Premium 3 Bulan', price:'Rp540.000'},
      {name:'Premium 1 Profile 1 Bulan', price:'Rp45.000'},
      {name:'Premium 1 Profile 3 Bulan', price:'Rp130.000'},
    ] 
  },

  ytprem: { 
    name: 'YouTube Premium', 
    cover: 'assets/streaming/ytprem.png', 
    fields: ['Email Gmail'], 
    subtitle: 'Google • YouTube Premium', 
    nominal: [
      {name:'Individual 1 Bulan', price:'Rp59.000'},
      {name:'Individual 3 Bulan', price:'Rp165.000'},
      {name:'Individual 6 Bulan', price:'Rp320.000'},
      {name:'Individual 12 Bulan', price:'Rp599.000'},
      {name:'Family 1 Bulan', price:'Rp99.000'},
      {name:'Family 3 Bulan', price:'Rp285.000'},
      {name:'Family 6 Bulan', price:'Rp560.000'},
    ] 
  },

  spotify: { 
    name: 'Spotify', 
    cover: 'assets/streaming/spotify.png', 
    fields: ['Email Spotify'], 
    subtitle: 'Spotify • Premium', 
    nominal: [
      {name:'Individual 1 Bulan', price:'Rp54.990'},
      {name:'Individual 3 Bulan', price:'Rp155.000'},
      {name:'Individual 6 Bulan', price:'Rp299.000'},
      {name:'Individual 12 Bulan', price:'Rp549.000'},
      {name:'Student 1 Bulan', price:'Rp27.500'},
      {name:'Student 3 Bulan', price:'Rp79.000'},
      {name:'Duo 1 Bulan', price:'Rp71.490'},
      {name:'Duo 3 Bulan', price:'Rp205.000'},
      {name:'Family 1 Bulan', price:'Rp86.900'},
      {name:'Family 3 Bulan', price:'Rp250.000'},
    ] 
  },

  vidio: { 
    name: 'Vidio', 
    cover: 'assets/streaming/vidio.png', 
    fields: ['Email/No HP'], 
    subtitle: 'Vidio • Premium', 
    nominal: [
      {name:'Platinum 1 Bulan', price:'Rp59.000'},
      {name:'Platinum 3 Bulan', price:'Rp159.000'},
      {name:'Platinum 6 Bulan', price:'Rp299.000'},
      {name:'Platinum 12 Bulan', price:'Rp499.000'},
      {name:'Diamond 1 Bulan', price:'Rp149.000'},
      {name:'Diamond 3 Bulan', price:'Rp425.000'},
    ] 
  },

  disney: { 
    name: 'Disney+ Hotstar', 
    cover: 'assets/streaming/disney.png', 
    fields: ['Email'], 
    subtitle: 'Disney • Hotstar', 
    nominal: [
      {name:'Mobile 1 Bulan', price:'Rp39.000'},
      {name:'Mobile 3 Bulan', price:'Rp109.000'},
      {name:'Mobile 12 Bulan', price:'Rp199.000'},
      {name:'Premium 1 Bulan', price:'Rp159.000'},
      {name:'Premium 3 Bulan', price:'Rp459.000'},
      {name:'Premium 12 Bulan', price:'Rp399.000'},
    ] 
  },

  prime: { 
    name: 'Amazon Prime Video', 
    cover: 'assets/streaming/prime.png', 
    fields: ['Email Amazon'], 
    subtitle: 'Amazon • Prime Video', 
    nominal: [
      {name:'1 Bulan', price:'Rp59.000'},
      {name:'3 Bulan', price:'Rp165.000'},
      {name:'6 Bulan', price:'Rp310.000'},
      {name:'12 Bulan', price:'Rp590.000'},
    ] 
  },

  wetv: { 
    name: 'WeTV', 
    cover: 'assets/streaming/wetv.png', 
    fields: ['Email/No HP'], 
    subtitle: 'Tencent • WeTV VIP', 
    nominal: [
      {name:'VIP 1 Bulan', price:'Rp39.000'},
      {name:'VIP 3 Bulan', price:'Rp109.000'},
      {name:'VIP 6 Bulan', price:'Rp199.000'},
      {name:'VIP 12 Bulan', price:'Rp349.000'},
    ] 
  },

  iqiyi: { 
    name: 'iQIYI', 
    cover: 'assets/streaming/iqiyi.png', 
    fields: ['Email/No HP'], 
    subtitle: 'iQIYI • VIP', 
    nominal: [
      {name:'VIP 1 Bulan', price:'Rp45.000'},
      {name:'VIP 3 Bulan', price:'Rp119.000'},
      {name:'VIP 6 Bulan', price:'Rp219.000'},
      {name:'VIP 12 Bulan', price:'Rp389.000'},
    ] 
  },

  bstation: { 
    name: 'Bstation', 
    cover: 'assets/streaming/bstation.png', 
    fields: ['User ID'], 
    subtitle: 'Bilibili • Premium', 
    nominal: [
      {name:'Premium 1 Bulan', price:'Rp29.000'},
      {name:'Premium 3 Bulan', price:'Rp79.000'},
      {name:'Premium 6 Bulan', price:'Rp149.000'},
      {name:'Premium 12 Bulan', price:'Rp269.000'},
      {name:'B-Coin 6', price:'Rp15.000'},
      {name:'B-Coin 30', price:'Rp75.000'},
      {name:'B-Coin 68', price:'Rp165.000'},
      {name:'B-Coin 128', price:'Rp315.000'},
    ] 
  },

  // STREAMING BARU: APPLE TV+
  appletv: { 
    name: 'Apple TV+', 
    cover: 'assets/streaming/appletv.png', 
    fields: ['Apple ID Email'], 
    subtitle: 'Apple • TV Plus', 
    nominal: [
      {name:'1 Bulan', price:'Rp69.000'},
      {name:'3 Bulan', price:'Rp199.000'},
      {name:'6 Bulan', price:'Rp389.000'},
      {name:'12 Bulan', price:'Rp749.000'},
    ] 
  },

  // STREAMING BARU: CRUNCHYROLL
  crunchyroll: { 
    name: 'Crunchyroll', 
    cover: 'assets/streaming/crunchyroll.png', 
    fields: ['Email Crunchyroll'], 
    subtitle: 'Crunchyroll • Premium', 
    nominal: [
      {name:'Fan 1 Bulan', price:'Rp55.000'},
      {name:'Fan 3 Bulan', price:'Rp155.000'},
      {name:'Fan 12 Bulan', price:'Rp589.000'},
      {name:'Mega Fan 1 Bulan', price:'Rp79.000'},
      {name:'Mega Fan 3 Bulan', price:'Rp225.000'},
      {name:'Mega Fan 12 Bulan', price:'Rp849.000'},
    ] 
  },

  // STREAMING BARU: JOOX VIP
  joox: { 
    name: 'JOOX VIP', 
    cover: 'assets/streaming/joox.png', 
    fields: ['Nomor HP'], 
    subtitle: 'Tencent • JOOX VIP', 
    nominal: [
      {name:'VIP 1 Bulan', price:'Rp39.000'},
      {name:'VIP 3 Bulan', price:'Rp109.000'},
      {name:'VIP 6 Bulan', price:'Rp199.000'},
      {name:'VIP 12 Bulan', price:'Rp379.000'},
    ] 
  },
};

  if (gameId && games[gameId]) {
    const game = games[gameId];
    
    titleEl.textContent = `Top Up ${game.name}`;
    subtitleEl.textContent = game.subtitle;
    coverEl.src = game.cover;
    rightPanel.innerHTML = '';

    // 1️⃣ Input fields
    const formCard = document.createElement('div');
    formCard.className = 'form-card';
    formCard.innerHTML = `<h3>1. Masukkan Data</h3>`;
    
    game.fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'input-group';
      group.innerHTML = `
        <label>${field}</label>
        <input type="text" placeholder="Masukkan ${field}" class="input-field" data-field="${field}">
      `;
      formCard.appendChild(group);
    });
    rightPanel.appendChild(formCard);

    // 2️⃣ Pilih Nominal
    const nominalWrap = document.createElement('div');
    nominalWrap.className = 'nominal-wrap';
    nominalWrap.innerHTML = `<h3>2. Pilih Nominal</h3>`;
    
    const nominalContainer = document.createElement('div');
    nominalContainer.className = 'diamond-grid';
    
    game.nominal.forEach(item => {
      const label = document.createElement('label');
      label.className = 'diamond-card';
      label.innerHTML = `
        <strong>${item.name}</strong>
        <span>${item.price}</span>
        <input type="radio" name="nominal" value="${item.name}" style="display:none">
      `;
      nominalContainer.appendChild(label);

      label.addEventListener('click', () => {
        nominalContainer.querySelectorAll('.diamond-card').forEach(c => c.classList.remove('active'));
        label.classList.add('active');
        label.querySelector('input').checked = true;
      });
    });
    
    nominalWrap.appendChild(nominalContainer);
    rightPanel.appendChild(nominalWrap);

    // 3️⃣ Payment methods
    const payBox = document.createElement('div');
    payBox.className = 'pay-box';
    payBox.innerHTML = `
      <h3>3. Pilih Metode Pembayaran</h3>
      <div class="pay-category pay-cat-toggle">
        <div class="pay-cat-title">💳 Transfer Bank</div>
        <div class="pay-items">
          <div class="pay-item" data-value="bca">BCA</div>
          <div class="pay-item" data-value="bri">BRI</div>
          <div class="pay-item" data-value="mandiri">Mandiri</div>
          <div class="pay-item" data-value="bni">BNI</div>
        </div>
      </div>
      <div class="pay-category pay-cat-toggle">
        <div class="pay-cat-title">💳 E-Wallet</div>
        <div class="pay-items">
          <div class="pay-item" data-value="dana">DANA</div>
          <div class="pay-item" data-value="ovo">OVO</div>
          <div class="pay-item" data-value="gopay">GoPay</div>
          <div class="pay-item" data-value="shopeepay">ShopeePay</div>
        </div>
      </div>
      <div class="pay-category pay-cat-toggle">
        <div class="pay-cat-title">💳 Pulsa</div>
        <div class="pay-items">
          <div class="pay-item" data-value="tsel">Telkomsel</div>
          <div class="pay-item" data-value="xl">XL</div>
          <div class="pay-item" data-value="indosat">Indosat</div>
          <div class="pay-item" data-value="axis">Axis</div>
        </div>
      </div>
    `;
    rightPanel.appendChild(payBox);

    // Toggle kategori payment
    const payCategories = payBox.querySelectorAll('.pay-cat-toggle');
    payCategories.forEach(cat => {
      const title = cat.querySelector('.pay-cat-title');
      title.addEventListener('click', () => {
        payCategories.forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
      });
    });

    // Pilih metode pembayaran
    payBox.addEventListener('click', e => {
      const item = e.target.closest('.pay-item');
      if (!item) return;
      payBox.querySelectorAll('.pay-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
    });

    // 4️⃣ Promo
    const promoCard = document.createElement('div');
    promoCard.className = 'promo-card';
    promoCard.innerHTML = `
      <h3>4. Kode Promo (Opsional)</h3>
      <input type="text" class="input-field" placeholder="Masukkan kode promo" data-field="Promo">
    `;
    rightPanel.appendChild(promoCard);

    // 5️⃣ Tombol Beli - HANYA SATU EVENT LISTENER
    const buyBtn = document.createElement('button');
    buyBtn.className = 'btn-buy';
    buyBtn.textContent = 'Beli Sekarang';
    
    buyBtn.addEventListener('click', () => {
      const inputs = rightPanel.querySelectorAll('.input-field');
      const values = {};
      let allFilled = true;
      
      inputs.forEach(i => {
        const field = i.dataset.field || i.placeholder;
        const value = i.value.trim();
        values[field] = value || '-';
        
        if (field !== 'Promo' && field !== 'Masukkan kode promo' && !value) {
          allFilled = false;
        }
      });
      
      const nominal = rightPanel.querySelector('input[name="nominal"]:checked');
      const payment = rightPanel.querySelector('.pay-item.selected');
      
      if (!allFilled) {
        alert('❌ Mohon isi semua data yang diperlukan!');
        return;
      }
      
      if (!nominal) {
        alert('❌ Pilih nominal yang ingin dibeli!');
        return;
      }
      
      if (!payment) {
        alert('❌ Pilih metode pembayaran!');
        return;
      }
      
      // Ambil data untuk popup
      const nominalCard = rightPanel.querySelector('.diamond-card.active');
      const nominalText = nominalCard.querySelector('strong').textContent + ' - ' + nominalCard.querySelector('span').textContent;
      
      let userDataText = '';
      Object.keys(values).forEach(key => {
        if (key !== 'Promo' && key !== 'Masukkan kode promo') {
          userDataText += values[key] + ' ';
        }
      });
      
      // Tampilkan popup
      showTopupPopup({
        game: game.name,
        userData: userDataText.trim(),
        nominal: nominalText,
        payment: payment.textContent.trim()
      });
    });
    
    rightPanel.appendChild(buyBtn);

  } else {
    titleEl.textContent = 'Game Tidak Ada Dalam Data';
    subtitleEl.textContent = 'Laporkan ke admin untuk menambahkan game ini';
    coverEl.src = 'assets/game/default.gif';
    rightPanel.innerHTML = '<p style="text-align:center; padding:40px; color:#aaa;">Game yang anda pilih belum ada dalam data, silahkan pilih game yang lain terlebih dahulu:</p>';
  }

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
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('active')) {
        btn.style.background = '#ffb700';
        btn.style.color = '#0a1822';
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (!btn.classList.contains('active')) {
        btn.style.background = '#15243c';
        btn.style.color = 'white';
      }
    });

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

    catBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = '#15243c';
      btn.style.color = 'white';
    });
  });
});