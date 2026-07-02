<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('POST');
requireAdmin();

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['id'], $data['statut'])){
    $stmt = $conn->prepare("UPDATE commandes SET statut = ? WHERE id = ?");
    $updated = $stmt->execute([$data['statut'], $data['id']]);

    if($updated){
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Impossible de mettre à jour le statut"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Paramètres manquants"]);
}
