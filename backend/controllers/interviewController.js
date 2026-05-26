import prisma from '../config/db.js';

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      include: { application: { include: { applicant: true, job: true } } },
    });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interviews', error: error.message });
  }
};


// Get interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: Number(req.params.id) },
      include: { application: { include: { applicant: true, job: true } } },
    });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview', error: error.message });
  }
};


// Create new interview
export const createInterview = async (req, res) => {
  try {
    const { applicationId, interviewDate, interviewerName, interviewNotes, result } = req.body;
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        interviewDate: interviewDate ? new Date(interviewDate) : new Date(),
        interviewerName: interviewerName || 'TBD',
        interviewNotes,
        result,
      },
    });
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create interview', error: error.message });
  }
};


// Update interview by ID
export const updateInterview = async (req, res) => {
  try {
    const interview = await prisma.interview.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update interview', error: error.message });
  }
};


// Delete interview by ID
export const deleteInterview = async (req, res) => {
  try {
    await prisma.interview.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete interview', error: error.message });
  }
};
