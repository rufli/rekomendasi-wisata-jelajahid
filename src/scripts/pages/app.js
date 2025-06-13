import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (page) {
      this.#content.innerHTML = await page.render();
      if (page.afterRender) {
        await page.afterRender();
      }
    } else {
      console.error(`Halaman untuk rute '${url}' tidak ditemukan.`);
      this.#content.innerHTML = '<h1>404 Halaman Tidak Ditemukan</h1><p>Maaf, halaman yang Anda cari tidak ada.</p>';
    }
  }
}

export default App;
