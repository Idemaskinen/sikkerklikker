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

const mailPreviews = document.querySelectorAll('.mail-preview');
const layover = document.querySelector('.mail-layover');
const lukKnap = document.querySelector('.luk-mail');

mailPreviews.forEach(preview => {
  preview.addEventListener('click', () => {
    mailPreviews.forEach(p => p.classList.remove('aktiv-mail')); // fjern tidligere aktiv
    preview.classList.add('aktiv-mail');
    layover.classList.remove('skjul');
  });
});

lukKnap.addEventListener('click', () => {
  layover.classList.add('skjul');
  mailPreviews.forEach(p => p.classList.remove('aktiv-mail'));
});
