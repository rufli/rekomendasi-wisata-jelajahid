export default class ItenaryDetailPage {
    async render() {
        return `
            <div class="itenary-detail-container">
                <div class="header">
                    <a href="#/itinerary" class="back-link"><i class="fas fa-chevron-left"></i> Kembali</a>
                </div>
                <div class="title-section">
                    <h1>Yogyakarta</h1>
                    <p>Wisata Alam</p>
                </div>

                <div class="timeline-section">
                    <h2>Hari Pertama</h2>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="time">08.00</span>
                            <div class="details">
                                <span class="place-name">Malioboro</span>
                                <span class="location">Jawa Tengah</span>
                            </div>
                            <img src="/images/borobudur.jpg" alt="Malioboro Image" class="place-image">
                        </div>
                    </div>
                    <div class="timeline-item">
                         <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="time">08.00</span>
                            <div class="details">
                                <span class="place-name">Malioboro</span>
                                <span class="location">Jawa Tengah</span>
                            </div>
                             <img src="https://via.placeholder.com/150" alt="Malioboro Image" class="place-image">
                        </div>
                    </div>
                     <div class="timeline-item">
                         <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="time">08.00</span>
                            <div class="details">
                                <span class="place-name">Malioboro</span>
                                <span class="location">Jawa Tengah</span>
                            </div>
                             <img src="https://via.placeholder.com/150" alt="Malioboro Image" class="place-image">
                        </div>
                    </div>

                    <h2>Hari Kedua</h2>
                     <div class="timeline-item">
                         <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="time">08.00</span>
                            <div class="details">
                                <span class="place-name">Malioboro</span>
                                <span class="location">Jawa Tengah</span>
                            </div>
                             <img src="https://via.placeholder.com/150" alt="Malioboro Image" class="place-image">
                        </div>
                    </div>
                    <!-- Add more days and items as needed -->

                </div>
            </div>
        `;
    }

    async afterRender() {
        // Add any necessary JavaScript here
    }
} 