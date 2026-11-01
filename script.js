(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const dots = [...document.querySelectorAll(".progress-dot")];
  const counter = document.getElementById("counter");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  let current = 0;

  function showSlide(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("current", i === current);
      dot.setAttribute("aria-current", i === current ? "step" : "false");
    });
    counter.innerHTML = `${String(current + 1).padStart(2, "0")} <i>/</i> 05`;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    history.replaceState(null, "", `#slide-${current + 1}`);
  }

  previous.addEventListener("click", () => showSlide(current - 1));
  next.addEventListener("click", () => showSlide(current + 1));
  dots.forEach(dot => dot.addEventListener("click", () => showSlide(Number(dot.dataset.go) - 1)));
  document.getElementById("restart").addEventListener("click", () => showSlide(0));

  document.addEventListener("keydown", event => {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault(); showSlide(current + 1);
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault(); showSlide(current - 1);
    } else if (event.key === "Home") showSlide(0);
    else if (event.key === "End") showSlide(slides.length - 1);
    else if (event.key.toLowerCase() === "f") toggleFullscreen();
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);

  let touchStartX = 0;
  document.addEventListener("touchstart", event => { touchStartX = event.changedTouches[0].screenX; }, {passive:true});
  document.addEventListener("touchend", event => {
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 55) showSlide(current + (delta < 0 ? 1 : -1));
  }, {passive:true});

  const hashMatch = location.hash.match(/slide-(\d)/);
  showSlide(hashMatch ? Number(hashMatch[1]) - 1 : 0);
})();