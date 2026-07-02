<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('POST');
requireAdmin();

require 'db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        throw new Exception('ID manquant');
    }
    
    $fields = [];
    $values = [];
    
    // ✅ Uniquement les champs qui existent dans la table produits
    if (isset($data['quantite'])) {
        $fields[] = "quantite = ?";
        $values[] = $data['quantite'];
    }
    
    if (isset($data['nom'])) {
        $fields[] = "nom = ?";
        $values[] = $data['nom'];
    }
    
    if (isset($data['prix'])) {
        $fields[] = "prix = ?";
        $values[] = $data['prix'];
    }
    
    if (isset($data['categorieId'])) {
        $fields[] = "categorie_id = ?";
        $values[] = $data['categorieId'];
    }
    
    // ❌ SUPPRIMÉ : Le champ 'image' n'existe plus dans la table produits
    // Les images sont maintenant dans la table produit_images
    
    if (empty($fields)) {
        throw new Exception('Aucun champ à mettre à jour');
    }
    
    $values[] = $data['id'];
    
    $sql = "UPDATE produits SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute($values)) {
        echo json_encode([
            'success' => true,
            'message' => 'Produit mis à jour avec succès'
        ]);
    } else {
        throw new Exception('Erreur lors de la mise à jour');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>