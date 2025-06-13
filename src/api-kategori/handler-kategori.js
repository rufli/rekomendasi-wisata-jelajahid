const pool = require('../scripts/data/database'); // sesuaikan path jika berbeda

// Tambah Kategori
const tambahKategoriHandler = async (request, h) => {
  const { nama } = request.payload;

  if (!nama) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan kategori. Nama tidak boleh kosong',
    }).code(400);
  }

  try {
    await pool.execute(
      'INSERT INTO kategori (nama) VALUES (?)',
      [nama]
    );

    return h.response({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan kategori',
      error: error.message,
    }).code(500);
  }
};

// Ambil Semua Kategori
const ambilKategoriHandler = async (request, h) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM kategori');

    return h.response({
      status: 'success',
      data: {
        kategori: rows,
      },
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data kategori',
      error: error.message,
    }).code(500);
  }
};

module.exports = {
  tambahKategoriHandler,
  ambilKategoriHandler,
};
