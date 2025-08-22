<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';  // <-- Inclure la config PDO

// Ici tu dois utiliser $pdo (pas $conn)

try {
    $stmt = $pdo->query("SELECT * FROM stagiaires");
    $stagiaires = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($stagiaires);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur serveur: " . $e->getMessage()]);
}
exit;
