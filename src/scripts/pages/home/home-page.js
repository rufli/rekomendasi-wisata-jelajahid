export default class HomePage {
  async render() {
    return `

      <section class="homepage-container">
        <div class="hero">
          <img src="images/nature.jpg" alt="nature" class="hero-image" />
          <div class="hero-content">
            <h1>Selamat Datang di Jelajah.ID</h1>
            <p>Rencanakan Wisatamu dengan Mudah!</p>
          </div>
        </div>
        
        
        <div class="section-wrapper">
          <h2>Kategori Wisata</h2>
          <div class="kategori-wisata-grid">
            <a class="kategori-card" style="background-image: url('images/alam.jpg')">
              <span>Wisata Alam</span>
            </a>
            <a class="kategori-card" style="background-image: url('images/sejarah.jpeg')">
              <span>Wisata Sejarah</span>
            </a>
            <a class="kategori-card" style="background-image: url('images/hiburan.jpeg')">
              <span>Wisata Hiburan</span>
            </a>
            <a class="kategori-card" style="background-image: url('images/religi.jpeg')">
              <span>Wisata Religi</span>
            </a>
            <a class="kategori-card" style="background-image: url('images/belanja.jpeg')">
              <span>Wisata Belanja</span>
            </a>
            <a class="kategori-card" style="background-image: url('images/bahari.jpeg')">
              <span>Wisata Bahari</span>
            </a>
          </div>
        </div>
      </section>

      

      
    `;
  }

  async afterRender() {
    // Do your job here
  }
}