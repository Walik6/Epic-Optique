<?php
header('Content-Type: application/json');
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

// Vérifier champs
$nom = $_POST['nom'] ?? '';
$categorie_id = $_POST['categorie_id'] ?? 0;
$prix = $_POST['prix'] ?? 0;
$quantite = $_POST['quantite'] ?? 0;

if (!$nom || !$categorie_id || !$prix || !$quantite) {
    echo json_encode(["error" => "Champs manquants"]);
    exit;
}

// Gestion upload image
$imagePath = null;

if (!empty($_FILES['image']['name'])) {
    $uploadDir = __DIR__ . '/uploads/';
    $filename = time() . '_' . basename($_FILES['image']['name']);
    $filePath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
        $imagePath = "/uploads/" . $filename;
    } else {
        echo json_encode(["error" => "Échec upload image"]);
        exit;
    }
}

try {
    $stmt = $conn->prepare("
        INSERT INTO produits (nom, categorie_id, prix, image, quantite)
        VALUES (:nom, :categorie_id, :prix, :image, :quantite)
    ");

    $stmt->execute([
        ":nom" => $nom,
        ":categorie_id" => $categorie_id,
        ":prix" => $prix,
        ":image" => $imagePath,
        ":quantite" => $quantite,
    ]);

    echo json_encode(["success" => true, "message" => "Produit ajouté !"]);
} 
catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
