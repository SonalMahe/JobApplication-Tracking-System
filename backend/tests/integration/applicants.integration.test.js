import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../../config/db.js', () => ({
  default: {
    applicant: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('../../middleware/auth.js', () => ({
  default: (req, res, next) => next(),
}));

import prisma from '../../config/db.js';
import applicantRoutes from '../../routes/applicants.js';

const app = express();
app.use(express.json());
app.use('/api/applicants', applicantRoutes);

beforeEach(() => vi.clearAllMocks());

describe('Applicants API Integration', () => {
// Test for getting all applicants
  it('GET /api/applicants - should return all applicants', async () => {
    const applicants = [{ id: 1, firstName: 'Max', lastName: 'Olsen', email: 'max@gmail.com' }];
    prisma.applicant.findMany.mockResolvedValue(applicants);

    const res = await request(app).get('/api/applicants');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(applicants);
  });


  // Test for getting an applicant by ID
  it('GET /api/applicants/:id - should return one applicant', async () => {
    const applicant = { id: 1, firstName: 'Max', lastName: 'Olsen', email: 'max@gmail.com' };
    prisma.applicant.findUnique.mockResolvedValue(applicant);

    const res = await request(app).get('/api/applicants/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(applicant);
  });


  // Test for applicant not found
  it('GET /api/applicants/:id - should return 404 if not found', async () => {
    prisma.applicant.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/applicants/999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Applicant not found');
  });


  // Test for creating a new applicant
  it('POST /api/applicants - should create a new applicant', async () => {
    const newApplicant = { id: 2, firstName: 'Sara', lastName: 'Nilsson', email: 'sara@gmail.com' };
    prisma.applicant.create.mockResolvedValue(newApplicant);

    const res = await request(app)
      .post('/api/applicants')
      .send({ firstName: 'Sara', lastName: 'Nilsson', email: 'sara@gmail.com' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newApplicant);
  });


  // Test for deleting an applicant
  it('DELETE /api/applicants/:id - should delete an applicant', async () => {
    prisma.applicant.delete.mockResolvedValue({});

    const res = await request(app).delete('/api/applicants/1');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Applicant deleted');
  });

});
