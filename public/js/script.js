/** **********************************************************
 * INITIALISATION DE LA MAP + MARQUEUR
 *********************************************************** */
const map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Coordonnées de départ
let lat = 48.8566;
let lon = 2.3522;

// Marqueur draggable
const marker = L.marker([lat, lon], { draggable: true }).addTo(map);

/**
 * Met à jour les coordonnées lat/lon
 * @param {*} e - Événement Leaflet contenant latlng
 */
function updateCoords(e) {
  const pos = e.latlng || marker.getLatLng();
  lat = pos.lat;
  lon = pos.lng;
}

// Mise à jour après déplacement du marqueur ou clic sur la map
map.on('click', e => {
  marker.setLatLng(e.latlng);
  updateCoords(e);
});
marker.on('dragend', updateCoords);

/** **********************************************************
 * AUTOCOMPLETE AVEC API /search (Nominatim backend)
 *********************************************************** */
const addressInput = document.getElementById('address');
const autocompleteDiv = document.getElementById('autocomplete');
let timeout = null;

addressInput.addEventListener('input', () => {
  const query = addressInput.value;

  // Reset quand input vide
  if (!query.trim()) {
    autocompleteDiv.innerHTML = '';
    return;
  }

  // Debounce 300ms
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      autocompleteDiv.innerHTML = '';
      if (!data || data.length === 0) return;

      // Normalisation pour éviter data = object
      const results = Array.isArray(data) ? data : [data];

      // Construction des suggestions
      results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-suggestion';
        div.textContent = item.name;

        div.addEventListener('click', () => {
          addressInput.value = item.name;

          lat = item.lat;
          lon = item.lon;

          marker.setLatLng([lat, lon]);
          map.setView([lat, lon], 13);

          autocompleteDiv.innerHTML = '';
        });

        autocompleteDiv.appendChild(div);
      });
    } catch (err) {
      console.error('Erreur autocomplete:', err);
    }
  }, 300);
});

/** **********************************************************
 * CAMERA + SELFIE + UPLOAD
 *********************************************************** */
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snap');
const selfiePreview = document.getElementById('selfiePreview');
const deletePhoto = document.getElementById('deletePhoto');

const cameraContainer = document.getElementById('cameraContainer');
const uploadContainer = document.getElementById('uploadContainer');
const photoContainer = document.getElementById('photoContainer');

const selfieBtn = document.getElementById('selfieBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

let cameraStream = null;

// Active la caméra au démarrage
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    cameraStream = stream;
  })
  .catch(err => console.error('Erreur caméra:', err));

/**
 * Basculer vers mode selfie
 */
selfieBtn.addEventListener('click', () => {
  selfieBtn.classList.add('active');
  uploadBtn.classList.remove('active');

  cameraContainer.classList.remove('d-none');
  uploadContainer.classList.add('d-none');
  photoContainer.classList.add('d-none');

  // Réactiver la caméra si elle était arrêtée
  if (!cameraStream) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        cameraStream = stream;
      })
      .catch(err => console.error('Erreur caméra:', err));
  }
});

/**
 * Basculer vers mode upload
 */
uploadBtn.addEventListener('click', () => {
  uploadBtn.classList.add('active');
  selfieBtn.classList.remove('active');

  uploadContainer.classList.remove('d-none');
  cameraContainer.classList.add('d-none');
  photoContainer.classList.add('d-none');
});

/**
 * Capture une photo depuis la cam
 */
snapBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  // Conversion en Base64
  selfiePreview.src = canvas.toDataURL('image/png');

  // Switch vue
  cameraContainer.classList.add('d-none');
  photoContainer.classList.remove('d-none');
});

/**
 * Gère l'upload de fichier
 */
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = event => {
      selfiePreview.src = event.target.result;
      uploadContainer.classList.add('d-none');
      photoContainer.classList.remove('d-none');
    };

    reader.readAsDataURL(file);
  }
});

/**
 * Supprime la photo et réactive le mode actuel
 */
deletePhoto.addEventListener('click', () => {
  selfiePreview.src = '';
  fileInput.value = '';
  photoContainer.classList.add('d-none');

  // Réafficher le mode actif
  if (selfieBtn.classList.contains('active')) {
    cameraContainer.classList.remove('d-none');
  } else {
    uploadContainer.classList.remove('d-none');
  }
});

/** **********************************************************
 * SOUMISSION FORMULAIRE
 *********************************************************** */
document.getElementById('moodForm').addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    text: document.getElementById('text').value,
    rating: Number(document.getElementById('rating').value),
    address: document.getElementById('address').value,
    lat,
    lon,
    imageUrl: selfiePreview.src || null,
  };

  try {
    const res = await fetch('/api/moods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log('result', result);

    showModal(result); // ← affichage modal
    document.getElementById('moodForm').reset();
    selfiePreview.src = '';
  } catch (err) {
    console.error('Erreur POST /moods:', err);
    alert('Erreur lors de l’enregistrement.');
  }
});

/** **********************************************************
 * MODAL BOOTSTRAP (résultat)
 *********************************************************** */
const feedbackModalEl = document.getElementById('feedbackModal');
const feedbackModal = new bootstrap.Modal(feedbackModalEl);
const modalBody = document.getElementById('modalBody');

/**
 * Affiche les résultats dans le modal
 * @param {*} mood - Objet renvoyé par backend
 */
function showModal(mood) {
  const score = mood.scoreResult ?? 'N/A';
  const { weather } = mood;

  const weatherHTML = weather
    ? `<ul>
         <li>Température : ${weather.temp ?? 'N/A'} °C</li>
         <li>Humidité : ${weather.humidity ?? 'N/A'} %</li>
         <li>Conditions : ${weather.weather ?? 'N/A'}</li>
         <li>Vent : ${weather.wind_speed ?? 'N/A'} m/s</li>
       </ul>`
    : 'Pas de météo disponible';

  const imgHTML = mood.imageUrl
    ? `<img src="${mood.imageUrl.replace(/\\/g, '/')}" class="img-fluid rounded mt-2" alt="Selfie">`
    : '';

  modalBody.innerHTML = `
    <p><strong>Humeur :</strong> ${mood.text}</p>
    <p><strong>Note :</strong> ${mood.rating}</p>
    <p><strong>Score :</strong> ${score}%</p>
    <p><strong>Adresse :</strong> ${mood.place?.name || mood.address || 'N/A'}</p>
    <h6><strong>Météo :</strong></h6>
    ${weatherHTML}
    ${imgHTML}
  `;

  // Stocker les données pour l'export
  feedbackModal._currentMoodData = mood;

  feedbackModal.show();
}

/** **********************************************************
 * EXPORT EN FICHIER TEXTE
 *********************************************************** */
const exportBtn = document.getElementById('exportBtn');

exportBtn.addEventListener('click', () => {
  const mood = feedbackModal._currentMoodData;
  if (!mood) return;

  // Construire le contenu du fichier texte
  const content = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult ?? 'N/A'}%

LOCALISATION
------------
Adresse : ${mood.place?.name || mood.address || 'N/A'}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
${
  mood.weather
    ? `Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s`
    : 'Pas de données météo disponibles'
}

==============================================
`;

  // Créer un blob et télécharger le fichier
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `humeur_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
