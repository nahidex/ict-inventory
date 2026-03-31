import request from 'supertest';
import app from '../app';

describe('Health Check Endpoints', () => {
  it('should return health status status 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
  });

  it('should return base route status 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Asset Lifecycle API Server is running');
  });
});
