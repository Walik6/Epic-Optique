<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('GET');
requireAdmin();

require 'db.php';

try {
    $res = [];

    // Comptage des commandes par statut
    $stmt = $conn->query("
        SELECT statut, COUNT(*) as total 
        FROM commandes 
        GROUP BY statut
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        $res[$row['statut']] = (int)$row['total'];
    }

    echo json_encode($res);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
