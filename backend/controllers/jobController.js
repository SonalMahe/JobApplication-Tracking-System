import prisma from '../config/db.js';

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};


// Create new job
export const createJob = async (req, res) => {
  try {
    const { title, department, location } = req.body;
    const job = await prisma.job.create({
      data: { title, department, location },
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};


// Update job by ID
export const updateJob = async (req, res) => {
  try {
    const job = await prisma.job.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

// Delete job by ID
export const deleteJob = async (req, res) => {
  try {
    await prisma.job.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};
