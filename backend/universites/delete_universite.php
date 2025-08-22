<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Gestion requête préflight
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

$sql = "DELETE FROM universites WHERE id = :id";
$stmt = $pdo->prepare($sql);

if ($stmt->execute([':id' => $id])) {
    echo json_encode(["message" => "Université supprimée"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la suppression"]);
}
