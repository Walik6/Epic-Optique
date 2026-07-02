<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('GET');
requireAdmin();

require_once 'db.php';

try {

    /* ===========================
       CAS 1 : Vente avec détails
    ============================ */
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];

        // Vente
        $stmt = $conn->prepare("SELECT * FROM ventes WHERE id = ?");
        $stmt->execute([$id]);
        $vente = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$vente) {
            http_response_code(404);
            echo json_encode(['error' => 'Vente introuvable']);
            exit;
        }

        // Détails
        $stmt = $conn->prepare("
            SELECT 
                vd.*,
                p.nom AS produit_nom
            FROM ventes_details vd
            LEFT JOIN produits p ON vd.produit_id = p.id
            WHERE vd.vente_id = ?
        ");
        $stmt->execute([$id]);
        $vente['details'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['vente' => $vente]);
        exit;
    }

    /* ===========================
       CAS 2 : Liste des ventes
    ============================ */

    $page  = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 15;
    $offset = ($page - 1) * $limit;
    $filter = $_GET['filter'] ?? 'all';

    $whereClause = "WHERE 1=1";

    switch ($filter) {
        case 'today':
            $whereClause .= " AND DATE(date_vente) = CURDATE()";
            break;

        case 'week':
            $whereClause .= " AND YEARWEEK(date_vente, 1) = YEARWEEK(CURDATE(), 1)";
            break;

        case 'month':
            $whereClause .= " AND YEAR(date_vente) = YEAR(CURDATE()) 
                              AND MONTH(date_vente) = MONTH(CURDATE())";
            break;
    }

    // Total
    $countStmt = $conn->query("SELECT COUNT(*) FROM ventes $whereClause");
    $totalVentes = (int) $countStmt->fetchColumn();

    // IMPORTANT : LIMIT & OFFSET injectés en INT
    $limit  = (int) $limit;
    $offset = (int) $offset;

    $stmt = $conn->prepare("
        SELECT 
            v.*,
            (SELECT COUNT(*) FROM ventes_details WHERE vente_id = v.id) AS nombre_articles
        FROM ventes v
        $whereClause
        ORDER BY v.date_vente DESC
        LIMIT $limit OFFSET $offset
    ");

    $stmt->execute();
    $ventes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'ventes' => $ventes,
        'totalPages' => ceil($totalVentes / $limit),
        'currentPage' => $page,
        'total' => $totalVentes
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
