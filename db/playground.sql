\c nc_news

SELECT articles.*, COUNT(comments.comment_id) as comment_count
FROM articles
INNER JOIN comments 
ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at;
