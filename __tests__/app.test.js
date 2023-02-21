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
    it('200: GET returns array of article objects', () => {
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
  });

  describe('/api/articles/:article_id', () => {
    it('200: GET responds with object of single article', () => {
      return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            {
              article_id: 3,
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: '2020-11-03T08:12:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }
          );
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
  });
});