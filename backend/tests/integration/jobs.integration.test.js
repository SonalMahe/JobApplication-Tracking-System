import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock Prisma - no real database needed
vi.mock('../../config/db.js', () => ({
  default: {
    job: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock Auth0 - skip token check in tests
vi.mock('../../middleware/auth.js', () => ({
  default: (req, res, next) => next(),
}));

import prisma from '../../config/db.js';
import jobRoutes from '../../routes/jobs.js';

const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes);

beforeEach(() => vi.clearAllMocks());

describe('Jobs API Integration', () => {

  it('GET /api/jobs - should return all jobs', async () => {
    const jobs = [{ id: 1, title: 'Developer', department: 'Engineering', location: 'Stockholm' }];
    prisma.job.findMany.mockResolvedValue(jobs);

    const res = await request(app).get('/api/jobs');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(jobs);
  });


  // Test for getting a job by ID
  it('GET /api/jobs/:id - should return one job', async () => {
    const job = { id: 1, title: 'Developer', department: 'Engineering', location: 'Stockholm' };
    prisma.job.findUnique.mockResolvedValue(job);

    const res = await request(app).get('/api/jobs/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(job);
  });


  //  Test for job not found
  it('GET /api/jobs/:id - should return 404 if not found', async () => {
    prisma.job.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/jobs/999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Job not found');
  });


  // Test for creating a new job
  it('POST /api/jobs - should create a new job', async () => {
    const newJob = { id: 2, title: 'Designer', department: 'Design', location: 'Remote' };
    prisma.job.create.mockResolvedValue(newJob);

    const res = await request(app)
      .post('/api/jobs')
      .send({ title: 'Designer', department: 'Design', location: 'Remote' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newJob);
  });


  // Test for updating a job
  it('PUT /api/jobs/:id - should update a job', async () => {
    const updated = { id: 1, title: 'Senior Developer', department: 'Engineering', location: 'Stockholm' };
    prisma.job.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/jobs/1')
      .send({ title: 'Senior Developer' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });


  // Test for deleting a job
  it('DELETE /api/jobs/:id - should delete a job', async () => {
    prisma.job.delete.mockResolvedValue({});

    const res = await request(app).delete('/api/jobs/1');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Job deleted');
  });

});
