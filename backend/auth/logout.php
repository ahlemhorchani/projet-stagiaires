<?php
// C:\xampp\htdocs\backend\auth\logout.php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// require relatif correct depuis backend/auth => ../utils/jwt.php
require_once __DIR__ . '/../utils/jwt.php';

function getAuthorizationHeader() {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) return trim($_SERVER['HTTP_AUTHORIZATION']);
    if (function_exists('apache_request_headers')) {
        $rh = apache_request_headers();
        if (isset($rh['Authorization'])) return trim($rh['Authorization']);
        if (isset($rh['authorization'])) return trim($rh['authorization']);
    }
    return null;
}

$authHeader = getAuthorizationHeader();
if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token manquant']);
    exit;
}

$parts = explode(' ', $authHeader);
if (count($parts) < 2 || strtolower($parts[0]) !== 'bearer') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format du token invalide']);
    exit;
}

$token = $parts[1];

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Déconnexion réussie']);
exit;
