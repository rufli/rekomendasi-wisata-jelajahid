const {
  tambahRencanaHandler,
  getRencanaHandler,
  hapusRencanaHandler,
  editRencanaHandler,
} = require('./handler-itenary');

const rencanaRoutes = [
  {
    method: 'POST',
    path: '/rencana/tambah',
    handler: tambahRencanaHandler,
  },
  {
    method: 'GET',
    path: '/rencana/ambil',
    handler: getRencanaHandler,
  },
  {
    method: 'DELETE',
    path: '/rencana/hapus/{rencanaid}',
    handler: hapusRencanaHandler,
  },
  {
    method: 'PUT',
    path: '/rencana/edit/{rencanaid}',
    handler: editRencanaHandler,
  },
];

module.exports = rencanaRoutes;
