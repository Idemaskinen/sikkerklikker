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

// Feedback forkert
const naesteMailKnap = document.querySelector('.naeste-mail-knap');

naesteMailKnap.addEventListener('click', () => {
  const aktiv = document.querySelector('.mail-preview.aktiv-mail');
  if (!aktiv) return;

  const mails = [...document.querySelectorAll('.mail-preview')];
  const index = mails.indexOf(aktiv);

  if (index >= 0 && index < mails.length - 1) {
    mails[index].classList.remove('aktiv-mail');
    layovers[index].classList.add('skjul');

    mails[index + 1].click(); // Trig næste mail
  }
});

// Feedback rigtigt

const bekræftKnap = document.querySelector(".send-feedback-knap");

bekræftKnap.addEventListener("click", () => {
  const afkrydsninger = document.querySelectorAll(
    "#faresignal-form input[type='checkbox']"
  );

  const mindstEnValgt = Array.from(afkrydsninger).some((boks) => boks.checked);
  //fejlmeddelelse ved ikke-valg
  if (!mindstEnValgt) {
    alert("Du skal krydse af i mindst ét felt.");
    return;
  }

  // Tjek hvilke signaler der er markeret
  const valgte = Array.from(afkrydsninger)
  .filter(boks => boks.checked)
  .map(boks => boks.value);

  const korrekte = ["afsender", "link", "panik"];

  const erAlleKorrekte = valgte.every(v => korrekte.includes(v)) && valgte.length === korrekte.length;

  // Skjul denne boks
  document.getElementById("feedback-rigtig").classList.add("skjul");

  // Vis passende feedback
  if (erAlleKorrekte) {
    document.getElementById("feedback-rigtig-rigtig").classList.remove("skjul");
  } else {
    document.getElementById("feedback-rigtig-forkert").classList.remove("skjul");
  }
});
