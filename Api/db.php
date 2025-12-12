<?php
$host = "localhost"; // host MySQL exact
$dbname = "u965604071_Epicoptique";
$user = "u965604071_Malik";
$pass = "***REMOVED***"; // attention aux majuscules et caractères spéciaux

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
?>
