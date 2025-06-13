import { generateItinerary } from '../../data/api-ml.js';

class RencanaPage {
  async render() {
    return `
      <section style="max-width: 1000px; margin: 0 auto; padding: 20px;">
        <h2>📅 Buat Rencana Perjalanan Wisata</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3>Pilih Cluster untuk Membuat Rencana Perjalanan</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="cluster-btn" data-cluster="0" 
                    style="padding: 10px 20px; border: 2px solid #007bff; background: white; border-radius: 6px; cursor: pointer;">
              Cluster 1 - Backpacker
            </button>
            <button class="cluster-btn" data-cluster="1" 
                    style="padding: 10px 20px; border: 2px solid #28a745; background: white; border-radius: 6px; cursor: pointer;">
              Cluster 2 - Mid Range
            </button>
            <button class="cluster-btn" data-cluster="2" 
                    style="padding: 10px 20px; border: 2px solid #ffc107; background: white; border-radius: 6px; cursor: pointer;">
              Cluster 3 - Premium
            </button>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label for="duration" style="display: block; margin-bottom: 5px; font-weight: bold;">Durasi Perjalanan (hari):</label>
            <select id="duration" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="1">1 Hari</option>
              <option value="2">2 Hari</option>
              <option value="3" selected>3 Hari</option>
              <option value="4">4 Hari</option>
              <option value="5">5 Hari</option>
            </select>
          </div>
          
          <button id="generate-btn" 
                  style="background: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;" 
                  disabled>
            🎯 Buat Rencana Perjalanan
          </button>
        </div>
        
        <div id="loading" style="display: none; text-align: center; padding: 40px;">
          <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 15px;">⏳ Membuat rencana perjalanan terbaik untuk Anda...</p>
        </div>
        
        <div id="itinerary-result">
          <!-- Rencana perjalanan akan ditampilkan di sini -->
        </div>
      </section>
    `;
  }

  async afterRender() {
    const clusterBtns = document.querySelectorAll('.cluster-btn');
    const generateBtn = document.querySelector('#generate-btn');
    const loading = document.querySelector('#loading');
    const itineraryResult = document.querySelector('#itinerary-result');
    const durationSelect = document.querySelector('#duration');
    
    let selectedCluster = null;

    // Handle cluster selection
    clusterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        clusterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Store selected cluster
        selectedCluster = parseInt(btn.dataset.cluster);
        
        // Enable generate button
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
      });
    });

    // Handle generate itinerary
    generateBtn.addEventListener('click', async () => {
      if (selectedCluster === null) {
        alert('Silakan pilih cluster terlebih dahulu!');
        return;
      }

      const duration = parseInt(durationSelect.value);
      
      // Show loading
      loading.style.display = 'block';
      itineraryResult.innerHTML = '';
      generateBtn.disabled = true;

      try {
        console.log(`📅 Membuat rencana perjalanan untuk cluster ${selectedCluster}, duration: ${duration} days`);
        
        const itineraryData = await generateItinerary(selectedCluster);
        
        // Process and display itinerary
        this.displayItinerary(itineraryData, duration, selectedCluster);
        
      } catch (error) {
        console.error('Error membuat rencana perjalanan:', error);
        itineraryResult.innerHTML = `
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; border: 1px solid #f1aeb5; color: #721c24;">
            <h4>❌ Gagal Membuat Rencana Perjalanan</h4>
            <p>${error.message}</p>
            <p>Silakan coba lagi atau hubungi administrator.</p>
          </div>
        `;
      } finally {
        loading.style.display = 'none';
        generateBtn.disabled = false;
      }
    });
  }

  displayItinerary(data, duration, clusterId) {
    const itineraryResult = document.querySelector('#itinerary-result');
    
    // Jika data memiliki struktur itinerary yang sudah jadi
    if (data.itinerary) {
      this.displayStructuredItinerary(data.itinerary);
      return;
    }
    
    // Jika data berupa list places, kita buat rencana perjalanan sendiri
    const places = data.places || data.recommendations || data;
    
    if (!places || !Array.isArray(places)) {
      throw new Error('Data rencana perjalanan tidak valid');
    }

    // Bagi places berdasarkan durasi
    const placesPerDay = Math.ceil(places.length / duration);
    const itinerary = [];
    
    for (let day = 0; day < duration; day++) {
      const dayPlaces = places.slice(day * placesPerDay, (day + 1) * placesPerDay);
      itinerary.push({
        day: day + 1,
        places: dayPlaces
      });
    }

    // Display rencana perjalanan
    itineraryResult.innerHTML = `
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #eee;">
          <h3 style="color: #007bff; margin: 0;">🎯 Rencana Perjalanan Wisata Anda</h3>
          <p style="color: #666; margin: 5px 0 0 0;">Cluster ${clusterId} • ${duration} Hari • ${places.length} Destinasi</p>
        </div>
        
        ${itinerary.map(dayData => `
          <div class="day-card">
            <h4 style="color: #007bff; margin: 0 0 15px 0; display: flex; align-items: center;">
              <span style="background: #007bff; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">
                ${dayData.day}
              </span>
              Hari ${dayData.day}
            </h4>
            
            ${dayData.places.map((place, index) => `
              <div class="place-item">
                <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 8px;">
                  <h5 style="margin: 0; color: #333; flex: 1;">${place.Place_Name || `Destinasi ${index + 1}`}</h5>
                  <span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                    ${place.Category || 'Wisata'}
                  </span>
                </div>
                
                <div style="display: flex; gap: 15px; margin-bottom: 8px; font-size: 14px; color: #666;">
                  <span>📍 ${place.City || 'Kota tidak tersedia'}</span>
                  <span>⭐ ${place.Rating || 'N/A'}</span>
                  <span>💰 ${place.Price ? `Rp ${place.Price.toLocaleString()}` : 'Gratis'}</span>
                </div>
                
                ${place.Description ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #555; line-height: 1.4;">${place.Description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h4 style="color: #28a745; margin: 0 0 10px 0;">💡 Tips Perjalanan</h4>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li>Periksa jam buka setiap destinasi sebelum berkunjung</li>
            <li>Siapkan budget lebih untuk transportasi antar lokasi</li>
            <li>Gunakan aplikasi maps untuk navigasi yang lebih mudah</li>
            <li>Jangan lupa membawa kamera untuk mengabadikan momen!</li>
          </ul>
        </div>
      </div>
    `;
  }

  displayStructuredItinerary(itinerary) {
    const itineraryResult = document.querySelector('#itinerary-result');
    
    itineraryResult.innerHTML = `
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="text-align: center; color: #007bff; margin-bottom: 30px;">🎯 Rencana Perjalanan Wisata Anda</h3>
        
        ${itinerary.map(day => `
          <div class="day-card">
            <h4 style="color: #007bff; margin-bottom: 15px;">Hari ${day.day}</h4>
            
            ${day.activities.map(activity => `
              <div class="place-item">
                <h5 style="margin: 0 0 8px 0;">${activity.name}</h5>
                <p style="margin: 0; color: #666; font-size: 14px;">${activity.description}</p>
                ${activity.time ? `<span style="color: #007bff; font-size: 12px;">⏰ ${activity.time}</span>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }
}

export default RencanaPage;