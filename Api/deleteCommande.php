<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('POST');
requireAdmin();

require 'db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit;
    }

    $id = intval($id);

    $conn->beginTransaction();

    $stmt1 = $conn->prepare("DELETE FROM commande_details WHERE commande_id = ?");
    $stmt1->execute([$id]);

    $stmt2 = $conn->prepare("DELETE FROM commandes WHERE id = ?");
    $stmt2->execute([$id]);

    $conn->commit();

    http_response_code(200);
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la suppression"]);
}

exit;
?>