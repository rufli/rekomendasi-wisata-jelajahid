import CONFIG from '../config.js';

// ✅ GET - Rekomendasi dari cluster tertentu
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

// ✅ GET - Generate itinerary otomatis dari cluster tertentu
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

    return json;
  } catch (error) {
    console.error('❌ Gagal generate itinerary:', error);
    throw error;
  }
}

// ✅ POST - Tambahkan rencana perjalanan baru ke cluster
export async function addPlan(clusterId, itineraryData) {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/add-plan/${clusterId}`;

  try {
    const requestData = {
      cluster_id: clusterId,
      name: itineraryData.name,
      description: itineraryData.description,
      days: itineraryData.days,
      places: itineraryData.places || []
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('Add Plan Status:', response.status);
    console.log('URL yang dipanggil:', url);
    console.log('Data itinerary yang dikirim:', requestData);

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

// ✅ POST - Prediksi cluster berdasarkan input pengguna
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

// ✅ GET - Ambil semua rencana yang sudah ditambahkan

// ✅ GET - Get all added plans
export async function getAllPlans() {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/get-added-plans`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    return json.plans || []; // Return the array of plans directly
  } catch (error) {
    console.error('Failed to get all plans:', error);
    throw error;
  }
}

// ✅ GET - Ambil semua rencana dari cluster tertentu
export async function getPlansByCluster(clusterId) {
  const BASE = CONFIG.ML_BASE_URL;
  const url = `${BASE}/plans/${clusterId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });

    console.log('Get Plans by Cluster Status:', response.status);
    console.log('URL yang dipanggil:', url);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText.slice(0, 100)}`);
    }

    const json = await response.json();
    console.log(`✅ Rencana dari cluster ${clusterId} diambil:`, json);

    return json.plans || [];
  } catch (error) {
    console.error(`❌ Gagal ambil rencana dari cluster ${clusterId}:`, error);
    throw error;
  }
}