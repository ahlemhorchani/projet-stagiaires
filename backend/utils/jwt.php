<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret = "your_secret_key";

function generate_jwt($payload) {
  global $secret;
  $payload['exp'] = time() + (3600 * 24);
  return JWT::encode($payload, $secret, 'HS256');
}

function verify_jwt($token) {
  global $secret;
  try {
    return JWT::decode($token, new Key($secret, 'HS256'));
  } catch (Exception $e) {
    return null;
  }
}
