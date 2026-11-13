const request = require('supertest');
const app = require('./app');
describe('Routing Tests', () => {
    test('Root path returns welcome', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });
    test('Name path returns dynamic welcome', async () => {
        const res = await request(app).get('/AWS');
        expect(res.text).toBe('Welcome AWS');
    });
});
