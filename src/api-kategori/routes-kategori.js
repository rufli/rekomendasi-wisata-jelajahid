const {
  tambahKategoriHandler,
  ambilKategoriHandler,
} = require('./handler-kategori');

const kategoriRoutes = [
  {
    method: 'POST',
    path: '/kategori/tambah',
    handler: tambahKategoriHandler,
  },
  {
    method: 'GET',
    path: '/kategori/ambil',
    handler: ambilKategoriHandler,
  },
];

module.exports = kategoriRoutes;
