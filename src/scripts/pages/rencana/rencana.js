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
      <style>
        .plans-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .filter-section, .add-section {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .section-title {
          margin-top: 0;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
        }
        
        .primary-btn {
          background: #007bff;
          color: white;
        }
        
        .success-btn {
          background: #28a745;
          color: white;
        }
        
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .plan-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .plan-title {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.2em;
        }
        
        .plan-description {
          color: #666;
          margin: 0 0 12px 0;
          font-size: 0.9em;
        }
        
        .plan-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .cluster-badge {
          background: #e0f7fa;
          color: #00838f;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8em;
        }
        
        .days-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8em;
        }
        
        .plan-actions {
          display: flex;
          gap: 10px;
        }
        
        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
        }
        
        .info-btn {
          background: #17a2b8;
          color: white;
        }
        
        .secondary-btn {
          background: #6c757d;
          color: white;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          display: none;
        }
        
        .error-message {
          background: #f8d7da;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          color: #721c24;
          display: none;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }
        
        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      </style>
      
      <section class="plans-container">
        <h2>Kelola Rencana Perjalanan</h2>
        
        <div style="display: flex; gap: 20px; margin-bottom: 30px;">
          <div class="filter-section" style="flex: 1;">
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
          
          <div class="add-section" style="flex: 1;">
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
          <p>⏳ Memuat data...</p>
        </div>
        
        <div id="error-message" class="error-message"></div>
        
        <div id="plans-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const loadPlansBtn = document.getElementById('load-plans-btn');
    const clusterFilter = document.getElementById('cluster-filter');
    const addPlanForm = document.getElementById('add-plan-form');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const plansContainer = document.getElementById('plans-container');

    // Fungsi untuk render kartu rencana
    const renderPlanCard = (plan) => {
      // Debugging: Tampilkan seluruh object plan di console
      console.log('Plan object:', plan);
      
      // Gunakan property yang sesuai dengan response API
      const planName = plan.Place_Name || plan.name || 'Unnamed Plan';
      const description = plan.Description || plan.description || 'No description';
      const clusterId = plan.cluster_id || plan.cluster || 'N/A';
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
            <button class="action-btn info-btn generate-btn" data-cluster="${clusterId}">
              🗺️ Generate Itinerary
            </button>
            <button class="action-btn secondary-btn recommend-btn" data-cluster="${clusterId}">
              🔍 Rekomendasi
            </button>
          </div>
        </div>
      `;
    };

    // Fungsi untuk memuat rencana
    const loadPlans = async () => {
      const clusterId = clusterFilter.value;
      console.log(`Memuat rencana untuk cluster ${clusterId}...`);
      
      loadingElement.style.display = 'block';
      errorElement.style.display = 'none';
      plansContainer.innerHTML = '';

      try {
        let plans = [];
        
        if (clusterId === 'all') {
          try {
            const response = await getAllPlans();
            console.log('Response all plans:', response);
            plans = response?.plans || response || [];
          } catch (error) {
            console.warn('Gagal mengambil semua rencana, mencoba alternatif...');
            // Fallback: Ambil per cluster lalu gabungkan
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
          console.log(`Response cluster ${clusterId}:`, response);
          plans = response?.plans || response || [];
        }

        console.log('Plans to render:', plans);
        if (plans.length > 0) console.log('Contoh item pertama:', plans[0]);

        if (!plans || plans.length === 0) {
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
            ${plans.map(plan => renderPlanCard(plan)).join('')}
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

    // Event listener untuk tombol muat rencana
    loadPlansBtn.addEventListener('click', loadPlans);

    // Event listener untuk form tambah rencana
    addPlanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(addPlanForm);
      const newPlan = {
        cluster_id: formData.get('cluster'),
        name: formData.get('name'),
        description: formData.get('description'),
        days: parseInt(formData.get('days'))
      };

      loadingElement.style.display = 'block';
      errorElement.style.display = 'none';

      try {
        const result = await addPlan(newPlan.cluster_id, newPlan);
        console.log('Plan added:', result);
        
        // Reset form
        addPlanForm.reset();
        
        // Tampilkan pesan sukses
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '✅ Rencana berhasil ditambahkan!';
        plansContainer.prepend(successMsg);
        
        // Muat ulang daftar rencana
        await loadPlans();
        
        // Hilangkan pesan setelah 3 detik
        setTimeout(() => successMsg.remove(), 3000);
        
      } catch (error) {
        console.error('Error adding plan:', error);
        errorElement.textContent = `Gagal menambahkan rencana: ${error.message}`;
        errorElement.style.display = 'block';
      } finally {
        loadingElement.style.display = 'none';
      }
    });

    // Delegasi event untuk tombol generate itinerary dan rekomendasi
    plansContainer.addEventListener('click', async (e) => {
      const generateBtn = e.target.closest('.generate-btn');
      const recommendBtn = e.target.closest('.recommend-btn');
      
      if (generateBtn) {
        const clusterId = generateBtn.dataset.cluster;
        loadingElement.style.display = 'block';
        
        try {
          const itinerary = await generateItinerary(clusterId);
          console.log('Generated itinerary:', itinerary);
          alert(`Itinerary untuk Cluster ${clusterId} berhasil digenerate!\n\nLihat console untuk detail.`);
        } catch (error) {
          console.error('Error generating itinerary:', error);
          errorElement.textContent = `Gagal generate itinerary: ${error.message}`;
          errorElement.style.display = 'block';
        } finally {
          loadingElement.style.display = 'none';
        }
      }
      
      if (recommendBtn) {
        const clusterId = recommendBtn.dataset.cluster;
        loadingElement.style.display = 'block';
        
        try {
          const recommendations = await getRecommendations(clusterId);
          console.log('Recommendations:', recommendations);
          alert(`Rekomendasi untuk Cluster ${clusterId} berhasil dimuat!\n\nLihat console untuk detail.`);
        } catch (error) {
          console.error('Error getting recommendations:', error);
          errorElement.textContent = `Gagal memuat rekomendasi: ${error.message}`;
          errorElement.style.display = 'block';
        } finally {
          loadingElement.style.display = 'none';
        }
      }
    });

    // Muat rencana secara otomatis saat pertama kali load
    await loadPlans();
  }
}

export default RencanaPage;