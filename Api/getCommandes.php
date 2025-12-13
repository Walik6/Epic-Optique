<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require 'db.php';

$page  = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

if ($page < 1) $page = 1;
if ($limit < 1) $limit = 10;

$offset = ($page - 1) * $limit;

$stmt = $conn->prepare("
    SELECT * 
    FROM commandes 
    ORDER BY date_commande DESC
    LIMIT :limit OFFSET :offset
");

$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
