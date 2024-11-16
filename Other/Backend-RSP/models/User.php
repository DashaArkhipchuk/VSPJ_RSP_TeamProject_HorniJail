<?php
class User {
    private $conn;
    private $table_name = "Users";

    public $id;
    public $login;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new user
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET login=:login, password=:password, role=:role";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":login", $this->login);
        $stmt->bindParam(":password", password_hash($this->password, PASSWORD_BCRYPT));
        $stmt->bindParam(":role", $this->role);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Read all users
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Authenticate a user
    public function authenticate($login, $password) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE login = :login";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":login", $login);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['Password'])) {
            return $user;
        }
        return null;
    }

}