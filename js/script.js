document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initActiveNav();
  initFaq();
  initScrollReveal();
  initCarousels();
  initGallery();
  initMapHotspots();
  initBookingForm();
});

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
}

function initActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === current) {
      link.classList.add("active");
    }
  });
}

function initFaq() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const answer = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(!expanded));
      if (answer) {
        answer.style.display = expanded ? "none" : "block";
      }
    });
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel-track");
    const slides = root.querySelectorAll(".carousel-slide");
    const dotsWrap = root.querySelector(".carousel-dots");
    const prevBtn = root.querySelector(".carousel-btn.prev");
    const nextBtn = root.querySelector(".carousel-btn.next");
    let index = 0;
    let timer = null;

    if (!track || slides.length === 0) return;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function update() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dotsWrap.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 5500);
    }

    if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

    update();
    resetTimer();
  });
}

function initGallery() {
  const items = document.querySelectorAll("[data-lightbox-src]");
  const lightbox = document.getElementById("lightbox");
  if (!items.length || !lightbox) return;

  const img = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      img.src = item.getAttribute("data-lightbox-src");
      img.alt = item.getAttribute("data-lightbox-alt") || "";
      lightbox.classList.add("open");
    });
  });

  function close() {
    lightbox.classList.remove("open");
    img.src = "";
  }

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initMapHotspots() {
  const hotspots = document.querySelectorAll(".map-hotspot");
  if (!hotspots.length) return;

  hotspots.forEach((spot) => {
    const popupId = spot.getAttribute("data-popup");
    const popup = document.getElementById(popupId);
    if (!popup) return;

    spot.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".map-popup.open").forEach((p) => {
        if (p !== popup) p.classList.remove("open");
      });
      popup.classList.toggle("open");
    });

    const closeBtn = popup.querySelector(".map-popup-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => popup.classList.remove("open"));
    }
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".map-popup.open").forEach((p) => p.classList.remove("open"));
  });
}

function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const feedback = document.getElementById("formFeedback");

  const rules = {
    nome: (value) => value.trim().length >= 2,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    telefono: (value) => value.trim() === "" || /^[0-9+\s]{6,}$/.test(value.trim()),
  };

  const messages = {
    nome: "Inserisci nome e cognome.",
    email: "Inserisci un indirizzo email valido.",
    telefono: "Inserisci un numero di telefono valido.",
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach((field) => {
      const input = form.querySelector("#" + field);
      const error = document.getElementById(field + "Error");
      if (!input) return;

      const ok = rules[field](input.value);
      input.classList.toggle("invalid", !ok);
      if (error) {
        error.textContent = messages[field];
        error.classList.toggle("show", !ok);
      }
      if (!ok) valid = false;
    });

    if (!valid) return;

    if (feedback) {
      feedback.textContent = "Prenotazione inviata! Ti contatteremo a breve per confermare la disponibilità.";
      feedback.classList.add("show");
    }
    form.reset();
  });
}
