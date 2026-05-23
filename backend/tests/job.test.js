import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma so tests don't touch the real database
vi.mock('../config/db.js', () => ({
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

import prisma from '../config/db.js';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';

beforeEach(() => vi.clearAllMocks());

describe('Job Controller', () => {
// Test for getting all jobs
  it('should return all jobs', async () => {
    const jobs = [{ id: 1, title: 'Developer', department: 'Engineering', location: 'Stockholm' }];
    prisma.job.findMany.mockResolvedValue(jobs);

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllJobs(req, res);

    expect(res.json).toHaveBeenCalledWith(jobs);
  });


  // Test for getting a job by ID
  it('should return a job by id', async () => {
    const job = { id: 1, title: 'Developer', department: 'Engineering', location: 'Stockholm' };
    prisma.job.findUnique.mockResolvedValue(job);

    const req = { params: { id: '1' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getJobById(req, res);

    expect(res.json).toHaveBeenCalledWith(job);
  });


// Test for job not found
  it('should return 404 if job not found', async () => {
    prisma.job.findUnique.mockResolvedValue(null);

    const req = { params: { id: '999' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getJobById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
  });


  // Test for creating a new job
  it('should create a new job', async () => {
    const newJob = { id: 2, title: 'Designer', department: 'Design', location: 'Remote' };
    prisma.job.create.mockResolvedValue(newJob);

    const req = { body: { title: 'Designer', department: 'Design', location: 'Remote' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await createJob(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newJob);
  });


  // Test for updating a job
  it('should update a job', async () => {
    const updated = { id: 1, title: 'Senior Developer', department: 'Engineering', location: 'Stockholm' };
    prisma.job.update.mockResolvedValue(updated);

    const req = { params: { id: '1' }, body: { title: 'Senior Developer' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await updateJob(req, res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });


  // Test for deleting a job
  it('should delete a job', async () => {
    prisma.job.delete.mockResolvedValue({});

    const req = { params: { id: '1' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await deleteJob(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Job deleted' });
  });

  // Test for database error handling
  it('should return 500 on database error', async () => {
    prisma.job.findMany.mockRejectedValue(new Error('DB error'));

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});
