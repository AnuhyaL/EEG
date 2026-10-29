/* Environmental Education Group — site behaviour */

// Where contact and newsletter forms are sent.
// Leave empty to open the visitor's email app addressed to EEG (works with no server).
// To collect submissions online, paste a form-service endpoint here (e.g. a Formspree URL).
const FORM_ENDPOINT = "";
const EEG_EMAIL = "Lielle@environmentaleducationgroup.org";

// ---- Mobile navigation ----
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

// ---- Research library: search + category filter ----
(function () {
  const lib = document.querySelector("[data-library]");
  if (!lib) return;
  const input = document.getElementById("lib-search");
  const chips = Array.from(document.querySelectorAll(".chip[data-filter]"));
  const items = Array.from(lib.querySelectorAll(".lib-item"));
  const groups = Array.from(lib.querySelectorAll(".lib-group"));
  const count = document.getElementById("lib-count");
  const empty = document.getElementById("lib-empty");
  let filter = "all";

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  items.forEach((el) => { el.dataset.search = norm(el.textContent + " " + (el.dataset.keywords || "")); });

  function apply() {
    const terms = norm(input.value.trim()).split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach((el) => {
      const typeOk = filter === "all" || el.dataset.type === filter;
      const textOk = terms.every((t) => el.dataset.search.includes(t));
      el.hidden = !(typeOk && textOk);
      if (!el.hidden) shown++;
    });
    groups.forEach((g) => { g.hidden = !g.querySelector(".lib-item:not([hidden])"); });
    count.textContent = shown === items.length ? `${items.length} items in the library` : `Showing ${shown} of ${items.length} items`;
    empty.style.display = shown ? "none" : "block";
  }

  input.addEventListener("input", apply);
  chips.forEach((chip) => chip.addEventListener("click", () => {
    filter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    apply();
  }));
  const q = new URLSearchParams(location.search).get("q");
  if (q) input.value = q;
  apply();
})();

// ---- Document viewer (Issuu reports and archives) ----
(function () {
  const dialog = document.getElementById("viewer");
  if (!dialog) return;
  const frame = dialog.querySelector("iframe");
  const title = dialog.querySelector("h3");
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-viewer]");
    if (!btn) return;
    e.preventDefault();
    title.textContent = btn.dataset.title || "Document";
    frame.src = btn.dataset.viewer;
    dialog.showModal();
  });
  const close = () => { dialog.close(); };
  dialog.querySelector("[data-close]").addEventListener("click", close);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener("close", () => { frame.src = "about:blank"; });
})();

// ---- Contact & newsletter forms ----
(function () {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector(".form-status");
      const kind = form.dataset.form;
      const data = new FormData(form);
      data.append("form", kind);

      if (FORM_ENDPOINT) {
        try {
          const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.statusText);
          form.reset();
          if (status) status.textContent = kind === "newsletter" ? "Thank you! You're on the EEG mailing list." : "Thank you! Your message has been sent.";
        } catch (err) {
          if (status) status.textContent = `Sorry, something went wrong. Please email ${EEG_EMAIL}.`;
        }
        return;
      }

      const lines = [];
      for (const [k, v] of data.entries()) if (k !== "form" && v) lines.push(`${k[0].toUpperCase() + k.slice(1)}: ${v}`);
      const subject = kind === "newsletter"
        ? "Please add me to the EEG mailing list"
        : `Website inquiry: ${data.get("topic") || "General question"}`;
      location.href = `mailto:${EEG_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      if (status) status.textContent = "Your email app should open with your message ready to send.";
    });
  });
})();

// ---- Footer year ----
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
