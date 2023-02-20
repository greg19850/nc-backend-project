const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

afterAll(() => {
  return connection.end();
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
          topics.forEach(topic => {
            expect(topic.hasOwnProperty('slug')).toBe(true);
            expect(topic.hasOwnProperty('description')).toBe(true);
          });
        });
    });
  });
});