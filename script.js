// HEADER
// Hent elementer
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

// Når der klikkes på menu-knappen
navToggle.addEventListener('click', () => {
  const isVisible = !navMenu.hasAttribute('hidden');

  // Vis eller skjul menu
  if (isVisible) {
    navMenu.setAttribute('hidden', '');
    navToggle.setAttribute('aria-expanded', 'false');
    menuIcon.style.display = 'inline';
    closeIcon.style.display = 'none';
  } else {
    navMenu.removeAttribute('hidden');
    navToggle.setAttribute('aria-expanded', 'true');
    menuIcon.style.display = 'none';
    closeIcon.style.display = 'inline';
  }
});

//MAILVISNING
const mailPreviews = document.querySelectorAll('.mail-preview');
const layovers = document.querySelectorAll('.mail-layover');
const lukKnapper = document.querySelectorAll('.luk-mail');

mailPreviews.forEach(preview => {
  preview.addEventListener('click', () => {
    const valgtMail = preview.dataset.mail;

    // Skjul alle layovers og fjern aktiv klasse
    layovers.forEach(l => l.classList.add('skjul'));
    mailPreviews.forEach(p => p.classList.remove('aktiv-mail'));

    // Vis den rigtige mail
    const aktivLayover = document.querySelector(`.mail-layover[data-mail="${valgtMail}"]`);
    if (aktivLayover) aktivLayover.classList.remove('skjul');

    preview.classList.add('aktiv-mail');
  });
});

lukKnapper.forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    if (layover) layover.classList.add('skjul');
    mailPreviews.forEach(p => p.classList.remove('aktiv-mail'));
  });
});

const vurderKnapSikker = document.querySelector('.vurder-sikker');
const vurderKnapUsikker = document.querySelector('.vurder-usikker');
const vurderingsboks = document.querySelector('.vurderingsboks');
const feedbackRigtig = document.querySelector('#feedback-rigtig');
const feedbackForkert = document.querySelector('#feedback-forkert');

vurderKnapSikker.addEventListener('click', () => {
  vurderingsboks.classList.add('skjul');
  feedbackForkert.classList.remove('skjul');
});

vurderKnapUsikker.addEventListener('click', () => {
  vurderingsboks.classList.add('skjul');
  feedbackRigtig.classList.remove('skjul');
});
