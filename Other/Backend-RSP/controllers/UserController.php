<?php
require_once 'models/User.php';

class UserController {
    private $db;
    private $requestMethod;

    public function __construct($db, $requestMethod) {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
    }

    public function processRequest() {
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

    private function getAllUsers() {
        $user = new User($this->db);
        $result = $user->readAll();
        $users = $result->fetchAll(PDO::FETCH_ASSOC);
        return [
            'status_code_header' => 'HTTP/1.1 200 OK',
            'body' => $users
        ];
    }

    private function createUser() {
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

    private function notFoundResponse() {
        return [
            'status_code_header' => 'HTTP/1.1 404 Not Found',
            'body' => ['message' => 'Not Found']
        ];
    }

    private function unprocessableEntityResponse() {
        return [
            'status_code_header' => 'HTTP/1.1 422 Unprocessable Entity',
            'body' => ['message' => 'Invalid input']
        ];
    }
}

