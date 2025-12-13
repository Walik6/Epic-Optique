<?php
// Autoriser toutes les origines
header("Access-Control-Allow-Origin: *");

// Autoriser les méthodes et headers nécessaires pour fetch POST JSON
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Répondre OK pour la requête preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("
    INSERT INTO commandes 
    (nom_client, prenom_client, adresse, telephone, statut, date_commande, commentaire)
    VALUES (?, ?, ?, ?, 'en_attente', NOW(), ?)
    ");
    
    $stmt->execute([
        $data['client']['nom'],
        $data['client']['prenom'],
        $data['client']['adresse'],
        $data['client']['telephone'],
        $data['client']['commentaire'] ?? ''
    ]);


    $commande_id = $conn->lastInsertId();

    $stmtDetail = $conn->prepare("
        INSERT INTO commande_details 
        (commande_id, produit_id, quantite, prix)
        VALUES (?, ?, ?, ?)
    ");

    foreach ($data['items'] as $item) {
        $stmtDetail->execute([
            $commande_id,
            $item['produit_id'],
            $item['quantite'],
            $item['prix']
        ]);
    }

    $conn->commit();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
