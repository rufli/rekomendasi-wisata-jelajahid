/*import HomePage from '../pages/home/home-page';

import KategoriPage from '../pages/kategori/kategori-page';
import ItenaryPage from '../pages/itenary/itenary-page';
import AlamPage from '../pages/wisata-alam/alam-page';
import HiburanPage from '../pages/wisata-hiburan/hiburan-page';
import ReligiPage from '../pages/wisata-religi/religi';
import BelanjaPage from '../pages/wisata-belanja/belanja-page';
import SejarahPage from '../pages/wisata-sejarah/sejarah-page';
import DetailPage from '../pages/detail/detail-page';
import ItenaryDetailPage from '../pages/itenary-detail/itenary-detail-page';

//baru

const routes = {
  '/': new HomePage(),
  '/wisata': new KategoriPage(),
  '/alam': new AlamPage(),
  '/hiburan': new HiburanPage(),
  '/religi' : new ReligiPage() ,
  '/belanja': new BelanjaPage(),
  '/sejarah': new SejarahPage(),
  '/itinerary': new ItenaryPage(),
  '/detail': new DetailPage(),
  '/itenary/:id': new ItenaryDetailPage(),

};

export default routes;
*/
import HomePage from '../pages/home/home-page';
import KategoriPage from '../pages/kategori/kategori-page';
import ItenaryPage from '../pages/itenary/itenary-page';
import DetailPage from '../pages/detail/detail-page';
import ItenaryDetailPage from '../pages/itenary-detail/itenary-detail-page';
import RekomendasiPage from '../pages/rekomendasi/rekomendasi-page';
import PredictClusterPage from '../pages/prediksi-cluster/prediksicluster';
import  RencanaPage from '../pages/rencana/rencana';
// Gunakan KategoriPage untuk semua kategori wisata
const routes = {
  '/': new HomePage(),
  '/wisata': new KategoriPage(null, 'Semua Wisata', true), // Menampilkan semua wisata dengan filter
  '/alam': new KategoriPage(1, 'Alam', false), // Menampilkan wisata alam tanpa filter
  '/hiburan': new KategoriPage(2, 'Hiburan', false),
  '/religi': new KategoriPage(3, 'Religi', false),
  '/belanja': new KategoriPage(4, 'Belanja', false),
  '/sejarah': new KategoriPage(5, 'Sejarah', false),
  '/itinerary': new ItenaryPage(),
  '/detail/:id': new DetailPage(),
  '/itenary/:id': new ItenaryDetailPage(),
  '/rekomendasi': new RekomendasiPage(), // Rekomendasi wisata
  '/prediksi': new PredictClusterPage(),
  '/rencana': new RencanaPage(), // Rencana wisata
};

export default routes;