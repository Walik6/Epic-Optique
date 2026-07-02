<?php
// ========================================
// CORS + AUTH - DOIT ÊTRE EN PREMIER
// ========================================
require_once __DIR__ . '/auth.php';
sendCorsHeaders('POST, GET');
requireAdmin();

// ========================================
// VÉRIFICATIONS DE SÉCURITÉ
// ========================================

// Vérifier que c'est bien une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Méthode non autorisée. Utilisez POST.'
    ]);
    exit;
}

// Vérifier que les uploads sont activés
if (!ini_get('file_uploads')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Les uploads de fichiers sont désactivés sur ce serveur'
    ]);
    exit;
}

// ========================================
// CONNEXION BASE DE DONNÉES
// ========================================
try {
    require_once 'db.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de connexion à la base de données'
    ]);
    exit;
}

// ========================================
// TRAITEMENT DE L'UPLOAD
// ========================================
try {
    // Récupérer l'ID du produit
    $produit_id = $_POST['produit_id'] ?? null;
    
    if (!$produit_id || !is_numeric($produit_id)) {
        throw new Exception('ID du produit invalide ou manquant');
    }
    
    // Vérifier que le produit existe
    $stmt = $conn->prepare("SELECT id FROM produits WHERE id = ?");
    $stmt->execute([$produit_id]);
    if (!$stmt->fetch()) {
        throw new Exception('Produit introuvable avec l\'ID: ' . $produit_id);
    }
    
    // Vérifier qu'au moins un fichier a été uploadé
    if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
        throw new Exception('Aucune image reçue. Vérifiez le formulaire.');
    }
    
    // ========================================
    // CRÉER LE DOSSIER D'UPLOAD
    // ========================================
    $baseDir = __DIR__ . '/uploads/produits/';
    $produitDir = $baseDir . $produit_id . '/';
    
    // Créer le dossier de base s'il n'existe pas
    if (!is_dir($baseDir)) {
        if (!mkdir($baseDir, 0755, true)) {
            throw new Exception('Impossible de créer le dossier uploads/produits/');
        }
    }
    
    // Créer le dossier du produit
    if (!is_dir($produitDir)) {
        if (!mkdir($produitDir, 0755, true)) {
            throw new Exception('Impossible de créer le dossier du produit');
        }
    }
    
    // Vérifier les permissions d'écriture
    if (!is_writable($produitDir)) {
        throw new Exception('Le dossier n\'est pas accessible en écriture. Permissions: ' . substr(sprintf('%o', fileperms($produitDir)), -4));
    }
    
    // ========================================
    // CONFIGURATION UPLOAD
    // ========================================
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    $uploadedImages = [];
    $errors = [];
    
    $files = $_FILES['images'];
    $fileCount = count($files['name']);
    
    // Vérifier le nombre actuel d'images
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM produit_images WHERE produit_id = ?");
    $stmt->execute([$produit_id]);
    $currentCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($currentCount + $fileCount > 5) {
        throw new Exception('Maximum 5 images par produit. Actuellement: ' . $currentCount);
    }
    
    // Déterminer si c'est la première image (sera principale)
    $estPremiere = ($currentCount == 0);
    
    // ========================================
    // TRAITER CHAQUE FICHIER
    // ========================================
    for ($i = 0; $i < $fileCount; $i++) {
        $error = $files['error'][$i];
        
        // Vérifier les erreurs PHP
        if ($error !== UPLOAD_ERR_OK) {
            $errorMsg = match($error) {
                UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (dépassement upload_max_filesize)',
                UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux (dépassement MAX_FILE_SIZE)',
                UPLOAD_ERR_PARTIAL => 'Upload partiel seulement',
                UPLOAD_ERR_NO_FILE => 'Aucun fichier uploadé',
                UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
                UPLOAD_ERR_CANT_WRITE => 'Échec d\'écriture sur le disque',
                UPLOAD_ERR_EXTENSION => 'Extension PHP a arrêté l\'upload',
                default => 'Erreur inconnue: ' . $error
            };
            $errors[] = $files['name'][$i] . ': ' . $errorMsg;
            continue;
        }
        
        $tmpName = $files['tmp_name'][$i];
        $originalName = $files['name'][$i];
        
        // Vérifier que le fichier existe
        if (!file_exists($tmpName)) {
            $errors[] = $originalName . ': Fichier temporaire introuvable';
            continue;
        }
        
        // Vérifier le type MIME
        $fileType = mime_content_type($tmpName);
        if (!in_array($fileType, $allowedTypes)) {
            $errors[] = $originalName . ': Type non autorisé (' . $fileType . ')';
            continue;
        }
        
        // Vérifier la taille
        if ($files['size'][$i] > $maxSize) {
            $errors[] = $originalName . ': Trop volumineux (' . round($files['size'][$i] / 1024 / 1024, 2) . 'MB)';
            continue;
        }
        
        // Générer un nom unique et sécurisé
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $filename = 'img_' . uniqid() . '_' . time() . '.' . $extension;
        $destination = $produitDir . $filename;
        
        // Déplacer le fichier
        if (move_uploaded_file($tmpName, $destination)) {
            // URL relative pour la BDD
            $imageUrl = '/uploads/produits/' . $produit_id . '/' . $filename;
            
            // Ordre : actuel + position dans le batch
            $ordre = $currentCount + $i + 1;
            
            // Première image = principale
            $estPrincipale = ($estPremiere && $i === 0) ? 1 : 0;
            
            // Insérer dans la BDD
            $stmt = $conn->prepare("
                INSERT INTO produit_images (produit_id, image_url, ordre, est_principale) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$produit_id, $imageUrl, $ordre, $estPrincipale]);
            
            $uploadedImages[] = [
                'id' => $conn->lastInsertId(),
                'image_url' => $imageUrl,
                'ordre' => $ordre,
                'est_principale' => $estPrincipale,
                'filename' => $filename
            ];
        } else {
            $errors[] = $originalName . ': Échec du déplacement du fichier';
        }
    }
    
    // ========================================
    // RÉPONSE
    // ========================================
    if (empty($uploadedImages) && !empty($errors)) {
        throw new Exception('Aucune image uploadée. Erreurs: ' . implode(', ', $errors));
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'images' => $uploadedImages,
        'message' => count($uploadedImages) . ' image(s) uploadée(s) avec succès',
        'errors' => $errors,
        'debug' => [
            'produit_id' => $produit_id,
            'files_received' => $fileCount,
            'files_uploaded' => count($uploadedImages),
            'upload_dir' => $produitDir
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>