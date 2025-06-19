import { 
  getPlansByCluster, 
  getAllPlans, 
  addPlan,
  generateItinerary,
  getRecommendations
} from '../../data/api-ml.js';

class RencanaPage {
  async render() {
    return `
      <section class="plans-container">
        <h2>Kelola Rencana Perjalanan</h2>
        
        <div class="flex-container">
          <div class="filter-section">
            <h3 class="section-title">Filter Rencana</h3>
            <div class="form-group">
              <label for="cluster-filter">Cluster:</label>
              <select id="cluster-filter">
                <option value="all">Semua Cluster</option>
                <option value="0">Cluster 0</option>
                <option value="1">Cluster 1</option>
                <option value="2">Cluster 2</option>
                <option value="3">Cluster 3</option>
              </select>
            </div>
            <button id="load-plans-btn" class="primary-btn">
              🔍 Muat Rencana
            </button>
          </div>
          
          <div class="add-section">
            <h3 class="section-title">Tambah Rencana Baru</h3>
            <form id="add-plan-form">
              <div class="form-group">
                <label for="plan-cluster">Cluster:</label>
                <select id="plan-cluster" name="cluster" required>
                  <option value="">-- Pilih Cluster --</option>
                  <option value="0">Cluster 0</option>
                  <option value="1">Cluster 1</option>
                  <option value="2">Cluster 2</option>
                  <option value="3">Cluster 3</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="plan-name">Nama Rencana:</label>
                <input type="text" id="plan-name" name="name" required>
              </div>
              
              <div class="form-group">
                <label for="plan-desc">Deskripsi:</label>
                <textarea id="plan-desc" name="description" rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label for="plan-days">Jumlah Hari:</label>
                <input type="number" id="plan-days" name="days" min="1" required>
              </div>
              
              <button type="submit" class="success-btn">
                ➕ Tambah Rencana
              </button>
            </form>
          </div>
        </div>
        
        <div id="loading" class="loading">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>
        
        <div id="error-message" class="error-message"></div>
        
        <div id="plans-container"></div>
      </section>

      <style>
        .plans-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .flex-container {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .filter-section, .add-section {
          flex: 1;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .plan-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .plan-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .modal {
          display: block;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.7);
        }
        
        .modal-content {
          background-color: #fefefe;
          margin: 5% auto;
          padding: 25px;
          border-radius: 10px;
          width: 85%;
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .close-modal {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        
        .close-modal:hover {
          color: #333;
        }
        
        .itinerary-view {
          margin-top: 20px;
        }
        
        .places-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .place-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .place-details {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 10px 0;
          font-size: 0.9em;
          color: #555;
        }
        
        .save-itinerary-section {
          margin-top: 20px;
          text-align: center;
        }
        
        .loading {
          display: none;
          text-align: center;
          padding: 20px;
        }
        
        .spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          display: none;
          background-color: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
        }
        
        .success-message {
          color: #2e7d32;
          font-weight: bold;
          text-align: center;
          padding: 15px;
        }
      </style>
    `;
  }

  async afterRender() {
    const loadPlansBtn = document.getElementById('load-plans-btn');
    const clusterFilter = document.getElementById('cluster-filter');
    const addPlanForm = document.getElementById('add-plan-form');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const plansContainer = document.getElementById('plans-container');

    const renderPlanCard = (plan, selectedCluster) => {
      const clusterId = selectedCluster || plan.cluster_id || plan.cluster || 'N/A';
      const planName = plan.Place_Name || plan.name || 'Unnamed Plan';
      const description = plan.Description || plan.description || 'No description';
      const days = plan.days || plan.total_days || 1;

      return `
        <div class="plan-card">
          <h4 class="plan-title">${planName}</h4>
          <p class="plan-description">${description}</p>
          <div class="plan-meta">
            <span class="cluster-badge">Cluster ${clusterId}</span>
            <span class="days-badge">${days} Hari</span>
          </div>
          <div class="plan-actions">
            <button class="action-btn info-btn generate-btn" data-cluster="${clusterId}" data-plan="${planName}">
              🗺️ Generate Itinerary
            </button>
            <button class="action-btn secondary-btn recommend-btn" data-cluster="${clusterId}" data-plan="${planName}">
              🔍 Rekomendasi
            </button>
          </div>
        </div>
      `;
    };

    const loadPlans = async () => {
      const clusterId = clusterFilter.value;
      
      loadingElement.style.display = 'flex';
      errorElement.style.display = 'none';
      plansContainer.innerHTML = '';

      try {
        let plans = [];
        
        if (clusterId === 'all') {
          try {
            const response = await getAllPlans();
            plans = response?.plans || response || [];
          } catch (error) {
            const clusters = [0, 1, 2, 3];
            const allPlans = [];
            for (const cluster of clusters) {
              const res = await getPlansByCluster(cluster);
              allPlans.push(...(res?.plans || res || []));
            }
            plans = allPlans;
          }
        } else {
          const response = await getPlansByCluster(clusterId);
          plans = response?.plans || response || [];
        }

        if (!Array.isArray(plans)) {
          console.error('Data plans bukan array:', plans);
          plans = [];
        }

        if (plans.length === 0) {
          plansContainer.innerHTML = `
            <div class="empty-state">
              <p>📭 Tidak ada rencana perjalanan yang tersedia</p>
              <p>Silakan tambahkan rencana baru</p>
            </div>
          `;
          return;
        }

        plansContainer.innerHTML = `
          <h3>Daftar Rencana ${clusterId === 'all' ? '' : 'Cluster ' + clusterId}</h3>
          <div class="plans-grid">
            ${plans.map(plan => renderPlanCard(plan, clusterId === 'all' ? null : clusterId)).join('')}
          </div>
        `;

      } catch (error) {
        console.error('Error loading plans:', error);
        errorElement.textContent = `Gagal memuat rencana: ${error.message}`;
        errorElement.style.display = 'block';
      } finally {
        loadingElement.style.display = 'none';
      }
    };

    const showModal = (title, content) => {
      const modalHtml = `
        <div class="modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>${title}</h3>
            <div class="modal-body">${content}</div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      const modal = document.querySelector('.modal');
      const closeBtn = document.querySelector('.close-modal');
      
      closeBtn.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => e.target === modal && modal.remove());
    };

    loadPlansBtn.addEventListener('click', loadPlans);

    addPlanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(addPlanForm);
      const newPlan = {
        cluster_id: formData.get('cluster'),
        name: formData.get('name'),
        description: formData.get('description'),
        days: parseInt(formData.get('days'))
      };

      loadingElement.style.display = 'flex';
      errorElement.style.display = 'none';

      try {
        await addPlan(newPlan.cluster_id, newPlan);
        addPlanForm.reset();
        showModal('Sukses', '<div class="success-message">✅ Rencana berhasil ditambahkan!</div>');
        await loadPlans();
      } catch (error) {
        errorElement.textContent = `Gagal menambahkan rencana: ${error.message}`;
        errorElement.style.display = 'block';
      } finally {
        loadingElement.style.display = 'none';
      }
    });

    plansContainer.addEventListener('click', async (e) => {
      const generateBtn = e.target.closest('.generate-btn');
      const recommendBtn = e.target.closest('.recommend-btn');
      
      if (generateBtn) {
        const clusterId = generateBtn.dataset.cluster;
        const planName = generateBtn.dataset.plan;
        
        loadingElement.style.display = 'flex';
        errorElement.style.display = 'none';
        
        try {
          const response = await generateItinerary(clusterId);
          console.log('Itinerary Response:', response);
          
          let content;
          if (response.itinerary && Array.isArray(response.itinerary)) {
            content = `
              <div class="itinerary-view">
                <h3>${planName}</h3>
                <p class="cluster-tag">Cluster ${clusterId} • ${response.itinerary.length} Tempat</p>
                
                <div class="places-grid">
                  ${response.itinerary.map((place, index) => `
                    <div class="place-card">
                      <h4>${place.Place_Name || 'Tempat Wisata'}</h4>
                      <div class="place-details">
                        <span class="category">${place.Category || 'Kategori'}</span>
                        <span class="city">📍 ${place.City || 'Lokasi'}</span>
                        <span class="rating">⭐ ${place.Rating || '0'}</span>
                        <span class="price">💰 ${place.Price === 0 ? 'Gratis' : `Rp${place.Price}`}</span>
                      </div>
                      <p class="day-info">Hari ke-${index + 1}</p>
                    </div>
                  `).join('')}
                </div>
                
                <div class="save-itinerary-section">
                  <button id="save-itinerary-btn" class="success-btn" 
                    data-cluster="${clusterId}" 
                    data-itinerary='${JSON.stringify(response.itinerary)}'
                    data-plan-name="${planName}">
                    💾 Simpan Itinerary
                  </button>
                </div>
              </div>
            `;
          } else {
            content = `
              <div class="api-response">
                <h4>${planName} (Cluster ${clusterId})</h4>
                <pre>${JSON.stringify(response, null, 2)}</pre>
              </div>
            `;
          }
          
          showModal(`Itinerary ${planName}`, content);
          
          // Tambahkan event listener untuk tombol simpan setelah modal muncul
          setTimeout(() => {
            const saveBtn = document.getElementById('save-itinerary-btn');
            if (saveBtn) {
              saveBtn.addEventListener('click', async () => {
                try {
                  const itineraryData = JSON.parse(saveBtn.dataset.itinerary);
                  const planName = saveBtn.dataset.planName;
                  const newPlan = {
                    cluster_id: clusterId,
                    name: `${planName} (Generated)`,
                    description: `Itinerary otomatis untuk ${planName}`,
                    days: itineraryData.length,
                    places: itineraryData
                  };
                  
                  loadingElement.style.display = 'flex';
                  await addPlan(clusterId, newPlan);
                  await loadPlans();
                  document.querySelector('.modal')?.remove();
                  showModal('Sukses', '<div class="success-message">✅ Itinerary berhasil disimpan!</div>');
                } catch (error) {
                  errorElement.textContent = `Gagal menyimpan itinerary: ${error.message}`;
                  errorElement.style.display = 'block';
                } finally {
                  loadingElement.style.display = 'none';
                }
              });
            }
          }, 100);
          
        } catch (error) {
          errorElement.textContent = `Gagal generate itinerary: ${error.message}`;
          errorElement.style.display = 'block';
        } finally {
          loadingElement.style.display = 'none';
        }
      }
      
      if (recommendBtn) {
        const clusterId = recommendBtn.dataset.cluster;
        const planName = recommendBtn.dataset.plan;
        
        loadingElement.style.display = 'flex';
        errorElement.style.display = 'none';
        
        try {
          const response = await getRecommendations(clusterId);
          console.log('Recommendations Response:', response);
          
          let content;
          if (Array.isArray(response)) {
            content = `
              <div class="recommendations-view">
                <h3>Rekomendasi Wisata</h3>
                <p class="cluster-tag">Cluster ${clusterId}</p>
                
                <div class="places-grid">
                  ${response.map(place => `
                    <div class="place-card">
                      <h4>${place.Place_Name || place.nama_tempat || 'Tempat Wisata'}</h4>
                      <div class="place-details">
                        <span class="category">${place.Category || 'Kategori'}</span>
                        <span class="city">📍 ${place.City || place.location || 'Lokasi'}</span>
                        <span class="rating">⭐ ${place.Rating || '0'}</span>
                        <span class="price">💰 ${place.Price === 0 ? 'Gratis' : `Rp${place.Price}`}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          } else {
            content = `
              <div class="api-response">
                <h4>Rekomendasi ${planName} (Cluster ${clusterId})</h4>
                <pre>${JSON.stringify(response, null, 2)}</pre>
              </div>
            `;
          }
          
          showModal(`Rekomendasi ${planName}`, content);
          
        } catch (error) {
          errorElement.textContent = `Gagal memuat rekomendasi: ${error.message}`;
          errorElement.style.display = 'block';
        } finally {
          loadingElement.style.display = 'none';
        }
      }
    });

    // Load data awal
    await loadPlans();
  }
}

export default RencanaPage;