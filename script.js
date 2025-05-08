// === HEADER-MENU TOGGLE ===
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

navToggle.addEventListener('click', () => {
  const isVisible = !navMenu.hasAttribute('hidden');

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

// === VIS MAILINDHOLD VED KLIK ===
const mailPreviews = document.querySelectorAll('.mail-preview');
const layovers = document.querySelectorAll('.mail-layover');

mailPreviews.forEach(preview => {
  preview.addEventListener('click', () => {
    const valgtMail = preview.dataset.mail;

    // Skjul alle
    layovers.forEach(l => l.classList.add('skjul'));
    mailPreviews.forEach(p => p.classList.remove('aktiv-mail'));

    // Vis den valgte
    const aktivLayover = document.querySelector(`.mail-layover[data-mail="${valgtMail}"]`);
    if (aktivLayover) aktivLayover.classList.remove('skjul');
    preview.classList.add('aktiv-mail');
  });
});

// === LUK MAIL ===
const lukKnapper = document.querySelectorAll('.luk-mail');
lukKnapper.forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    if (layover) layover.classList.add('skjul');
    mailPreviews.forEach(p => p.classList.remove('aktiv-mail'));
  });
});

// === VURDER MAIL: SIKKER/USIKKER ===
const vurderKnapSikker = document.querySelector('.vurder-sikker');
const vurderKnapUsikker = document.querySelector('.vurder-usikker');
const vurderingsboks = document.querySelector('.vurderingsboks');
const feedbackRigtig = document.querySelector('#feedback-rigtig');
const feedbackForkert = document.querySelector('#feedback-forkert');

vurderKnapSikker.addEventListener('click', () => {
  vurderingsboks.classList.add('skjul');
  feedbackForkert.classList.remove('skjul');

  // Opdater point (0)
  const layover = vurderKnapSikker.closest(".mail-layover");
  const preview = document.querySelector(`.mail-preview.aktiv-mail`);
  const cirkel = preview.querySelector('.mail-cirkel');

  cirkel.textContent = "0";
  cirkel.classList.add("vurderet");
  preview.dataset.point = "0";

  const pointBoks = layover.querySelector("#feedback-forkert .point-visning");
  if (pointBoks) {
    pointBoks.innerHTML = `Du har fået <strong>0 point</strong> for denne mail.`;
  }
});

vurderKnapUsikker.addEventListener('click', () => {
  vurderingsboks.classList.add('skjul');
  feedbackRigtig.classList.remove('skjul');
});

// === VURDERING FOR MAIL 2 (SIKKER MAIL) ===
const vurderKnapperMail2 = document.querySelectorAll('.mail-layover[data-mail="2"] .mail-knapper .knap');
const feedbackRigtigMail2 = document.querySelector('#feedback-rigtig-mail2');
const feedbackForkertMail2 = document.querySelector('#feedback-forkert-mail2');

vurderKnapperMail2.forEach(knap => {
  knap.addEventListener('click', () => {
    const vurderingsboks = knap.closest('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    const erRigtig = knap.classList.contains('vurder-sikker');
    if (erRigtig) {
      feedbackRigtigMail2.classList.remove('skjul');
      opdaterPoint(1, 2); // 1 point for rigtig sikker vurdering
    } else {
      feedbackForkertMail2.classList.remove('skjul');
      opdaterPoint(0, 2); // 0 point for forkert usikker vurdering
    }
  });
});


// === HÅNDTER NÆSTE-MAIL-KNAPPER ===
const naesteMailKnapper = document.querySelectorAll('.naeste-mail-knap');
naesteMailKnapper.forEach(knap => {
  knap.addEventListener('click', () => {
    const aktiv = document.querySelector('.mail-preview.aktiv-mail');
    if (!aktiv) return;

    const mails = [...document.querySelectorAll('.mail-preview')];
    const index = mails.indexOf(aktiv);

    if (index >= 0 && index < mails.length - 1) {
      mails[index].classList.remove('aktiv-mail');
      layovers[index].classList.add('skjul');
      mails[index + 1].click(); // trigger næste mail
    }
  });
});

// === FARESIGNALER: VURDER OG VIS FEEDBACK ===
const bekræftKnap = document.querySelector(".send-feedback-knap");

bekræftKnap.addEventListener("click", () => {
  const layover = bekræftKnap.closest(".mail-layover");
  const preview = document.querySelector(`.mail-preview.aktiv-mail`);
  const cirkel = preview.querySelector('.mail-cirkel');

  const afkrydsninger = layover.querySelectorAll("input[type='checkbox']");
  const mindstEnValgt = Array.from(afkrydsninger).some(b => b.checked);

  if (!mindstEnValgt) {
    alert("Du skal krydse af i mindst ét felt.");
    return;
  }

  const valgte = Array.from(afkrydsninger)
    .filter(b => b.checked)
    .map(b => b.value);

  const korrekte = ["afsender", "link", "panik"];
  const erAlleKorrekte = valgte.every(v => korrekte.includes(v)) && valgte.length === korrekte.length;

  // Skjul vurderingsboks
  layover.querySelector("#feedback-rigtig").classList.add("skjul");

  // Beregn point og vis feedback
  let point = erAlleKorrekte ? 2 : 1;
  const pointTekst = `Du har fået <strong>${point} point</strong> for denne mail.`;

  if (erAlleKorrekte) {
    const boks = layover.querySelector("#feedback-rigtigt-rigtigt");
    boks.classList.remove("skjul");
    boks.querySelector(".point-visning").innerHTML = pointTekst;
  } else {
    const boks = layover.querySelector("#feedback-rigtigt-forkert");
    boks.classList.remove("skjul");
    boks.querySelector(".point-visning").innerHTML = pointTekst;
  }

  // Opdater preview-visning: farveændring og pointvisning
  cirkel.textContent = point;
  cirkel.classList.add("vurderet");
  preview.dataset.point = point;
});

function opdaterPoint(point, mailNummer) {
  const preview = document.querySelector(`.mail-preview[data-mail="${mailNummer}"]`);
  const layover = document.querySelector(`.mail-layover[data-mail="${mailNummer}"]`);
  if (!preview || !layover) return;

  const cirkel = preview.querySelector('.mail-cirkel');
  if (cirkel) {
    cirkel.textContent = point;
    cirkel.classList.add('vurderet');
  }

  preview.dataset.point = point;

  const pointBokse = layover.querySelectorAll('.point-visning');
  pointBokse.forEach(boks => {
    boks.innerHTML = `Du har fået <strong>${point} point</strong> for denne mail.`;
  });
}

// === VURDERING FOR MAIL 4 (USIKKER MAIL) ===
const vurderKnapperMail4 = document.querySelectorAll('.mail-layover[data-mail="4"] .mail-knapper .knap');
const feedbackRigtigMail4 = document.querySelector('#feedback-rigtig-mail4');
const feedbackForkertMail4 = document.querySelector('#feedback-forkert-mail4');

vurderKnapperMail4.forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const vurderingsboks = layover.querySelector('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    const erRigtig = knap.classList.contains('vurder-usikker');
    if (erRigtig) {
      feedbackRigtigMail4.classList.remove('skjul');
    } else {
      feedbackForkertMail4.classList.remove('skjul');
      
      // Vis point og marker mailen
      const preview = document.querySelector(`.mail-preview[data-mail="4"]`);
      const cirkel = preview.querySelector('.mail-cirkel');
      cirkel.textContent = "0";
      cirkel.classList.add("vurderet");
      preview.dataset.point = "0";

      const pointVisning = layover.querySelector('#feedback-forkert-mail4 .point-visning');
      if (pointVisning) {
        pointVisning.innerHTML = `Du har fået <strong>0 point</strong> for denne mail.`;
      }
    }
  });
});

// === FARESIGNALER VURDERING FOR MAIL 4 ===
const bekræftKnapMail4 = document.querySelector('#faresignal-form-mail4 .send-feedback-knap');

bekræftKnapMail4.addEventListener('click', () => {
  const layover = bekræftKnapMail4.closest('.mail-layover');
  const preview = document.querySelector(`.mail-preview[data-mail="4"]`);
  const cirkel = preview.querySelector('.mail-cirkel');

  const afkrydsninger = layover.querySelectorAll("input[type='checkbox']");
  const mindstEnValgt = Array.from(afkrydsninger).some(b => b.checked);

  if (!mindstEnValgt) {
    alert("Du skal krydse af i mindst ét felt.");
    return;
  }

  const valgte = Array.from(afkrydsninger)
    .filter(b => b.checked)
    .map(b => b.value);

  const korrekte = ["gevinst", "betaling", "link", "afsender", "panik"];
  const erAlleKorrekte =
    valgte.every(v => korrekte.includes(v)) &&
    valgte.length === korrekte.length;

  // Skjul vurderings-feedback
  feedbackRigtigMail4.classList.add("skjul");

  // Beregn og vis point
  let point = erAlleKorrekte ? 2 : 1;
  const pointTekst = `Du har fået <strong>${point} point</strong> for denne mail.`;

  if (erAlleKorrekte) {
    const boks = layover.querySelector("#feedback-rigtigt-rigtigt-mail4");
    boks.classList.remove("skjul");
    boks.querySelector(".point-visning").innerHTML = pointTekst;
  } else {
    const boks = layover.querySelector("#feedback-rigtigt-forkert-mail4");
    boks.classList.remove("skjul");
    boks.querySelector(".point-visning").innerHTML = pointTekst;
  }

  // Opdater preview
  cirkel.textContent = point;
  cirkel.classList.add("vurderet");
  preview.dataset.point = point;
});


// === VURDERING FOR SIDSTE MAIL (SIKKER MAIL + UDLØSER OPSAMLING) ===
const vurderKnapSikker3 = document.querySelector('.vurder-sikker-3');
const vurderKnapUsikker3 = document.querySelector('.vurder-usikker-3');
const feedbackRigtigMail3 = document.querySelector('#feedback-rigtig-mail3');
const feedbackForkertMail3 = document.querySelector('#feedback-forkert-mail3');

[vurderKnapSikker3, vurderKnapUsikker3].forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const preview = document.querySelector('.mail-preview.aktiv-mail');
    const cirkel = preview.querySelector('.mail-cirkel');

    // Skjul vurderingsboks
    const vurderingsboks = knap.closest('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    let point = 0;

    if (knap.classList.contains('vurder-sikker-3')) {
      feedbackRigtigMail3.classList.remove('skjul');
      point = 1;
    } else {
      feedbackForkertMail3.classList.remove('skjul');
      point = 0;
    }

    // Opdater pointvisning
    const boks = layover.querySelector('.feedbackboks:not(.skjul) .point-visning');
    if (boks) {
      boks.innerHTML = `Du har fået <strong>${point} point</strong> for denne mail.`;
    }

    cirkel.textContent = point;
    cirkel.classList.add("vurderet");
    preview.dataset.point = point;
  });
});

// === SE SAMLET RESULTAT ===
const afslutningsKnapper = document.querySelectorAll('.afslutnings-knap');
afslutningsKnapper.forEach(knap => {
  knap.addEventListener('click', () => {
    const feedbackBokse = document.querySelectorAll('.feedbackboks');
    feedbackBokse.forEach(boks => boks.classList.add('skjul'));

    // Beregn samlet score
    let samlet = 0;
    mailPreviews.forEach(mail => {
      samlet += Number(mail.dataset.point || 0);
    });

    // Vis score og vurdering
    const scoreBoks = document.querySelector('#feedback-samlet');
    const scoreVisning = scoreBoks.querySelector('.samlet-score-visning');

    let kommentar = "";
    if (samlet >= 5) {
      kommentar = "Flot klaret! Du er godt på vej til at blive en Sikker Klikker.";
    } else if (samlet >= 3) {
      kommentar = "Godt forsøgt! Du fangede det meste – men der er plads til forbedring.";
    } else {
      kommentar = "Pas på! Det er vigtigt at lære faresignalerne at kende.";
    }

    scoreVisning.innerHTML = `Du har fået i alt <strong>${samlet} point</strong> ud af 6 mulige.<br>${kommentar}`;
    scoreBoks.classList.remove('skjul');
  });
});



