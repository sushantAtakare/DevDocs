/**
 * DevDocs — client-side documentation search
 * Loads a static JSON index and filters it in the browser.
 */
(function () {
  "use strict";

  var root = document.getElementById("docs-search");
  if (!root) {
    return;
  }

  var input = document.getElementById("docs-search-input");
  var resultsEl = document.getElementById("docs-search-results");
  var statusEl = document.getElementById("docs-search-status");
  var clearBtn = document.getElementById("docs-search-clear");
  var indexUrl = root.getAttribute("data-search-index");

  var docs = [];
  var filtered = [];
  var activeIndex = -1;
  var loadPromise = null;
  var debounceTimer = null;

  function setExpanded(isOpen) {
    input.setAttribute("aria-expanded", isOpen ? "true" : "false");
    resultsEl.hidden = !isOpen;
  }

  function setStatus(message) {
    statusEl.textContent = message || "";
  }

  function clearResults() {
    filtered = [];
    activeIndex = -1;
    resultsEl.innerHTML = "";
    setExpanded(false);
    input.removeAttribute("aria-activedescendant");
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  /**
   * Rank: title hits outweigh description, which outweigh body content.
   * Earlier matches score slightly higher within the same field.
   */
  function scoreDoc(doc, query) {
    var q = normalize(query);
    if (!q) {
      return 0;
    }

    var title = normalize(doc.title);
    var description = normalize(doc.description);
    var content = normalize(doc.content);
    var score = 0;

    if (title === q) {
      score += 200;
    }

    var titleIndex = title.indexOf(q);
    if (titleIndex !== -1) {
      score += 100 - Math.min(titleIndex, 40);
      if (title.startsWith(q)) {
        score += 25;
      }
    }

    var descriptionIndex = description.indexOf(q);
    if (descriptionIndex !== -1) {
      score += 50 - Math.min(descriptionIndex, 20);
    }

    var contentIndex = content.indexOf(q);
    if (contentIndex !== -1) {
      score += 15;
      var occurrences = content.split(q).length - 1;
      score += Math.min(occurrences, 8);
    }

    return score;
  }

  function snippetFrom(text, query, maxLength) {
    var source = String(text || "").replace(/\s+/g, " ").trim();
    if (!source) {
      return "";
    }

    var lower = source.toLowerCase();
    var q = query.toLowerCase();
    var index = lower.indexOf(q);
    var start = 0;

    if (index === -1) {
      return source.slice(0, maxLength) + (source.length > maxLength ? "…" : "");
    }

    start = Math.max(0, index - 36);
    var end = Math.min(source.length, start + maxLength);
    var snippet = source.slice(start, end);
    if (start > 0) {
      snippet = "…" + snippet;
    }
    if (end < source.length) {
      snippet += "…";
    }
    return snippet;
  }

  function appendHighlighted(container, text, query) {
    if (!query) {
      container.appendChild(document.createTextNode(text));
      return;
    }

    var regex = new RegExp("(" + escapeRegExp(query) + ")", "ig");
    var parts = String(text).split(regex);

    parts.forEach(function (part, index) {
      if (!part) {
        return;
      }
      if (index % 2 === 1) {
        var mark = document.createElement("mark");
        mark.className = "docs-search__mark";
        mark.textContent = part;
        container.appendChild(mark);
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function renderResults(query) {
    resultsEl.innerHTML = "";
    activeIndex = -1;
    input.removeAttribute("aria-activedescendant");

    if (!query) {
      clearResults();
      clearBtn.hidden = true;
      setStatus("");
      return;
    }

    clearBtn.hidden = false;

    if (!filtered.length) {
      var empty = document.createElement("li");
      empty.className = "docs-search__empty";
      empty.setAttribute("role", "presentation");
      empty.textContent = 'No results for "' + query + '". Try another keyword.';
      resultsEl.appendChild(empty);
      setExpanded(true);
      setStatus("No search results");
      return;
    }

    filtered.forEach(function (doc, index) {
      var item = document.createElement("li");
      item.setAttribute("role", "option");
      item.id = "docs-search-option-" + index;
      item.className = "docs-search__result";
      item.setAttribute("aria-selected", "false");

      var link = document.createElement("a");
      link.className = "docs-search__result-link";
      link.href = doc.url;
      link.id = "docs-search-link-" + index;

      var title = document.createElement("span");
      title.className = "docs-search__result-title";
      appendHighlighted(title, doc.title, query);

      var excerpt = document.createElement("span");
      excerpt.className = "docs-search__result-excerpt";
      var snippetSource = doc.description || doc.content;
      var matchedInContent =
        normalize(doc.description).indexOf(normalize(query)) === -1 &&
        normalize(doc.content).indexOf(normalize(query)) !== -1;
      if (matchedInContent) {
        snippetSource = doc.content;
      }
      appendHighlighted(excerpt, snippetFrom(snippetSource, query, 110), query);

      link.appendChild(title);
      link.appendChild(excerpt);
      item.appendChild(link);
      resultsEl.appendChild(item);
    });

    setExpanded(true);
    setStatus(filtered.length + " result" + (filtered.length === 1 ? "" : "s") + " available");
  }

  function setActive(index) {
    var options = resultsEl.querySelectorAll(".docs-search__result");
    if (!options.length) {
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      return;
    }

    if (index < 0) {
      index = options.length - 1;
    }
    if (index >= options.length) {
      index = 0;
    }

    options.forEach(function (option, i) {
      var selected = i === index;
      option.classList.toggle("is-active", selected);
      option.setAttribute("aria-selected", selected ? "true" : "false");
    });

    activeIndex = index;
    input.setAttribute("aria-activedescendant", options[index].id);
    options[index].scrollIntoView({ block: "nearest" });
  }

  function openActiveResult() {
    if (!filtered.length) {
      return;
    }
    var index = activeIndex >= 0 ? activeIndex : 0;
    var target = filtered[index];
    if (target && target.url) {
      window.location.href = target.url;
    }
  }

  function runSearch(query) {
    var trimmed = String(query || "").trim();
    if (!trimmed) {
      filtered = [];
      renderResults("");
      return;
    }

    filtered = docs
      .map(function (doc) {
        return { doc: doc, score: scoreDoc(doc, trimmed) };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.doc.title.localeCompare(b.doc.title);
      })
      .slice(0, 8)
      .map(function (entry) {
        return entry.doc;
      });

    renderResults(trimmed);
  }

  function ensureIndex() {
    if (docs.length) {
      return Promise.resolve(docs);
    }
    if (loadPromise) {
      return loadPromise;
    }

    loadPromise = fetch(indexUrl, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Unable to load search index");
        }
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          throw new Error("Search index must be an array");
        }
        docs = data.map(function (item) {
          return {
            title: item.title || "",
            description: item.description || "",
            url: item.url || "",
            content: item.content || ""
          };
        });
        return docs;
      })
      .catch(function (error) {
        loadPromise = null;
        setStatus("Search is unavailable right now.");
        console.error("[DevDocs search]", error);
        throw error;
      });

    return loadPromise;
  }

  function onInput() {
    clearTimeout(debounceTimer);
    var value = input.value;
    clearBtn.hidden = !value;

    debounceTimer = setTimeout(function () {
      ensureIndex()
        .then(function () {
          runSearch(value);
        })
        .catch(function () {
          clearResults();
          var empty = document.createElement("li");
          empty.className = "docs-search__empty";
          empty.setAttribute("role", "presentation");
          empty.textContent = "Search index could not be loaded.";
          resultsEl.appendChild(empty);
          setExpanded(true);
        });
    }, 120);
  }

  input.addEventListener("input", onInput);
  input.addEventListener("focus", function () {
    if (input.value.trim()) {
      ensureIndex().then(function () {
        runSearch(input.value);
      });
    }
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    clearBtn.hidden = true;
    clearResults();
    setStatus("");
    input.focus();
  });

  input.addEventListener("keydown", function (event) {
    var hasPanel = !resultsEl.hidden;

    if (event.key === "ArrowDown") {
      if (!hasPanel) {
        return;
      }
      event.preventDefault();
      setActive(activeIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      if (!hasPanel) {
        return;
      }
      event.preventDefault();
      setActive(activeIndex - 1);
      return;
    }

    if (event.key === "Enter") {
      if (!hasPanel || !filtered.length) {
        return;
      }
      event.preventDefault();
      openActiveResult();
      return;
    }

    if (event.key === "Escape") {
      if (hasPanel) {
        event.preventDefault();
        clearResults();
        setStatus("");
        return;
      }
      if (input.value) {
        event.preventDefault();
        input.value = "";
        clearBtn.hidden = true;
        clearResults();
        setStatus("");
      }
    }
  });

  document.addEventListener("click", function (event) {
    if (!root.contains(event.target)) {
      clearResults();
    }
  });

  // Warm the index after idle so the first keystroke feels instant.
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(function () {
      ensureIndex().catch(function () {});
    });
  } else {
    setTimeout(function () {
      ensureIndex().catch(function () {});
    }, 800);
  }
})();
