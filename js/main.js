const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const projectGrid = $("#projectsGrid");
const filterWrap = $("#projectFilters");
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
const themeToggle = $("#themeToggle");
const header = $(".site-header");

function renderFilters() {
  const categories = ["All", ...new Set(portfolioProjects.map(project => project.category))];

  filterWrap.innerHTML = categories.map((category, index) => `
    <button class="filter-btn ${index === 0 ? "active" : ""}" data-filter="${category}">
      ${category}
    </button>
  `).join("");

  $$(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderProjects(button.dataset.filter);
    });
  });
}

function renderProjects(filter = "All") {
  const visibleProjects = filter === "All"
    ? portfolioProjects
    : portfolioProjects.filter(project => project.category === filter);

  projectGrid.innerHTML = visibleProjects.map(project => `
    <article class="project-card reveal visible">
      <div class="project-art">
        <span class="project-number">${project.number} / PROJECT</span>
      </div>
      <div class="project-body">
        <span class="project-category">${project.category.toUpperCase()}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map(tech => `<span>${tech}</span>`).join("")}
        </div>
        <div class="project-links">
          <a href="${project.github}" target="_blank" rel="noopener">GitHub ↗</a>
          <a href="${project.demo}" target="_blank" rel="noopener">Details ↗</a>
        </div>
      </div>
    </article>
  `).join("");
}

function setupMobileMenu() {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    if (isLight) {
      delete document.documentElement.dataset.theme;
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem("portfolio-theme", "light");
    }
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  themeToggle.textContent =
    document.documentElement.dataset.theme === "light" ? "☀" : "☾";
}

function setupReveal() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(element => observer.observe(element));
}

function setupHeader() {
  const update = () => header.classList.toggle("scrolled", window.scrollY > 20);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupPlaceholderLinks() {
  /*
    Replace these URLs with your actual profiles.
    This keeps the template usable before you publish your links.
  */
  const links = {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/"
  };

  $$("[data-placeholder-link]").forEach(link => {
    link.href = links[link.dataset.placeholderLink];
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function init() {
  renderFilters();
  renderProjects();
  setupMobileMenu();
  setupTheme();
  setupReveal();
  setupHeader();
  setupPlaceholderLinks();
  $("#year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
