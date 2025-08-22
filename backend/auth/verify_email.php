<?php
require_once '../config/database.php';

$token = $_GET['token'] ?? '';

if (!$token) {
    echo "Lien invalide.";
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE verification_token = ?");
$stmt->execute([$token]);

if ($stmt->rowCount() === 0) {
    echo "Lien expiré ou invalide.";
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET verified = 1, verification_token = NULL WHERE verification_token = ?");
$stmt->execute([$token]);

echo "Votre email a été vérifié. Vous pouvez vous connecter.";
