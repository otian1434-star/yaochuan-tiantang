(function () {
  "use strict";

  var config = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
  var server = config.server || {};

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && value) element.textContent = value;
  }

  setText("opening-text", config.openingText);
  setText("server-version", config.serverVersion || server.version);
  setText("rate-exp", server.expRate);
  setText("rate-drop", server.dropRate);
  setText("rate-gold", server.goldRate);
  setText("rate-enhance", server.enhanceRate);
  setText("rate-client", server.multiClient);
  setText("rate-characters", server.characters);

  var countdownTarget = new Date(config.openingDate || "2026-10-09T20:00:00+08:00").getTime();
  var countdownIds = ["cd-days", "cd-hours", "cd-mins", "cd-secs"];

  function pad(value) {
    return String(Math.max(0, value)).padStart(2, "0");
  }

  function updateCountdown() {
    var difference = Math.max(0, countdownTarget - Date.now());
    var values = [
      Math.floor(difference / 86400000),
      Math.floor((difference % 86400000) / 3600000),
      Math.floor((difference % 3600000) / 60000),
      Math.floor((difference % 60000) / 1000)
    ];
    countdownIds.forEach(function (id, index) { setText(id, pad(values[index])); });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  var header = document.getElementById("site-header");
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  var menuButton = document.getElementById("menu-button");
  var siteNav = document.getElementById("site-nav");
  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }
})();
