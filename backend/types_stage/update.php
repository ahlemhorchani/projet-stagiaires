<?php
// backend/types_stage/update.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Démarrage du buffer
ob_start();

// Headers CORS et type JSON
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Gestion prévol OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit;
}

// Inclusion de la DB et middleware JWT
require_once '../config/database.php';
require_once '../middleware/auth.php';

// --- Récupération du header Authorization ---
$authHeader = null;

// Cas standard
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
}
// Pour XAMPP/Apache
elseif (function_exists('apache_request_headers')) {
    $requestHeaders = apache_request_headers();
    $requestHeaders = array_change_key_case($requestHeaders, CASE_LOWER);
    if (isset($requestHeaders['authorization'])) {
        $authHeader = trim($requestHeaders['authorization']);
    }
}

// Vérification du token
if (!$authHeader) {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé : token manquant"]);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);
$payload = verify_jwt($token);

if (!$payload || !isset($payload->role) || $payload->role !== 'admin') {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé : rôle non autorisé"]);
    exit;
}

// --- Lecture des données POST ---
$data = json_decode(file_get_contents("php://input"));
$id = $data->id ?? null;
$libelle = $data->libelle ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "ID du type de stage manquant"]);
    exit;
}

if (empty($libelle)) {
    http_response_code(400);
    echo json_encode(["message" => "Le libellé est obligatoire"]);
    exit;
}

// --- Mise à jour dans la base ---
try {
    $stmt = $pdo->prepare("UPDATE types_stage SET libelle = :libelle WHERE id = :id");
    $stmt->execute([
        ':libelle' => $libelle,
        ':id' => $id
    ]);

    ob_clean();
    echo json_encode(["message" => "Type de stage mis à jour avec succès"]);
} catch (PDOException $e) {
    http_response_code(500);
    ob_clean();
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
}

ob_end_flush();
exit;
?>
