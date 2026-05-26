import prisma from '../config/db.js';
import express from 'express';

// Get all applicants
export const getAllApplicants = async (req, res) => {
  try {
    const applicants = await prisma.applicant.findMany();
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applicants', error: error.message });
  }
};

// Get applicant by ID
export const getApplicantById = async (req, res) => {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applicant', error: error.message });
  }
};


// Create new applicant
export const createApplicant = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, resumeLink } = req.body;
    const applicant = await prisma.applicant.create({
      data: { firstName, lastName, email, phoneNumber, resumeLink },
    });
    res.status(201).json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create applicant', error: error.message });
  }
};

// Update applicant by ID
export const updateApplicant = async (req, res) => {
  try {
    const applicant = await prisma.applicant.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update applicant', error: error.message });
  }
};


// Delete applicant by ID
export const deleteApplicant = async (req, res) => {
  try {
    await prisma.applicant.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Applicant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete applicant', error: error.message });
  }
};
