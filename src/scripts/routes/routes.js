
import HomePage from '../pages/home/home-page';
import RekomendasiPage from '../pages/rekomendasi/rekomendasi-page';
import PredictClusterPage from '../pages/prediksi-cluster/prediksicluster';
import  RencanaPage from '../pages/rencana/rencana';
// Gunakan KategoriPage untuk semua kategori wisata
const routes = {
  '/': new HomePage(),
  '/rekomendasi': new RekomendasiPage(), // Rekomendasi wisata
  '/prediksi': new PredictClusterPage(),
  '/rencana': new RencanaPage(), // Rencana wisata
};

export default routes;