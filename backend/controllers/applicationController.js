import prisma from '../config/db.js';

export const getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: { job: true, applicant: true },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};


// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: Number(req.params.id) },
      include: { job: true, applicant: true },
    });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch application', error: error.message });
  }
};


// Create new application
export const createApplication = async (req, res) => {
  try {
    const { jobId, applicantId, status, applicationDate } = req.body;
    const application = await prisma.application.create({
      data: { jobId, applicantId, status, applicationDate: new Date(applicationDate) },
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};


// Update application by ID
export const updateApplication = async (req, res) => {
  try {
    const application = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
};


// Delete application by ID
export const deleteApplication = async (req, res) => {
  try {
    await prisma.application.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete application', error: error.message });
  }
};
