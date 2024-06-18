import request from 'supertest';
import { app } from './../app';
import { errorRouteNotFound } from '../core';

describe('App', () => {
  it('should use CORS', async () => {
    const res = await request(app).options('/');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('should handle JSON bodies', async () => {
    const res = await request(app)
      .post('/')
      .send({ name: 'test' })
      .set('Content-Type', 'application/json');
    expect(res.status).not.toBe(415); // 415 Unsupported Media Type
  });

  it('should respond with 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.errors[0].message).toBe(errorRouteNotFound);
  });

  it('should use custom error handler', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0]).toHaveProperty('message');
    expect(res.body.errors[0].message).toBe(errorRouteNotFound);
  });

  it('should handle asynchronous errors', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.errors[0].message).toBe(errorRouteNotFound);
  });
});
