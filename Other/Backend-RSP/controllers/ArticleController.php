<?php
require_once 'models/Article.php';

class ArticleController
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
        header('Content-Type: application/json');
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->articleId) {
                    $response = $this->getArticleById($this->articleId);
                } else {
                    $response = $this->getAllArticles();
                }
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

    private function getAllArticles()
    {
        // Capture query parameters
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $sortBy = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'SubmissionDate';
        $order = isset($_GET['order']) ? strtoupper($_GET['order']) : 'ASC';

        //echo $status;

        // Validate and sanitize parameters
        $offset = ($page - 1) * $limit;
        $allowedSortColumns = ['SubmissionDate', 'Name'];
        $allowedOrder = ['ASC', 'DESC'];

        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'SubmissionDate'; // default
        }
        if (!in_array($order, $allowedOrder)) {
            $order = 'ASC'; // default
        }

        // Build SQL query with parameters
        $sql = "SELECT * FROM Article WHERE 1=1";

        if ($status !=null) {
            $sql .= " AND PublicationStatus = :status";
        }
        $sql .= " ORDER BY $sortBy $order LIMIT :limit OFFSET :offset";

        try {
            $stmt = $this->db->prepare($sql);
            
            if ($status !=null) {
                $stmt->bindParam(':status', $status, PDO::PARAM_INT);
            }
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            
            //echo $stmt->debugDumpParams();
            $stmt->execute();
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = $articles;
            return $response;
        } catch (PDOException $e) {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body'] = ['error' => $e->getMessage()];
            return $response;
        }
    }

    private function getArticleById($id)
    {
        $article = new Article($this->db);
        $articleData = $article->fetchArticleWithDetails($id);

        if (!$articleData) {
            return $this->notFoundResponse();
        }

        return [
            'status_code_header' => 'HTTP/1.1 200 OK',
            'body' => $articleData
        ];
    }

    private function notFoundResponse()
    {
        return [
            'status_code_header' => 'HTTP/1.1 404 Not Found',
            'body' => ['message' => 'Resource not found']
        ];
    }
}