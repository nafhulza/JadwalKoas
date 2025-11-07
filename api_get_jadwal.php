<?php
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    include 'config.php';

    $sql = "SELECT * FROM jadwal_koas ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $jadwal = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $jadwal[] = $row;
        }
    }

    echo json_encode($jadwal);
    $conn->close();
?>