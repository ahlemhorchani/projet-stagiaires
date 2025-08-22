<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

ob_start();

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit;
}

require_once '../config/database.php';
require_once '../middleware/auth.php';

if (!isAdmin()) {
    http_response_code(403);
    // Debug - affiche les headers (commenter après debug)
    var_dump(apache_request_headers());
    ob_end_flush();
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$name = $data->name ?? '';
$email = $data->email ?? '';
$cin = $data->cin ?? '';

try {
    $stmt = $pdo->prepare("INSERT INTO stagiaires (name, email, cin) VALUES (:name, :email, :cin)");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':cin' => $cin
    ]);

    ob_clean();
    echo json_encode(["message" => "Stagiaire ajouté avec succès"]);
} catch (PDOException $e) {
    http_response_code(500);
    ob_clean();
    echo json_encode(["message" => "Erreur : " . $e->getMessage()]);
}

ob_end_flush();
exit;
