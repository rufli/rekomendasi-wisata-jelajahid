/*export default class BelanjaPage {
    async render() {
        return `
      <section class="container">
        
        <div class="section-wrapper section-header-wrapper">
          <h2>Wisata Belanja</h2>
          <div class="search-bar">
            <input type="text" placeholder="Cari wisata...">
            <button class="search-button"><i class="fas fa-search"></i></button>
          </div>
        </div>

        <div class="section-wrapper">
          <div class="rekomendasi-populer-grid">
            <!-- Item list will go here -->
            <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/hiburan.jpeg" alt="Example Image">
              </div>
              <div class="rekomendasi-info">
                <h3>Taman Hiburan A</h3>
                <p>Jakarta</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
             <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/hiburan.jpeg" alt="Example Image">
              </div>
              <div class="rekomendasi-info">
                <h3>Waterpark Seru</h3>
                <p>Surabaya</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
             <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/hiburan.jpeg" alt="Example Image">
              </div>
              <div class="rekomendasi-info">
                <h3>Arena Bermain Kota</h3>
                <p>Bandung</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
             <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/hiburan.jpeg" alt="Example Image">
              </div>
              <div class="rekomendasi-info">
                <h3>Pusat Rekreasi Keluarga</h3>
                <p>Yogyakarta</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
             <div class="rekomendasi-item">
              <div class="rekomendasi-image">
                <img src="images/hiburan.jpeg" alt="Example Image">
              </div>
              <div class="rekomendasi-info">
                <h3>Bioskop Modern</h3>
                <p>Semarang</p>
                <a href="#/detail" class="lihat-detail-btn">Lihat Detail</a>
              </div>
            </div>
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
import KategoriPage from '../kategori/kategori-page';

export default new KategoriPage(5, 'Belanja');