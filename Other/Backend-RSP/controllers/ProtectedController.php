<?php
include_once './config/database.php';
require __DIR__ . '/../helpers/auth.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class ProtectedController
{
    private $db;
    private $requestMethod;
    private $articleId;

    public function __construct($db, $requestMethod, $articleId = null)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->articleId = $articleId;
    }

    public function processRequest()
    {
        $secret_key = "e3a8d2a0946f7c2e5e9dcb78d589c8c9ffb3142cd473f8a5c80c8e9dbbd42b3f";

        // Specify required roles for this action
        $requiredRoles = [1]; // Only role 1 (author) can access

        // Validate JWT and ensure the user has one of the required roles
        $decoded = validateJWT($secret_key, $requiredRoles);


        switch ($this->requestMethod) {
            case 'GET':
                $response = $this->getUserData($decoded);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }

        header($response['status_code_header']);
        if ($response['body']) {
            echo json_encode($response['body']);
        }
        exit;
    }

    private function getUserData($decoded)
    {
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = $decoded->data;
        return $response;
    }

    private function notFoundResponse()
    {
        return [
            'status_code_header' => 'HTTP/1.1 404 Not Found',
            'body' => ['message' => 'Resource not found']
        ];
    }
}