<?php

require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
function send_verification_email($email, $token) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'ahlemhorchani701@gmail.com';
        $mail->Password = 'unsh uqxs zfub tzmw'; // ou app password si 2FA
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('ahlemhorchani701@gmail.com', 'Gestion Stagiaires');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Vérifiez votre adresse email';
        $mail->Body = "Cliquez ici pour vérifier votre email : <a href='http://localhost/backend/auth/verify_email.php?token=$token'>Activer le compte</a>";

        $mail->send();
    } catch (Exception $e) {
        error_log("Erreur email : {$mail->ErrorInfo}");
    }
}
