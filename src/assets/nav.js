const button = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function toggle(open) {
  button.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}
button.addEventListener('click', () => toggle(button.getAttribute('aria-expanded') === 'false'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { toggle(false); button.focus(); }
});
document.documentElement.classList.add('js');
