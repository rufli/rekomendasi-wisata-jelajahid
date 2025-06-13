/*import { ambilWisataByKategori } from '../../data/api';

export default class AlamPage {
  async render() {
    return `
      <section class="container">
        <div class="section-wrapper section-header-wrapper">
          <h2>Wisata Alam</h2>
          <div class="search-bar">
            <input type="text" id="searchInput" placeholder="Cari wisata...">
            <button class="search-button" id="searchButton"><i class="fas fa-search"></i></button>
          </div>
        </div>

        <div class="section-wrapper">
          <div class="rekomendasi-populer-grid" id="wisataList">
            <!-- Data wisata akan dimasukkan di sini -->
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
  const wisataListContainer = document.getElementById('wisataList');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  try {
    // Ambil data wisata berdasarkan kategori "Alam" (kategoriId = 1)
    const response = await ambilWisataByKategori(1);
    console.log('Response dari API:', response); // Debugging

    // Perbaiki cara membaca response
    if (response.status === 'success' && response.data && response.data.wisata.length > 0) {
      this.renderWisataList(response.data.wisata, wisataListContainer);
    } else {
      wisataListContainer.innerHTML = `<p>Tidak ada wisata yang ditemukan.</p>`;
    }
  } catch (error) {
    console.error('Error mengambil data wisata:', error);
    wisataListContainer.innerHTML = `<p>Terjadi kesalahan saat mengambil data wisata.</p>`;
  }

  // Event listener untuk pencarian wisata
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      const response = await ambilWisataByKategori(1);
      if (response.status === 'success' && response.data && response.data.wisata.length > 0) {
        const filteredWisata = response.data.wisata.filter(wisata =>
          wisata.nama.toLowerCase().includes(query) ||
          wisata.lokasi.toLowerCase().includes(query) ||
          wisata.deskripsi.toLowerCase().includes(query)
        );
        this.renderWisataList(filteredWisata, wisataListContainer);
      }
    }
  });
}
renderWisataList(wisataData, container) {
  console.log('Data wisata yang akan ditampilkan:', wisataData); // Debugging

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
}*/
import KategoriPage from '../kategori/kategori-page';

export default new KategoriPage(1, 'Alam');