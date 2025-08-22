<?php
require_once '../utils/jwt.php';

function getAuthorizationHeader() {
    $headers = null;

    // Cas standard Apache/Nginx
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    }
    // Apache sous certaines configurations
    elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        // Normalise la casse
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }

    return $headers; // Retourne null si absent
}


function isAdmin() {
    $authHeader = getAuthorizationHeader();
    if (!$authHeader) return false;

    // Supprime "Bearer " si présent
    $token = str_replace('Bearer ', '', $authHeader);

    // Vérifie le token
    $payload = verify_jwt($token);
    if (!$payload) return false;

    return isset($payload->role) && $payload->role === 'admin';
}
?>
