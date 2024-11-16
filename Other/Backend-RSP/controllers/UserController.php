<?php
include_once './config/database.php';
require __DIR__ . '/../vendor/autoload.php';
use \Firebase\JWT\JWT;

require_once 'models/User.php';

class UserController
{
    private $db;
    private $requestMethod;

    public function __construct($db, $requestMethod)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                $response = $this->getAllUsers();
                break;
            case 'POST':
                $response = $this->createUser();
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo json_encode($response['body']);
        }
    }

    private function getAllUsers()
    {
        $user = new User($this->db);
        $result = $user->readAll();
        $users = $result->fetchAll(PDO::FETCH_ASSOC);
        return [
            'status_code_header' => 'HTTP/1.1 200 OK',
            'body' => $users
        ];
    }

    private function createUser()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!isset($input['login']) || !isset($input['password']) || !isset($input['role'])) {
            return $this->unprocessableEntityResponse();
        }

        $user = new User($this->db);
        $user->login = $input['login'];
        $user->password = $input['password'];
        $user->role = $input['role'];
        if ($user->create()) {
            return [
                'status_code_header' => 'HTTP/1.1 201 Created',
                'body' => ['message' => 'User created']
            ];
        }
        return $this->unprocessableEntityResponse();
    }

    private function notFoundResponse()
    {
        return [
            'status_code_header' => 'HTTP/1.1 404 Not Found',
            'body' => ['message' => 'Not Found']
        ];
    }

    private function unprocessableEntityResponse()
    {
        return [
            'status_code_header' => 'HTTP/1.1 422 Unprocessable Entity',
            'body' => ['message' => 'Invalid input']
        ];
    }

    public function authenticate()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!isset($input['login']) || !isset($input['password'])) {
            return $this->unprocessableEntityResponse();
        }

        $user = new User($this->db);
        $result = $user->authenticate($input['login'], $input['password']);
        if ($result) {
            $secret_key = "e3a8d2a0946f7c2e5e9dcb78d589c8c9ffb3142cd473f8a5c80c8e9dbbd42b3f";
            $issuer_claim = "RSP_Backend";
            $audience_claim = "RSP_Audience";
            $issuedat_claim = time();
            $notbefore_claim = $issuedat_claim + 5;
            $expire_claim = $issuedat_claim + 60;
            $token = array(
                "iss" => $issuer_claim,
                "aud" => $audience_claim,
                "iat" => $issuedat_claim,
                "nbf" => $notbefore_claim,
                "exp" => $expire_claim,
                "data" => array(
                    "id" => $result['Id'],
                    "role" => $result['Role'],
                    "login" => $result['Login']
                )
            );

            http_response_code(200);

            $header = [
                "alg" => "HS256",
                "typ" => "JWT"
            ];

            $jwt = JWT::encode($token, $secret_key, 'HS256', null, $header);
            echo json_encode(
                array(
                    "message" => "Successful login.",
                    "jwt" => $jwt,
                    "login" => $result['Login'],
                    "expireAt" => $expire_claim,
                    )
                );
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    }
}

