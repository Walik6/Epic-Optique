<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('POST');
requireAdmin();

require 'db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validation des champs obligatoires
    if (!isset($data['nom']) || empty($data['nom'])) {
        throw new Exception('Le nom du produit est obligatoire');
    }
    
    if (!isset($data['prix']) || !is_numeric($data['prix'])) {
        throw new Exception('Le prix est obligatoire et doit être un nombre');
    }
    
    if (!isset($data['quantite']) || !is_numeric($data['quantite'])) {
        throw new Exception('La quantité est obligatoire et doit être un nombre');
    }
    
    if (!isset($data['categorieId']) || empty($data['categorieId'])) {
        throw new Exception('La catégorie est obligatoire');
    }

    // Prix promo optionnel : vide/absent = pas de promo
    $prixPromo = null;
    if (!empty($data['prixPromo'])) {
        if (!is_numeric($data['prixPromo'])) {
            throw new Exception('Le prix promo doit être un nombre');
        }
        if ((float)$data['prixPromo'] >= (float)$data['prix']) {
            throw new Exception('Le prix promo doit être inférieur au prix normal');
        }
        $prixPromo = $data['prixPromo'];
    }

    // ✅ Insertion SANS le champ 'image' (qui n'existe plus dans la table produits)
    $stmt = $conn->prepare("
        INSERT INTO produits (nom, prix, prix_promo, quantite, categorie_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    $success = $stmt->execute([
        $data['nom'],
        $data['prix'],
        $prixPromo,
        $data['quantite'],
        $data['categorieId']
    ]);
    
    if (!$success) {
        throw new Exception('Erreur lors de l\'insertion du produit');
    }
    
    // Récupérer l'ID du produit créé
    $produitId = $conn->lastInsertId();
    
    // Récupérer le produit complet
    $stmt = $conn->prepare("
        SELECT p.*, c.nom as categorie_nom 
        FROM produits p 
        LEFT JOIN categories c ON p.categorie_id = c.id 
        WHERE p.id = ?
    ");
    $stmt->execute([$produitId]);
    $produit = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'produit' => $produit,
        'message' => 'Produit ajouté avec succès'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>