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
    $image_id = $data['image_id'] ?? null;

    if (!$image_id) {
        throw new Exception('ID de l\'image manquant');
    }

    // Récupérer l'info de l'image
    $stmt = $conn->prepare("SELECT * FROM produit_images WHERE id = ?");
    $stmt->execute([$image_id]);
    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$image) {
        throw new Exception('Image introuvable');
    }

    // Supprimer le fichier physique
    $filePath = __DIR__ . $image['image_url'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    // Supprimer de la BDD
    $stmt = $conn->prepare("DELETE FROM produit_images WHERE id = ?");
    $stmt->execute([$image_id]);

    // Si c'était l'image principale, mettre la première restante en principale
    if ($image['est_principale'] == 1) {
        $stmt = $conn->prepare("
            UPDATE produit_images 
            SET est_principale = 1 
            WHERE produit_id = ? 
            ORDER BY ordre ASC 
            LIMIT 1
        ");
        $stmt->execute([$image['produit_id']]);
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image supprimée'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>