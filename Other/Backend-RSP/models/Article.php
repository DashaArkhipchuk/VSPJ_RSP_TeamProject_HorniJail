<?php
class Article
{
    private $conn;
    private $table_name = "Article";

    public $id;
    public $name;
    public $submissionDate;
    public $publicationStatus;
    public $editionId;
    public $authorId;
    public $description;
    public $pictureUrl;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get a single article by ID
    public function fetchArticleWithDetails($articleId)
    {
        $query = "
            SELECT 
                a.Id AS article_id,
                a.Name AS article_name,
                a.Description AS article_description,
                a.PictureURL AS article_picture,
                a.PublicationStatus AS article_publication_status,
                av.VersionNumber AS version_number,
                ed.Title AS edition_title,
                au.Name AS author_name,
                ed.PublicationDate AS edition_publication_date,
                av.Text AS article_text
            FROM 
                Article a
            JOIN 
                ArticleVersions av ON a.Id = av.IdArticle
            JOIN 
                Author au ON a.AuthorId = au.Id
            JOIN 
                Edition ed ON a.EditionId = ed.Id
            WHERE 
                av.VersionNumber = (
                    SELECT MAX(VersionNumber) 
                    FROM ArticleVersions 
                    WHERE IdArticle = a.Id
                )
                AND a.Id = :articleId
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':articleId', $articleId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $row : null;
    }
}