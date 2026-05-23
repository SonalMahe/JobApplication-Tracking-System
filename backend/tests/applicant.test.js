import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/db.js', () => ({
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

import prisma from '../config/db.js';
import { getAllApplicants, getApplicantById, createApplicant, deleteApplicant } from '../controllers/applicantController.js';

beforeEach(() => vi.clearAllMocks());

describe('Applicant Controller', () => {
// Test for getting all applicants
  it('should return all applicants', async () => {
    const applicants = [{ id: 1, firstName: 'Max', lastName: 'Olsen', email: 'max@gmail.com' }];
    prisma.applicant.findMany.mockResolvedValue(applicants);

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllApplicants(req, res);

    expect(res.json).toHaveBeenCalledWith(applicants);
  });


  // Test for getting an applicant by ID
  it('should return an applicant by id', async () => {
    const applicant = { id: 1, firstName: 'Max', lastName: 'Olsen', email: 'max@gmail.com' };
    prisma.applicant.findUnique.mockResolvedValue(applicant);

    const req = { params: { id: '1' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getApplicantById(req, res);

    expect(res.json).toHaveBeenCalledWith(applicant);
  });


  // Test for applicant not found
  it('should return 404 if applicant not found', async () => {
    prisma.applicant.findUnique.mockResolvedValue(null);

    const req = { params: { id: '999' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getApplicantById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Applicant not found' });
  });


  // Test for creating a new applicant
  it('should create a new applicant', async () => {
    const newApplicant = { id: 2, firstName: 'Sara', lastName: 'Nilsson', email: 'sara@gmail.com' };
    prisma.applicant.create.mockResolvedValue(newApplicant);

    const req = { body: { firstName: 'Sara', lastName: 'Nilsson', email: 'sara@gmail.com' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await createApplicant(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newApplicant);
  });

  it('should delete an applicant', async () => {
    prisma.applicant.delete.mockResolvedValue({});

    const req = { params: { id: '1' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await deleteApplicant(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Applicant deleted' });
  });

  it('should return 500 on database error', async () => {
    prisma.applicant.findMany.mockRejectedValue(new Error('DB error'));

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllApplicants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});
