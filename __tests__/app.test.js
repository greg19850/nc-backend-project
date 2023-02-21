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
    it('400: GET prevents SQL injection, if user tries to input sort parameter', () => {
      return request(app)
        .get('/api/articles?sort_by=something&order=DESC')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid sort query parameters');
        });
    });
    it('400: GET prevents SQL injection, if user tries to input order parameter', () => {
      return request(app)
        .get('/api/articles?sort_by=created_at&order=notRight')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid order query parameters');
        });
    });
  });

  describe('/api/badPath', () => {
    it('404: GET returns not found if incorrect path given', () => {
      return request(app)
        .get('/api/badPath')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path not found');
        });
    });
  });
});