<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Gestion de la requête préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';
require_once '../middleware/auth.php';

if (!isAdmin()) {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$id = intval($data->id);
$nom = $pdo->quote($data->nom);
$adresse = $pdo->quote($data->adresse);

$sql = "UPDATE universites SET nom=$nom, adresse=$adresse WHERE id=$id";

try {
    $pdo->exec($sql);
    echo json_encode(["message" => "Université mise à jour avec succès"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur : " . $e->getMessage()]);
}
?>
