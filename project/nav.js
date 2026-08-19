document.addEventListener("DOMContentLoaded", function () {
  var placeholder = document.getElementById("nav-placeholder");
  if (!placeholder) return;

  fetch("nav.html")
    .then(function (res) { return res.text(); })
    .then(function (html) {
      placeholder.innerHTML = html;
      var currentPage = location.pathname.split("/").pop() || "index.html";
      var links = placeholder.querySelectorAll(".inner-nav a");
      links.forEach(function (link) {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });
    });
});
