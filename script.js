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

// === HÅNDTER NÆSTE-MAIL-KNAPPER ===
const naesteMailKnapper = document.querySelectorAll('.naeste-mail-knap');
naesteMailKnapper.forEach(knap => {
  knap.addEventListener('click', () => {
    const aktivPreview = document.querySelector('.mail-preview.aktiv-mail');
    const aktivLayover = document.querySelector('.mail-layover:not(.skjul)');
    if (!aktivPreview || !aktivLayover) return;

    const mails = [...document.querySelectorAll('.mail-preview')];
    const index = mails.indexOf(aktivPreview);

    if (index >= 0 && index < mails.length - 1) {
      aktivPreview.classList.remove('aktiv-mail');
      aktivLayover.classList.add('skjul');
      mails[index + 1].click(); // Åbn næste mail
    }
  });
});

// === NORDBANK VURDERING FOR MAIL 1 (usikker) ===
const vurderKnapperMail1 = document.querySelectorAll('.mail-layover[data-mail="1"] .mail-knapper .knap');
const feedbackRigtigMail1 = document.querySelector('#feedback-rigtig');
const feedbackForkertMail1 = document.querySelector('#feedback-forkert');

vurderKnapperMail1.forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const preview = document.querySelector('.mail-preview[data-mail="1"]');
    const cirkel = preview.querySelector('.mail-cirkel');
    const vurderingsboks = layover.querySelector('.vurderingsboks');

    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    // Gem brugerens vurdering (sikker/usikker)
    const brugerVurdering = knap.classList.contains('vurder-sikker') ? 'Sikker' : 'Usikker';
    preview.dataset.vurdering = brugerVurdering;

    if (brugerVurdering === 'Sikker') {
      // Forkert svar → 0 point
      feedbackForkertMail1.classList.remove('skjul');
      cirkel.textContent = "0";
      preview.dataset.point = "0";
      cirkel.classList.add("vurderet");

      const pointBoks = layover.querySelector("#feedback-forkert .point-visning");
      if (pointBoks) {
        pointBoks.innerHTML = `Du har fået <strong>0 point</strong> for denne mail.`;
      }
    } else {
      // Rigtigt svar → vis næste trin (afkrydsning)
      feedbackRigtigMail1.classList.remove('skjul');
    }
  });
});

  // === faresignaler mail 1 ===
const bekræftMail1 = document.querySelector('#feedback-rigtig .send-feedback-knap');
bekræftMail1.addEventListener('click', () => {
  const layover = bekræftMail1.closest('.mail-layover');
  const preview = document.querySelector('.mail-preview[data-mail="1"]');
  const cirkel = preview.querySelector('.mail-cirkel');

  const afkrydsninger = layover.querySelectorAll("input[type='checkbox']");
  const mindstEnValgt = Array.from(afkrydsninger).some(b => b.checked);
  if (!mindstEnValgt) {
    alert("Du skal krydse af i mindst ét felt.");
    return;
  }

  const valgte = Array.from(afkrydsninger).filter(b => b.checked).map(b => b.value);
  const korrekte = ["afsender", "link", "panik"];
  const erAlleKorrekte = valgte.every(v => korrekte.includes(v)) && valgte.length === korrekte.length;

  // Skjul første feedback-boks
  layover.querySelector("#feedback-rigtig").classList.add("skjul");

  // Point og visning
  const point = erAlleKorrekte ? 2 : 1;
  const pointTekst = `Du har fået <strong>${point} point</strong> for denne mail.`;

  const feedbackBoks = layover.querySelector(
    erAlleKorrekte ? "#feedback-rigtigt-rigtigt" : "#feedback-rigtigt-forkert"
  );
  feedbackBoks.classList.remove("skjul");
  feedbackBoks.querySelector(".point-visning").innerHTML = pointTekst;

  // Opdater preview
  cirkel.textContent = point;
  cirkel.classList.add("vurderet");
  preview.dataset.point = point;
});


// === TANDLÆGEHUSET VURDERING FOR MAIL 2 (sikker)  ===
const vurderingMail2Sikker = document.querySelector('.mail-layover[data-mail="2"] .vurder-sikker');
const vurderingMail2Usikker = document.querySelector('.mail-layover[data-mail="2"] .vurder-usikker');
const feedbackRigtig2 = document.querySelector('#feedback-rigtig-mail2');
const feedbackForkert2 = document.querySelector('#feedback-forkert-mail2');

[vurderingMail2Sikker, vurderingMail2Usikker].forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const preview = document.querySelector('.mail-preview[data-mail="2"]');
    const cirkel = preview.querySelector('.mail-cirkel');
    const vurderingsboks = layover.querySelector('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    const erKorrekt = knap.classList.contains('vurder-sikker');
    const point = erKorrekt ? 1 : 0;

    // Gem vurdering + point
    preview.dataset.point = point;
    preview.dataset.vurdering = knap.textContent.includes("sikker") ? "Sikker" : "Usikker";

    // Vis point
    cirkel.textContent = point;
    cirkel.classList.add("vurderet");

    // Vis feedback
    const feedback = erKorrekt ? feedbackRigtig2 : feedbackForkert2;
    feedback.classList.remove('skjul');
    const pointVisning = feedback.querySelector('.point-visning');
    if (pointVisning) {
      pointVisning.innerHTML = `Du har fået <strong>${point} point</strong> for denne mail.`;
    }
  });
});

// === QUICKBONUS VURDERING FOR MAIL 4 (usikker) ===
const vurderKnapperMail4 = document.querySelectorAll('.mail-layover[data-mail="4"] .mail-knapper .knap');
const feedbackRigtigMail4 = document.querySelector('#feedback-rigtig-mail4');
const feedbackForkertMail4 = document.querySelector('#feedback-forkert-mail4');

vurderKnapperMail4.forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const vurderingsboks = layover.querySelector('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    const preview = document.querySelector(`.mail-preview[data-mail="4"]`);
    const cirkel = preview.querySelector('.mail-cirkel');

    const erRigtig = knap.classList.contains('vurder-usikker');
    const vurdering = knap.classList.contains('vurder-sikker') ? "Sikker" : "Usikker";

    preview.dataset.vurdering = vurdering;

    if (erRigtig) {
      feedbackRigtigMail4.classList.remove('skjul');
    } else {
      feedbackForkertMail4.classList.remove('skjul');

      // Point for forkert vurdering
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

  // === faresignaler mail 4 ===
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
  const erAlleKorrekte = valgte.every(v => korrekte.includes(v)) && valgte.length === korrekte.length;

  // Skjul vurderings-feedback
  feedbackRigtigMail4.classList.add("skjul");

  // Beregn point
  let point = erAlleKorrekte ? 2 : 1;
  const pointTekst = `Du har fået <strong>${point} point</strong> for denne mail.`;

  const boks = layover.querySelector(
    erAlleKorrekte ? "#feedback-rigtigt-rigtigt-mail4" : "#feedback-rigtigt-forkert-mail4"
  );
  boks.classList.remove("skjul");
  boks.querySelector(".point-visning").innerHTML = pointTekst;

  // Gem og vis point
  cirkel.textContent = point;
  cirkel.classList.add("vurderet");
  preview.dataset.point = point;
});


// === BOGUNIVERSET VURDERING AF MAIL 5 (kontekstbaseret) ===
const købBoks = document.querySelector('.bekræft-køb-boks');
const vurderingsBoks5 = document.querySelector('.vurderingsboks-bestilling');
const harBestiltKnap = document.querySelector('.har-bestilt');
const harIkkeBestiltKnap = document.querySelector('.har-ikke-bestilt');

let harBestilt = null; // status gemmes midlertidigt

// Første trin: vælg kontekst
harBestiltKnap.addEventListener('click', () => {
  harBestilt = true;
  købBoks.classList.add('skjul');
  vurderingsBoks5.classList.remove('skjul');
});

harIkkeBestiltKnap.addEventListener('click', () => {
  harBestilt = false;
  købBoks.classList.add('skjul');
  vurderingsBoks5.classList.remove('skjul');
});

// Andet trin: vurder mail
const vurderKnapSikker5 = document.querySelector('.vurder-sikker-mail5');
const vurderKnapUsikker5 = document.querySelector('.vurder-usikker-mail5');

vurderKnapSikker5.addEventListener('click', () => {
  vurderingsBoks5.classList.add('skjul');
  const korrekt = harBestilt === true;
  const preview = document.querySelector('.mail-preview[data-mail="5"]');
  preview.dataset.vurdering = "Sikker";
  visFeedbackMail5(korrekt);
});

vurderKnapUsikker5.addEventListener('click', () => {
  vurderingsBoks5.classList.add('skjul');
  const korrekt = harBestilt === false;
  const preview = document.querySelector('.mail-preview[data-mail="5"]');
  preview.dataset.vurdering = "Usikker";
  visFeedbackMail5(korrekt);
});

function visFeedbackMail5(erRigtigt) {
  const layover = document.querySelector('.mail-layover[data-mail="5"]');
  const preview = document.querySelector('.mail-preview[data-mail="5"]');
  const cirkel = preview.querySelector('.mail-cirkel');

  const point = erRigtigt ? 1 : 0;
  cirkel.textContent = point;
  cirkel.classList.add('vurderet');
  preview.dataset.point = point;

  const feedbackBoks = layover.querySelector(
    erRigtigt ? '#feedback-rigtig-mail5' : '#feedback-forkert-mail5'
  );
  feedbackBoks.classList.remove('skjul');
  feedbackBoks.querySelector('.point-visning').innerHTML = `Du har fået <strong>${point} point</strong> for denne mail.`;
}

// === POSTSYD VURDERING AF MAIL 6 (usikker)===
const vurderKnapperMail6 = document.querySelectorAll('.mail-layover[data-mail="6"] .mail-knapper .knap');
const feedbackRigtigMail6 = document.querySelector('#feedback-rigtig-mail6');
const feedbackForkertMail6 = document.querySelector('#feedback-forkert-mail6');

vurderKnapperMail6.forEach(knap => {
  knap.addEventListener('click', () => {
    const vurderingsboks = knap.closest('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    const erUsikkerValgt = knap.classList.contains('vurder-usikker');
    const preview = document.querySelector('.mail-preview.aktiv-mail');
    const cirkel = preview.querySelector('.mail-cirkel');

    preview.dataset.vurdering = erUsikkerValgt ? "Usikker" : "Sikker";

    if (erUsikkerValgt) {
      feedbackRigtigMail6.classList.remove('skjul');
    } else {
      feedbackForkertMail6.classList.remove('skjul');

      // Forkert svar = 0 point
      cirkel.textContent = "0";
      preview.dataset.point = "0";
      cirkel.classList.add("vurderet");

      const boks = document.querySelector('#feedback-forkert-mail6');
      boks.querySelector(".point-visning").innerHTML = `Du har fået <strong>0 point</strong> for denne mail.`;
    }
  });
});

  // === faresignaler mail 6 ===
const bekræftKnapMail6 = document.querySelector('#feedback-rigtig-mail6 .send-feedback-knap');

bekræftKnapMail6.addEventListener('click', () => {
  const layover = bekræftKnapMail6.closest('.mail-layover');
  const preview = document.querySelector('.mail-preview.aktiv-mail');
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

  const korrekte = ["afsender", "link", "panik", "vedhaeftning"];
  const erAlleKorrekte = valgte.every(v => korrekte.includes(v)) && valgte.length === korrekte.length;

  // Skjul vurderings-feedback
  layover.querySelector("#feedback-rigtig-mail6").classList.add("skjul");

  // Beregn point og vis feedback
  const point = erAlleKorrekte ? 2 : 1;
  const pointTekst = `Du har fået <strong>${point} point</strong> for denne mail.`;

  const boks = layover.querySelector(
    erAlleKorrekte ? "#feedback-rigtigt-rigtigt-mail6" : "#feedback-rigtigt-forkert-mail6"
  );
  boks.classList.remove("skjul");
  boks.querySelector(".point-visning").innerHTML = pointTekst;

  // Opdater preview
  cirkel.textContent = point;
  preview.dataset.point = point;
  cirkel.classList.add("vurderet");
});


// === IT-SUPPORT VURDERING AF MAIL 7 (usikker) ===
const vurderKnapperMail7 = document.querySelectorAll('.mail-layover[data-mail="7"] .mail-knapper .knap');
const feedbackRigtigMail7 = document.querySelector('#feedback-rigtig-mail7');
const feedbackForkertMail7 = document.querySelector('#feedback-forkert-mail7');

vurderKnapperMail7.forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const vurderingsboks = layover.querySelector('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    const preview = document.querySelector(`.mail-preview[data-mail="7"]`);
    const cirkel = preview.querySelector('.mail-cirkel');

    const erRigtigt = knap.classList.contains('vurder-usikker');

    // Gem vurdering
    preview.dataset.vurdering = knap.classList.contains('vurder-sikker') ? "Sikker" : "Usikker";

    if (!erRigtigt) {
      feedbackForkertMail7.classList.remove('skjul');
      cirkel.textContent = "0";
      cirkel.classList.add("vurderet");
      preview.dataset.point = "0";

      const boks = layover.querySelector("#feedback-forkert-mail7 .point-visning");
      if (boks) boks.innerHTML = `Du har fået <strong>0 point</strong> for denne mail.`;
    } else {
      feedbackRigtigMail7.classList.remove('skjul');
    }
  });
});

  // === faresignaler mail 7 ===
const bekræftMail7 = document.querySelector('#feedback-rigtig-mail7 .send-feedback-knap');
bekræftMail7.addEventListener('click', () => {
  const layover = bekræftMail7.closest(".mail-layover");
  const preview = document.querySelector(`.mail-preview[data-mail="7"]`);
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

  const korrekte = ["afsender", "panik", "link", "vedhaeftning"];
  const erAlleKorrekte = valgte.every(v => korrekte.includes(v)) && valgte.length === korrekte.length;

  // Skjul vurderings-feedback
  layover.querySelector("#feedback-rigtig-mail7").classList.add("skjul");

  const point = erAlleKorrekte ? 2 : 1;
  const pointTekst = `Du har fået <strong>${point} point</strong> for denne mail.`;

  const boks = layover.querySelector(`#feedback-rigtigt-${erAlleKorrekte ? 'rigtigt' : 'forkert'}-mail7`);
  boks.classList.remove('skjul');
  boks.querySelector('.point-visning').innerHTML = pointTekst;

  cirkel.textContent = point;
  cirkel.classList.add('vurderet');
  preview.dataset.point = point;
});


// === VURDERING MAIL 8 – (kontekstbaseret) ===
const layoverMail8 = document.querySelector('.mail-layover[data-mail="8"]');
const svarKender = layoverMail8.querySelector('.svar-kender');
const svarKenderIkke = layoverMail8.querySelector('.svar-kender-ikke');
const vurderingKontekst = layoverMail8.querySelector('.vurderingsboks-kontekst');
const vurderingEndelig = layoverMail8.querySelector('.vurderingsboks-endelig');
const vurderSikker8 = layoverMail8.querySelector('.vurder-sikker');
const vurderUsikker8 = layoverMail8.querySelector('.vurder-usikker');
const feedbackRigtig8 = document.getElementById('feedback-rigtig-mail8');
const feedbackForkert8 = document.getElementById('feedback-forkert-mail8');

let kenderAfsender = null; // status gemmes midlertidigt

  // Første trin: vælg kontekst
svarKender.addEventListener('click', () => {
  kenderAfsender = true;
  vurderingKontekst.classList.add('skjul');
  vurderingEndelig.classList.remove('skjul');
});

svarKenderIkke.addEventListener('click', () => {
  kenderAfsender = false;
  vurderingKontekst.classList.add('skjul');
  vurderingEndelig.classList.remove('skjul');
});

  // Andet trin: vurder mail
const pointVisning = (element, point) => {
  const p = element.querySelector(".point-visning");
  if (p) p.innerHTML = `Du har fået <strong>${point} point</strong> for denne mail.`;
};

[vurderSikker8, vurderUsikker8].forEach(knap => {
  knap.addEventListener('click', () => {
    vurderingEndelig.classList.add('skjul');
    const preview = document.querySelector('.mail-preview.aktiv-mail');
    const cirkel = preview.querySelector('.mail-cirkel');
    let point = 0;
    let vurdering = "";

    const harValgtSikker = knap.classList.contains('vurder-sikker');

    if ((kenderAfsender && harValgtSikker) || (!kenderAfsender && !harValgtSikker)) {
      // Rigtigt
      feedbackRigtig8.classList.remove('skjul');
      point = 1;
      pointVisning(feedbackRigtig8, point);
    } else {
      // Forkert
      feedbackForkert8.classList.remove('skjul');
      point = 0;
      pointVisning(feedbackForkert8, point);
    }

    vurdering = harValgtSikker ? "Sikker" : "Usikker";
    preview.dataset.vurdering = vurdering;
    preview.dataset.point = point;
    cirkel.textContent = point;
    cirkel.classList.add("vurderet");
  });
});


// === VURDERING FOR MAIL 99 (SIKKER MAIL) ===
const vurderKnapSikker9 = document.querySelector('.vurder-sikker-99');
const vurderKnapUsikker9 = document.querySelector('.vurder-usikker-99');
const feedbackRigtigMail9 = document.querySelector('#feedback-rigtig-mail99');
const feedbackForkertMail9 = document.querySelector('#feedback-forkert-mail99');

[vurderKnapSikker9, vurderKnapUsikker9].forEach(knap => {
  knap.addEventListener('click', () => {
    const layover = knap.closest('.mail-layover');
    const preview = document.querySelector('.mail-preview.aktiv-mail');
    const cirkel = preview.querySelector('.mail-cirkel');
    const vurderingsboks = knap.closest('.vurderingsboks');
    if (vurderingsboks) vurderingsboks.classList.add('skjul');

    let point = 0;
    if (knap.classList.contains('vurder-sikker-99')) {
      feedbackRigtigMail9.classList.remove('skjul');
      point = 1;
    } else {
      feedbackForkertMail9.classList.remove('skjul');
      point = 0;
    }

    const boks = layover.querySelector('.feedbackboks:not(.skjul) .point-visning');
    if (boks) boks.innerHTML = `Du har fået <strong>${point} point</strong> for denne mail.`;

    cirkel.textContent = point;
    cirkel.classList.add("vurderet");
    preview.dataset.point = point;
    preview.dataset.vurdering = knap.classList.contains('vurder-sikker-99') ? "Sikker" : "Usikker";
  });
});


// === SAMLET RESULTAT OG OVERSIGT ===
const afslutningsKnapper = document.querySelectorAll('.afslutnings-knap');

afslutningsKnapper.forEach(knap => {
  knap.addEventListener('click', () => {
    document.querySelectorAll('.feedbackboks').forEach(b => b.classList.add('skjul'));

    const mails = [...document.querySelectorAll('.mail-preview')];
    let samlet = 0;

    const oversigt = document.querySelector('.vurderings-oversigt');
    oversigt.innerHTML = "";

    mails.forEach((mail, i) => {
      const point = Number(mail.dataset.point || 0);
      const vurdering = mail.dataset.vurdering || "Ikke vurderet";
      samlet += point;

      const navn = mail.querySelector('.mail-tekst')?.childNodes[0]?.textContent.trim() || `Mail ${i + 1}`;

      const li = document.createElement("li");
      li.innerHTML = `<strong>${i + 1}. ${navn}</strong><br>Vurdering: ${vurdering}<br>Point: ${point}`;
      oversigt.appendChild(li);
    });

    // Samlet score og feedback
    const scoreBoks = document.querySelector('#feedback-samlet');
    const scoreVisning = scoreBoks.querySelector('.samlet-score-visning');

    let kommentar = "";
    if (samlet >= 12) {
      kommentar = "Flot klaret! Du er godt på vej til at blive en Sikker Klikker.";
    } else if (samlet >= 6) {
      kommentar = "Godt forsøgt! Du fangede det meste – men der er plads til forbedring.";
    } else {
      kommentar = "Pas på! Det er vigtigt at lære faresignalerne at kende.";
    }

    scoreVisning.innerHTML = `Du har fået i alt <strong>${samlet} point</strong>.<br>${kommentar}`;
    scoreBoks.classList.remove('skjul');
  });
});





