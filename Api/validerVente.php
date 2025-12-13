<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
        throw new Exception('Panier vide ou invalide');
    }
    
    if (!isset($data['total']) || !is_numeric($data['total'])) {
        throw new Exception('Total invalide');
    }
    
    $items = $data['items'];
    $total = $data['total'];
    
    // Démarrer une transaction
    $conn->beginTransaction();
    
    // 1. Créer la vente dans la table 'ventes'
    $stmt = $conn->prepare("
        INSERT INTO ventes (date_vente, total) 
        VALUES (NOW(), ?)
    ");
    $stmt->execute([$total]);
    $vente_id = $conn->lastInsertId();
    
    // 2. Pour chaque produit vendu
    foreach ($items as $item) {
        $produit_id = $item['produit_id'];
        $quantite = $item['quantite'];
        $prix_unitaire = $item['prix_unitaire'];
        
        // Vérifier le stock disponible
        $stmt = $conn->prepare("SELECT quantite FROM produits WHERE id = ?");
        $stmt->execute([$produit_id]);
        $produit = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$produit) {
            throw new Exception('Produit introuvable: ID ' . $produit_id);
        }
        
        if ($produit['quantite'] < $quantite) {
            throw new Exception('Stock insuffisant pour le produit ID ' . $produit_id);
        }
        
        // a) Insérer dans ventes_details
        $stmt = $conn->prepare("
            INSERT INTO ventes_details (vente_id, produit_id, quantite, prix_unitaire) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$vente_id, $produit_id, $quantite, $prix_unitaire]);
        
        // b) Décrémenter le stock
        $stmt = $conn->prepare("
            UPDATE produits 
            SET quantite = quantite - ? 
            WHERE id = ?
        ");
        $stmt->execute([$quantite, $produit_id]);
    }
    
    // Valider la transaction
    $conn->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'vente_id' => $vente_id,
        'message' => 'Vente enregistrée avec succès'
    ]);
    
} catch (PDOException $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>