const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "IP_DB_SERVER",
  user: "maganguser",
  password: "password123",
  database: "magang_db"
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

app.post("/mahasiswa", (req, res) => {
  const {
    nama,
    tempat_magang,
    tanggal_mulai,
    tanggal_selesai,
    status_referral
  } = req.body;

  const sql = `
    INSERT INTO mahasiswa
    (nama, tempat_magang, tanggal_mulai, tanggal_selesai, status_referral)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nama,
      tempat_magang,
      tanggal_mulai,
      tanggal_selesai,
      status_referral
    ],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Data berhasil disimpan");
      }
    }
  );
});

app.get("/mahasiswa", (req, res) => {
  db.query("SELECT * FROM mahasiswa", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});