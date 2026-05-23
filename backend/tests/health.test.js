import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import cors from 'cors';
import request from 'supertest';

// Small test app with CORS and health route
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('Production Behaviour Tests', () => {

  // Test 1 - server health check
  it('GET /api/health - server is running and returns status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  // Test 2 - CORS headers are present in response
  it('GET /api/health - response includes CORS headers', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

});
