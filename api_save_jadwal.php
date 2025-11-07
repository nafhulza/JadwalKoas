<?php
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    include 'config.php';

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    $nama = $data['nama'];
    $nim = $data['nim'];
    $stase = $data['stase'];
    $rumahSakit = $data['rumahSakit'];
    $tanggalMulai = $data['tanggalMulai'];
    $tanggalSelesai = $data['tanggalSelesai'];
    $pembimbing = $data['pembimbing'];
    $status = $data['status'];

    if ($id) {
        // Update
        $sql = "UPDATE jadwal_koas SET nama_mahasiswa=?, nim=?, stase=?, rumah_sakit=?, tanggal_mulai=?, tanggal_selesai=?, dosen_pembimbing=?, status=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssssi", $nama, $nim, $stase, $rumahSakit, $tanggalMulai, $tanggalSelesai, $pembimbing, $status, $id);
    } else {
        // Insert
        $sql = "INSERT INTO jadwal_koas (nama_mahasiswa, nim, stase, rumah_sakit, tanggal_mulai, tanggal_selesai, dosen_pembimbing, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssss", $nama, $nim, $stase, $rumahSakit, $tanggalMulai, $tanggalSelesai, $pembimbing, $status);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }

    $stmt->close();
    $conn->close();
?>