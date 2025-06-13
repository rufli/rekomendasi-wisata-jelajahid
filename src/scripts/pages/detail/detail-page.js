/*export default class DetailPage {
  async render() {
    return `
      <div class="container detail-page-container">
        <div class="detail-header-info">
          <a href="#/" class="back-link">&#x2039; Kembali</a>
          <div class="breadcrumb">
            <span>Wisata</span> &gt; <span>Detail Wisata</span>
          </div>
        </div>

        <div class="main-detail-content">
          <div class="image-gallery">
            <img src="images/borobudur.jpg" alt="Raja Ampat" class="main-image"/>
            <div class="thumbnail-images">
              <img src="images/pantai kuta.jpg" alt="Thumbnail of Pantai Kuta"/>
              <img src="images/borobudur.jpg" alt="Thumbnail of Candi Borobudur"/>
              <img src="images/alam.jpg" alt="Thumbnail of Wisata Alam"/>
              <img src="images/hiburan.jpeg" alt="Thumbnail of Wisata Hiburan"/>
            </div>
          </div>

          <div class="destination-info">
            <h1>Raja Ampat</h1>
            <span class="category-tag">Wisata Alam</span>
            <p><i class="fas fa-map-marker-alt"></i> Jl. Raya Curug Putri No. 123, Desa Wisata Kecamatan Sejuk,Kabupaten Asri, Jawa Barat.</p>
            <p><i class="far fa-clock"></i> 07.00 - 17.00 WIB</p>
            <p><i class="fas fa-money-bill-wave"></i> Rp 25.000 / orang</p>
            <p><i class="fas fa-phone"></i> +62 812-3456-7890</p>
          </div>
        </div>

        <div class="description-section">
          <h2>Deskripsi</h2>
          <p>
            Kepulauan Raja Ampat adalah gugusan kepulauan yang berlokasi di barat bagian Semenanjung Kepala Burung (Vogelkoop) Pulau Papua. Scecara administrasi, gugusan ini berada di bawah Kabupaten Raja Ampat dan Kota Sorong, Provinsi Papua Barat Daya. Kepulauan ini sekarang menjadi tujuan para penyelam yang tertarik akan keindahan pemandangan bawah lautnya. Empat gugusan pulau utama yang anggotanya tersebar luas menurut empat penjuru terbesarnya, yaitu Pulau Waigeo, Pulau Misool, Pulau Salawati, dan Pulau Batanta. Perairan Kepulauan Raja Ampat memiliki sebaran 574 spesies terumbu karang dan 553 jenis ikan karang (bullseye) dan diketahui sebagai kawasan laut terkaya dengan keanekaragaman hayati tertinggi di dunia.
          </p>
        </div>

        <div class="location-section">
          <h2>Lokasi</h2>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.9411544571416!2d110.2036845147777!3d-7.607745894509614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af1fcf17e4045%3A0x72891f11b030c3b!2sCandi%20Borobudur!5e0!3m2!1sen!2sid!4v1678451124385!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

      </div>
    `;
  }

  async afterRender() {
    // Get the back link element
    const backLink = document.querySelector('.back-link');

    // Add a click event listener
    backLink.addEventListener('click', (event) => {
      // Prevent the default link behavior
      event.preventDefault();

      // Navigate back to the previous page
      history.back();
    });
  }
} 
*/
import { detailWisata } from '../../data/api';

export default class DetailPage {
  async render() {
    return `
      <div class="container detail-page-container">
        <div class="detail-header-info">
          <a href="#" class="back-link">&#x2039; Kembali</a>
          <div class="breadcrumb">
            <span>Wisata</span> &gt; <span>Detail Wisata</span>
          </div>
        </div>

        <div class="main-detail-content">
          <div class="image-gallery">
            <img id="mainImage" src="images/default.jpg" alt="Wisata" class="main-image"/>
            <div class="thumbnail-images" id="thumbnailContainer">
              <!-- Thumbnail images will be inserted here -->
            </div>
          </div>

          <div class="destination-info">
            <h1 id="wisataNama">Nama Wisata</h1>
            <span class="category-tag" id="wisataKategori">Kategori</span>
            <p><i class="fas fa-map-marker-alt"></i> <span id="wisataLokasi">Lokasi</span></p>
            <p><i class="far fa-clock"></i> <span id="wisataJam">Jam Operasional</span></p>
            <p><i class="fas fa-money-bill-wave"></i> <span id="wisataHarga">Harga</span></p>
            <p><i class="fas fa-phone"></i> <span id="wisataKontak">Kontak</span></p>
          </div>
        </div>

        <div class="description-section">
          <h2>Deskripsi</h2>
          <p id="wisataDeskripsi">Deskripsi wisata akan muncul di sini.</p>
        </div>

        <div class="location-section">
          <h2>Lokasi</h2>
          <iframe id="wisataMap" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>
    `;
  }

  async afterRender() {
  // Ambil ID wisata dari URL
  const urlHash = window.location.hash;
  const wisataId = urlHash.split('/')[2]; // Ambil ID dari URL

  console.log('ID wisata dari URL:', wisataId); // Debugging

  if (!wisataId) {
    document.querySelector('.detail-page-container').innerHTML = `<p>Wisata tidak ditemukan.</p>`;
    return;
  }

  try {
    // Ambil data detail wisata dari API
    const response = await detailWisata(wisataId);
    console.log('Response dari API:', response); // Debugging

   if (response.status === 'success' && response.data && response.data.wisata) {
  this.updateDetailPage(response.data.wisata);

    } else {
      document.querySelector('.detail-page-container').innerHTML = `<p>Wisata tidak ditemukan.</p>`;
    }
  } catch (error) {
    console.error('Error mengambil detail wisata:', error);
    document.querySelector('.detail-page-container').innerHTML = `<p>Terjadi kesalahan saat mengambil data wisata.</p>`;
  }


    // Event listener untuk tombol kembali
    const backLink = document.querySelector('.back-link');
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      history.back();
    });
  }

 updateDetailPage(wisata) {
  console.log('Data wisata yang diterima setelah perbaikan:', wisata); // Debugging

  // Pastikan elemen ada sebelum mengaksesnya
  const namaElement = document.getElementById('wisataNama');
  const kategoriElement = document.getElementById('wisataKategori');
  const lokasiElement = document.getElementById('wisataLokasi');
  const jamElement = document.getElementById('wisataJam');
  const hargaElement = document.getElementById('wisataHarga');
  const kontakElement = document.getElementById('wisataKontak');
  const deskripsiElement = document.getElementById('wisataDeskripsi');
  const mainImageElement = document.getElementById('mainImage');
  const thumbnailContainer = document.getElementById('thumbnailContainer');
  const mapElement = document.getElementById('wisataMap');

  if (namaElement) namaElement.textContent = wisata.nama || 'Tidak tersedia';
  if (kategoriElement) kategoriElement.textContent = wisata.kategori || 'Tidak tersedia';
  if (lokasiElement) lokasiElement.textContent = wisata.lokasi || 'Tidak tersedia';
  if (jamElement) jamElement.textContent = wisata.jam_operasional || 'Tidak tersedia';
  if (hargaElement) hargaElement.textContent = wisata.harga || 'Tidak tersedia';
  if (kontakElement) kontakElement.textContent = wisata.kontak || 'Tidak tersedia';
  if (deskripsiElement) deskripsiElement.textContent = wisata.deskripsi || 'Tidak tersedia';

  // Update gambar utama jika tersedia
  if (mainImageElement) mainImageElement.src = wisata.image || 'images/default.jpg';

  // Cek apakah thumbnail_images ada sebelum memanggil map()
  if (thumbnailContainer && wisata.thumbnail_images && Array.isArray(wisata.thumbnail_images)) {
    thumbnailContainer.innerHTML = wisata.thumbnail_images.map(img => `
      <img src="${img}" alt="Thumbnail of ${wisata.nama}"/>
    `).join('');
  } else {
    console.warn('thumbnail_images tidak ditemukan atau bukan array:', wisata.thumbnail_images);
  }

  // Update lokasi Google Maps jika tersedia
  if (mapElement) mapElement.src = wisata.map_url || 'https://www.google.com/maps';
}
}