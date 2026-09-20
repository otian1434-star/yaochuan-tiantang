// ================================================================
// 論壇設定檔 config.js
// 每個社團換皮只需修改本檔案，無需動其他程式碼
// ================================================================

const FORUM_CONFIG = {

  // ── 論壇基本資訊 ─────────────────────────────────────────────
  forumName:     "曜川天堂",
  forumFullName: "曜川天堂",
  forumSlogan:   "3.81 內掛版",
  serverVersion: "3.81 內掛版",
  heroTitle:     "曜川天堂",
  heroSubTitle:  "",
  heroVideo:     "assets/media/hero-bg.mp4",
  heroImage:     "assets/media/hero-characters.png",
  brandLogo:     "assets/media/brand-logo.png",

  // ── 首頁專用欄位 ─────────────────────────────────────────────
  openingDate:   "2026-10-09T20:00:00+08:00",
  openingText:   "2026/10/09（五）20:00 開機",
  server: {
    version:     "3.81 內掛版",
    expRate:     "× 12（內掛 × 1）",
    dropRate:    "× 5",
    goldRate:    "× 5",
    enhanceRate: "× 2",
    multiClient: "IP 限制 3 開",
    characters:  "每帳號可創 4 隻",
    publicChat:  "Lv.10 以上",
    whisper:     "Lv.5 以上",
  },

  // ── 社群連結（尚未設定）──────────────────────────────────────
  lineOfficial:   "",
  lineCommunity:  "",

  // ── 遊戲下載連結（尚未設定）─────────────────────────────────
  download: {
    mainUrl:      "",
    backup1:      "",
    backup2:      "",
    backup3:      "",
    patchUrl:     "",
    updateDate:   "",
    anyDeskUrl:   "https://anydesk.com/zh-tw/downloads/windows",
  },

  // ── 贊助連結（尚未設定）─────────────────────────────────────
  sponsorUrl: "",

  // ── 浮動快捷視窗 ─────────────────────────────────────────────
  floatingPanel: {
    enabled: true,
    title: "曜川快捷",
    note: "官方客服 · 贊助入口 · 下載資訊",
    links: [
      { label: "玩家討論區", icon: "💬", url: "", style: "line" },
      { label: "LINE 官方客服", icon: "LINE", url: "", style: "line" },
      { label: "贊助連結", icon: "SP", url: "", style: "gold" },
      { label: "遊戲下載", icon: "DL", url: "pages/download.html", style: "blue" },
      { label: "全站搜尋", icon: "查", url: "pages/search.html", style: "dark" },
      { label: "最新文章", icon: "NEWS", url: "pages/news.html", style: "dark" },
    ],
  },

  // ── 左右側懸浮圖片 ───────────────────────────────────────────
  sideBanners: {
    enabled: false,
    left: {
      image: "assets/media/side-line-official.png",
      url: "",
      alt: "官方 LINE@",
    },
    right: {
      image: "assets/media/side-auto-sponsor.png",
      url: "",
      alt: "自動贊助",
    },
  },

  // ── 全站音樂播放器 ───────────────────────────────────────────
  musicPlayer: {
    enabled: true,
    title: "曜川音樂",
    autoplay: true,
    loop: true,
    shuffle: true,
    volume: 0.7,
    tracks: [
      { title: "背景音樂 1", url: "assets/media/music/music0.mp3" },
      { title: "背景音樂 2", url: "assets/media/music/music10.mp3" },
      { title: "背景音樂 3", url: "assets/media/music/music12.mp3" },
      { title: "背景音樂 4", url: "assets/media/music/music13.mp3" },
      { title: "背景音樂 5", url: "assets/media/music/music14.mp3" },
      { title: "背景音樂 6", url: "assets/media/music/music16.mp3" },
      { title: "背景音樂 7", url: "assets/media/music/music18.mp3" },
      { title: "背景音樂 8", url: "assets/media/music/music23.mp3" },
      { title: "背景音樂 9", url: "assets/media/music/music27.mp3" },
      { title: "背景音樂 10", url: "assets/media/music/music28.mp3" },
      { title: "背景音樂 11", url: "assets/media/music/music37.mp3" },
      { title: "背景音樂 12", url: "assets/media/music/music76.mp3" },
      { title: "背景音樂 13", url: "assets/media/music/music82.mp3" },
      { title: "背景音樂 14", url: "assets/media/music/music83.mp3" },
      { title: "背景音樂 15", url: "assets/media/music/music142.mp3" },
      { title: "背景音樂 16", url: "assets/media/music/music146.mp3" },
      { title: "背景音樂 17", url: "assets/media/music/music149.mp3" },
      { title: "背景音樂 18", url: "assets/media/music/music153.mp3" },
      { title: "背景音樂 19", url: "assets/media/music/music164.mp3" },
      { title: "背景音樂 20", url: "assets/media/music/music165.mp3" },
      { title: "背景音樂 21", url: "assets/media/music/music176.mp3" },
      { title: "背景音樂 22", url: "assets/media/music/music178.mp3" }
    ],
  },

  // ── 申辦帳號表單 ────────────────────────────────────────────
  registrationForm: {
    provider: "auto",
    appsScript: {
      endpoint: "",
      token: "",
    },
  },

  // ── 彈窗公告 ────────────────────────────────────────────────
  popup: {
    enabled:  false,
    title:    "最新公告",
    content:  `<strong>曜川天堂</strong> 即將開服！<br><br>
               <strong>開服時間：</strong>2026/10/09 20:00<br>
               開服禮包 · 全員贈送<br>
               加入官方LINE獲取最新消息`,
    btnText:  "加入官方 LINE@",
    btnUrl:   "",
    showOnce: true,
  },

  // ── 首頁更新歷程 ────────────────────────────────────────────
  updates: [],

  // ── 首頁 Hero 倍率說明 ──────────────────────────────────────
  heroBadges: [
    "3.81 內掛版",
    "經驗 x12（內掛 x1）",
    "金幣 x5",
    "掉落 x5",
    "強化 x2",
    "IP 限制 3 開",
  ],

  // ── 客服資訊 ──────────────────────────────────────────────────
  lineId:   "",
  teamName: "曜川天堂管理團隊",
};

// 首頁 site.js 使用 SITE_CONFIG
const SITE_CONFIG = FORUM_CONFIG;

// ================================================================
// 後台設定覆蓋
// 上面是「預設值／後備」；實際以後台 CMS 編輯的 data/site.json 為準。
// 讀不到或失敗時自動沿用上面的預設值，網站照常運作（雙重保險）。
// ================================================================
(function () {
  function deepMergeConfig(target, src) {
    if (!src || typeof src !== 'object') return;
    Object.keys(src).forEach(function (key) {
      var sv = src[key];
      var tv = target[key];
      if (sv && typeof sv === 'object' && !Array.isArray(sv) &&
          tv && typeof tv === 'object' && !Array.isArray(tv)) {
        deepMergeConfig(tv, sv);
      } else if (sv !== undefined) {
        target[key] = sv;
      }
    });
  }

  window.FORUM_CONFIG_READY = new Promise(function (resolve) {
    var settled = false;
    function finish() { if (settled) return; settled = true; resolve(FORUM_CONFIG); }
    setTimeout(finish, 2500);
    try {
      var p = window.location.pathname;
      var base = (p.indexOf('/pages/') >= 0 || p.indexOf('/admin/') >= 0) ? '../' : './';
      fetch(base + 'data/site.json', { cache: 'no-store' })
        .then(function (r) { return (r && r.ok) ? r.json() : null; })
        .then(function (data) { if (data) deepMergeConfig(FORUM_CONFIG, data); })
        .catch(function () {})
        .then(finish);
    } catch (e) { finish(); }
  });
})();
