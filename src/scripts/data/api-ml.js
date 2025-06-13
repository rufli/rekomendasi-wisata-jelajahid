import CONFIG from '../config.js';

// Function untuk mendapatkan rekomendasi
export async function getRecommendations(clusterId) {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/get-recommendations/${clusterId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });

    console.log('Status:', response.status);
    console.log('URL yang dipanggil:', url);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText.slice(0, 100)}`);
    }

    const json = await response.json();

    if (!json.recommendations) {
      console.log('Structure JSON yang diterima:', json);
      throw new Error('Response tidak mengandung field "recommendations"');
    }

    return json.recommendations;
  } catch (error) {
    console.error('❌ Gagal ambil rekomendasi:', error);
    throw error;
  }
}

// Function untuk generate itinerary
export async function generateItinerary(clusterId) {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/generate-itinerary/${clusterId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });

    console.log('Generate Itinerary Status:', response.status);
    console.log('URL yang dipanggil:', url);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText.slice(0, 100)}`);
    }

    const json = await response.json();
    console.log('✅ Data itinerary:', json);

    return json; // Return seluruh response karena struktur bisa bervariasi
  } catch (error) {
    console.error('❌ Gagal generate itinerary:', error);
    throw error;
  }
}

// Function untuk menambahkan rencana perjalanan ke backend
export async function addPlan(clusterId, itineraryData) {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/add-plan/${clusterId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      body: JSON.stringify(itineraryData)
    });

    console.log('Add Plan Status:', response.status);
    console.log('URL yang dipanggil:', url);
    console.log('Data itinerary yang dikirim:', itineraryData);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText.slice(0, 100)}`);
    }

    const json = await response.json();
    console.log('✅ Rencana berhasil ditambahkan:', json);

    return json;
  } catch (error) {
    console.error('❌ Gagal menambahkan rencana:', error);
    throw error;
  }
}

// Function untuk predict cluster berdasarkan input user
export async function predictCluster(userPreferences) {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/predict-cluster`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userPreferences)
    });

    console.log('Predict Cluster Status:', response.status);
    console.log('URL yang dipanggil:', url);
    console.log('Data yang dikirim:', userPreferences);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText.slice(0, 100)}`);
    }

    const json = await response.json();
    console.log('✅ Predicted cluster:', json);

    return json;
  } catch (error) {
    console.error('❌ Gagal predict cluster:', error);
    throw error;
  }
}