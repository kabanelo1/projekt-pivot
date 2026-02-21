const transition = document.querySelector(".page-transition");
const links = document.querySelectorAll("a.nav-link");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    const isSamePage = destination.pathname === window.location.pathname;
    const isExternal = destination.origin !== window.location.origin;

    if (isExternal || isSamePage) {
      return;
    }

    if (transition) {
      event.preventDefault();
      transition.classList.add("active");
      setTimeout(() => {
        window.location.href = destination.href;
      }, 350);
    }
  });
});

window.addEventListener("pageshow", () => {
  if (transition) {
    transition.classList.remove("active");
  }
});