<?php
require __DIR__ . '/../vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

function validateJWT($secret_key, $requiredRoles = []) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(["message" => "Authorization header missing or invalid."]);
        exit;
    }

    $jwt = trim(str_replace('Bearer', '', $authHeader));

    try {
        $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));

        // Check if the user's role is allowed for this action
        if (!empty($requiredRoles) && !in_array($decoded->data->role, $requiredRoles)) {
            http_response_code(403);
            echo json_encode(["message" => "Access denied. Insufficient role."]);
            exit;
        }

        return $decoded; // Return the decoded token if the role matches
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            "message" => "Access denied.",
            "error" => $e->getMessage()
        ]);
        exit;
    }
}