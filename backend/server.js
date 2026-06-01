const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// DATABASE CONNECTION
// =====================
const db = mysql.createConnection({
  host: "34.10.132.215",
  user: "maganguser",
  password: "password123",
  database: "magang_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// =====================
// HELPER VALIDATION
// =====================
function validateMahasiswa(data) {
  if (
    !data.nama ||
    !data.tempat_magang ||
    !data.tanggal_mulai ||
    !data.tanggal_selesai
  ) {
    return false;
  }
  return true;
}

// =====================
// POST - INSERT MAHASISWA
// =====================
app.post("/mahasiswa", (req, res) => {
  const data = req.body;

  // VALIDATION
  if (!validateMahasiswa(data)) {
    return res.status(400).json({
      success: false,
      message: "Semua field wajib diisi"
    });
  }

  const sql = `
    INSERT INTO mahasiswa
    (nama, tempat_magang, tanggal_mulai, tanggal_selesai, status_referral)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      data.nama,
      data.tempat_magang,
      data.tanggal_mulai,
      data.tanggal_selesai,
      data.status_referral ? 1 : 0
    ],
    (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({
          success: false,
          message: "Gagal menyimpan data",
          error: err
        });
      }

      return res.status(201).json({
        success: true,
        message: "Data berhasil disimpan",
        data: {
          id: result.insertId,
          ...data
        }
      });
    }
  );
});

// =====================
// GET - ALL MAHASISWA
// =====================
app.get("/mahasiswa", (req, res) => {
  db.query("SELECT * FROM mahasiswa ORDER BY id DESC", (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  });
});

// =====================
// SERVER START
// =====================
app.listen(3000, () => {
  console.log("🚀 Backend running on port 3000");
});
