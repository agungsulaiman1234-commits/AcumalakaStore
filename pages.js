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
});

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       COUNTDOWN TIMER (Promo Page)
    ======================================== */
    const countdown = document.getElementById('flashCountdown');
    if (countdown) {
        // Set target: akhir minggu ini (Minggu 23:59:59)
        function getNextSunday() {
            const now = new Date();
            const day = now.getDay();
            const diff = 7 - day; // days until Sunday
            const target = new Date(now);
            target.setDate(now.getDate() + diff);
            target.setHours(23, 59, 59, 999);
            return target;
        }

        let targetDate = getNextSunday();

        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                targetDate = getNextSunday();
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /* ========================================
       ANIMATED COUNTER (About Page)
    ======================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    el.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target.toLocaleString() + (target === 24 ? '/7' : '+');
                }
            };
            update();
        };

        // Intersection Observer for triggering animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => observer.observe(num));
    }

    /* ========================================
       FAQ ACCORDION (Kebijakan Page)
    ======================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains('show');

            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('show'));
            document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

            // Toggle current
            if (!isOpen) {
                answer.classList.add('show');
                question.classList.add('active');
            }
        });
    });

    /* ========================================
       POLICY NAV ACTIVE STATE
    ======================================== */
    const policyLinks = document.querySelectorAll('.policy-link');
    policyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            policyLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active link on scroll
    const policySections = document.querySelectorAll('.policy-section');
    if (policySections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            policySections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            policyLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    /* ========================================
       TRANSACTION FILTER (Daftar Transaksi)
    ======================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            // Di sini bisa ditambahkan logic untuk filter transaksi
            console.log('Filter:', filter);
        });
    });

    /* ========================================
       SEARCH TRANSACTION
    ======================================== */
    const searchTransactionBtn = document.getElementById('btnSearchTransaction');
    const searchTransactionInput = document.getElementById('searchTransaction');
    
    if (searchTransactionBtn && searchTransactionInput) {
        searchTransactionBtn.addEventListener('click', () => {
            const query = searchTransactionInput.value.trim();
            if (query) {
                // Logic pencarian transaksi
                console.log('Mencari transaksi:', query);
                alert('Mencari transaksi dengan ID/Email: ' + query);
            } else {
                alert('Masukkan ID transaksi atau email!');
            }
        });

        searchTransactionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchTransactionBtn.click();
            }
        });
    }

    /* ========================================
       PROMO CLAIM BUTTON
    ======================================== */
    const claimBtns = document.querySelectorAll('.btn-claim');
    claimBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const promoName = btn.closest('.promo-info').querySelector('h3').textContent;
            alert('Promo "' + promoName + '" berhasil diklaim! Silakan cek akun Anda.');
        });
    });

    /* ========================================
       SMOOTH SCROLL FOR ANCHOR LINKS
    ======================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ========================================
       SAMPLE TRANSACTION DATA (Demo)
    ======================================== */
    // Uncomment untuk demo menampilkan transaksi
    /*
    const sampleTransactions = [
        { id: 'TRX001', product: 'Mobile Legends 86 Diamond', date: '20 Jan 2025', status: 'success', amount: 'Rp 25.000' },
        { id: 'TRX002', product: 'Free Fire 100 Diamond', date: '19 Jan 2025', status: 'pending', amount: 'Rp 15.000' },
        { id: 'TRX003', product: 'Voucher Google Play 50K', date: '18 Jan 2025', status: 'failed', amount: 'Rp 50.000' },
    ];

    const transactionList = document.getElementById('transactionList');
    if (transactionList && sampleTransactions.length > 0) {
        transactionList.innerHTML = '';
        sampleTransactions.forEach(trx => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="transaction-info">
                    <h4>${trx.product}</h4>
                    <p>${trx.id} • ${trx.date} • ${trx.amount}</p>
                </div>
                <span class="transaction-status status-${trx.status}">
                    ${trx.status === 'success' ? 'Sukses' : trx.status === 'pending' ? 'Pending' : 'Gagal'}
                </span>
            `;
            transactionList.appendChild(item);
        });
    }
    */
});