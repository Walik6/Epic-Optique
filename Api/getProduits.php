<?php
$conn = new mysqli("host", "user", "password", "database");

$categorie = $_GET['categorie'] ?? '';

$sql = "SELECT * FROM produits";
if($categorie) $sql .= " WHERE categorie='$categorie'";

$result = $conn->query($sql);

$produits = [];
while($row = $result->fetch_assoc()) {
    $produits[] = $row;
}

header('Content-Type: application/json');
echo json_encode($produits);
?>