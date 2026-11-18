/**
 * DevDocs — theme, header nav, and documentation drawer.
 */
(function () {
  "use strict";

  var THEME_KEY = "devdocs-theme";
  var THEMES = ["light", "dark", "system"];

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getPreference() {
    try {
      return localStorage.getItem(THEME_KEY) || "system";
    } catch (e) {
      return "system";
    }
  }

  function resolveTheme(pref) {
    if (pref === "dark" || pref === "light") {
      return pref;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(pref) {
    var resolved = resolveTheme(pref);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-preference", pref);

    var toggle = document.getElementById("theme-toggle");
    var label = document.getElementById("theme-toggle-label");
    if (toggle) {
      var readable = pref.charAt(0).toUpperCase() + pref.slice(1);
      toggle.setAttribute("aria-label", "Color theme: " + readable + ". Click to change.");
      toggle.setAttribute("data-theme-preference", pref);
      toggle.setAttribute("title", "Theme: " + readable);
    }
    if (label) {
      label.textContent = pref.charAt(0).toUpperCase() + pref.slice(1);
    }
  }

  function cycleTheme() {
    var current = getPreference();
    var index = THEMES.indexOf(current);
    var next = THEMES[(index + 1) % THEMES.length];
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* ignore quota / private mode */
    }
    applyTheme(next);
  }

  function initTheme() {
    applyTheme(getPreference());

    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", cycleTheme);
    }

    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      if (getPreference() === "system") {
        applyTheme("system");
      }
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onChange);
    }
  }

  function lockBodyScroll(lock) {
    document.documentElement.classList.toggle("scroll-locked", lock);
    document.body.classList.toggle("scroll-locked", lock);
  }

  function initSiteNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) {
      return null;
    }

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
      if (!document.body.classList.contains("docs-drawer-open")) {
        lockBodyScroll(isOpen);
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    return { setOpen: setOpen };
  }

  function initDocsDrawer() {
    var toggle = document.getElementById("docs-sidebar-toggle");
    var sidebar = document.getElementById("docs-sidebar");
    var backdrop = document.getElementById("docs-sidebar-backdrop");
    var closeBtn = document.getElementById("docs-sidebar-close");

    if (!toggle || !sidebar) {
      return null;
    }

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      sidebar.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("docs-drawer-open", isOpen);
      if (backdrop) {
        backdrop.hidden = !isOpen;
        backdrop.classList.toggle("is-visible", isOpen);
      }
      lockBodyScroll(isOpen || document.body.classList.contains("nav-open"));

      if (isOpen && !prefersReducedMotion()) {
        sidebar.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setOpen(false);
        toggle.focus();
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    sidebar.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    sidebar.setAttribute("tabindex", "-1");

    return { setOpen: setOpen };
  }

  initTheme();
  var siteNav = initSiteNav();
  var docsDrawer = initDocsDrawer();

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    if (docsDrawer) {
      docsDrawer.setOpen(false);
    }
    if (siteNav) {
      siteNav.setOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 961px)").matches && docsDrawer) {
      docsDrawer.setOpen(false);
    }
    if (window.matchMedia("(min-width: 801px)").matches && siteNav) {
      siteNav.setOpen(false);
    }
  });
})();
