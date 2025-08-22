<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Réponse à la requête préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';
require_once '../middleware/auth.php';

// Vérification des droits
if (!isAdmin()) {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé"]);
    exit;
}

// Récupération des données
$data = json_decode(file_get_contents("php://input"));
$id = intval($data->id);

try {
    $stmt = $pdo->prepare("DELETE FROM stagiaires WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Stagiaire supprimé"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la suppression"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur : " . $e->getMessage()]);
}
