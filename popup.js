const API_URL = 'https://app.flyballhub.com/api/v1/teams?limit=100';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const FLYBALL_HUB_URL = 'https://flyballhub.com';

let allTeams = [];

// DOM Elements
const locationBtn = document.getElementById('locationBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const teamsList = document.getElementById('teamsList');

// Event Listeners
locationBtn.addEventListener('click', handleLocationSearch);
searchBtn.addEventListener('click', handleTextSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleTextSearch();
});

// Fetch teams on popup open
fetchTeams();

async function fetchTeams() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch teams');
    const data = await response.json();
    allTeams = data.data || [];
  } catch (err) {
    showError('Unable to load teams. Please try again later.');
  }
}

async function handleLocationSearch() {
  showLoading();
  hideError();
  hideResults();

  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    hideLoading();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      displayTeamsByDistance(latitude, longitude);
    },
    (err) => {
      hideLoading();
      switch (err.code) {
        case err.PERMISSION_DENIED:
          showError('Location access denied. Please enable location permissions or search by postcode.');
          break;
        case err.POSITION_UNAVAILABLE:
          showError('Location unavailable. Please try searching by postcode.');
          break;
        case err.TIMEOUT:
          showError('Location request timed out. Please try again.');
          break;
        default:
          showError('Unable to get your location. Please try searching by postcode.');
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

async function handleTextSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    showError('Please enter a postcode or city name.');
    return;
  }

  showLoading();
  hideError();
  hideResults();

  try {
    const response = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'FlyballTeamFinder/1.0' } }
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();

    if (!data.length) {
      hideLoading();
      showError('Location not found. Please try a different search term.');
      return;
    }

    const { lat, lon } = data[0];
    displayTeamsByDistance(parseFloat(lat), parseFloat(lon));
  } catch (err) {
    hideLoading();
    showError('Unable to find that location. Please try again.');
  }
}

function displayTeamsByDistance(userLat, userLon) {
  if (!allTeams.length) {
    hideLoading();
    showError('No teams available. Please try again later.');
    return;
  }

  const teamsWithDistance = allTeams
    .filter(team => team.location_latitude && team.location_longitude)
    .map(team => ({
      ...team,
      distance: calculateDistance(
        userLat,
        userLon,
        team.location_latitude,
        team.location_longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6);

  if (!teamsWithDistance.length) {
    hideLoading();
    showError('No teams found with location data.');
    return;
  }

  renderTeams(teamsWithDistance);
  hideLoading();
  showResults();
}

function renderTeams(teams) {
  teamsList.innerHTML = teams.map(team => {
    const teamUrl = `${FLYBALL_HUB_URL}/teams/${team.slug}`;
    const logoHtml = team.logo_url
      ? `<img src="${team.logo_url}" alt="${team.name}" class="team-logo">`
      : `<div class="team-logo-placeholder">${team.name.charAt(0)}</div>`;

    const distanceText = formatDistance(team.distance);
    const location = team.location_name || team.country || 'Unknown location';

    return `
      <a href="${teamUrl}" target="_blank" rel="noopener" class="team-card">
        ${logoHtml}
        <div class="team-info">
          <div class="team-name">${escapeHtml(team.name)}</div>
          <div class="team-location">${escapeHtml(location)}</div>
        </div>
        <div class="team-distance">${distanceText}</div>
      </a>
    `;
  }).join('');
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  } else if (km < 10) {
    return `${km.toFixed(1)}km`;
  } else {
    return `${Math.round(km)}km`;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// UI Helpers
function showLoading() { loading.classList.remove('hidden'); }
function hideLoading() { loading.classList.add('hidden'); }
function showResults() { results.classList.remove('hidden'); }
function hideResults() { results.classList.add('hidden'); }
function showError(msg) { error.textContent = msg; error.classList.remove('hidden'); }
function hideError() { error.classList.add('hidden'); }
