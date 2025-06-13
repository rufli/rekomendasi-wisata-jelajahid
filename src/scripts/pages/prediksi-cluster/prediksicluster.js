import { predictCluster, getRecommendations } from '../../data/api-ml.js';

class PredictClusterPage {
  async render() {
    return `
      <section style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2>Cari Rekomendasi Wisata Berdasarkan Preferensi</h2>
        
        <form id="predict-form" style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <div style="margin-bottom: 15px;">
            <label for="budget" style="display: block; margin-bottom: 5px; font-weight: bold;">Budget (Rp):</label>
            <input type="number" id="budget" name="budget" placeholder="Contoh: 100000" 
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label for="category" style="display: block; margin-bottom: 5px; font-weight: bold;">Kategori Wisata:</label>
            <select id="category" name="category" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
              <option value="">-- Pilih Kategori --</option>
              <option value="Bahari">Bahari</option>
              <option value="Budaya">Budaya</option>
              <option value="Cagar Alam">Cagar Alam</option>
              <option value="Pusat Perbelanjaan">Pusat Perbelanjaan</option>
              <option value="Taman Hiburan">Taman Hiburan</option>
              <option value="Tempat Ibadah">Tempat Ibadah</option>
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label for="city" style="display: block; margin-bottom: 5px; font-weight: bold;">Kota Tujuan:</label>
            <input type="text" id="city" name="city" placeholder="Contoh: Jakarta, Bali, Yogyakarta" 
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label for="rating" style="display: block; margin-bottom: 5px; font-weight: bold;">Rating Minimum:</label>
            <select id="rating" name="rating" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
              <option value="">-- Pilih Rating --</option>
              <option value="4.0">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="5.0">5.0</option>
            </select>
          </div>
          
          <button type="submit" 
                  style="background: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
            🔍 Cari Rekomendasi
          </button>
        </form>
        
        <div id="loading" style="display: none; text-align: center; padding: 20px;">
          <p>⏳ Mencari rekomendasi terbaik untuk Anda...</p>
        </div>
        
        <div id="cluster-result" style="display: none; background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>📊 Hasil Prediksi Cluster</h3>
          <div id="cluster-info"></div>
        </div>
        
        <div id="recommendations-result">
          <!-- Rekomendasi akan ditampilkan di sini -->
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#predict-form');
    const loading = document.querySelector('#loading');
    const clusterResult = document.querySelector('#cluster-result');
    const clusterInfo = document.querySelector('#cluster-info');
    const recommendationsResult = document.querySelector('#recommendations-result');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Ambil data dari form
      const formData = new FormData(form);
      const userPreferences = {
        budget: parseInt(formData.get('budget')),
        category: formData.get('category'),
        city: formData.get('city'),
        rating: parseFloat(formData.get('rating'))
      };

      // Tampilkan loading
      loading.style.display = 'block';
      clusterResult.style.display = 'none';
      recommendationsResult.innerHTML = '';

      try {
        // Step 1: Predict cluster
        console.log('📊 Predicting cluster...', userPreferences);
        const clusterData = await predictCluster(userPreferences);
        
        // Tampilkan hasil cluster
        clusterInfo.innerHTML = `
          <p><strong>Cluster ID:</strong> ${clusterData.cluster_id || clusterData.cluster || 'Unknown'}</p>
          <p><strong>Confidence:</strong> ${clusterData.confidence || 'N/A'}</p>
          <p><strong>Deskripsi:</strong> ${clusterData.description || 'Cluster untuk preferensi Anda'}</p>
        `;
        clusterResult.style.display = 'block';

        // Step 2: Get recommendations berdasarkan cluster
        const clusterId = clusterData.cluster_id || clusterData.cluster || 2; // fallback ke cluster 2
        console.log('🎯 Getting recommendations for cluster:', clusterId);
        
        const recommendations = await getRecommendations(clusterId);
        
        // Tampilkan recommendations
        if (recommendations && recommendations.length > 0) {
  recommendationsResult.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
      <h3>🎯 Rekomendasi Untuk Anda</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">
        ${recommendations.map(item => `
          <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; background: #fafafa; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h4 style="margin: 0 0 5px 0; color: #333; font-size: 1.1em;">${item.Place_Name || 'Nama tidak tersedia'}</h4>
              <p style="margin: 0 0 10px 0; color: #777; font-size: 0.9em;">📍 ${item.City || 'Kota tidak tersedia'}</p>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <span style="background: #e0f2f7; color: #0288d1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; display: flex; align-items: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag-fill" viewBox="0 0 16 16" style="margin-right: 4px;">
                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                  </svg>
                  Kategori: ${item.Category || 'Tidak tersedia'}
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #ffc107; font-size: 1.1em; display: flex; align-items: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16" style="margin-right: 4px;">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                  Rating: ${item.Rating || 'N/A'}
                </span>
              </div>
            </div>
            <div style="margin-top: 15px; text-align: right;">
              ${item.Price ? `<span style="background: #e6ffed; color: #28a745; padding: 6px 12px; border-radius: 6px; font-weight: bold;">Rp ${item.Price.toLocaleString('id-ID')}</span>` : `<span style="background: #e6ffed; color: #28a745; padding: 6px 12px; border-radius: 6px; font-weight: bold;">Harga tidak tersedia</span>`}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
} else {
          recommendationsResult.innerHTML = `
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7;">
              <p>📝 Tidak ada rekomendasi yang sesuai dengan preferensi Anda saat ini.</p>
              <p>Coba ubah kriteria pencarian atau budget Anda.</p>
            </div>
          `;
        }

      } catch (error) {
        console.error('Error:', error);
        recommendationsResult.innerHTML = `
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; border: 1px solid #f1aeb5; color: #721c24;">
            <h4>❌ Terjadi Kesalahan</h4>
            <p>${error.message}</p>
            <p>Silakan coba lagi atau hubungi administrator.</p>
          </div>
        `;
      } finally {
        loading.style.display = 'none';
      }
    });
  }
}

export default PredictClusterPage;