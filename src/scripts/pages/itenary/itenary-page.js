import { ambilWisata, ambilRencana, tambahRencana, hapusRencana } from '../../data/api';

export default class ItenaryPage {
  async render() {
    return `
      <section class="container">
        <div class="itenary-header">
          <h2>Rencana Perjalanan</h2>
          <button class="tambah-rencana-btn">+ Tambah Rencana</button>
        </div>

        <div class="itenary-list">
          <div class="list-header">
            <div class="col">NO</div>
            <div class="col">Wisata</div>
            <div class="col">Tanggal</div>
            <div class="col">Jam</div>
            <div class="col">Aksi</div>
          </div>
          <div id="rencanaContainer">
            <!-- Data rencana perjalanan akan dimasukkan di sini -->
          </div>
        </div>
      </section>

      <!-- Modal Structure -->
      <div class="modal-overlay">
        <div class="modal-content">
          <span class="close-button">&times;</span>
          <h2>Buat Rencana Perjalanan Baru</h2>
          <div class="modal-form">
            <div class="form-group">
              <label for="wisataNama">Nama Wisata</label>
              <select id="wisataNama">
                <option value="">Pilih Wisata</option>
              </select>
            </div>
            <div class="form-group">
              <label for="tanggal">Tanggal</label>
              <input type="date" id="tanggal">
            </div>
            <div class="form-group">
              <label for="jam">Jam</label>
              <input type="time" id="jam">
            </div>
          </div>
          <button class="tambah-list-btn">Tambah ke List Rencana</button>
        </div>
      </div>
    `;
  }

  async afterRender() {
    await this.loadRencanaData();
    await this.loadWisataOptions();
    this.setupModalEvents();
  }

  async loadRencanaData() {
    const rencanaContainer = document.getElementById('rencanaContainer');

    if (!rencanaContainer) {
      console.error('Element rencanaContainer tidak ditemukan!');
      return;
    }

    try {
      console.log('Memuat data rencana perjalanan...'); // Debugging
      const response = await ambilRencana();
      console.log('Response dari API ambilRencana:', response); // Debugging

      if (response.success && response.data && response.data.rencana) {
        if (response.data.rencana.length > 0) {
          this.renderRencanaList(response.data.rencana, rencanaContainer);
        } else {
          rencanaContainer.innerHTML = `<div class="empty-state">
            <p>Belum ada rencana perjalanan yang dibuat.</p>
            <p>Klik tombol "Tambah Rencana" untuk membuat rencana baru.</p>
          </div>`;
        }
      } else {
        console.warn('Response tidak memiliki data rencana yang valid:', response);
        rencanaContainer.innerHTML = `<div class="error-state">
          <p>Gagal memuat data rencana perjalanan.</p>
          <p>Error: ${response.message || 'Unknown error'}</p>
        </div>`;
      }
    } catch (error) {
      console.error('Error mengambil rencana perjalanan:', error);
      rencanaContainer.innerHTML = `<div class="error-state">
        <p>Terjadi kesalahan saat mengambil data rencana perjalanan.</p>
        <p>Error: ${error.message}</p>
      </div>`;
    }
  }

  async loadWisataOptions() {
    try {
      console.log('Memuat data wisata untuk dropdown...'); // Debugging
      const response = await ambilWisata();
      console.log('Data wisata dari API:', response); // Debugging

      // Handle both response formats: {success: true} and {status: 'success'}
      const isSuccess = response.success === true || response.status === 'success';
      
      if (isSuccess && response.data && response.data.wisata) {
        const wisataSelect = document.getElementById('wisataNama');

        if (!wisataSelect) {
          console.error('Elemen wisataNama tidak ditemukan!');
          return;
        }

        wisataSelect.innerHTML = '<option value="">Pilih Wisata</option>';

        if (response.data.wisata.length > 0) {
          response.data.wisata.forEach(wisata => {
            const option = document.createElement('option');
            option.value = wisata.id; // Simpan ID wisata sebagai value
            option.textContent = wisata.nama;
            wisataSelect.appendChild(option);
          });

          console.log(`Dropdown wisata berhasil diperbarui dengan ${response.data.wisata.length} item.`);
        } else {
          console.warn('Tidak ada data wisata yang tersedia.');
          wisataSelect.innerHTML = '<option value="">Tidak ada wisata tersedia</option>';
        }
      } else {
        console.warn('Response tidak memiliki data wisata yang valid:', response);
        const wisataSelect = document.getElementById('wisataNama');
        if (wisataSelect) {
          wisataSelect.innerHTML = '<option value="">Error loading wisata</option>';
        }
      }
    } catch (error) {
      console.error('Error mengambil daftar wisata:', error);
      const wisataSelect = document.getElementById('wisataNama');
      if (wisataSelect) {
        wisataSelect.innerHTML = '<option value="">Error loading wisata</option>';
      }
    }
  }

  setupModalEvents() {
    const openModalBtn = document.querySelector('.tambah-rencana-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.querySelector('.close-button');
    const tambahListBtn = document.querySelector('.tambah-list-btn');

    if (!openModalBtn || !modalOverlay || !closeModalBtn || !tambahListBtn) {
      console.error('Salah satu elemen modal tidak ditemukan!');
      return;
    }

    // Buka modal
    openModalBtn.addEventListener('click', () => {
      modalOverlay.classList.add('visible');
    });

    // Tutup modal dengan tombol close
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('visible');
      this.resetModalForm();
    });

    // Tutup modal dengan klik di luar
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        modalOverlay.classList.remove('visible');
        this.resetModalForm();
      }
    });

    // Tambah rencana
    tambahListBtn.addEventListener('click', async () => {
      await this.handleTambahRencana();
    });
  }

  async handleTambahRencana() {
    const wisataId = document.getElementById('wisataNama').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;

    // Validasi input
    if (!wisata) {
      alert('Mohon pilih wisata terlebih dahulu.');
      return;
    }

    if (!tanggal) {
      alert('Mohon pilih tanggal.');
      return;
    }

    if (!jam) {
      alert('Mohon pilih jam.');
      return;
    }

    // Format jam untuk backend (tambahkan detik jika diperlukan)
    const formattedJam = jam.includes(':') && jam.split(':').length === 2 ? `${jam}:00` : jam;

    const rencanaData = { 
      wisataId: wisataId, 
      tanggal: tanggal, 
      jam: formattedJam 
    };

    console.log('Data yang akan dikirim ke API:', rencanaData); // Debugging

    try {
      const response = await tambahRencana(rencanaData);
      console.log('Response dari API setelah tambah rencana:', response); // Debugging

      if (response.success) {
        alert('Rencana perjalanan berhasil ditambahkan!');
        
        // Tutup modal dan reset form
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
          modalOverlay.classList.remove('visible');
        }
        this.resetModalForm();
        
        // Refresh daftar rencana perjalanan
        await this.loadRencanaData();
      } else {
        alert(`Gagal menambahkan rencana perjalanan. ${response.message || ''}`);
      }
    } catch (error) {
      console.error('Error saat menambahkan rencana perjalanan:', error);
      alert(`Terjadi kesalahan saat menambahkan rencana perjalanan: ${error.message}`);
    }
  }

  resetModalForm() {
    const wisataSelect = document.getElementById('wisataNama');
    const tanggalInput = document.getElementById('tanggal');
    const jamInput = document.getElementById('jam');

    if (wisataSelect) wisataSelect.value = '';
    if (tanggalInput) tanggalInput.value = '';
    if (jamInput) jamInput.value = '';
  }

  renderRencanaList(rencanaData, container) {
    console.log('Data rencana perjalanan yang akan ditampilkan:', rencanaData);

    if (!rencanaData || rencanaData.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <p>Tidak ada rencana perjalanan yang ditemukan.</p>
      </div>`;
      return;
    }

    container.innerHTML = rencanaData.map((rencana, index) => {
      // Format tanggal
      let formattedDate = 'Invalid Date';
      try {
        const date = new Date(rencana.tanggal);
        formattedDate = date.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.warn('Error formatting date:', rencana.tanggal, error);
        formattedDate = rencana.tanggal;
      }

      // Format jam (hilangkan detik jika ada)
      let formattedTime = rencana.jam;
      if (typeof rencana.jam === 'string' && rencana.jam.includes(':')) {
        const timeParts = rencana.jam.split(':');
        if (timeParts.length >= 2) {
          formattedTime = `${timeParts[0]}:${timeParts[1]}`;
        }
      }

      return `
        <div class="list-item" data-id="${rencana.id}">
          <div class="col">${index + 1}.</div>
          <div class="col">${rencana.nama_wisata || 'Nama tidak tersedia'}</div>
          <div class="col">${formattedDate}</div>
          <div class="col">${formattedTime}</div>
          <div class="col actions">
            <button class="view-btn" data-id="${rencana.id}" title="Lihat Detail">
              <i class="fas fa-eye"></i>
            </button>
            <button class="delete-btn" data-id="${rencana.id}" title="Hapus">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.setupActionButtons();
  }

  setupActionButtons() {
    // Setup view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const itineraryId = event.currentTarget.dataset.id;
        if (itineraryId) {
          window.location.hash = `#/itenary/${itineraryId}`;
        }
      });
    });

    // Setup delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const itineraryId = event.currentTarget.dataset.id;
        
        if (!itineraryId) {
          alert('ID rencana tidak valid.');
          return;
        }

        const confirmDelete = confirm('Apakah Anda yakin ingin menghapus rencana perjalanan ini?');

        if (confirmDelete) {
          try {
            console.log('Menghapus rencana dengan ID:', itineraryId); // Debugging
            const response = await hapusRencana(itineraryId);
            console.log('Response hapus rencana:', response);

            if (response.success) {
              alert('Rencana perjalanan berhasil dihapus.');
              await this.loadRencanaData(); // Refresh daftar rencana perjalanan
            } else {
              alert(`Gagal menghapus rencana perjalanan. ${response.message || ''}`);
            }
          } catch (error) {
            console.error('Error menghapus rencana perjalanan:', error);
            alert(`Terjadi kesalahan saat menghapus rencana perjalanan: ${error.message}`);
          }
        }
      });
    });
  }
}