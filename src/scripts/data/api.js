
 import CONFIG from '../config';

const BASE_URL = CONFIG.BASE_URL;

const ENDPOINTS = {
  // Wisata
  TAMBAH_WISATA: `${BASE_URL}/wisata/tambah`,
  AMBIL_WISATA: `${BASE_URL}/wisata/ambil`,
  DETAIL_WISATA: (id) => `${BASE_URL}/wisata/detail/${id}`,
  UBAH_WISATA: (id) => `${BASE_URL}/wisata/edit/${id}`,
  HAPUS_WISATA: (id) => `${BASE_URL}/wisata/hapus/${id}`,
  AMBIL_WISATA_BY_KATEGORI: (kategoriId) => `${BASE_URL}/wisata/kategori/${kategoriId}`,

  // Kategori
  TAMBAH_KATEGORI: `${BASE_URL}/kategori/tambah`,
  AMBIL_KATEGORI: `${BASE_URL}/kategori/ambil`,

  // Rencana Perjalanan
  TAMBAH_RENCANA: `${BASE_URL}/rencana/tambah`,
  AMBIL_RENCANA: `${BASE_URL}/rencana/ambil`,
  EDIT_RENCANA: (id) => `${BASE_URL}/rencana/edit/${id}`,
  HAPUS_RENCANA: (id) => `${BASE_URL}/rencana/hapus/${id}`,
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true', // 🛡️ bypass header ngrok
};

// === Helper ===
async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! ${response.status} - ${text}`);
  }

  const text = await response.text();
  if (!text) return { success: false, message: 'Empty response' };

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    console.error('Raw response:', text);
    throw new Error('Invalid JSON response');
  }
}

// === Wisata ===
export async function tambahWisata(data) {
  try {
    const response = await fetch(ENDPOINTS.TAMBAH_WISATA, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error tambah wisata:', error);
    return { success: false, message: error.message };
  }
}

export async function ambilWisata() {
  try {
    const response = await fetch(ENDPOINTS.AMBIL_WISATA, { headers: DEFAULT_HEADERS });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error ambil wisata:', error);
    return { success: false, message: error.message };
  }
}

export async function detailWisata(id) {
  try {
    const response = await fetch(ENDPOINTS.DETAIL_WISATA(id), { headers: DEFAULT_HEADERS });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error detail wisata:', error);
    return { success: false, message: error.message };
  }
}

export async function ubahWisata(id, data) {
  try {
    const response = await fetch(ENDPOINTS.UBAH_WISATA(id), {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error ubah wisata:', error);
    return { success: false, message: error.message };
  }
}

export async function hapusWisata(id) {
  try {
    const response = await fetch(ENDPOINTS.HAPUS_WISATA(id), {
      method: 'DELETE',
      headers: DEFAULT_HEADERS,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error hapus wisata:', error);
    return { success: false, message: error.message };
  }
}

export async function ambilWisataByKategori(kategoriId) {
  try {
    const response = await fetch(ENDPOINTS.AMBIL_WISATA_BY_KATEGORI(kategoriId), {
      headers: DEFAULT_HEADERS,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error ambil wisata by kategori:', error);
    return { success: false, message: error.message };
  }
}

// === Kategori ===
export async function tambahKategori(data) {
  try {
    const response = await fetch(ENDPOINTS.TAMBAH_KATEGORI, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error tambah kategori:', error);
    return { success: false, message: error.message };
  }
}

export async function ambilKategori() {
  try {
    const response = await fetch(ENDPOINTS.AMBIL_KATEGORI, { headers: DEFAULT_HEADERS });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error ambil kategori:', error);
    return { success: false, message: error.message };
  }
}

// === Rencana Perjalanan ===
export async function tambahRencana(data) {
  try {
    const response = await fetch(ENDPOINTS.TAMBAH_RENCANA, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        wisataId: data.wisataId,
        tanggal: data.tanggal,
        jam: data.jam,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error tambah rencana:', error);
    return { success: false, message: error.message };
  }
}

export async function ambilRencana() {
  try {
    const response = await fetch(ENDPOINTS.AMBIL_RENCANA, { headers: DEFAULT_HEADERS });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error ambil rencana:', error);
    return { success: false, message: error.message };
  }
}

export async function editRencana(id, data) {
  try {
    const response = await fetch(ENDPOINTS.EDIT_RENCANA(id), {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error edit rencana:', error);
    return { success: false, message: error.message };
  }
}

export async function hapusRencana(id) {
  try {
    const response = await fetch(ENDPOINTS.HAPUS_RENCANA(id), {
      method: 'DELETE',
      headers: DEFAULT_HEADERS,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error hapus rencana:', error);
    return { success: false, message: error.message };
  }
}

// === Helper: Search Wisata ===
export async function searchWisata(query) {
  try {
    const response = await ambilWisata();
    if (response.success && response.data) {
      const results = response.data.wisata.filter((item) =>
        item.nama?.toLowerCase().includes(query.toLowerCase()) ||
        item.lokasi?.toLowerCase().includes(query.toLowerCase()) ||
        item.deskripsi?.toLowerCase().includes(query.toLowerCase())
      );
      return {
        success: true,
        data: results,
        message: `Found ${results.length} results for "${query}"`,
      };
    } else {
      return response;
    }
  } catch (error) {
    console.error('Error search wisata:', error);
    return { success: false, message: error.message };
  }
}
