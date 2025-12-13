<?php
$host = "localhost"; 
$dbname = "u965604071_Epicoptique";
$user = "u965604071_Malik";
$pass = "***REMOVED***"; 

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $conn->exec("SET time_zone = '+01:00'");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
?>
