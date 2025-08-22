<?php
// Début du script et gestion CORS
error_log("📌 Début script register.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Réponse immédiate aux requêtes OPTIONS (préflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Inclusion des dépendances
require_once '../config/database.php';
require_once '../utils/send_email.php';

// Création de l'admin par défaut s'il n'existe pas
try {
    error_log("🔍 Vérification admin existant");
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $stmt->execute();
    $adminCount = $stmt->fetchColumn();

    if ($adminCount == 0) {
        error_log("🛠 Création admin par défaut");
        $defaultAdminName = 'Admin Principal';
        $defaultAdminEmail = 'admin@example.com';
        $defaultAdminPassword = hash('sha256', 'Admin@1234');
        $defaultToken = null;

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, verified, verification_token) VALUES (?, ?, ?, 'admin', 1, ?)");
        $stmt->execute([$defaultAdminName, $defaultAdminEmail, $defaultAdminPassword, $defaultToken]);

        error_log("✅ Admin par défaut créé");
    }
} catch (Exception $e) {
    error_log("❌ Erreur création admin : " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Erreur interne serveur"]);
    exit;
}

// Lecture et décodage des données JSON envoyées
$rawInput = file_get_contents("php://input");
error_log("Données reçues (raw): " . $rawInput);

$data = json_decode($rawInput, true);
error_log("Données décodées : " . print_r($data, true));

// Validation des champs
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
    error_log("⚠️ Champs manquants ou vides : name='$name', email='$email'");
    echo json_encode(["success" => false, "message" => "Tous les champs sont obligatoires"]);
    exit;
}

// Hash du mot de passe
$hashedPassword = hash('sha256', $password);
// Génération du token de vérification
$token = bin2hex(random_bytes(32));

try {
    // Vérification doublon email
    error_log("🔍 Vérification doublon email : $email");
    $stmt = $pdo->prepare("SELECT 1 FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        error_log("❗ Email déjà utilisé");
        echo json_encode(["success" => false, "message" => "Email déjà utilisé"]);
        exit;
    }

    // Insertion utilisateur en base
    error_log("✅ Email disponible, insertion en base");
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword, $token]);

    // Envoi email de vérification
    error_log("📧 Envoi de l’email de vérification à $email");
    send_verification_email($email, $token);

    // Succès inscription
    error_log("🎉 Inscription réussie");
    echo json_encode(["success" => true, "message" => "Inscription réussie. Vérifiez votre email."]);

} catch (Exception $e) {
    error_log("❌ Erreur inscription utilisateur : " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Erreur lors de l’inscription"]);
    exit;
}
