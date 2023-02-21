\c nc_news

SELECT comments.*
FROM comments
JOIN articles 
ON comments.article_id = articles.article_id
WHERE comments.article_id = 2
ORDER BY created_at DESC;
