import { getRecommendations } from '../../data/api-ml.js'; 

class RekomendasiPage {
  // Data internal untuk menyimpan rekomendasi asli dan yang sudah difilter
  _originalRecommendations = [];
  _filteredRecommendations = [];

  async render() {
    return `
      <section class="page-container">
        <aside class="filter-panel">
          <h3>Filter Lokasi</h3>
          <div class="filter-group">
            <label for="city-filter">Semua Kota</label>
            <select id="city-filter">
              <option value="">Semua Kota</option>
              </select>
          </div>
          <div class="filter-group">
            <label for="category-filter">Semua Kategori</label>
            <select id="category-filter">
              <option value="">Semua Kategori</option>
              </select>
          </div>
          <div class="filter-group">
            <label for="sort-filter">Urutkan</label>
            <select id="sort-filter">
              <option value="popularity">Paling Populer</option>
              <option value="rating-desc">Rating Tertinggi</option>
              <option value="rating-asc">Rating Terendah</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="price-desc">Harga Termahal</option>
              <option value="name-asc">Nama (A-Z)</option>
              <option value="name-desc">Nama (Z-A)</option>
            </select>
          </div>
          <button id="apply-filter-button">Cari</button>
        </aside>

        <main class="content-area">
          <h2 id="content-title">Wisata Semua Wisata</h2>
          <div id="rekomendasi-list"></div>
        </main>
      </section>
    `;
  }

  async afterRender() {
    const recommendationListContainer = document.querySelector('#rekomendasi-list');
    const cityFilter = document.querySelector('#city-filter');
    const categoryFilter = document.querySelector('#category-filter');
    const sortFilter = document.querySelector('#sort-filter');
    const applyFilterButton = document.querySelector('#apply-filter-button');
    const contentTitle = document.querySelector('#content-title');

    // Initial loading state
    this._renderRecommendations(recommendationListContainer, []); // Clear previous content
    recommendationListContainer.innerHTML = `
      <div class="loading-message">
        <span class="spinner"></span> Memuat rekomendasi wisata terbaik untuk Anda...
      </div>
    `;

    try {
      // Fetch all recommendations initially (assuming getRecommendations can fetch all or a large set)
      // If getRecommendations only fetches based on clusterId, you might need a different API for all data
      // For now, let's assume getRecommendations(null) or getRecommendations() gets all if clusterId is not relevant for initial fetch
      const clusterId = 2; // Keep it if it's for personalization after initial load, or make it dynamic
      const allItems = await getRecommendations(clusterId);
      console.log('✅ Data rekomendasi asli:', allItems);

      if (!allItems || !allItems.length) {
        recommendationListContainer.innerHTML = '<p class="no-recommendations-found">Tidak ada rekomendasi ditemukan saat ini.</p>';
        return;
      }

      this._originalRecommendations = allItems;
      this._populateFilters(allItems); // Populate filter options
      this._applyFiltersAndRender(); // Apply initial filters (none) and render

      // Add event listeners for filters
      applyFilterButton.addEventListener('click', () => this._applyFiltersAndRender());
      // Optional: Add change listeners for live filtering (without button click)
      // cityFilter.addEventListener('change', () => this._applyFiltersAndRender());
      // categoryFilter.addEventListener('change', () => this._applyFiltersAndRender());
      // sortFilter.addEventListener('change', () => this._applyFiltersAndRender());

    } catch (error) {
      console.error('Error detail:', error);

      let errorMessage = 'Terjadi kesalahan saat memuat data rekomendasi.';
      if (error.message.includes('JSON')) {
        errorMessage = 'Server tidak mengembalikan data yang valid. Silakan coba lagi nanti.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Koneksi ke server gagal. Pastikan Anda terhubung ke internet dan coba lagi.';
      } else if (error.message.includes('HTTP error! status')) {
        errorMessage = `Terjadi kesalahan pada server (Status: ${error.message.split('status ')[1]}). Mohon hubungi administrator.`;
      }

      recommendationListContainer.innerHTML = `
        <div class="error-message">
          <h4><i class="fas fa-exclamation-circle"></i> Ups, ada masalah!</h4>
          <p>${errorMessage}</p>
          <details>
            <summary>Detail Teknis (untuk Developer)</summary>
            <pre>${error.message}\n${error.stack || ''}</pre>
          </details>
        </div>
      `;
    }
  }

  // Method untuk mengisi dropdown filter
  _populateFilters(items) {
    const cityFilter = document.querySelector('#city-filter');
    const categoryFilter = document.querySelector('#category-filter');

    const uniqueCities = [...new Set(items.map(item => item.City).filter(Boolean))].sort();
    const uniqueCategories = [...new Set(items.map(item => item.Category).filter(Boolean))].sort();

    cityFilter.innerHTML = '<option value="">Semua Kota</option>' +
      uniqueCities.map(city => `<option value="${city}">${city}</option>`).join('');

    categoryFilter.innerHTML = '<option value="">Semua Kategori</option>' +
      uniqueCategories.map(category => `<option value="${category}">${category}</option>`).join('');
  }

  // Method untuk mengaplikasikan filter dan merender ulang tampilan
  _applyFiltersAndRender() {
    const cityFilter = document.querySelector('#city-filter');
    const categoryFilter = document.querySelector('#category-filter');
    const sortFilter = document.querySelector('#sort-filter');
    const recommendationListContainer = document.querySelector('#rekomendasi-list');
    const contentTitle = document.querySelector('#content-title');

    const selectedCity = cityFilter.value;
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    let currentFilteredItems = [...this._originalRecommendations];

    // Filter by City
    if (selectedCity) {
      currentFilteredItems = currentFilteredItems.filter(item => item.City === selectedCity);
    }

    // Filter by Category
    if (selectedCategory) {
      currentFilteredItems = currentFilteredItems.filter(item => item.Category === selectedCategory);
    }

    // Sort
    currentFilteredItems.sort((a, b) => {
      switch (selectedSort) {
        case 'popularity':
            // Asumsi ada 'Popularity_Score' atau 'Rating' bisa digunakan sebagai proxy
            // Jika tidak ada data popularitas, bisa disamakan dengan rating desc
            const popularityA = a.Rating || 0; // Menggunakan rating sebagai proxy
            const popularityB = b.Rating || 0;
            return popularityB - popularityA; // Descending
        case 'rating-desc':
          return (b.Rating || 0) - (a.Rating || 0);
        case 'rating-asc':
          return (a.Rating || 0) - (b.Rating || 0);
        case 'price-asc':
          const priceA = a.Price || Infinity; // Treat 'Harga tidak tersedia' as very expensive
          const priceB = b.Price || Infinity;
          return priceA - priceB;
        case 'price-desc':
          const priceADesc = a.Price || -Infinity; // Treat 'Harga tidak tersedia' as very cheap
          const priceBDesc = b.Price || -Infinity;
          return priceBDesc - priceADesc;
        case 'name-asc':
          return (a.Place_Name || '').localeCompare(b.Place_Name || '');
        case 'name-desc':
          return (b.Place_Name || '').localeCompare(a.Place_Name || '');
        default:
          return 0;
      }
    });

    this._filteredRecommendations = currentFilteredItems;
    this._renderRecommendations(recommendationListContainer, this._filteredRecommendations);

    // Update content title based on filters
    let titleText = 'Wisata ';
    if (selectedCity && selectedCategory) {
        titleText += `${selectedCategory} di ${selectedCity}`;
    } else if (selectedCity) {
        titleText += `di ${selectedCity}`;
    } else if (selectedCategory) {
        titleText += `${selectedCategory}`;
    } else {
        titleText += 'Semua Wisata';
    }
    contentTitle.textContent = titleText;
  }

  // Method untuk merender list rekomendasi ke DOM
  _renderRecommendations(container, items) {
    if (!items || items.length === 0) {
      container.innerHTML = '<p class="no-recommendations-found">Tidak ada wisata yang ditemukan dengan filter ini.</p>';
      return;
    }

    container.innerHTML = `
      <div class="recommendations-grid">
        ${items.map(item => `
          <div class="recommendation-card">
            <div class="card-header">
              <h3>${item.Place_Name || 'Nama Tidak Tersedia'}</h3>
              ${item.City ? `<p class="city"><i class="fas fa-map-marker-alt"></i> ${item.City}</p>` : ''}
            </div>
            <div class="card-content">
              <p><i class="fas fa-tag"></i> Kategori: <strong>${item.Category || 'N/A'}</strong></p>
              <p><i class="fas fa-star"></i> Rating: <strong>${item.Rating || 'N/A'}</strong></p>
            </div>
            <div class="card-footer">
              <span class="price"><i class="fas fa-money-bill-wave"></i> ${item.Price ? `Rp${item.Price.toLocaleString('id-ID')}` : 'Harga tidak tersedia'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

export default RekomendasiPage;