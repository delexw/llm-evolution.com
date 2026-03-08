export function initNav() {
  const sections = document.querySelectorAll('.section[id]');
  const links = document.querySelectorAll('.topnav a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#'+e.target.id));
    });
  }, {threshold:0.25});
  sections.forEach(s => obs.observe(s));
}
