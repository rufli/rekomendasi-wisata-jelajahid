
const pool = require('../scripts/data/database'); // sesuaikan path ini

// Tambah Wisata
const tambahWisataHandler = async (request, h) => {
  const { nama, lokasi, kategoriId, deskripsi } = request.payload;


  if (!nama || !lokasi || !kategoriId) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan wisata. Mohon lengkapi semua data wajib',
    }).code(400);
  }

  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    await pool.execute(
      'INSERT INTO tempat_wisata (nama, lokasi, kategori_id, deskripsi, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, lokasi, kategoriId, deskripsi, createdAt, updatedAt]
    );

    return h.response({
      status: 'success',
      message: 'Wisata berhasil ditambahkan',
    }).code(201);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan wisata',
      error: err.message,
    }).code(500);
  }
};

// Ambil Semua Wisata (dengan filter opsional)
const ambilWisataHandler = async (request, h) => {
  const { nama, kategori, kategoriId } = request.query;

  if (kategoriId && isNaN(kategoriId)) {
    return h.response({
      status: 'fail',
      message: 'Kategori ID harus berupa angka',
    }).code(400);
  }

  let query = `
    SELECT tw.id, tw.nama, tw.lokasi, k.nama AS kategori, tw.deskripsi
    FROM tempat_wisata tw
    JOIN kategori k ON tw.kategori_id = k.id
  `;
  const conditions = [];
  const values = [];

  if (nama) {
    conditions.push('tw.nama LIKE ?');
    values.push(`%${nama}%`);
  }

  if (kategoriId) {
    conditions.push('tw.kategori_id = ?');
    values.push(kategoriId);
  } else if (kategori) {
    conditions.push('k.nama = ?');
    values.push(kategori);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  try {
    const [rows] = await pool.execute(query, values);

    return h.response({
      status: 'success',
      data: { wisata: rows },
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data wisata',
      error: err.message,
    }).code(500);
  }
};

// Detail Wisata by ID
const detailWisataHandler = async (request, h) => {
  const { wisataId } = request.params;

  try {
    const [rows] = await pool.execute(
      `SELECT tw.id, tw.nama, tw.lokasi, k.nama AS kategori, tw.deskripsi, tw.created_at, tw.updated_at
       FROM tempat_wisata tw
       JOIN kategori k ON tw.kategori_id = k.id
       WHERE tw.id = ?`,
      [wisataId]
    );

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Wisata tidak ditemukan',
      }).code(404);
    }

    return h.response({
      status: 'success',
      data: { wisata: rows[0] },
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'error',
      message: 'Gagal mengambil detail wisata',
      error: err.message,
    }).code(500);
  }
};

// Update Wisata by ID
const ubahWisataHandler = async (request, h) => {
  const { wisataId } = request.params;
  const { nama, lokasi, kategoriId, deskripsi } = request.payload;

  if (!nama || !lokasi || !kategoriId) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui wisata. Mohon lengkapi semua data wajib',
    }).code(400);
  }

  const updatedAt = new Date();

  try {
    const [result] = await pool.execute(
      `UPDATE tempat_wisata
       SET nama = ?, lokasi = ?, kategori_id = ?, deskripsi = ?, updated_at = ?
       WHERE id = ?`,
      [nama, lokasi, kategoriId, deskripsi, updatedAt, wisataId]
    );

    if (result.affectedRows === 0) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui wisata. Id tidak ditemukan',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Wisata berhasil diperbarui',
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'error',
      message: 'Gagal memperbarui wisata',
      error: err.message,
    }).code(500);
  }
};

// Hapus Wisata by ID
const hapusWisataHandler = async (request, h) => {
  const { wisataId } = request.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM tempat_wisata WHERE id = ?',
      [wisataId]
    );

    if (result.affectedRows === 0) {
      return h.response({
        status: 'fail',
        message: 'Wisata gagal dihapus. Id tidak ditemukan',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Wisata berhasil dihapus',
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'error',
      message: 'Gagal menghapus wisata',
      error: err.message,
    }).code(500);
  }
};

//ambil wisata sesuai kategori
const getWisataByKategoriHandler = async (request, h) => {
  const { kategoriId } = request.params;

  if (!kategoriId || isNaN(kategoriId)) {
    return h.response({
      status: 'fail',
      message: 'Kategori ID harus berupa angka',
    }).code(400);
  }

  try {
    const [wisata] = await pool.execute(
      `SELECT tw.id, tw.nama, tw.lokasi, k.nama AS kategori, tw.deskripsi, tw.created_at, tw.updated_at
       FROM tempat_wisata tw
       JOIN kategori k ON tw.kategori_id = k.id
       WHERE tw.kategori_id = ?`,
      [kategoriId]
    );

    if (wisata.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Tidak ada wisata yang ditemukan untuk kategori ini',
      }).code(404);
    }

    return h.response({
      status: 'success',
      data: { wisata },
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data wisata berdasarkan kategori',
      error: error.message,
    }).code(500);
  }
};


module.exports = {
  tambahWisataHandler,
  ambilWisataHandler,
  detailWisataHandler,
  ubahWisataHandler,
  hapusWisataHandler,
  getWisataByKategoriHandler
};
