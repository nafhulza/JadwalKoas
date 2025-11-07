-- Buat database
CREATE DATABASE IF NOT EXISTS jadwal_koas;
USE jadwal_koas;

-- Buat tabel jadwal_koas
CREATE TABLE IF NOT EXISTS jadwal_koas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_mahasiswa VARCHAR(100) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    stase VARCHAR(50) NOT NULL,
    rumah_sakit VARCHAR(100) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    dosen_pembimbing VARCHAR(100) NOT NULL,
    status ENUM('Aktif', 'Selesai', 'Ditunda') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data sesuai dengan yang diberikan
INSERT INTO jadwal_koas (nama_mahasiswa, nim, stase, rumah_sakit, tanggal_mulai, tanggal_selesai, dosen_pembimbing, status) VALUES
('Fauzia Amanda', '22111012384', 'Penyakit Dalam', 'RSUD Dr. Soetomo', '2025-09-01', '2026-10-31', 'Dr. Surya Adi, Sp.PD', 'Aktif'),
('Tugba Amelda', '22111012346', 'Obstetri dan Ginekologi', 'RSIA Kendangsari', '2025-09-15', '2026-11-15', 'Dr. Maya Sari, Sp.OG', 'Aktif'),
('Yolanda Brian', '21121012765', 'Pediatri', 'RSUD Dr. Soetomo', '2025-10-01', '2026-11-30', 'Dr. Indah Permatasari, Sp.A', 'Aktif'),
('Ricky Rullian', '21121012453', 'Ilmu Bedah', 'RS Universitas Airlangga', '2025-08-15', '2026-10-15', 'Dr. Agus Setiawan, Sp.B', 'Selesai'),
('Rani Handita', '22111012876', 'Neurologi', 'RSUD Dr. Soetomo', '2025-10-10', '2026-12-10', 'Dr. Linda Wati, Sp.N', 'Aktif');

-- Buat index untuk pencarian
CREATE INDEX idx_nama ON jadwal_koas(nama_mahasiswa);
CREATE INDEX idx_nim ON jadwal_koas(nim);
CREATE INDEX idx_stase ON jadwal_koas(stase);
CREATE INDEX idx_rumah_sakit ON jadwal_koas(rumah_sakit);
CREATE INDEX idx_tanggal ON jadwal_koas(tanggal_mulai, tanggal_selesai);
CREATE INDEX idx_status ON jadwal_koas(status);