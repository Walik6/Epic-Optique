<?php
// CORS centralisé. Contrairement à "Access-Control-Allow-Origin: *", on
// reflète une origine précise dans une liste blanche : c'est nécessaire
// pour pouvoir envoyer le cookie de session (Allow-Credentials ne
// fonctionne pas avec un wildcard '*').
function sendCorsHeaders($methods = 'GET, POST') {
    $allowedOrigins = [
        'https://epicoptique.com',
        'http://localhost:5173',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
    header("Access-Control-Allow-Methods: $methods, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");
    header("Content-Type: application/json; charset=utf-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
