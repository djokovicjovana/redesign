document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".inner-header");
  if (header) {
    var checkScroll = function () {
      if (window.scrollY > 30) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
  }

  var toggleBtn = document.querySelector(".mobile-menu-toggle");
  var drawer = document.querySelector(".mobile-drawer");
  var drawerBackdrop = document.querySelector(".mobile-drawer-backdrop");

  function openDrawer() {
    if (!drawer || !toggleBtn) return;
    drawer.classList.add("active");
    toggleBtn.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer || !toggleBtn) return;
    drawer.classList.remove("active");
    toggleBtn.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", function () {
      if (drawer.classList.contains("active")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener("click", closeDrawer);
    }

    var drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("active")) {
        closeDrawer();
      }
    });
  }

  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var allNavLinks = document.querySelectorAll(".inner-nav a, .mobile-drawer-links a, .overlay-nav a");
  allNavLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  var revealElements = document.querySelectorAll(".reveal-on-scroll, .events-grid-row, .events-feature, .project-item, .portrait-card, .portrait-story-section, .about-right, .booking-container");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(function (el) {
      el.classList.add("reveal-on-scroll");
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }
});
