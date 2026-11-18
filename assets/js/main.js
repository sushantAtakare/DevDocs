/**
 * DevDocs — Phase 1 client script
 * Mobile nav toggle and progressive enhancement hooks.
 */
(function () {
  "use strict";

  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  if (!toggle || !nav) {
    return;
  }

  function setOpen(isOpen) {
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    nav.classList.toggle("is-open", isOpen);
  }

  toggle.addEventListener("click", function () {
    var expanded = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!expanded);
  });

  // Close the mobile menu after activating a nav link
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  // Close on Escape for keyboard users
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
})();
