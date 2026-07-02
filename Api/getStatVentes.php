<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('GET');
requireAdmin();

require_once 'db.php';

try {

    // CA total
    $stmt = $conn->query("SELECT COALESCE(SUM(total), 0) AS total_ca FROM ventes");
    $total_ca = (float) $stmt->fetch(PDO::FETCH_ASSOC)['total_ca'];

    // Aujourd'hui
    $stmt = $conn->query("
        SELECT 
            COUNT(*) AS count,
            COALESCE(SUM(total), 0) AS ca
        FROM ventes
        WHERE DATE(date_vente) = CURDATE()
    ");
    $today = $stmt->fetch(PDO::FETCH_ASSOC);

    // Mois
    $stmt = $conn->query("
        SELECT 
            COUNT(*) AS count,
            COALESCE(SUM(total), 0) AS ca
        FROM ventes
        WHERE YEAR(date_vente) = YEAR(CURDATE())
        AND MONTH(date_vente) = MONTH(CURDATE())
    ");
    $month = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_ca' => $total_ca,
            'ventes_aujourd_hui' => (int) $today['count'],
            'ca_aujourd_hui' => (float) $today['ca'],
            'ventes_mois' => (int) $month['count'],
            'ca_mois' => (float) $month['ca']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
