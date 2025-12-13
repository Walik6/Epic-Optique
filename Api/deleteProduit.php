<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        throw new Exception('ID manquant');
    }

    $id = intval($data['id']);

    // Vérifier si le produit est utilisé dans des commandes
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM commande_details WHERE produit_id = ?");
    $stmt->execute([$id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] > 0) {
        throw new Exception('Impossible de supprimer ce produit car il est présent dans ' . $result['count'] . ' commande(s). Vous pouvez plutôt mettre sa quantité à 0.');
    }

    $conn->beginTransaction();

    // Supprimer les images physiques du serveur
    $uploadDir = __DIR__ . '/uploads/produits/' . $id . '/';
    if (is_dir($uploadDir)) {
        $files = array_diff(scandir($uploadDir), ['.', '..']);
        foreach ($files as $file) {
            unlink($uploadDir . $file);
        }
        rmdir($uploadDir);
    }

    // Supprimer les entrées d'images dans la BDD (CASCADE le fera automatiquement normalement)
    $stmt = $conn->prepare("DELETE FROM produit_images WHERE produit_id = ?");
    $stmt->execute([$id]);

    // Supprimer le produit
    $stmt = $conn->prepare("DELETE FROM produits WHERE id = ?");
    
    if (!$stmt->execute([$id])) {
        throw new Exception('Impossible de supprimer le produit');
    }

    $conn->commit();

    http_response_code(200);
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit;
?>