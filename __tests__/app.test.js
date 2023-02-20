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
          expect(topics.length).toBe(3);
          topics.forEach(topic => {
            expect(topic.hasOwnProperty('slug')).toBe(true);
            expect(topic.hasOwnProperty('description')).toBe(true);
          });
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