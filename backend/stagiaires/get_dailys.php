<?php
require_once '../config/database.php';
require_once '../middleware/auth.php';

if (!isAdmin()) {
    http_response_code(403);
    echo json_encode(["message" => "Accès refusé"]);
    exit;
}

$sql = "SELECT d.id, u.name, d.date, d.content
        FROM dailys d
        JOIN users u ON d.user_id = u.id
        ORDER BY d.date DESC";

$result = $conn->query($sql);
$dailys = [];

while ($row = $result->fetch_assoc()) {
    $dailys[] = $row;
}

echo json_encode($dailys);
?>
