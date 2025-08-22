<?php
// ✅ CORS headers
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

// ✅ Inclusion
require_once '../config/database.php';
require_once '../utils/jwt.php';

error_log("✅ Début login.php");

// ✅ Gestion des requêtes OPTIONS (prévol)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Lecture des données
$input = file_get_contents("php://input");
error_log("📦 Données brutes reçues: " . $input);

if (empty($input)) {
    error_log("❌ Aucune donnée reçue");
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Aucune donnée reçue"]);
    exit;
}

$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("❌ Erreur JSON: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données JSON invalides"]);
    exit;
}

try {
    // ✅ Récupération
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    error_log("📝 Email reçu: $email");

    if (!$email || !$password) {
        throw new Exception("Email et mot de passe requis", 400);
    }

    // ✅ Recherche de l’utilisateur
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception("Email ou mot de passe incorrect", 401);
    }

    // ✅ Comparaison des mots de passe
    $hashedPassword = hash('sha256', $password);

    error_log("🔐 Password DB: " . $user['password']);
    error_log("🔑 Hash(password): " . $hashedPassword);

    if ($user['password'] !== $hashedPassword) {
        throw new Exception("Email ou mot de passe incorrect", 401);
    }

    // ✅ Vérification de l'email
    if (!$user['verified']) {
        throw new Exception("Email non vérifié", 403);
    }

    // ✅ Génération du token
    $payload = [
        'email' => $user['email'],
        'role' => $user['role'],
        'exp' => time() + (60 * 60) // 1 heure
    ];

    $token = generate_jwt($payload);

    echo json_encode([
        "success" => true,
        "token" => $token,
        "role" => $user['role'],
        "message" => "Connexion réussie"
    ]);

    error_log("✅ Connexion réussie pour $email");

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    error_log("❌ Erreur de connexion: " . $e->getMessage());
}
