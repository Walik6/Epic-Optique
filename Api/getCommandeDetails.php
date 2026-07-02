<?php
require_once __DIR__ . '/auth.php';
sendCorsHeaders('GET');
requireAdmin();

require 'db.php';

$id = $_GET['id'];

$stmt = $conn->prepare("
  SELECT d.*, p.nom 
  FROM commande_details d
  JOIN produits p ON p.id = d.produit_id
  WHERE d.commande_id = ?
");
$stmt->execute([$id]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
