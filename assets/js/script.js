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
      addMessage("bot", `C'est parfait ! Votre demande a bien été envoyée. Un chargé de projets GET'COM vous rappellera rapidement au ${phoneValue}.`);
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

/* ============================================================
   GET'COM — Assistant virtuel — Moteur d'analyse de message
   Reconnaissance par mots-clés, verbes (présent) et synonymes
   ============================================================ */

function analyzeMessage(text) {
  const cleanText = text.toLowerCase().trim();

  /* ----------------------------------------------------------
     1. LISTES DE MOTS-CLÉS PAR INTENTION
     ---------------------------------------------------------- */

  // --- 1.1 DEVIS / CONTACT / RAPPEL / PRIX ---
  const kwDevisContact = [
    'devis', 'devis gratuit', 'demande de devis', 'faire un devis',
    'rappel', 'rappels', 'rappeler', 'rappelle', 'rappelez', 'rappellerez',
    'me rappeler', 'me recontacter', 'recontacter', 'recontacte', 'recontactez',
    'appeler', 'appelle', 'appelez', 'appel', 'téléphoner', 'telephoner',
    'téléphone', 'telephone', 'numéro', 'numero', 'num',
    'contacter', 'contact', 'contactez', 'joindre', 'joins', 'joignable',
    'écrire', 'ecrire', 'écris', 'ecris', 'mail', 'email', 'e-mail', 'courriel',
    'message', 'envoyer un message', 'vous contacter', 'vous joindre',
    'prix', 'tarif', 'tarifs', 'tarification', 'coût', 'cout', 'coûts', 'couts',
    'budget', 'combien', 'combien ça coûte', 'combien ca coute', 'ça coûte combien',
    'ca coute combien', 'estimation', 'estimer', 'estime', 'chiffrer', 'chiffrage',
    'facture', 'facturation', 'payant', 'gratuit', 'gratuitement', 'sans engagement',
    'rendez-vous', 'rendez vous', 'rdv', 'planifier un rendez-vous', 'fixer un rdv',
    'parler à quelqu\'un', 'parler a quelqu un', 'un commercial', 'service commercial',
    'demande de rappel', 'être recontacté', 'etre recontacte', 'laisser mes coordonnées',
    'laisser mes coordonnees', 'mes coordonnées', 'mes coordonnees',
    'prendre contact', 'prise de contact', 'être contacté', 'me contacter',
    'discuter', 'échanger', 'échange', 'dialoguer', 'conversation',
    'appel téléphonique', 'appel telephone', 'par téléphone', 'par telephone',
    'envoyer un mail', 'envoyer un email', 'me répondre', 'répondre',
    'coordonnées', 'coordonnees', 'donner mes coordonnées', 'portable', 'gsm',
    'montant', 'prix estimé', 'estimation de prix', 'fourchette de prix',
    'évaluer', 'évaluation', 'calculer un devis', 'simulation', 'simulateur',
    'prendre rendez-vous', 'prendre rdv', 'réserver un rdv', 'disponibilité',
    'créneau', 'horaire', 'horaires', 'planifier',
    'acheter', 'achat', 'commande', 'commander', 'passer commande',
    'renseignement', 'renseignements', 'se renseigner', 'information commerciale',
    'service client', 'support', 'assistance' 
  ];

  // --- 1.2 ACCESSIBILITÉ PMR / NORMES / RÉGLEMENTATION ---
  const kwPmrNormes = [
    'pmr', 'p.m.r', 'handicapé', 'handicapée', 'handicap', 'handicapés',
    'mobilité réduite', 'mobilite reduite', 'personne à mobilité réduite',
    'personne a mobilite reduite', 'accessible', 'accessibilité', 'accessibilite',
    'fauteuil roulant', 'place réservée', 'place reservee', 'place handicapé',
    'place handicapée', 'prioritaire', 'place prioritaire', 'stationnement réservé',
    'stationnement reserve', 'norme', 'normes', 'normé', 'normée', 'normees',
    'normalisation', 'réglementaire', 'reglementaire', 'réglementation',
    'reglementation', 'règlement', 'reglement', 'règles', 'regles',
    'conforme', 'conformité', 'conformite', 'conformes', 'mise en conformité',
    'mise en conformite', 'iisr', 'setra', 'cerema', 'arrêté', 'arrete',
    'arrêté municipal', 'arrete municipal', 'code de la route', 'décret', 'decret',
    'obligation légale', 'obligation legale', 'légal', 'legal', 'légalement',
    'legalement', 'aux normes', 'respect des normes', 'panneau réglementaire',
    'panneau reglementaire', 'panneaux réglementaires', 'panneaux reglementaires',
    'a, ab, b, c', 'classe a', 'classe b','personne handicapée', 'personnes handicapées', 'accès handicapé', 'accès pmr',
    'accès fauteuil', 'accès fauteuil roulant', 'rampe', 'rampe pmr',
    'rampe d’accès', 'rampe d acces', 'rampe handicapé', 'rampe handicap',
    'cheminement', 'cheminement pmr', 'cheminement accessible', 'cheminement piéton',
    'cheminement pieton', 'bandes podotactiles', 'bande podotactile', 'podotactile',
    'guidage', 'guidage pmr', 'accessibilité voirie', 'accessibilite voirie',
    'norme pmr', 'normes pmr', 'norme accessibilité', 'normes accessibilité',
    'mise aux normes', 'mise en règle', 'mise en regle', 'respect des règles',
    'respect des regles', 'respect des obligations', 'obligations pmr',
    'obligation pmr', 'obligation accessibilité', 'obligations accessibilité',
    'conformité pmr', 'conformite pmr', 'conforme pmr', 'non conforme',
    'non-conforme', 'non conformité', 'non conformite',
    'loi', 'lois', 'décret pmr', 'decret pmr', 'arrêté pmr', 'arrete pmr',
    'arrêté préfectoral', 'arrete prefectoral', 'arrêté départemental',
    'arrete departemental', 'arrêté voirie', 'arrete voirie',
    'code de la construction', 'code de la voirie', 'code de la voirie routière',
    'code de la voirie routiere', 'code de l’urbanisme', 'code de l urbanisme',
    'règlementation pmr', 'reglementation pmr', 'règlementation accessibilité',
    'reglementation accessibilite', 'directive', 'directives', 'textes officiels',
    'texte officiel',
    'signalisation pmr', 'signalisation réglementaire', 'signalisation reglementaire',
    'panneau pmr', 'panneaux pmr', 'panneau handicapé', 'panneau handicap',
    'marquage pmr', 'marquage au sol pmr', 'marquage réglementaire',
    'marquage reglementaire', 'marquage au sol réglementaire',
    'marquage au sol reglementaire', 'stationnement pmr', 'stationnement handicapé',
    'stationnement handicap', 'place pmr', 'place pour handicapé', 'place pour handicap',
    'cerfa', 'cerfa pmr', 'cerfa accessibilité', 'ad’ap', 'adap',
    'agenda d’accessibilité', 'agenda d accesibilite', 'erp', 'erps',
    'établissement recevant du public', 'etablissement recevant du public',
    'commission d’accessibilité', 'commission accessibilité',
  ];

  // --- 1.3 HORAIRES / DISPONIBILITÉ / NUIT / URGENCE ---
const kwHorairesDispo = [
  'nuit', 'nuits', 'nocturne', 'nocturnes', 'de nuit', 'la nuit',
  'horaire', 'horaires', 'heures d\'ouverture', 'heures d ouverture',
  'plage horaire', 'créneau', 'creneau', 'créneaux', 'creneaux',
  '24h', '24h/24', '24/24', '24h sur 24', '24 heures sur 24',
  '7j', '7j/7', '7/7', '7 jours sur 7', 'tous les jours',
  'disponible', 'disponibles', 'disponibilité', 'disponibilite',
  'urgence', 'urgences', 'urgent', 'urgente', 'urgents', 'en urgence',
  'rapidement', 'rapide', 'vite', 'dans l\'urgence', 'dans l urgence',
  'délai', 'delai', 'délais', 'delais', 'sous combien de temps',
  'quand pouvez-vous', 'quand pouvez vous', 'jour', 'journée', 'journee',
  'weekend', 'week-end', 'week end', 'samedi', 'dimanche', 'férié', 'ferie',
  'jours fériés', 'jours feries', 'décalé', 'decale', 'décalés', 'decales',
  'horaires décalés', 'horaires decales', 'intervention immédiate',
  'intervention immediate', 'astreinte', 'permanence',
  'travail de nuit', 'intervention de nuit', 'service de nuit', 'ouvert la nuit',
  'ouverture nocturne', 'horaire nocturne', 'horaires nocturnes', 'tard le soir',
  'tard dans la nuit', 'après minuit', 'apres minuit',
  'horaire flexible', 'horaires flexibles', 'flexible', 'flexibilité',
  'flexibilite', 'sur rendez-vous', 'sur rdv', 'à toute heure',
  'a toute heure', 'à n’importe quelle heure', 'a n importe quelle heure',
  'quand êtes-vous disponibles', 'quand etes vous disponibles',
  'vos horaires', 'vos disponibilités', 'vos disponibilites', 'dispo',
  'être dispo', 'etre dispo',
  'urgence absolue', 'urgence totale', 'urgence immédiate',
  'urgence immediate', 'urgentissime', 'très urgent', 'tres urgent',
  'besoin urgent', 'intervention urgente', 'intervenir rapidement',
  'intervention rapide', 'réagir vite', 'reagir vite', 'réponse rapide',
  'reponse rapide', 'réactivité', 'reactivite', 'immédiatement',
  'immediatement', 'tout de suite', 'sans attendre', 'sans délai',
  'sans delai',
  'soir', 'soirée', 'soiree', 'matin', 'matinée', 'matinee',
  'après-midi', 'apres midi', 'semaine', 'en semaine', 'hors semaine',
  'hors horaires', 'hors horaires classiques', 'hors horaires habituels',
  'hors horaires d’ouverture', 'hors horaires d ouverture',
  'jours ouvrés', 'jours ouvres', 'jours ouvrables', 'jours non ouvrés',
  'jours non ouvres',
  'permanence téléphonique', 'permanence telephone', 'permanence 24h/24',
  'permanence 7j/7', 'astreinte nuit', 'astreinte week-end',
  'astreinte weekend', 'astreinte 24/24', 'astreinte 7/7',
  'service continu', 'service en continu', 'service permanent',
  'disponible en continu',
  'dans les plus brefs délais', 'brefs délais', 'brefs delais',
  'délais courts', 'delais courts', 'délais serrés', 'delais serres',
  'délai urgent', 'delai urgent', 'temps d’intervention',
  'temps d intervention', 'temps de réponse', 'temps de reponse',
  'réponse immédiate', 'reponse immediate', 'intervention express',
  'express'
];


  // --- 1.4 ENVIRONNEMENT / ÉCOLOGIE / ZFE / RSE ---
const kwEnvironnement = [
  'écologique', 'ecologique', 'écologiques', 'ecologiques', 'écologie',
  'ecologie', 'environnement', 'environnementale', 'environnementaux',
  'environnemental', 'rse', 'r.s.e', 'responsabilité sociétale',
  'responsabilite societale', 'zfe', 'z.f.e', 'zone à faibles émissions',
  'zone a faibles emissions', 'crit\'air', 'critair', 'crit air',
  'vignette crit\'air', 'émission', 'emission', 'émissions', 'emissions',
  'pollution', 'polluant', 'polluants', 'polluante', 'non polluant',
  'durable', 'durabilité', 'durabilite', 'développement durable',
  'developpement durable', 'responsable', 'éco-responsable', 'eco-responsable',
  'eco responsable', 'recycl', 'recyclage', 'recyclé', 'recycle', 'recyclables',
  'tri des déchets', 'tri des dechets', 'déchets', 'dechets', 'vert', 'verte',
  'transition écologique', 'transition ecologique', 'empreinte carbone',
  'carbone', 'co2', 'ecovadis', 'eco vadis', 'mase', 'sans solvant',
  'sans solvants', 'produits écologiques', 'produits ecologiques',
  'véhicule propre', 'vehicule propre', 'véhicules propres', 'vehicules propres',
  'électrique', 'electrique', 'hybride',
  'écologique responsable', 'eco responsable', 'respectueux de l’environnement',
  'respect de l’environnement', 'impact environnemental', 'impact ecologique',
  'impact carbone', 'bilan carbone', 'réduction carbone', 'reduction carbone',
  'réduction des émissions', 'reduction des emissions', 'éco-conception',
  'eco conception', 'écoconçu', 'eco conçu', 'éco-friendly', 'eco friendly',
  'transition énergétique', 'transition energetique', 'transition verte',
  'transition bas carbone', 'neutralité carbone', 'neutralite carbone',
  'zéro émission', 'zero emission', 'zéro carbone', 'zero carbone',
  'décarbonation', 'decarbonation', 'décarboner', 'decarboner',
  'sobriété énergétique', 'sobriete energetique',
  'zone verte', 'zone propre', 'zone écologique', 'zone ecologique',
  'faibles émissions', 'faibles emissions', 'véhicule non polluant',
  'mobilité durable', 'mobilite durable', 'mobilité propre', 'mobilite propre',
  'responsabilité environnementale', 'responsabilite environnementale',
  'politique rse', 'stratégie rse', 'strategie rse', 'engagement rse',
  'charte rse', 'label rse', 'performance rse', 'audit rse', 'bilan rse',
  'rapport rse', 'entreprise responsable', 'démarche responsable',
  'demarche responsable',
  'énergie propre', 'energie propre', 'énergies renouvelables',
  'energies renouvelables', 'renouvelable', 'solaire', 'photovoltaïque',
  'photovoltaique', 'éolien', 'eolien', 'hydrogène', 'hydrogene',
  'bioénergie', 'bioenergie', 'sans émission', 'sans emission',
  'faible émission', 'faible emission', 'pollution atmosphérique',
  'pollution atmospherique', 'pollution de l’air', 'pollution de l air',
  'tri', 'tri sélectif', 'tri selectif', 'déchets recyclables',
  'dechets recyclables', 'déchets verts', 'dechets verts',
  'gestion des déchets', 'gestion des dechets', 'valorisation',
  'valorisation des déchets', 'valorisation des dechets',
  'réemploi', 'reemploi', 'réutilisation', 'reutilisation'
];


  // --- 1.5 CERTIFICATIONS / QUALITÉ / GARANTIES ---
const kwCertifications = [
  'certification', 'certifications', 'certifié', 'certifie', 'certifiée',
  'certifiee', 'certifiés', 'certifies', 'certifiées', 'certifiees',
  'qualibat', 'iso', 'iso 9001', 'iso9001', 'norme iso', 'qualité',
  'qualite', 'label', 'labels', 'labellisé', 'labellise', 'labellisée',
  'labellisee', 'agrément', 'agrement', 'agréé', 'agree', 'agréée', 'agreee',
  'garantie', 'garanties', 'garantir', 'garantissez', 'garantissent',
  'sérieux', 'serieux', 'fiable', 'fiabilité', 'fiabilite', 'reconnu',
  'reconnue', 'professionnalisme', 'gage de qualité', 'gage de qualite',
  'attestation', 'homologué', 'homologue', 'homologation',
  'certification qualité', 'certification professionnelle', 'certification officielle',
  'certification reconnue', 'certification obligatoire', 'certification européenne',
  'certification ce', 'certifié ce', 'certifie ce', 'norme ce', 'marquage ce',
  'conformité ce', 'conformite ce', 'norme nf', 'nf', 'label qualité',
  'label de qualité', 'label officiel', 'label reconnu', 'label environnemental',
  'label professionnel', 'label entreprise', 'label sécurité', 'label securite',
  'qualité supérieure', 'qualité premium', 'haute qualité', 'bonne qualité',
  'qualité garantie', 'qualité contrôlée', 'qualite controlee', 'contrôle qualité',
  'controle qualite', 'contrôlé', 'controle', 'contrôlée', 'controlee',
  'fiable', 'très fiable', 'tres fiable', 'fiabilité garantie',
  'fiabilite garantie', 'professionnel certifié', 'professionnel certifie',
  'entreprise certifiée', 'entreprise certifiee', 'entreprise sérieuse',
  'entreprise serieuse', 'prestataire fiable',
  'garantie décennale', 'garantie decennale', 'garantie légale',
  'garantie legale', 'garantie constructeur', 'garantie professionnelle',
  'garantie de résultat', 'garantie de conformite', 'garantie de conformité',
  'garantie qualité', 'assurance qualité', 'assurance qualite', 'assuré',
  'assuree', 'assurés', 'assures', 'assurance professionnelle', 'assurance rc pro',
  'rc pro', 'responsabilité civile professionnelle', 'responsabilite civile professionnelle',
  'sécurisé', 'securise', 'sécurisée', 'securisee', 'sécurité', 'securite',
  'homologué ce', 'homologue ce', 'homologué nf', 'homologue nf',
  'homologué iso', 'homologue iso', 'homologué par l’état', 'homologue par l etat',
  'homologation officielle', 'homologation européenne', 'agrément préfectoral',
  'agrement prefectoral', 'agrément officiel', 'agrement officiel',
  'agrément qualité', 'agrement qualite', 'attestation de conformité',
  'attestation de conformite', 'attestation qualité', 'attestation qualite',
  'certificat', 'certificat de conformité', 'certificat de conformite',
  'certificat qualité', 'certificat qualite',
  'audit qualité', 'audit qualite', 'audit externe', 'audit interne',
  'audit de certification', 'audit de conformité', 'audit de conformite',
  'contrôle externe', 'controle externe', 'contrôle interne', 'controle interne',
  'inspection', 'inspection qualité', 'inspection qualite', 'standard qualité',
  'standard qualite', 'standard professionnel', 'standard européen',
  'standard ce'
];


  // --- 1.6 SIGNALISATION HORIZONTALE / MARQUAGE AU SOL ---
const kwSignalHorizontale = [
  'marquage', 'marquages', 'marquer', 'marque', 'marqué', 'marque le sol',
  'marquage au sol', 'marquage routier', 'marquage horizontal',
  'signalisation horizontale', 'tracer', 'trace', 'traçage', 'tracage',
  'tracé', 'trace au sol', 'peinture', 'peintures', 'peindre', 'peint',
  'peinture routière', 'peinture routiere', 'résine', 'resine', 'résines',
  'resines', 'résine routière', 'resine routiere', 'enduit', 'enduits',
  'enduit thermoplastique', 'thermoplastique', 'enduit à froid',
  'enduit a froid', 'enduit à chaud', 'enduit a chaud', 'bi-composant',
  'sol', 'chaussée', 'chaussee', 'chaussées', 'chaussees', 'route', 'routes',
  'voirie', 'voiries', 'passage piéton', 'passage pieton', 'passages piétons',
  'passages pietons', 'zébra', 'zebra', 'zébras', 'zebras', 'piste cyclable',
  'pistes cyclables', 'voie bus', 'voies bus', 'écomobilité', 'ecomobilite',
  'flèche directionnelle', 'fleche directionnelle', 'ligne de stop', 'stop',
  'cédez le passage', 'cedez le passage', 'place de parking', 'places de parking',
  'parking', 'parkings', 'stationnement', 'stationnements', 'marquage parking',
  'marquage stationnement', 'logo handicapé', 'logo handicape',
  'borne de recharge', 'bornes de recharge', 'borne recharge véhicule',
  'recharge ve', 'véhicule électrique', 'vehicule electrique', 'antidérapant',
  'antiderapant', 'anti-glissance', 'antiglissance', 'rétroréflexion',
  'retroreflexion', 'rétro-réflexion', 'haute visibilité', 'haute visibilite',
  'sol industriel', 'sol logistique', 'entrepôt', 'entrepot', 'sol intérieur',
  'sol interieur',
  'marquage neuf', 'marquage effacé', 'marquage efface', 'marquage à refaire',
  'marquage a refaire', 'rafraîchir le marquage', 'rafraichir le marquage',
  'repeindre au sol', 'repeindre les lignes', 'reprise de marquage',
  'réfection de marquage', 'refection de marquage', 'peinture blanche',
  'peinture jaune', 'peinture thermoplastique', 'résine froide', 'resine froide',
  'résine chaude', 'resine chaude', 'résine bi-composant', 'resine bi-composant',
  'peinture antidérapante', 'peinture antiderapante', 'peinture haute résistance',
  'peinture haute resistance',
  'ligne continue', 'ligne discontinue', 'ligne pointillée', 'ligne pointillee',
  'ligne de guidage', 'ligne de rive', 'ligne axiale', 'ligne médiane',
  'ligne mediane', 'hachures', 'chevrons', 'flèches', 'fleches',
  'symboles au sol', 'pictogramme', 'pictogrammes', 'logo au sol',
  'zone piétonne', 'zone pietonne', 'bande piétonne', 'bande pietonne',
  'bande de guidage', 'bande de sécurité', 'bande de securite',
  'zone de sécurité', 'zone de securite', 'ralentisseur', 'ralentisseurs',
  'dos d’âne', 'dos d ane', 'plateau surélevé', 'plateau sureleve',
  'zone 30', 'zone 20', 'zone de rencontre',
  'marquage vélo', 'marquage velo', 'logo vélo', 'logo velo', 'voie cyclable',
  'voie verte', 'voie partagée', 'voie partagee', 'bande cyclable',
  'bande vélo', 'bande velo', 'sas vélo', 'sas velo',
  'marquage parking privé', 'marquage parking prive', 'marquage parking entreprise',
  'marquage parking magasin', 'marquage parking supermarché',
  'marquage parking supermarche', 'marquage parking souterrain',
  'marquage parking extérieur', 'marquage parking exterieur', 'places visiteurs',
  'place visiteur', 'place livraison', 'zone livraison', 'zone de chargement',
  'zone de dépose', 'zone de depose', 'dépose-minute', 'depose minute',
  'marquage borne électrique', 'marquage borne electrique', 'marquage recharge',
  'logo borne', 'logo recharge', 'zone recharge', 'zone véhicule électrique',
  'zone vehicule electrique', 'emplacement ve', 'emplacement véhicule électrique',
  'emplacement vehicule electrique',
  'marquage entrepôt', 'marquage entrepot', 'marquage industriel',
  'marquage logistique', 'marquage de sécurité', 'marquage de securite',
  'cheminement au sol', 'cheminement sécurité', 'cheminement securite',
  'zone de stockage', 'zone de transit', 'zone de chargement',
  'zone de déchargement', 'zone de déchargement', 'zoning au sol',
  'zoning industriel',
  'stop au sol', 'cédez-le-passage au sol', 'cedez le passage au sol',
  'priorité au sol', 'priorite au sol', 'zone interdite', 'zone d’interdiction',
  'zone d interdiction', 'interdit au sol', 'interdiction au sol'
];


  // --- 1.7 SIGNALISATION VERTICALE / PANNEAUX ---
const kwSignalVerticale = [
  'signalisation verticale', 'panneau', 'panneaux', 'panneau de signalisation',
  'panneaux de signalisation', 'panneau de police', 'panneaux de police',
  'panneau directionnel', 'panneaux directionnels', 'pose de panneau',
  'pose de panneaux', 'installer un panneau', 'installer des panneaux',
  'poteau', 'poteaux', 'mât', 'mat', 'mâts', 'mats', 'support', 'supports',
  'fixation', 'fixations', 'scellement', 'sceller', 'scelle', 'ancrage',
  'panneaux temporaires', 'panneau temporaire', 'balisage temporaire',
  'signalétique directionnelle', 'signaletique directionnelle',
  'signalétique urbaine', 'signaletique urbaine', 'panneau réglementaire',
  'panneau reglementaire', 'panneaux réglementaires', 'panneaux reglementaires',
  'horodateur', 'horodateurs', 'borne', 'bornes', 'totem', 'totems',
  'mobilier de voirie', 'mobilier urbain', 'mobiliers urbains',
  'panneau routier', 'panneaux routiers', 'panneau de circulation',
  'panneaux de circulation', 'panneau de voirie', 'panneaux de voirie',
  'panneau de sécurité', 'panneaux de sécurité', 'panneau de danger',
  'panneaux de danger', 'panneau d’interdiction', 'panneau d interdiction',
  'panneau d’obligation', 'panneau d obligation', 'panneau d’information',
  'panneau d information', 'panneau d’indication', 'panneau d indication',
  'panneau de priorité', 'panneau de zone', 'panneau de limitation',
  'panneau de vitesse', 'panneau de stationnement', 'panneau de parking',
  'panneau de stop', 'panneau cédez-le-passage', 'panneau cedez le passage',
  'pose de signalisation', 'installation de panneaux', 'installation de signalisation',
  'fixer un panneau', 'fixer des panneaux', 'fixation au sol', 'fixation sur poteau',
  'fixation sur mât', 'fixation murale', 'support de panneau',
  'support de signalisation', 'support métallique', 'support metalique',
  'poteau galvanisé', 'poteau galvanise', 'mât galvanisé', 'mat galvanise',
  'scellement béton', 'scellement beton', 'platine', 'platines',
  'balisage', 'balisage de chantier', 'balisage routier', 'balisage de sécurité',
  'balisage de securite', 'panneau de chantier', 'panneaux de chantier',
  'panneau temporaire de chantier', 'panneau de déviation', 'panneau de deviation',
  'déviation', 'deviation', 'panneau travaux', 'panneaux travaux',
  'signalisation temporaire', 'signalisation de chantier',
  'panneau direction', 'panneaux direction', 'fléchage', 'flechage',
  'fléchage directionnel', 'fleche directionnelle', 'orientation',
  'panneau d’orientation', 'panneau d orientation', 'totem directionnel',
  'totem signalétique', 'totem signaletique',
  'mobilier urbain', 'mobilier de voirie', 'totem urbain', 'borne urbaine',
  'bornes urbaines', 'potelet', 'potelets', 'barrière', 'barriere',
  'barrières', 'barrieres', 'glissière', 'glissiere', 'glissières',
  'glissieres', 'séparateur', 'separateur', 'séparateurs', 'separateurs',
  'panneau parking', 'panneau stationnement', 'zone bleue',
  'zone de stationnement', 'zone de livraison', 'zone de dépose',
  'zone de depose', 'panneau pmr', 'panneau handicapé', 'panneau handicape',
  'borne électrique', 'borne electrique', 'borne de recharge',
  'borne de paiement', 'borne automatique', 'borne d’information',
  'borne d information', 'horodateur électronique', 'horodateur electronique'
];


  // --- 1.8 GÉNIE CIVIL / AMÉNAGEMENT URBAIN ---
const kwGenieCivil = [
  'génie civil', 'genie civil', 'aménagement', 'amenagement',
  'aménagement urbain', 'amenagement urbain', 'aménagements urbains',
  'amenagements urbains', 'infrastructure', 'infrastructures',
  'infrastructures routières', 'infrastructures routieres',
  'mobilier urbain', 'mobiliers urbains', 'îlot de sécurité', 'ilot de securite',
  'îlots de sécurité', 'ilots de securite', 'ralentisseur', 'ralentisseurs',
  'butée de stationnement', 'butees de stationnement', 'dos d\'âne',
  'dos d ane', 'aire piétonne', 'aire pietonne', 'carrefour', 'carrefours',
  'rond-point', 'rond point', 'giratoire', 'voie de bus', 'transports en commun',
  'gare', 'gares', 'gare routière', 'gare routiere', 'gare ferroviaire',
  'aéroport', 'aeroport', 'zone aéroportuaire', 'zone aeroportuaire',
  'plateforme multimodale', 'plate-forme multimodale', 'centre logistique',
  'logistique', 'port', 'portuaire', 'événementiel', 'evenementiel',
  'signalétique événementielle', 'signaletique evenementielle',
  'travaux publics', 'travaux de voirie', 'travaux voirie', 'voirie urbaine',
  'réfection de voirie', 'refection de voirie', 'réhabilitation de voirie',
  'rehabilitation de voirie', 'vrd', 'travaux vrd', 'réseaux secs',
  'reseaux secs', 'réseaux humides', 'reseaux humides', 'réseau pluvial',
  'reseau pluvial', 'réseau d’assainissement', 'reseau d assainissement',
  'assainissement', 'assainissement urbain', 'terrassement', 'terrassements',
  'nivellement', 'nivelage', 'compactage', 'rabotage', 'enrobé', 'enrobe',
  'enrobés', 'enrobes', 'béton désactivé', 'beton desactive', 'béton balayé',
  'beton balaye', 'béton imprimé', 'beton imprime',
  'espace public', 'espaces publics', 'réaménagement', 'reamenagement',
  'réaménagement urbain', 'reamenagement urbain', 'revêtement', 'revetement',
  'revêtements urbains', 'revetements urbains', 'revêtement de sol',
  'revetement de sol', 'bordure', 'bordures', 'bordure béton', 'bordure beton',
  'bordure granit', 'bordure granit', 'caniveau', 'caniveaux', 'trottoir',
  'trottoirs', 'élargissement de trottoir', 'elargissement de trottoir',
  'plateau traversant', 'plateau surélevé', 'plateau sureleve', 'zone de rencontre',
  'zone 30', 'zone piétonne', 'zone pietonne',
  'sécurité routière', 'securite routiere', 'sécurisation', 'securisation',
  'sécurisation de carrefour', 'securisation de carrefour',
  'aménagement de carrefour', 'amenagement de carrefour', 'giratoire urbain',
  'giratoire routier', 'rond-point urbain', 'rond point urbain',
  'ilots directionnels', 'îlot central', 'ilot central', 'îlot refuge',
  'ilot refuge', 'passage surélevé', 'passage sureleve', 'ralentisseur urbain',
  'ralentisseur routier',
  'mobilité urbaine', 'mobilite urbaine', 'mobilité douce', 'mobilite douce',
  'piste cyclable', 'voie verte', 'voie bus', 'site propre', 'site propre bus',
  'arrêt de bus', 'arret de bus', 'arrêts de bus', 'arrets de bus',
  'station de tramway', 'station tramway', 'plateforme tramway',
  'plateforme bus', 'plateforme transport', 'pôle multimodal', 'pole multimodal',
  'zone industrielle', 'zones industrielles', 'zone logistique',
  'zones logistiques', 'plateforme logistique', 'plateforme de distribution',
  'plateforme transport', 'entrepôt logistique', 'entrepot logistique',
  'parc d’activités', 'parc d activites', 'zone d’activités',
  'zone d activites',
  'aménagement paysager', 'amenagement paysager', 'paysager', 'paysagers',
  'espace vert', 'espaces verts', 'plantation', 'plantations',
  'mobilier paysager', 'mobilier de parc', 'mobilier extérieur',
  'mobilier exterieur',
  'structure événementielle', 'structure evenementielle',
  'installation événementielle', 'installation evenementielle',
  'aménagement temporaire', 'amenagement temporaire', 'barriérage',
  'barrierage', 'clôture temporaire', 'cloture temporaire'
];


  // --- 1.9 AMÉNAGEMENT INTÉRIEUR ---
const kwAmenagementInterieur = [
  'aménagement intérieur', 'amenagement interieur', 'intérieur', 'interieur',
  'signalétique intérieure', 'signaletique interieure', 'sol industriel',
  'sol logistique', 'entrepôt', 'entrepot', 'entrepôts', 'entrepots',
  'usine', 'usines', 'centre commercial', 'centres commerciaux',
  'galerie marchande', 'galeries marchandes', 'parking souterrain',
  'parkings souterrains', 'parking en ouvrage', 'parking couvert',
  'enseigne', 'enseignes', 'enseigne lumineuse', 'enseignes lumineuses',
  'bloc lumineux', 'blocs lumineux', 'panneau lumineux', 'panneaux lumineux',
  'habillage mural', 'edp', 'établissement recevant du public',
  'etablissement recevant du public', 'marquage de sécurité', 'marquage de securite',
  'travaux intérieurs', 'travaux interieur', 'réaménagement intérieur',
  'reamenagement interieur', 'aménagement de bâtiment', 'amenagement de batiment',
  'aménagement de locaux', 'amenagement de locaux', 'aménagement de hall',
  'amenagement de hall', 'aménagement de magasin', 'amenagement de magasin',
  'aménagement de boutique', 'amenagement de boutique', 'aménagement de bureaux',
  'amenagement de bureaux',
  'signalétique intérieure', 'signaletique intérieure', 'signalétique interne',
  'signaletique interne', 'signalétique bâtiment', 'signaletique batiment',
  'signalétique magasin', 'signaletique magasin', 'signalétique entreprise',
  'signaletique entreprise', 'signalétique directionnelle intérieure',
  'signaletique directionnelle interieure', 'marquage intérieur',
  'marquage interieur', 'marquage au sol intérieur', 'marquage au sol interieur',
  'marquage sécurité intérieur', 'marquage securite interieur',
  'pictogrammes intérieurs', 'pictogrammes interieurs',
  'sol epoxy', 'sol époxy', 'sol resine', 'sol résine', 'revêtement intérieur',
  'revetement interieur', 'revêtement de sol intérieur', 'revetement de sol interieur',
  'sol antidérapant intérieur', 'sol antiderapant interieur', 'sol technique',
  'sol technique industriel', 'sol entrepôt', 'sol entrepot', 'sol atelier',
  'sol logistique intérieur', 'sol parking intérieur', 'sol parking couvert',
  'galerie commerciale', 'magasin', 'boutique', 'supermarché', 'supermarche',
  'hypermarché', 'hypermarché', 'retail', 'erp intérieur', 'erp interieur',
  'circulation intérieure', 'circulation interieur', 'flux clients',
  'flux visiteurs', 'accueil', 'hall d’accueil', 'hall d accueil',
  'parking intérieur', 'parking interieur', 'parking couvert',
  'parking en ouvrage', 'parking sous-terrain', 'parking sous terrain',
  'marquage parking intérieur', 'marquage parking couvert',
  'marquage parking souterrain', 'signalétique parking', 'signaletique parking',
  'enseigne intérieure', 'enseigne interieur', 'enseigne murale',
  'enseigne suspendue', 'enseigne plafond', 'enseigne directionnelle',
  'enseigne de sécurité', 'enseigne de securite', 'panneau intérieur',
  'panneau interieur', 'panneau mural', 'panneau suspendu',
  'panneau lumineux intérieur', 'panneau lumineux interieur',
  'bloc lumineux intérieur', 'bloc lumineux interieur', 'totem intérieur',
  'totem interieur',
  'habillage intérieur', 'habillage interieur', 'habillage mural intérieur',
  'habillage mural interieur', 'habillage de colonne', 'habillage de mur',
  'habillage de cloison', 'cloisonnement', 'cloison', 'cloisons',
  'paroi intérieure', 'paroi interieur', 'structure intérieure',
  'structure interieur',
  'entrepôt industriel', 'entrepot industriel', 'entrepôt logistique',
  'entrepot logistique', 'zone de stockage', 'zone de préparation',
  'zone de picking', 'zone de tri', 'atelier', 'usine intérieure',
  'usine interieur', 'hall industriel', 'hall logistique'
];


  // --- 1.10 MATÉRIEL / FLOTTE / VÉHICULES ---
const kwMateriel = [
  'matériel', 'materiel', 'équipement', 'equipement', 'équipements',
  'equipements', 'flotte', 'flottes', 'véhicule', 'vehicule', 'véhicules',
  'vehicules', 'camion', 'camions', 'fourgon', 'fourgons', 'remorque',
  'remorques', 'machine', 'machines', 'engin', 'engins', 'inovi',
  'éco inovi', 'eco inovi', 'fourgon traceur', 'fourgons traceurs',
  'automotrice', 'automotrices', 'applicateur', 'applicateurs',
  'application de peinture', 'airless', 'extrusion', 'extrudeuse',
  'balisage', 'baliser', 'balise', 'balises', 'led', 'à led', 'a led',
  'panneau à messages variables', 'panneau a messages variables', 'pmv',
  'épi', 'epi', 'équipement de protection', 'equipement de protection',
  'protection individuelle', 'gilet', 'gilet de sécurité', 'gilet de securite',
  'casque', 'sécurité chantier', 'securite chantier', 'cône', 'cone',
  'cônes', 'cones', 'barrière', 'barriere', 'barrières', 'barrieres',
  'véhicule utilitaire', 'vehicule utilitaire', 'véhicule atelier',
  'vehicule atelier', 'camionnette', 'camion nacelle', 'camion grue',
  'camion plateau', 'camion benne', 'fourgon atelier', 'fourgon équipé',
  'fourgon equipe', 'engin de chantier', 'engin routier', 'engin de marquage',
  'engin de signalisation', 'machine de marquage', 'machine de peinture',
  'machine routière', 'machine routiere', 'machine professionnelle',
  'traceur', 'traceurs', 'traceuse', 'traceuses', 'machine à tracer',
  'machine a tracer', 'appareil de marquage', 'appareil de peinture',
  'applicateur de peinture', 'applicateur thermoplastique',
  'extrudeuse thermoplastique', 'extrusion peinture', 'machine airless',
  'pompe airless', 'pistolet airless', 'réservoir peinture',
  'reservoir peinture', 'cuve peinture', 'cuve résine', 'cuve resine',
  'balisage chantier', 'balisage routier', 'balisage de sécurité',
  'balisage de securite', 'panneaux de chantier', 'panneau chantier',
  'barrière de chantier', 'barriere de chantier', 'barrière plastique',
  'barriere plastique', 'barrière mobile', 'barriere mobile',
  'cône de chantier', 'cone de chantier', 'rubalise', 'ruban de signalisation',
  'ruban de balisage', 'lampe de chantier', 'lampe led', 'gyrophares',
  'gyrophare', 'feux de chantier',
  'epi', 'épi', 'équipements de sécurité', 'equipements de securite',
  'équipement de chantier', 'equipement de chantier', 'gants',
  'gants de sécurité', 'gants de securite', 'lunettes de protection',
  'masque de protection', 'chaussures de sécurité', 'chaussures de securite',
  'bottes de sécurité', 'bottes de securite', 'casque de chantier',
  'casque de sécurité', 'casque de securite', 'gilet haute visibilité',
  'gilet haute visibilite', 'veste réfléchissante', 'veste reflechissante',
  'outillage', 'outils', 'outil professionnel', 'outil de chantier',
  'compresseur', 'compresseurs', 'générateur', 'generateur',
  'groupe électrogène', 'groupe electrogene', 'marteau piqueur',
  'perforateur', 'perceuse', 'meuleuse', 'scie', 'scie circulaire',
  'scie sauteuse', 'laser de chantier', 'niveau laser', 'mètre laser',
  'metre laser',
  'panneau lumineux', 'panneaux lumineux', 'panneau led', 'panneaux led',
  'totem lumineux', 'totem led', 'afficheur lumineux', 'afficheur led',
  'panneau électronique', 'panneau electronique', 'pmv mobile',
  'pmv remorquable', 'panneau message variable', 'radar pédagogique',
  'radar pedagogique', 'afficheur de vitesse',
  'remorque signalisation', 'remorque de chantier', 'remorque pmv',
  'remorque balisage', 'remorque porte-machine', 'remorque porte engin',
  'remorque utilitaire', 'plateau remorque', 'attelage', 'attaches',
  'supports de panneaux', 'supports mobiles', 'pieds de panneaux',
  'pieds lourds', 'pieds légers', 'pieds legers'
];


  // --- 1.11 SÉCURITÉ / PRÉVENTION DES RISQUES ---
const kwSecurite = [
  'sécurité', 'securite', 'sécurisé', 'securise', 'sécurisée', 'securisee',
  'sécuriser', 'securiser', 'prévention', 'prevention', 'risque', 'risques',
  'risque routier', 'hse', 'h.s.e', 'santé sécurité environnement',
  'sante securite environnement', 'accident', 'accidents', 'protocole',
  'protocoles', 'causerie sécurité', 'causerie securite', 'formation sécurité',
  'formation securite', 'protection des équipes', 'protection des equipes',
  'protection des usagers', 'sécurité des usagers', 'securite des usagers',
  'signalisation de chantier', 'balisage de chantier', 'zone de chantier',
  'chantier sécurisé', 'chantier securise',
  'sécurité routière', 'securite routiere', 'sécurité au travail',
  'securite au travail', 'sécurité opérationnelle', 'securite operationnelle',
  'sécurité des chantiers', 'securite des chantiers', 'prévention des risques',
  'prevention des risques', 'gestion des risques', 'maîtrise des risques',
  'maitrise des risques', 'analyse de risques', 'analyse des risques',
  'risques professionnels', 'risques chantier', 'risques d’accident',
  'risques d accident', 'danger', 'dangers', 'dangerosité', 'dangerosite',
  'sécurité des équipes', 'securite des equipes', 'sécurité du personnel',
  'securite du personnel', 'protection du personnel', 'protection des travailleurs',
  'protection individuelle', 'protection collective', 'équipements de sécurité',
  'equipements de securite', 'équipements de protection', 'equipements de protection',
  'équipements hse', 'equipements hse', 'consignes de sécurité',
  'consignes de securite', 'consignes hse', 'brief sécurité', 'brief securite',
  'zone sécurisée', 'zone securisee', 'zone de sécurité', 'zone de securite',
  'zone de danger', 'zone de travaux', 'zone de circulation',
  'zone d’intervention', 'zone d intervention', 'balisage de sécurité',
  'balisage de securite', 'balisage routier', 'balisage chantier',
  'signalisation de sécurité', 'signalisation de securite',
  'signalisation temporaire', 'signalisation de travaux', 'protection chantier',
  'protection de chantier',
  'procédure de sécurité', 'procedure de securite', 'procédures hse',
  'procedures hse', 'protocoles hse', 'protocole de sécurité',
  'protocole de securite', 'plan de prévention', 'plan de prevention',
  'plan de sécurité', 'plan de securite', 'ppsps', 'document unique',
  'duerp', 'audit sécurité', 'audit securite', 'contrôle sécurité',
  'controle securite', 'inspection sécurité', 'inspection securite',
  'mise en sécurité', 'mise en securite',
  'sécurité circulation', 'securite circulation', 'sécurité voirie',
  'securite voirie', 'sécurisation routière', 'securisation routiere',
  'sécurisation de voirie', 'securisation de voirie', 'sécurisation de zone',
  'securisation de zone',
  'sécurité incendie', 'securite incendie', 'risque incendie',
  'risques incendie', 'évacuation', 'evacuation', 'plan d’évacuation',
  'plan d evacuation', 'extincteur', 'extincteurs', 'alarme incendie',
  'détecteur incendie', 'detecteur incendie', 'urgence sécurité',
  'urgence securite'
];


  // --- 1.12 RECRUTEMENT / EMPLOI ---
const kwRecrutement = [
  'recrutement', 'recrute', 'recrutez', 'recrutent', 'recruter',
  'recrutements', 'embauche', 'embauches', 'embaucher', 'embauchez',
  'embauchent', 'emploi', 'emplois', 'job', 'jobs', 'travail', 'travailler',
  'travaillez', 'travaillent', 'candidature', 'candidatures', 'candidater',
  'candidate', 'candidatez', 'postuler', 'postule', 'postulez', 'poste',
  'postes', 'cv', 'c.v', 'curriculum', 'lettre de motivation', 'motivation',
  'applicateur', 'applicateurs', 'chef d\'équipe', 'chef d equipe',
  'chefs d\'équipe', 'chefs d equipe', 'conducteur de travaux',
  'conducteurs de travaux', 'traceur routier', 'formation', 'formations',
  'former', 'forme', 'apprenti', 'apprentissage', 'alternance', 'alternant',
  'stage', 'stagiaire', 'stages', 'évolution', 'evolution', 'évoluer',
  'evoluer', 'carrière', 'carriere', 'rejoindre', 'rejoindre l\'équipe',
  'rejoindre l equipe', 'rejoignez', 'intégrer', 'integrer',
  'salaire', 'rémunération', 'remuneration', 'permis', 'caces', 'permis pl',
  'ressources humaines', 'rh', 'service rh', 'service recrutement',
  'déposer une candidature', 'deposer une candidature', 'envoyer mon cv',
  'envoyer ma candidature', 'candidat', 'candidats', 'profil', 'profils',
  'recherche de personnel', 'recherche de collaborateurs',
  'recherche d’employés', 'recherche d employes', 'besoin de personnel',
  'besoin de recruter', 'offre d’emploi', 'offre d emploi',
  'annonce', 'annonces', 'poste à pourvoir', 'poste a pourvoir',
  'cv pdf', 'cv joint', 'cv en pièce jointe', 'cv en piece jointe',
  'portfolio', 'profil professionnel', 'profil linkedin', 'lettre de candidature',
  'références', 'references', 'expérience', 'experience',
  'expériences professionnelles', 'experiences professionnelles',
  'marqueur au sol', 'marqueur routier', 'opérateur de marquage',
  'operateur de marquage', 'technicien de marquage', 'technicien voirie',
  'ouvrier voirie', 'ouvrier routier', 'agent de voirie',
  'agent de signalisation', 'poseur de panneaux', 'poseur signalisation',
  'chef de chantier', 'chef de projet voirie', 'chef de projet signalisation',
  'conducteur d’engins', 'conducteur d engins', 'manœuvre', 'manoeuvre',
  'manutentionnaire', 'technicien sécurité', 'technicien securite',
  'formation interne', 'formation professionnelle', 'formation marquage',
  'formation signalisation', 'formation btp', 'formation chantier',
  'formation terrain', 'formation continue', 'formation initiale',
  'programme de formation', 'plan de formation', 'montée en compétences',
  'montee en competences', 'évolution professionnelle',
  'evolution professionnelle', 'perspectives d’évolution',
  'perspectives d evolution', 'promotion', 'mobilité interne',
  'mobilite interne',
  'stagiaire btp', 'stagiaire marquage', 'stagiaire signalisation',
  'stagiaire voirie', 'stagiaire logistique', 'alternance btp',
  'alternance marquage', 'alternance signalisation', 'alternant btp',
  'alternant marquage', 'alternant signalisation', 'apprenti btp',
  'apprenti marquage', 'apprenti signalisation',
  'paie', 'payé', 'paye', 'grille salariale', 'conditions de travail',
  'horaires de travail', 'permis b', 'permis c', 'permis ce',
  'permis poids lourd', 'caces r482', 'caces r489', 'habilitation',
  'habilitations', 'habilitation électrique', 'habilitation electrique'
];


  // --- 1.13 ENTREPRISE / HISTOIRE / IDENTITÉ ---
const kwEntreprise = [
  'get\'com', 'getcom', 'get com', 'entreprise', 'société', 'societe',
  'compagnie', 'firme', 'histoire', 'historique', 'créé', 'cree', 'créée',
  'creee', 'création', 'creation', 'fondé', 'fonde', 'fondée', 'fondee',
  'fondation', '1991', 'depuis quand', 'depuis combien de temps',
  'ancienneté', 'anciennete', 'expérience', 'experience', 'années d\'expérience',
  'annees d experience', 'qui êtes-vous', 'qui etes vous', 'qui êtes vous',
  'qui sommes nous', 'présentation', 'presentation', 'présenter',
  'presenter', 'qu\'est-ce que get\'com', 'qu est ce que get com',
  'que faites-vous', 'que faites vous', 'votre activité', 'votre activite',
  'valeurs', 'mission', 'savoir-faire', 'savoir faire', 'expertise terrain',
  'qui sommes-nous', 'qui sommes nous', 'présentation de l’entreprise',
  'presentation de l entreprise', 'à propos', 'a propos', 'profil entreprise',
  'profil société', 'corporate', 'institutionnel', 'institutionnelle',
  'depuis 1991', 'créée en 1991', 'fondée en 1991', 'historique entreprise',
  'date de création', 'origines', 'parcours', 'évolution de l’entreprise',
  'evolution de l entreprise', 'longévité', 'longevite', 'depuis plus de 30 ans',
  'valeurs de l’entreprise', 'valeurs de l entreprise', 'vision',
  'vision d’entreprise', 'mission de l’entreprise', 'engagement', 'engagements',
  'philosophie', 'culture d’entreprise', 'culture d entreprise', 'éthique',
  'ethique',
  'expertise', 'expertises', 'expertise technique', 'expertise métier',
  'expertise marquage', 'expertise signalisation', 'expertise voirie',
  'savoir-faire technique', 'compétences', 'competences', 'maîtrise',
  'maitrise', 'références', 'references', 'clients', 'partenaires',
  'réalisations', 'realisations',
  'équipe', 'equipe', 'nos équipes', 'nos equipes', 'personnel',
  'collaborateurs', 'direction', 'dirigeants', 'fondateurs', 'fondateur',
  'gérant', 'gerant', 'siège', 'siege', 'siège social', 'siege social',
  'implantation', 'implantations', 'agence', 'agences',
  'notoriété', 'notoriete', 'réputation', 'reputation', 'image de marque',
  'branding', 'identité visuelle', 'identite visuelle', 'charte graphique',
  'communication corporate',
  'que proposez-vous', 'que proposez vous', 'présentez-vous',
  'présentez votre entreprise'
];


  // --- 1.14 LOCALISATION / ZONE D'INTERVENTION ---
const kwLocalisation = [
  'localisation', 'situé', 'situe', 'situés', 'situes', 'adresse',
  'où êtes-vous', 'ou etes vous', 'où êtes vous', 'où se trouve',
  'ou se trouve', 'où vous trouvez-vous', 'ou vous trouvez vous',
  'gennevilliers', 'île-de-france', 'ile de france', 'ile-de-france',
  'idf', 'i.d.f', 'paris', 'région parisienne', 'region parisienne',
  'zone d\'intervention', 'zone d intervention', 'zones d\'intervention',
  'zones d intervention', 'secteur', 'secteurs', 'secteur géographique',
  'secteur geographique', 'intervenez', 'intervenir', 'intervenez-vous',
  'intervenez vous', 'vous déplacez', 'vous deplacez', 'déplacement',
  'deplacement', 'se déplacer', 'se deplacer', 'région', 'region',
  'département', 'departement', 'départements', 'departements',
  'hauts-de-seine', 'hauts de seine', '92', 'national', 'france entière',
  'france entiere', 'limitrophe', 'limitrophes',
  'où êtes-vous situés', 'ou etes vous situes', 'où se situe votre entreprise',
  'où est votre siège', 'adresse exacte', 'adresse complète', 'coordonnées',
  'localisé', 'localise', 'localisée', 'localisee',
  'vous déplacez où', 'vous intervenez où', 'intervention sur site',
  'intervention terrain', 'intervention locale', 'intervention régionale',
  'intervention nationale', 'déplacement sur site', 'déplacement en région',
  'zone couverte', 'zones couvertes', 'périmètre d’intervention',
  'perimetre d intervention', 'périmètre géographique', 'perimetre geographique',
  'paris intramuros', 'petite couronne', 'grande couronne', 'banlieue parisienne',
  'nord parisien', 'ouest parisien', 'sud parisien', 'est parisien',
  'la défense', 'la defense', 'saint-denis', 'saint denis', 'asnières',
  'asnieres', 'colombes', 'courbevoie', 'levallois', 'clichy', 'argenteuil',
  'nanterre',
  'seine-saint-denis', 'seine saint denis', 'val-d’oise', 'val d oise',
  'yvelines', 'essonne', 'val-de-marne', 'val de marne', 'francilien',
  'francilienne', 'intervention nationale',
  'zones limitrophes', 'départements limitrophes', 'régions limitrophes',
  'intervention hors région', 'intervention hors idf', 'déplacement hors idf',
  'où travaillez-vous', 'où intervenez-vous', 'dans quel secteur',
  'dans quels secteurs', 'dans quelle région', 'dans quel département',
  'dans quelles zones', 'couvrez-vous ma zone'
];


  // --- 1.15 SALUTATIONS / POLITESSE / SMALL TALK ---
const kwSalutations = [
  'bonjour', 'bonsoir', 'salut', 'coucou', 'hello', 'hey', 'bjr', 'slt',
  'comment ça va', 'comment ca va', 'ça va', 'ca va', 'comment allez-vous',
  'comment allez vous',
  'bonjour à vous', 'bonjour a vous', 'bonsoir à vous', 'bonsoir a vous',
  'salutations', 'bien le bonjour', 'yo', 'yop', 'wesh', 'bonjour tout le monde',
  'hello there', 'hi', 'greetings', 'comment vas-tu', 'comment vas tu',
  'comment allez-vous aujourd’hui', 'comment allez vous aujourd hui',
  'ça roule', 'ca roule', 'ça dit quoi', 'ca dit quoi', 'quoi de neuf',
  'ça fait plaisir', 'ca fait plaisir', 'ravi de vous écrire',
  'ravi de vous ecrire'
];

const kwRemerciements = [
  'merci', 'merci beaucoup', 'merci bien', 'je vous remercie', 'cool',
  'super', 'parfait', 'génial', 'genial', 'top', 'nickel',
  'merci infiniment', 'un grand merci', 'merci pour votre aide',
  'merci pour votre réponse', 'merci pour votre reponse',
  'merci pour votre retour', 'merci d’avance', 'merci d avance',
  'c’est parfait', 'c est parfait', 'nickel chrome', 'au top', 'trop bien',
  'génial merci', 'super merci', 'merci pour tout',
  'merci pour votre disponibilité', 'merci pour votre temps'
];

  const kwAuRevoir = [
  'au revoir', 'a bientot', 'à bientôt', 'bye', 'bonne journée',
  'bonne journee', 'bonne soirée', 'bonne soiree', 'a plus', 'à plus',
  'bonne continuation', 'bonne soirée à vous', 'bonne soiree a vous',
  'bonne journée à vous', 'bonne journee a vous', 'à demain', 'a demain',
  'à plus tard', 'a plus tard', 'à la prochaine', 'a la prochaine',
  'bonne fin de journée', 'bonne fin de journee', 'bonne fin de soirée',
  'bonne fin de soiree', 'prenez soin de vous', 'bonne semaine',
  'bon week-end', 'bon weekend', 'à très vite', 'a tres vite'
];


  /* ----------------------------------------------------------
     2. FONCTIONS UTILITAIRES
     ---------------------------------------------------------- */
  function matches(keywordList) {
    return keywordList.some(kw => cleanText.includes(kw));
  }

  // Pioche une réponse au hasard dans un tableau de variantes,
  // pour que le chatbot ne semble pas "répéter" la même phrase
  // en cas de questions répétées sur le même sujet.
  function pickResponse(variants) {
    const index = Math.floor(Math.random() * variants.length);
    return variants[index];
  }

  /* ----------------------------------------------------------
     3. BANQUE DE RÉPONSES (plusieurs variantes par intention)
     ---------------------------------------------------------- */

  const reponsesDevisContact = [
    "Pour étudier votre projet de voirie ou de signalisation, nos équipes sont disponibles au 01 48 11 15 35 ou par mail à contact@getcom.fr.",
    "Nous serions ravis d'étudier votre demande de devis. Vous pouvez nous joindre directement au 01 48 11 15 35, ou remplir notre formulaire en ligne pour être recontacté rapidement.",
    "Un devis personnalisé peut être établi en fonction de votre projet de marquage ou de signalisation. Contactez notre service commercial au 01 48 11 15 35 ou à contact@getcom.fr.",
    "Notre département commercial est à votre écoute pour chiffrer votre besoin. Le plus simple est de nous appeler au 01 48 11 15 35 ou de demander un rappel directement depuis ce chat.",
  ];

  const reponsesPmrNormes = [
    "Nos marquages PMR respectent strictement les normes d'implantation (emplacement de 3,30m x 5m) et la signalisation verticale associée, conformément aux référentiels SETRA et IISR.",
    "L'accessibilité PMR fait partie de nos priorités : nous appliquons les normes réglementaires en vigueur pour le dimensionnement, le marquage et la signalisation des places prioritaires.",
    "Tous nos chantiers de marquage réglementaire (PMR, stationnement, sécurité) sont réalisés en conformité avec le code de la route et les directives SETRA / IISR.",
  ];

  const reponsesHoraires = [
    "GET'COM assure des interventions modulables 24h/24 et 7j/7 (de jour comme de nuit) pour ne pas perturber votre trafic, avec une remise en circulation optimale des voies.",
    "Oui, nous intervenons aussi bien de jour que de nuit, y compris en horaires décalés, afin de nous adapter à vos contraintes d'exploitation routière ou commerciale.",
    "Nos équipes sont organisées pour répondre rapidement, y compris en urgence ou en dehors des horaires classiques, 7 jours sur 7.",
  ];

  const reponsesEnvironnement = [
    "GET'COM s'engage activement pour l'environnement : parc de véhicules éco-responsables conformes aux ZFE, démarche RSE certifiée EcoVadis et MASE, et valorisation systématique des déchets de chantier.",
    "Notre flotte est composée de véhicules récents conformes aux zones à faibles émissions (ZFE), et nous suivons une politique RSE stricte avec tri des déchets et produits sans solvants nocifs.",
    "La transition écologique est au cœur de notre démarche : matériel à faible émission, gestion responsable des déchets et certifications RSE (EcoVadis, MASE).",
  ];

  const reponsesCertifications = [
    "GET'COM est certifié ISO 9001, labellisé QUALIBAT et engagé dans une démarche RSE EcoVadis et MASE, gages de notre rigueur en matière de qualité, de sécurité et d'environnement.",
    "Nos certifications (ISO 9001, QUALIBAT, EcoVadis, MASE) attestent de notre système de management de la qualité, de la sécurité et de l'environnement sur l'ensemble de nos chantiers.",
    "La qualité de nos prestations est garantie par plusieurs labels reconnus dans le secteur du BTP : ISO 9001, QUALIBAT et une démarche RSE active.",
  ];

  const reponsesSignalHorizontale = [
    "Notre signalisation horizontale couvre le marquage routier, le stationnement, les passages piétons, les pistes cyclables et les sols industriels, avec des résines certifiées NF haute durabilité.",
    "Nous réalisons tous types de marquage au sol : régulation de circulation, écomobilité, stationnement, marquage temporaire de chantier ou marquage de sécurité, avec des enduits thermoplastiques ou à froid.",
    "Le marquage horizontal est l'un de nos cœurs de métier : peinture routière, résines haute performance, tracé de précision pour collectivités comme pour autoroutes.",
  ];

  const reponsesSignalVerticale = [
    "Nous installons et entretenons tous types de panneaux : signalisation réglementaire, directionnelle, temporaire, ainsi que les supports, mâts et fixations certifiés.",
    "Notre pôle signalisation verticale prend en charge la pose de panneaux de police, de panneaux directionnels et de mobilier de voirie réglementaire.",
    "Que ce soit pour des panneaux réglementaires (catégories A, AB, B, C) ou des panneaux temporaires de chantier, nous assurons la fourniture, la pose et la maintenance.",
  ];

  const reponsesGenieCivil = [
    "Notre pôle génie civil prend en charge les aménagements urbains : mobilier urbain, îlots de sécurité, ralentisseurs, carrefours, gares et plateformes multimodales.",
    "Nous intervenons sur l'aménagement d'infrastructures routières et urbaines : voiries, dépose-minute, zones logistiques, gares ferroviaires et routières.",
    "Du carrefour au giratoire en passant par les aménagements d'arrêts de bus, notre équipe génie civil conçoit et réalise des aménagements urbains complets.",
  ];

  const reponsesAmenagementInterieur = [
    "Nous proposons des solutions complètes pour les espaces privés : signalétique intérieure sur mesure, marquage de sécurité, enseignes lumineuses et parkings souterrains.",
    "Pour les centres commerciaux, entrepôts et parkings en ouvrage, nous concevons une signalétique intérieure adaptée ainsi que le marquage de sécurité des sols industriels.",
    "Notre offre d'aménagement intérieur inclut les enseignes corporatives, les blocs lumineux et l'habillage mural de sécurité pour les établissements recevant du public.",
  ];

  const reponsesMateriel = [
    "Notre flotte est composée de fourgons traceurs Éco-Inovi, d'automotrices de marquage lourd et de remorques de balisage LED, conformes aux exigences ZFE des centres urbains.",
    "Nous disposons d'un parc matériel de pointe : machines d'extrusion thermoplastique, unités d'application airless automatisées et remorques de signalisation d'urgence.",
    "Notre équipement permet une intervention rapide et sécurisée : véhicules récents, systèmes de traçage automatisés et matériel de balisage lumineux haute visibilité.",
  ];

  const reponsesSecurite = [
    "La sécurité est notre priorité absolue : équipements de protection individuelle haut de gamme, respect strict des protocoles HSE, et formations régulières de nos équipes terrain.",
    "Nos chantiers respectent des protocoles de sécurité stricts (HSE, MASE), avec causeries sécurité hebdomadaires et mises en situation pour limiter le risque routier.",
    "La protection de nos équipes et des usagers de la route est centrale dans notre organisation : EPI premium, balisage lumineux et formations régulières.",
  ];

  const reponsesRecrutement = [
    "Nous recherchons régulièrement des applicateurs et chefs d'équipe en Île-de-France. Rejoignez une équipe d'expérience aux côtés de professionnels cumulant plus de 30 ans de métier !",
    "GET'COM recrute toute l'année des profils techniques : applicateurs, traceurs routiers, chefs d'équipe et conducteurs de travaux. Toutes les candidatures sont étudiées.",
    "Vous cherchez un emploi dans le secteur de la voirie ? Postulez chez GET'COM, où la formation continue et l'évolution interne sont encouragées.",
  ];

  const reponsesEntreprise = [
    "GET'COM est le spécialiste de la voirie et de la signalisation depuis 1991, basé à Gennevilliers en Île-de-France, au service des collectivités et des entreprises du BTP.",
    "Depuis sa création en 1991, GET'COM accompagne les collectivités et les entreprises dans l'aménagement durable et la mise en conformité de leurs voies publiques et privées.",
    "GET'COM, c'est plus de 30 ans d'expertise terrain dans le marquage et la signalisation, au service de la sécurité routière en Île-de-France.",
  ];

  const reponsesLocalisation = [
    "Nous sommes basés à Gennevilliers (10-12 boulevard Louise Michel) et intervenons principalement en Île-de-France, avec une capacité de déploiement sur l'ensemble du territoire français.",
    "Notre siège se trouve à Gennevilliers, dans les Hauts-de-Seine. Environ 56% de nos interventions ont lieu en Île-de-France, le reste sur des chantiers d'envergure dans toute la France.",
    "GET'COM intervient dans toute l'Île-de-France et au-delà, depuis ses locaux de Gennevilliers (Bâtiment B2, 92230).",
  ];

  const reponsesSalutations = [
    "Bonjour ! Je suis l'assistant virtuel de GET'COM. Je peux répondre à vos questions sur nos expertises, nos capacités, nos certifications ou vous mettre en relation avec notre équipe commerciale.",
    "Bonjour et bienvenue ! N'hésitez pas à me poser vos questions sur le marquage routier, la signalisation ou nos services, je suis là pour vous renseigner.",
  ];

  const reponsesRemerciements = [
    "Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur nos services de voirie et de signalisation.",
    "Je vous en prie ! N'hésitez pas à revenir vers nous pour toute autre question.",
  ];

  const reponsesAuRevoir = [
    "Au revoir et merci pour votre intérêt envers GET'COM ! Notre équipe reste disponible au 01 48 11 15 35 si besoin.",
    "À bientôt ! N'hésitez pas à nous recontacter au 01 48 11 15 35 ou contact@getcom.fr pour toute question.",
  ];

  const reponseDefaut = [
    "Désolé, je n'ai pas bien compris. N'hésitez pas à utiliser des mots simples ou à cliquer sur le bouton de téléphone en haut pour demander un rappel.",
    "Je n'ai pas saisi votre demande. Vous pouvez me parler de nos expertises, de nos capacités, du recrutement ou cliquer sur le bouton de rappel pour être contacté directement.",
  ];

  /* ----------------------------------------------------------
     4. ARBRE DE DÉCISION — ORDRE DE PRIORITÉ
     ---------------------------------------------------------- */

  // --- Politesse / small talk (réponses courtes, pas de redirection systématique) ---
  if (matches(kwSalutations)) {
    addMessage('bot', pickResponse(reponsesSalutations));
    return;
  }
  if (matches(kwRemerciements)) {
    addMessage('bot', pickResponse(reponsesRemerciements));
    return;
  }
  if (matches(kwAuRevoir)) {
    addMessage('bot', pickResponse(reponsesAuRevoir));
    return;
  }

  // --- Devis / Contact / Rappel (priorité haute : intention d'achat) ---
  if (matches(kwDevisContact)) {
    addMessage('bot', pickResponse(reponsesDevisContact));
    createLinkButton("Aller à la page Contact / Devis ➔", "contact.html");
  }

  // --- PMR / Normes / Réglementation ---
  else if (matches(kwPmrNormes)) {
    addMessage('bot', pickResponse(reponsesPmrNormes));
    createLinkButton("Consulter nos expertises ➔", "expertises.html");
  }

  // --- Horaires / Disponibilité / Nuit / Urgence ---
  else if (matches(kwHorairesDispo)) {
    addMessage('bot', pickResponse(reponsesHoraires));
    createLinkButton("Découvrir nos capacités ➔", "capacites.html");
  }

  // --- Environnement / Écologie / ZFE / RSE ---
  else if (matches(kwEnvironnement)) {
    addMessage('bot', pickResponse(reponsesEnvironnement));
    createLinkButton("Découvrir nos capacités ➔", "capacites.html");
  }

  // --- Certifications / Qualité / Garanties ---
  else if (matches(kwCertifications)) {
    addMessage('bot', pickResponse(reponsesCertifications));
    createLinkButton("Découvrir nos capacités ➔", "capacites.html");
  }

  // --- Signalisation horizontale / marquage au sol ---
  else if (matches(kwSignalHorizontale)) {
    addMessage('bot', pickResponse(reponsesSignalHorizontale));
    createLinkButton("Consulter la page Expertises ➔", "expertises.html");
  }

  // --- Signalisation verticale / panneaux ---
  else if (matches(kwSignalVerticale)) {
    addMessage('bot', pickResponse(reponsesSignalVerticale));
    createLinkButton("Consulter la page Expertises ➔", "expertises.html");
  }

  // --- Génie civil / aménagement urbain ---
  else if (matches(kwGenieCivil)) {
    addMessage('bot', pickResponse(reponsesGenieCivil));
    createLinkButton("Consulter la page Expertises ➔", "expertises.html");
  }

  // --- Aménagement intérieur ---
  else if (matches(kwAmenagementInterieur)) {
    addMessage('bot', pickResponse(reponsesAmenagementInterieur));
    createLinkButton("Consulter la page Expertises ➔", "expertises.html");
  }

  // --- Matériel / Flotte / Véhicules ---
  else if (matches(kwMateriel)) {
    addMessage('bot', pickResponse(reponsesMateriel));
    createLinkButton("Découvrir nos capacités ➔", "capacites.html");
  }

  // --- Sécurité / Prévention des risques ---
  else if (matches(kwSecurite)) {
    addMessage('bot', pickResponse(reponsesSecurite));
    createLinkButton("Découvrir nos capacités ➔", "capacites.html");
  }

  // --- Recrutement / Emploi ---
  else if (matches(kwRecrutement)) {
    addMessage('bot', pickResponse(reponsesRecrutement));
    createLinkButton("Déposer une candidature en ligne ➔", "recrutement.html");
  }

  // --- Entreprise / Histoire / Identité ---
  else if (matches(kwEntreprise)) {
    addMessage('bot', pickResponse(reponsesEntreprise));
    createLinkButton("En savoir plus sur nos projets ➔", "projets.html");
  }

  // --- Localisation / Zone d'intervention ---
  else if (matches(kwLocalisation)) {
    addMessage('bot', pickResponse(reponsesLocalisation));
    createLinkButton("Voir nos coordonnées ➔", "contact.html");
  }

  // --- DÉFAUT ---
  else {
    addMessage('bot', pickResponse(reponseDefaut));
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

document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("legalModal");
  const btn = document.getElementById("legalBtn");
  const closeCross = document.querySelector(".modal-close-btn");
  const closeBtn = document.getElementById("closeLegalBtn");

  // Ouvrir la modale au clic sur "Mentions légales"
  if (btn && modal) {
    btn.addEventListener("click", function(e) {
      e.preventDefault(); // Empêche de remonter la page avec le #
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Bloque le scroll du site derrière
    });
  }

  // Fonction de fermeture
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Réactive le scroll du site
  }

  // Fermer via la croix X
  if (closeCross) closeCross.addEventListener("click", closeModal);

  // Fermer via le gros bouton jaune "Fermer"
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Fermer si l'utilisateur clique n'importe où en dehors de la boîte blanche
  window.addEventListener("click", function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
});