<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

// Lecture des données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['stagiaire_id'], $data['universite_id'], $data['type_stage_id'], $data['specialite'], $data['date_debut'], $data['date_fin'], $data['annee_scolaire'], $data['observation'] )) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Champs manquants']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE affectations_stage
        SET stagiaire_id = ?, universite_id = ?, type_stage_id = ?, specialite = ?, date_debut = ?, date_fin = ?, annee_scolaire = ?, observation = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $data['stagiaire_id'],
        $data['universite_id'],
        $data['type_stage_id'],
        $data['specialite'],
        $data['date_debut'],
        $data['date_fin'],
        $data['annee_scolaire'],
        $data['observation'],
        $data['id']
    ]);

    echo json_encode(['success' => true, 'message' => 'Affectation mise à jour']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
