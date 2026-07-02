<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('POST');
requireAdmin();

require 'db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $image_id = $data['image_id'] ?? null;

    if (!$image_id) {
        throw new Exception('ID de l\'image manquant');
    }

    // Récupérer l'image
    $stmt = $conn->prepare("SELECT produit_id FROM produit_images WHERE id = ?");
    $stmt->execute([$image_id]);
    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$image) {
        throw new Exception('Image introuvable');
    }

    $conn->beginTransaction();

    // Retirer le statut principal de toutes les images du produit
    $stmt = $conn->prepare("UPDATE produit_images SET est_principale = 0 WHERE produit_id = ?");
    $stmt->execute([$image['produit_id']]);

    // Définir la nouvelle image principale
    $stmt = $conn->prepare("UPDATE produit_images SET est_principale = 1 WHERE id = ?");
    $stmt->execute([$image_id]);

    $conn->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image principale définie'
    ]);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>