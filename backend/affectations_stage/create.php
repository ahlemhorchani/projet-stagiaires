<?php
// Enable CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
require_once '../config/database.php';

// Read JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log received data (for debugging)
error_log("Received data: " . print_r($data, true));

// Validate required fields
$requiredFields = [
    'stagiaire_id',
    'universite_id',
    'type_stage_id',
    'specialite',
    'date_debut',
    'date_fin',
    'annee_scolaire'
];

foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {   // ✅ corrigé ici
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Le champ '$field' est manquant."
        ]);
        exit();
    }
}
$observation = isset($data['observation']) ? $data['observation'] : null;

try {
    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO affectations_stage
        (stagiaire_id, universite_id, type_stage_id, specialite, date_debut, date_fin, annee_scolaire, observation, created_at)
        VALUES (:stagiaire_id, :universite_id, :type_stage_id, :specialite, :date_debut, :date_fin, :annee_scolaire, :observation, NOW())
    ");


    $stmt->execute([
        ':stagiaire_id' => $data['stagiaire_id'],
        ':universite_id' => $data['universite_id'],
        ':type_stage_id' => $data['type_stage_id'],
        ':specialite' => $data['specialite'],
        ':date_debut' => $data['date_debut'],
        ':date_fin' => $data['date_fin'],
        ':annee_scolaire' => $data['annee_scolaire'],
        ':observation'    => $observation
    ]);

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Affectation créée avec succès.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
