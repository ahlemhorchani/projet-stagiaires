<?php
require_once '../config/database.php';
require_once '../middleware/auth.php';

if (!isAdmin()) {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé"]);
    exit;
}

$sql = "SELECT p.id, u.name, p.date, p.status
        FROM presences p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.date DESC";

$result = $conn->query($sql);
$presences = [];

while ($row = $result->fetch_assoc()) {
    $presences[] = $row;
}

echo json_encode($presences);
?>
