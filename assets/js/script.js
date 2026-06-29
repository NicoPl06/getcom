/* ── NAVBAR : ombre au scroll ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0,0,0,.14)'
      : '0 2px 12px rgba(0,0,0,.08)';
  }, { passive: true });
}

/* ── BURGER : menu mobile ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navbar) {
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav-mobile';

  const navItems = navLinks ? navLinks.querySelectorAll('a.nav-link') : [];
  navItems.forEach(link => {
    const a = document.createElement('a');
    a.className   = 'nav-link';
    a.textContent = link.textContent;
    a.href        = link.getAttribute('href');
    if (link.classList.contains('active')) a.classList.add('active');
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
    mobileMenu.appendChild(a);
  });

  navbar.appendChild(mobileMenu);

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── HERO : slideshow (index uniquement) ── */
const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 1) {
  let current = 0;
  function nextSlide() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }
  setInterval(nextSlide, 5000);
}

/* ── CARROUSEL CLIENTS (index uniquement) ── */
(function initClientsCarousel() {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  track.innerHTML = '';

  const clients = [
    { name: 'Ville de Paris',           file: 'ville-paris.svg' },
    { name: 'RATP',                     file: 'ratp.svg' },
    { name: 'SNCF',                     file: 'sncf.svg' },
    { name: 'Bouygues Construction',    file: 'bouygues.svg' },
    { name: 'VINCI',                    file: 'vinci.svg' },
    { name: 'Eiffage',                  file: 'eiffage.svg' },
    { name: 'Colas',                    file: 'colas.svg' },
    { name: 'Eurovia',                  file: 'eurovia.svg' },
    { name: 'Aéroports de Paris',       file: 'adp.svg' },
    { name: 'Île-de-France Mobilités',  file: 'idf-mobilites.svg' },
    { name: 'Grand Paris Express',      file: 'grand-paris.svg' },
    { name: 'Hauts-de-Seine',           file: 'hauts-de-seine.svg' },
    { name: 'Métropole Grand Paris',    file: 'grand-paris-metropole.svg' }
  ];

  [...clients, ...clients].forEach(client => {
    const card = document.createElement('div');
    card.className = 'client-logo-item';

    const img = document.createElement('img');
    img.src = `assets/logos/${client.file}`;
    img.alt = `Logo ${client.name}`;

    img.onerror = () => {
      const span = document.createElement('span');
      span.className   = 'client-logo-fallback';
      span.textContent = client.name;
      card.appendChild(span);
      img.remove();
    };

    card.appendChild(img);
    track.appendChild(card);
  });
})();

/* ── ANIMATIONS AU SCROLL (Intersection Observer) ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.expertise-card, .capa-item, .methodo-card, .secteur-card, .stat-card'
).forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(30px)';
  el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
  observer.observe(el);
});

/* ── FORMULAIRE CONTACT (contact.html) ── */
const form       = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg   = document.getElementById('formError');
const submitBtn  = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Envoi en cours…';

    try {
      const res = await fetch(form.action, {
        method: 'POST', body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        successMsg.style.display = 'block';
        form.reset();
      } else {
        const json = await res.json();
        errorMsg.style.display = 'block';
        if (json.errors) errorMsg.textContent = json.errors.map(err => err.message).join(', ');
      }
    } catch {
      errorMsg.style.display = 'block';
      errorMsg.textContent   = '❌ Erreur réseau. Veuillez nous appeler directement.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Envoyer la demande';
    }
  });
}

/* ── FORMULAIRE RECRUTEMENT (recrutement.html) ── */
const recruteForm    = document.getElementById('recrutementForm');
const recruteSuccess = document.getElementById('recrutementSuccess');
const recruteError   = document.getElementById('recrutementError');
const recruteSubmit  = document.getElementById('recrutementSubmitBtn');

if (recruteForm) {
  recruteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    recruteSuccess.style.display = 'none';
    recruteError.style.display   = 'none';
    recruteSubmit.disabled = true;
    recruteSubmit.querySelector('span').textContent = 'Envoi du dossier…';

    try {
      const res = await fetch(recruteForm.action, {
        method: 'POST', body: new FormData(recruteForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        recruteSuccess.style.display = 'block';
        recruteForm.reset();
      } else {
        const json = await res.json();
        recruteError.style.display = 'block';
        if (json.errors) recruteError.textContent = json.errors.map(err => err.message).join(', ');
      }
    } catch {
      recruteError.style.display = 'block';
      recruteError.textContent   = '❌ Erreur réseau. Veuillez réessayer ou nous envoyer votre CV par mail.';
    } finally {
      recruteSubmit.disabled = false;
      recruteSubmit.querySelector('span').textContent = 'Envoyer ma candidature';
    }
  });
}

/* ── FILTRAGE CATALOGUE PROJETS (projets.html) ── */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'btn-gold');
        b.classList.add('btn-outline');
      });
      btn.classList.add('active', 'btn-gold');
      btn.classList.remove('btn-outline');

      const filterValue = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const show = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
        card.style.display   = show ? 'block' : 'none';
        if (show) card.style.animation = 'fadeIn 0.5s ease forwards';
      });
    });
  });
});

/* ---------- MODULE CHATBOT FLOUTANT GET'COM ---------- */

function toggleChat() {
  const chatBox = document.getElementById('chat-box');
  if (chatBox.style.display === 'none' || chatBox.style.display === '') {
    chatBox.style.display = 'flex';
    const body = document.getElementById('chat-body');
    if (body.children.length === 1) { // 1 correspond à l'overlay de la popup cachée
      addMessage("bot", "Bonjour ! Comment l'équipe GET'COM peut-elle vous aider aujourd'hui ? Pouvons-nous vous renseigner sur nos expertises, un devis ou nos recrutements ?");
    }
  } else {
    chatBox.style.display = 'none';
    closePhonePopup();
  }
}

/* --- LOGIQUE DE LA POP-UP FORMULAIRE --- */

function openPhonePopup() {
  document.getElementById('phone-popup').style.display = 'flex';
  document.getElementById('popup-phone-input').focus();
}

function closePhonePopup() {
  document.getElementById('phone-popup').style.display = 'none';
}

// Gestion de la soumission asynchrone du formulaire de la pop-up
function submitPhonePopup(event) {
  event.preventDefault(); // Empêche la redirection/rechargement de page Formspree

  const form = document.getElementById('formspree-popup-form');
  const phoneInput = document.getElementById('popup-phone-input');
  const phoneValue = phoneInput.value.trim();

  // Validation rapide du numéro
  const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[\s.-]*\d{2}){4}$/;
  if (!phoneRegex.test(phoneValue.replace(/\s/g, ''))) {
    alert("Veuillez entrer un numéro de téléphone valide.");
    phoneInput.focus();
    return;
  }

  // On ferme la pop-up immédiatement pour fluidifier l'expérience
  closePhonePopup();
  addMessage("bot", "Transmission de votre demande de rappel à nos équipes...");

  // Envoi des données du formulaire à Formspree via Fetch
  const data = new FormData(form);
  
  fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      addMessage("bot", `C'est parfait ! Votre demande a bien été envoyée. Un conseiller GET'COM vous rappellera rapidement au ${phoneValue}.`);
      form.reset(); // Vide les champs du formulaire pour la prochaine fois
    } else {
      addMessage("bot", "Une erreur est survenue. Veuillez nous contacter directement au 01 48 11 15 35.");
    }
  })
  .catch(error => {
    addMessage("bot", "Erreur réseau. Vous pouvez joindre notre secrétariat au 01 48 11 15 35.");
  });
}

/* --- LOGIQUE STANDARD DU CHATBOT --- */

function addMessage(sender, text) {
  const body = document.getElementById('chat-body');
  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'bot' ? 'bot-msg' : 'user-msg';
  msgDiv.innerText = text;
  body.appendChild(msgDiv);
  body.scrollTop = body.scrollHeight;
}

function handleSend() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (message === "") return;

  addMessage('user', message);
  input.value = "";

  const lowerMsg = message.toLowerCase();
  setTimeout(() => {
    analyzeMessage(lowerMsg);
  }, 500);
}

function analyzeMessage(text) {
  const cleanText = text.toLowerCase().trim();

  if (cleanText.includes('devis') || cleanText.includes('rappel') || cleanText.includes('appeler') || cleanText.includes('téléphone') || cleanText.includes('prix') || cleanText.includes('tarif') || cleanText.includes('coût') || cleanText.includes('contact')) {
    addMessage('bot', "Pour étudier votre projet de voirie ou de signalisation, nos équipes sont disponibles au 01 48 11 15 35 ou par mail à contact@getcom.fr.");
    createLinkButton("Aller à la page Contact / Devis ➔", "contact.html");
  } 
  else if (cleanText.includes('pmr') || cleanText.includes('handicapé') || cleanText.includes('norme') || cleanText.includes('réglementaire')) {
    addMessage('bot', "Nos marquages PMR respectent strictement les normes d'implantation (emplacement de 3,30m x 5m) et la signalisation verticale associée.");
    createLinkButton("Consulter nos expertises ➔", "expertises.html");
  }
  else if (cleanText.includes('nuit') || cleanText.includes('horaire') || cleanText.includes('24h') || cleanText.includes('7j')) {
    addMessage('bot', "GET'COM assure des interventions modulables 24h/24 et 7j/7 (de jour comme de nuit) pour ne pas perturber votre trafic.");
    createLinkButton("Découvrir nos capacités ➔", "capacites.html");
  }
  else if (cleanText.includes('expertise') || cleanText.includes('marquage') || cleanText.includes('sol') || cleanText.includes('parking') || cleanText.includes('routier')) {
    addMessage('bot', "Nous maîtrisons 4 grands métiers : signalisation horizontale (résines certifiées NF), panneaux verticaux, mobilier urbain et traçage intérieur.");
    createLinkButton("Consulter la page Expertises ➔", "expertises.html");
  } 
  else if (cleanText.includes('recrutement') || cleanText.includes('emploi') || cleanText.includes('job') || cleanText.includes('candidature')) {
    addMessage('bot', "Nous recherchons régulièrement des applicateurs et chefs d'équipe en Île-de-France. Rejoignez une équipe d'expérience !");
    createLinkButton("Déposer une candidature en ligne ➔", "recrutement.html");
  } 
  else {
    addMessage('bot', "Désolé, je n'ai pas bien compris. N'hésitez pas à utiliser des mots simples ou à cliquer sur le bouton de téléphone en haut pour demander un rappel.");
    createLinkButton("Nous contacter ➔", "contact.html");
  }
}

function createLinkButton(text, url) {
  const body = document.getElementById('chat-body');
  const btn = document.createElement('button');
  btn.className = 'chat-btn';
  btn.innerText = text;
  btn.onclick = () => window.location.href = url;
  body.appendChild(btn);
  body.scrollTop = body.scrollHeight;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSend();
  }
}