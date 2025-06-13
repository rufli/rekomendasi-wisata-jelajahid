/*export default class AboutPage {
  async render() {
    return `
      <section class="container category-page-container">
        <div class="main-content">
          <div class="filter-section">
            <h2>Filter Lokasi</h2>
            <div class="filter-dropdown">
              <label for="kota">Semua Kota</label>
              <select id="kota">
                <option value="">Semua Kota</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <label for="kategori">Semua Kategori</label>
              <select id="kategori">
                <option value="">Semua Kategori</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <label for="urutkan">Urutkan</label>
              <select id="urutkan">
                <option value="populer">Paling Populer</option>
              </select>
            </div>
            <button class="search-button">Cari</button>
          </div>
          
          <div class="section-wrapper">
          <h2>Rekomendasi Populer</h2>
          <div class="rekomendasi-populer-grid">
            <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/alam.jpg" alt="Gunung Bromo">
              </div>
              <div class="rekomendasi-info">
                <h3>Gunung Bromo</h3>
                <p>Jawa Timur</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
            <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/raja ampat.jpg" alt="Raja Ampat">
              </div>
              <div class="rekomendasi-info">
                <h3>Raja Ampat</h3>
                <p>Papua Barat</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
            <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/pantai kuta.jpg" alt="Pantai Kuta">
              </div>
              <div class="rekomendasi-info">
                <h3>Pantai Kuta</h3>
                <p>Bali</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
            <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/borobudur.jpg" alt="Candi Borobudur">
              </div>
              <div class="rekomendasi-info">
                <h3>Candi Borobudur</h3>
                <p>Jawa Tengah</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
          </div>
        </div>

        <div class="category-content">
          <!-- Content for the category listing will go here -->
        </div>
      </div>
    </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
*/

import { ambilWisata, ambilWisataByKategori } from '../../data/api';

export default class KategoriPage {
  constructor(kategoriId = null, kategoriNama = 'Semua Wisata', showFilter = false) {
    this.kategoriId = kategoriId;
    this.kategoriNama = kategoriNama;
    this.showFilter = showFilter;
  }

  async render() {
    return `
      <section class="container category-page-container">
        <div class="main-content">
          ${this.showFilter ? `
          <div class="filter-section">
            <h2>Filter Lokasi</h2>
            <div class="filter-dropdown">
              <label for="kota">Semua Kota</label>
              <select id="kota">
                <option value="">Semua Kota</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <label for="kategori">Semua Kategori</label>
              <select id="kategori">
                <option value="">Semua Kategori</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <label for="urutkan">Urutkan</label>
              <select id="urutkan">
                <option value="populer">Paling Populer</option>
              </select>
            </div>
            <button class="search-button" id="filterButton">Cari</button>
          </div>
          ` : ''}
          
          <div class="section-wrapper">
            <h2>Wisata ${this.kategoriNama}</h2>
            <div class="rekomendasi-populer-grid" id="wisataList">
              <!-- Data wisata akan dimasukkan di sini -->
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const wisataListContainer = document.getElementById('wisataList');

    try {
      let response;
      if (this.kategoriId) {
        response = await ambilWisataByKategori(this.kategoriId);
      } else {
        response = await ambilWisata(); // Ambil semua wisata jika kategoriId tidak ada
      }

      console.log(`Response dari API untuk ${this.kategoriNama}:`, response);

      if (response.status === 'success' && response.data && response.data.wisata.length > 0) {
        this.renderWisataList(response.data.wisata, wisataListContainer);
      } else {
        wisataListContainer.innerHTML = `<p>Tidak ada wisata yang ditemukan.</p>`;
      }
    } catch (error) {
      console.error(`Error mengambil data wisata ${this.kategoriNama}:`, error);
      wisataListContainer.innerHTML = `<p>Terjadi kesalahan saat mengambil data wisata.</p>`;
    }

    // Event listener untuk filter (hanya jika filter ditampilkan)
    if (this.showFilter) {
      const filterButton = document.getElementById('filterButton');
      filterButton.addEventListener('click', async () => {
        const kota = document.getElementById('kota').value;
        const kategori = document.getElementById('kategori').value;
        const urutkan = document.getElementById('urutkan').value;

        console.log(`Filter: Kota=${kota}, Kategori=${kategori}, Urutkan=${urutkan}`);

        let response = await ambilWisata();
        if (response.status === 'success' && response.data && response.data.wisata.length > 0) {
          let filteredWisata = response.data.wisata;

          if (kota) {
            filteredWisata = filteredWisata.filter(wisata => wisata.lokasi.toLowerCase().includes(kota.toLowerCase()));
          }

          if (kategori) {
            filteredWisata = filteredWisata.filter(wisata => wisata.kategori.toLowerCase().includes(kategori.toLowerCase()));
          }

          if (urutkan === 'populer') {
            filteredWisata = filteredWisata.sort((a, b) => b.popularitas - a.popularitas);
          }

          this.renderWisataList(filteredWisata, wisataListContainer);
        }
      });
    }
  }

  renderWisataList(wisataData, container) {
    console.log(`Data wisata yang akan ditampilkan untuk ${this.kategoriNama}:`, wisataData);

    if (!wisataData || wisataData.length === 0) {
      container.innerHTML = `<p>Tidak ada wisata yang ditemukan.</p>`;
      return;
    }

    container.innerHTML = wisataData.map(wisata => `
  <div class="rekomendasi-item">
    <div class="rekomendasi-image">
      <img src="${wisata.image || 'images/default.jpg'}" alt="${wisata.nama}">
    </div>
    <div class="rekomendasi-info">
      <h3>${wisata.nama}</h3>
      <p>${wisata.lokasi}</p>
      <a href="#/detail/${wisata.id}" class="lihat-detail-btn">Lihat Detail</a>
    </div>
  </div>
`).join('');
  }
}