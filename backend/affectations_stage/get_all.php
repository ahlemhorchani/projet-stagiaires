<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Réponse pour la requête préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inclure la connexion PDO
require_once '../config/database.php';

try {
    $stmt = $pdo->query("
        SELECT
            a.id,
            a.stagiaire_id,
            s.name AS stagiaire_nom,
            s.email AS stagiaire_email,
            a.universite_id,
            u.nom AS universite_nom,
            a.type_stage_id,
            t.libelle AS type_stage_nom,
            a.specialite,
            a.date_debut,
            a.date_fin,
            a.observation,
            a.annee_scolaire,
            a.created_at
        FROM affectations_stage a
        LEFT JOIN stagiaires s ON a.stagiaire_id = s.id
        LEFT JOIN universites u ON a.universite_id = u.id
        LEFT JOIN types_stage t ON a.type_stage_id = t.id
        ORDER BY a.created_at DESC

    ");

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $result]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
