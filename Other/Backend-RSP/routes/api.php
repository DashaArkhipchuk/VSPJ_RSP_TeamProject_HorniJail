<?php
require 'config/Database.php';
require 'controllers/UserController.php';
require 'controllers/ArticleController.php';
require 'controllers/ProtectedController.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$database = new Database();
$db = $database->getConnection();

$requestMethod = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = explode('/', trim($uri, '/'));


switch ($path[0]) {
    case 'users':
        $controller = new UserController($db, $requestMethod);
        $controller->processRequest();
        break;
    case 'articles':
        $articleId = isset($path[1]) ? (int) $path[1] : null;
        $controller = new ArticleController($db, $requestMethod, $articleId);
        $controller->processRequest();
        break;
    case 'authenticate':
        $controller = new UserController($db, $requestMethod);
        $controller->authenticate();
        break;
    case 'protected':
        $controller = new ProtectedController($db, $requestMethod);
        $controller->processRequest();
        break;


    // Add more cases for other resources like 'articles', 'editions', etc.
    default:
        header("HTTP/1.1 405 Not Found");
        echo json_encode(["message" => "Resource not found"]);
        break;
}
