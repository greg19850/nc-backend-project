const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  connection.end();
});

describe('app', () => {
  describe('Server Error - bad path', () => {
    it('404: GET responds with not found error, if incorrect path given', () => {
      return request(app)
        .get('/api/badPath')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path not found');
        });
    });
  });

  describe('/api', () => {
    it('200: GET responds with json file with all /api endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          const jsonKeys = Object.keys(body);
          const jsonValues = Object.values(body);

          expect(jsonKeys.includes('GET /api/articles')).toBe(true);
          expect(jsonValues).toHaveLength(6);
          jsonValues.forEach(element => {
            expect(element.hasOwnProperty('description')).toBe(true);
          });

        });
    });
  });

  describe('/api/topics', () => {
    it('200: GET returns array of topic objects, each with slug, and description properties', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;

          expect(Array.isArray(topics)).toBe(true);
          expect(topics).toHaveLength(3);
          topics.forEach(topic => {
            expect(topic.hasOwnProperty('slug')).toBe(true);
            expect(topic.hasOwnProperty('description')).toBe(true);
          });
        });
    });
  });

  describe('/api/articles', () => {
    it('200: GET returns array of article objects. Articles are, by default sorted by column: created_at, and ordered in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(12);
          articles.forEach(article => {
            expect(article.hasOwnProperty('title')).toBe(true);
            expect(article.hasOwnProperty('article_id')).toBe(true);
            expect(article.hasOwnProperty('topic')).toBe(true);
          });

          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    it('200: GET returns each object with comment_count property - total count of comments with this article_id', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach(article => {
            expect(article.hasOwnProperty('comment_count')).toBe(true);
          });
        });
    });
    it('200: GET returns article objects sorted by date, in descending order', () => {
      return request(app)
        .get('/api/articles?sort_by=created_at&order=DESC')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    it('200: GET returns article objects filtered by topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles).toHaveLength(11);
          articles.forEach(article => {
            expect(article.topic).toBe('mitch');
          });

        });
    });
    it('200: GET returns article objects sorted by any valid column', () => {
      return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles).toBeSorted();
        });
    });
    it('200: GET returns article objects ordered in any valid order: ascending or descending', () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=ASC')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles).toBeSortedBy('title');
        });
    });

    it('400: GET responds with error, if invalid sort_by query is used', () => {
      return request(app)
        .get('/api/articles?sort_by=something&order=DESC')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid sort query parameters');
        });
    });
    it('400: GET responds with error, if invalid order query is used', () => {
      return request(app)
        .get('/api/articles?sort_by=created_at&order=notRight')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid order query parameters');
        });
    });
    it('400: GET responds with error, if invalid topic query is used', () => {
      return request(app)
        .get('/api/articles?topic=unknownTopic')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid topic query parameters');
        });
    });
  });

  describe('/api/articles/:article_id', () => {
    it('200: GET responds with object of single article', () => {
      return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject(
            {
              article_id: 3,
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              // created_at: '2020-11-03T08:12:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            }
          );
        });
    });
    it('200: GET returns each object with comment_count property - total count of comments with this article_id', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article.hasOwnProperty('comment_count')).toBe(true);
        });
    });

    it('400: GET responds with error, when invalid article_id is passed', () => {
      return request(app)
        .get('/api/articles/not_valid_id')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path Request');
        });
    });


    it('404: GET responds with error message, for valid, but not existing article_id', () => {
      return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article Not Found!');
        });
    });
    it('400: GET responds with error, if invalid sort_by query is used', () => {
      return request(app)
        .get('/api/articles?sort_by=something&order=DESC')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid sort query parameters');
        });
    });

    it('200: PATCH responds with updated article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 100 })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article.votes).toBe(100);
        });
    });
    it('200: PATCH responds with original votes decremented, if negative value is send', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -50 })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article.votes).toBe(-50);
        });
    });
    it('400: PATCH responds with error, when invalid article_id is passed', () => {
      return request(app)
        .patch('/api/articles/not_valid_id')
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path Request');
        });
    });
    it('404: PATCH responds with error message, for valid, but not existing article_id', () => {
      return request(app)
        .patch('/api/articles/1000')
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article Not Found!');
        });
    });
    it('400: PATCH responds with error message, for votes passed in wrong format', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'abc' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
  });

  describe('/api/articles/:article_id/comments', () => {
    it('200: GET responds with array of comments for given article_id', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments).toHaveLength(11);

          comments.forEach(comment => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String)
            });
          });
        });
    });
    it('200: GET responds with empty array of comments when article_id is valid, but has no comments', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          expect(comments).toHaveLength(0);
        });
    });
    it('200: GET returns comments objects sorted by date', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=created_at')
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy('created_at');
        });
    });

    it('400: GET responds with error, when invalid article_id is passed', () => {
      return request(app)
        .get('/api/articles/not_valid_id/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path Request');
        });
    });
    it('404: GET responds with error message, for valid, but not existing article_id', () => {
      return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article Not Found!');
        });
    });
    it('400: GET responds with error, if invalid sort_by query is used', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=invalidQuery')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid sort query parameters');
        });
    });
    it('201: POST responds with new posted comment', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ author: 'icellusedkars', body: 'All good in the hood' })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;

          expect(comment.article_id).toBe(1);
          expect(comment.author).toBe('icellusedkars');
          expect(comment.body).toBe('All good in the hood');
        });
    });
    it('201: POST responds with new posted comment, extra fields are ignored', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ author: 'icellusedkars', body: 'All good in the hood', extra: 'some extra stuff' })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;

          expect(comment.hasOwnProperty('extra')).toBe(false);
        });
    });
    it('400: POST responds with error, when invalid article_id is passed', () => {
      return request(app)
        .post('/api/articles/invalid_id/comments')
        .send({ author: 'icellusedkars', body: 'All good in the hood' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path Request');
        });
    });
    it('404: POST responds with error message, for valid, but not existing article_id', () => {
      return request(app)
        .post('/api/articles/1000/comments')
        .send({ author: 'icellusedkars', body: 'All good in the hood' })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article Not Found!');
        });
    });
    it('400: POST responds with error, when body is empty', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Comment body empty!');
        });
    });
    it('404: POST responds with error, when author is not found', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ author: 'Greg', body: 'All good in the hood' })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Data not found');
        });
    });
  });

  describe('/api/users', () => {
    it('200: GET responds with array of users objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(Array.isArray(users)).toBe(true);
          expect(users).toHaveLength(4);
          users.forEach(user => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            });
          });
        });
    });
  });

  describe('/api/comments/:comment_id', () => {
    it('204: DELETE comment with given id, responds with staus and no content', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response) => {
          expect(response.statusCode).toBe(204);
        });
    });
    it('404: DELETE responds with error message, for valid, but not existing comment_id', () => {
      return request(app)
        .delete('/api/comments/1000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Comment Not Found!');
        });
    });
    it('400: DELETE responds with error, when invalid comment_id is passed', () => {
      return request(app)
        .delete('/api/comments/invalid_comment')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path Request');
        });
    });
  });
});