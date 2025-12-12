<?php
// En-têtes CORS - À METTRE EN PREMIER
header('Access-Control-Allow-Origin: *'); // Ou spécifiez http://localhost:5173
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

try {
    $stmt = $conn->prepare("SELECT * FROM categories");
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($categories)) {
        echo json_encode([["id"=>0,"nom"=>"Aucune catégorie","image_url"=>"/uploads/default.jpg"]]);
    } else {
        echo json_encode($categories);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}
?>