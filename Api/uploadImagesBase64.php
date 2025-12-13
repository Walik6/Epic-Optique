<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!isset($data['produit_id']) || !isset($data['images'])) {
        throw new Exception('Données manquantes');
    }
    
    $produit_id = (int)$data['produit_id'];
    $images = $data['images'];
    
    // Vérifier le produit existe
    $stmt = $conn->prepare("SELECT id FROM produits WHERE id = ?");
    $stmt->execute([$produit_id]);
    if (!$stmt->fetch()) {
        throw new Exception('Produit introuvable');
    }
    
    // Créer les dossiers
    $produitDir = __DIR__ . '/uploads/produits/' . $produit_id . '/';
    if (!is_dir($produitDir)) {
        mkdir($produitDir, 0755, true);
    }
    
    // Compter les images existantes
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM produit_images WHERE produit_id = ?");
    $stmt->execute([$produit_id]);
    $currentCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($currentCount + count($images) > 5) {
        throw new Exception('Maximum 5 images');
    }
    
    $estPremiere = ($currentCount == 0);
    $uploadedImages = [];
    
    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/jpg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif'
    ];
    
    foreach ($images as $index => $imageData) {
        $base64 = $imageData['data'];
        $mimeType = $imageData['type'];
        
        if (!isset($allowedTypes[$mimeType])) {
            continue;
        }
        
        $imageContent = base64_decode($base64, true);
        if ($imageContent === false) {
            continue;
        }
        
        // Vérifier taille (5MB max)
        if (strlen($imageContent) > 5 * 1024 * 1024) {
            continue;
        }
        
        $extension = $allowedTypes[$mimeType];
        $filename = 'img_' . uniqid() . '.' . $extension;
        $filepath = $produitDir . $filename;
        
        if (file_put_contents($filepath, $imageContent) === false) {
            continue;
        }
        
        $imageUrl = '/uploads/produits/' . $produit_id . '/' . $filename;
        $ordre = $currentCount + $index + 1;
        $estPrincipale = ($estPremiere && $index === 0) ? 1 : 0;
        
        $stmt = $conn->prepare("
            INSERT INTO produit_images (produit_id, image_url, ordre, est_principale) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$produit_id, $imageUrl, $ordre, $estPrincipale]);
        
        $uploadedImages[] = [
            'id' => $conn->lastInsertId(),
            'image_url' => $imageUrl,
            'ordre' => $ordre,
            'est_principale' => $estPrincipale
        ];
    }
    
    if (empty($uploadedImages)) {
        throw new Exception('Aucune image uploadée');
    }
    
    echo json_encode([
        'success' => true,
        'images' => $uploadedImages,
        'message' => count($uploadedImages) . ' image(s) uploadée(s)'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>