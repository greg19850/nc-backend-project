# **Northcoders nc-news Backend Project**

This project is a backend server built with Node.js and Express that provides an
API for managing articles.

link to hosted version: **https://nc-backend-project-nc-news.onrender.com**

## **Table of Contents**

- Installation
- Usage
- Database Information
- Tests

## **Installation**

To install the project, you'll need Node.js and npm installed on your machine.

1. Clone the repository: git clone **https://github.com/nc-backend-project.git**
2. Install dependencies: **_npm install_**
3. Start the server: **_npm start_**

> In order to run this repo, you will also need to create two files:
> .env.development & .env.test Set.env.development with PGDATABASE=database_name
> Set .env.test PGDATABASE=database_name_test (Use file .env-example, as
> template)

## **Usage**

Example endpoints which API provides:

- **'GET api/articles'** : Returns list of all articles.
- **'GET api/articles/:article_id'** : Returns single article with specific ID.
- **'GET api/comments/:comment_id'** : Returns single comment with specific ID.
- **'POST /api/articles/:article_id/comments'** : Add's comment to specific
  article.
- **'PATCH api/articles/:article_id'** : Updates information about a specific
  article.
- **'DELETE api/comments/:comment_id'** : Delete's specific comment.

## **Database Information**

The project uses a PostgreSQL database

## **Tests**

The project uses Jest for testing. To run tests, run the command **_npm test_**.
