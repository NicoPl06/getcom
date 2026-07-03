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
    'a, ab, b, c', 'classe a', 'classe b',
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
  ];

  // --- 1.15 SALUTATIONS / POLITESSE / SMALL TALK ---
  const kwSalutations = [
    'bonjour', 'bonsoir', 'salut', 'coucou', 'hello', 'hey', 'bjr', 'slt',
    'comment ça va', 'comment ca va', 'ça va', 'ca va', 'comment allez-vous',
    'comment allez vous',
  ];
  const kwRemerciements = [
    'merci', 'merci beaucoup', 'merci bien', 'je vous remercie', 'cool',
    'super', 'parfait', 'génial', 'genial', 'top', 'nickel',
  ];
  const kwAuRevoir = [
    'au revoir', 'a bientot', 'à bientôt', 'bye', 'bonne journée',
    'bonne journee', 'bonne soirée', 'bonne soiree', 'a plus', 'à plus',
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