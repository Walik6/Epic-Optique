<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$categorie_id = $_GET['categorie'] ?? '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$search = $_GET['search'] ?? '';
$filter = $_GET['filter'] ?? '';
$limit = 12;
$offset = ($page - 1) * $limit;

try {
    $sql = "SELECT * FROM produits WHERE 1=1";
    $params = [];

    if ($categorie_id) {
        $sql .= " AND categorie_id = ?";
        $params[] = $categorie_id;
    }

    if ($search) {
        $sql .= " AND nom LIKE ?";
        $params[] = "%$search%";
    }

    if ($filter === 'prix_asc') $sql .= " ORDER BY prix ASC";
    elseif ($filter === 'prix_desc') $sql .= " ORDER BY prix DESC";
    else $sql .= " ORDER BY id ASC";

    $sql .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $conn->prepare($sql);

    foreach ($params as $i => $p) {
        $stmt->bindValue($i + 1, $p, is_int($p) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }

    $stmt->execute();
    $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($produits as &$p) {
        $p['image'] = "https://coral-termite-458611.hostingersite.com/Api" . $p['image'];
    }

    echo json_encode($produits);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
