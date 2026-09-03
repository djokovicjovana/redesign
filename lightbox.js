(function () {
  function createLightboxMarkup() {
    var existing = document.getElementById("globalLightbox");
    if (existing) return existing;

    var lightbox = document.createElement("div");
    lightbox.id = "globalLightbox";
    lightbox.className = "anja-lightbox global-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");

    lightbox.innerHTML =
      '<div class="anja-lightbox-backdrop" id="globalLightboxBackdrop"></div>' +
      '<div class="anja-lightbox-dialog">' +
        '<div class="lightbox-header-bar">' +
          '<span class="lightbox-counter" id="globalLightboxCounter">01 / 01</span>' +
          '<button type="button" class="anja-lightbox-close" id="globalLightboxClose" aria-label="Close image">&times;</button>' +
        '</div>' +
        '<button type="button" class="anja-lightbox-nav anja-lightbox-prev" id="globalLightboxPrev" aria-label="Previous image">&larr;</button>' +
        '<div class="anja-lightbox-media" id="globalLightboxMedia">' +
          '<img id="globalLightboxImg" src="" alt="Enlarged gallery view">' +
        '</div>' +
        '<button type="button" class="anja-lightbox-nav anja-lightbox-next" id="globalLightboxNext" aria-label="Next image">&rarr;</button>' +
      '</div>';

    document.body.appendChild(lightbox);
    return lightbox;
  }

  function setupLightbox(imagesList, triggerSelector) {
    if (!imagesList || imagesList.length === 0) return;

    var lightbox = createLightboxMarkup();
    var lightboxImg = document.getElementById("globalLightboxImg");
    var lightboxCounter = document.getElementById("globalLightboxCounter");
    var lightboxBackdrop = document.getElementById("globalLightboxBackdrop");
    var lightboxClose = document.getElementById("globalLightboxClose");
    var lightboxPrev = document.getElementById("globalLightboxPrev");
    var lightboxNext = document.getElementById("globalLightboxNext");
    var mediaContainer = document.getElementById("globalLightboxMedia");

    var currentIndex = 0;
    var total = imagesList.length;
    var preloadedCache = {};

    function formatNumber(num) {
      return num < 10 ? "0" + num : "" + num;
    }

    function preload(idx) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      var src = typeof imagesList[idx] === "string" ? imagesList[idx] : imagesList[idx].src;
      if (src && !preloadedCache[src]) {
        var img = new Image();
        img.src = src;
        preloadedCache[src] = img;
      }
    }

    function updateView(idx) {
      if (idx < 0) {
        currentIndex = total - 1;
      } else if (idx >= total) {
        currentIndex = 0;
      } else {
        currentIndex = idx;
      }

      var item = imagesList[currentIndex];
      var src = typeof item === "string" ? item : item.src;
      var alt = typeof item === "object" && item.alt ? item.alt : "Enlarged photo";

      lightboxImg.style.opacity = "0";
      setTimeout(function () {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightboxImg.style.opacity = "1";
      }, 120);

      if (lightboxCounter) {
        lightboxCounter.textContent = formatNumber(currentIndex + 1) + " / " + formatNumber(total);
      }

      preload(currentIndex + 1);
      preload(currentIndex - 1);
    }

    function open(idx) {
      currentIndex = typeof idx === "number" ? idx : 0;
      updateView(currentIndex);
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lightboxClose) lightboxClose.focus();
    }

    function close() {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function prev() {
      updateView(currentIndex - 1);
    }

    function next() {
      updateView(currentIndex + 1);
    }

    if (lightboxClose) lightboxClose.onclick = close;
    if (lightboxBackdrop) lightboxBackdrop.onclick = close;
    if (lightboxPrev) lightboxPrev.onclick = prev;
    if (lightboxNext) lightboxNext.onclick = next;

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;

    if (mediaContainer) {
      mediaContainer.addEventListener("touchstart", function (e) {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      mediaContainer.addEventListener("touchend", function (e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      var dx = touchEndX - touchStartX;
      var dy = touchEndY - touchStartY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          next();
        } else {
          prev();
        }
      }
    }

    if (triggerSelector) {
      var triggers = document.querySelectorAll(triggerSelector);
      triggers.forEach(function (el, i) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          var dataIdx = el.getAttribute("data-index");
          var targetIndex = dataIdx !== null ? parseInt(dataIdx, 10) : i;
          if (isNaN(targetIndex)) targetIndex = i;
          open(targetIndex);
        });
      });
    }

    return {
      open: open,
      close: close,
      next: next,
      prev: prev
    };
  }

  window.initLightbox = setupLightbox;
})();
