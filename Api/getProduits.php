<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

// Base URL déduite de la requête (évite de coder un domaine en dur qui casse
// dès qu'on change d'hébergeur ou d'environnement)
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$baseUrl = $scheme . '://' . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');

// ========================================
// CAS 1 : RÉCUPÉRER UN SEUL PRODUIT PAR ID
// ========================================
if (isset($_GET['id'])) {
    try {
        $id = intval($_GET['id']);
        
        // Récupérer le produit
        $stmt = $conn->prepare("
            SELECT 
                p.*,
                c.nom as categorie_nom
            FROM produits p
            LEFT JOIN categories c ON p.categorie_id = c.id
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $produit = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($produit) {
            // ✅ Récupérer TOUTES les images du produit, triées par ordre
            $stmt = $conn->prepare("
                SELECT 
                    id,
                    produit_id,
                    image_url,
                    ordre,
                    est_principale,
                    date_ajout
                FROM produit_images 
                WHERE produit_id = ? 
                ORDER BY est_principale DESC, ordre ASC
            ");
            $stmt->execute([$id]);
            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Ajouter l'URL complète pour chaque image
            foreach ($images as &$img) {
                $img['image_url'] = $baseUrl . $img['image_url'];
            }
            
            // ✅ Ajouter le tableau d'images au produit
            $produit['images'] = $images;
            
            // Pour compatibilité: image principale dans le champ "image"
            $imagePrincipale = array_filter($images, fn($img) => $img['est_principale'] == 1);
            $produit['image'] = !empty($imagePrincipale) 
                ? array_values($imagePrincipale)[0]['image_url'] 
                : (isset($images[0]) ? $images[0]['image_url'] : null);
            
            echo json_encode(["produit" => $produit]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Produit introuvable"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// ========================================
// CAS 2 : LISTE DES PRODUITS
// ========================================

$show_out_of_stock = isset($_GET['show_out_of_stock']) && $_GET['show_out_of_stock'] === 'true';
$promo_only = isset($_GET['promo']) && $_GET['promo'] === 'true';
$categorie_id = $_GET['categorie'] ?? '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$search = $_GET['search'] ?? '';
$filter = $_GET['filter'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
$offset = $limit ? ($page - 1) * $limit : 0;
$promoCondition = " AND prix_promo IS NOT NULL AND prix_promo > 0 AND prix_promo < prix";

try {
    // ========================================
    // COMPTER LE NOMBRE TOTAL DE PRODUITS
    // ========================================
    $countSql = "SELECT COUNT(*) FROM produits WHERE 1=1";
    if (!$show_out_of_stock) {
        $countSql .= " AND quantite > 0";
    }
    if ($promo_only) {
        $countSql .= $promoCondition;
    }

    $countParams = [];
    
    if ($categorie_id) {
        $countSql .= " AND categorie_id = ?";
        $countParams[] = $categorie_id;
    }
    if ($search) {
        $countSql .= " AND nom LIKE ?";
        $countParams[] = "%$search%";
    }
    
    $countStmt = $conn->prepare($countSql);
    foreach ($countParams as $i => $p) {
        $countStmt->bindValue($i + 1, $p, is_int($p) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $countStmt->execute();
    $totalProduits = (int)$countStmt->fetchColumn();

    // ========================================
    // RÉCUPÉRER LES PRODUITS
    // ========================================
    $sql = "SELECT * FROM produits WHERE 1=1";

    if (!$show_out_of_stock) {
        $sql .= " AND quantite > 0";
    }
    if ($promo_only) {
        $sql .= $promoCondition;
    }

    $params = [];
    
    if ($categorie_id) {
        $sql .= " AND categorie_id = ?";
        $params[] = $categorie_id;
    }
    if ($search) {
        $sql .= " AND nom LIKE ?";
        $params[] = "%$search%";
    }
    
    if ($filter === 'prix_asc') $sql .= " ORDER BY prix ASC";
    elseif ($filter === 'prix_desc') $sql .= " ORDER BY prix DESC";
    else $sql .= " ORDER BY id DESC";
    
    if ($limit) {
        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
    }
    
    $stmt = $conn->prepare($sql);
    foreach ($params as $i => $p) {
        $stmt->bindValue($i + 1, $p, is_int($p) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $stmt->execute();
    $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ✅ OPTIMISATION : Récupérer toutes les images en UNE SEULE requête
    if (!empty($produits)) {
        $produitIds = array_column($produits, 'id');
        $placeholders = implode(',', array_fill(0, count($produitIds), '?'));
        
        $stmtImages = $conn->prepare("
            SELECT 
                produit_id,
                image_url,
                est_principale,
                ordre
            FROM produit_images
            WHERE produit_id IN ($placeholders)
            ORDER BY produit_id, est_principale DESC, ordre ASC
        ");
        $stmtImages->execute($produitIds);
        $allImages = $stmtImages->fetchAll(PDO::FETCH_ASSOC);
        
        // Créer un index des images par produit_id
        $imagesByProduit = [];
        foreach ($allImages as $img) {
            if (!isset($imagesByProduit[$img['produit_id']])) {
                $imagesByProduit[$img['produit_id']] = $img['image_url'];
            }
        }
        
        // Assigner les images aux produits
        foreach ($produits as &$p) {
            if (isset($imagesByProduit[$p['id']])) {
                $p['image'] = $baseUrl . $imagesByProduit[$p['id']];
            } else {
                $p['image'] = null;
            }
        }
    }

    // ========================================
    // RÉPONSE
    // ========================================
    if ($limit) {
        echo json_encode([
            "produits" => $produits,
            "totalPages" => ceil($totalProduits / $limit),
            "currentPage" => $page,
            "total" => $totalProduits
        ]);
    } else {
        echo json_encode($produits);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>