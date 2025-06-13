
const Hapi = require('@hapi/hapi');
const wisataRoutes = require('./api-wisata/routes-wisata');
const rencanaRoutes = require('./api-itenary/routes-itenary');
const kategoriRoutes = require('./api-kategori/routes-kategori');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['ngrok-skip-browser-warning'], // ✅ penting untuk ngrok
      },
    },
  });

  server.route([...wisataRoutes, ...rencanaRoutes, ...kategoriRoutes]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
