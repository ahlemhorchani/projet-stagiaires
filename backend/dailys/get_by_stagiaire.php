<?php
require_once '../config/database.php';
require_once '../middleware/auth.php';

if (!isAdmin()) {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé"]);
    exit;
}

if (!isset($_GET['stagiaireId'])) {
    http_response_code(400);
    echo json_encode(["message" => "Paramètre stagiaireId manquant"]);
    exit;
}

$stagiaireId = intval($_GET['stagiaireId']);

$sql = "SELECT * FROM dailys WHERE stagiaire_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $stagiaireId);
$stmt->execute();
$result = $stmt->get_result();

$dailys = [];
while ($row = $result->fetch_assoc()) {
    $dailys[] = $row;
}

echo json_encode($dailys);
?>
