/**
 * DevDocs — client script
 * Site header nav + documentation sidebar toggles.
 */
(function () {
  "use strict";

  function bindToggle(toggleId, panelId) {
    var toggle = document.getElementById(toggleId);
    var panel = document.getElementById(panelId);

    if (!toggle || !panel) {
      return null;
    }

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      panel.classList.toggle("is-open", isOpen);
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!expanded);
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    return { setOpen: setOpen };
  }

  var siteNav = bindToggle("nav-toggle", "site-nav");
  var docsSidebar = bindToggle("docs-sidebar-toggle", "docs-sidebar");

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    if (siteNav) {
      siteNav.setOpen(false);
    }
    if (docsSidebar) {
      docsSidebar.setOpen(false);
    }
  });
})();
