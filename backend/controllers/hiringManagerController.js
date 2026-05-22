import prisma from '../config/db.js';

export const getAllManagers = async (req, res) => {
  try {
    const managers = await prisma.hiringManager.findMany();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch managers', error: error.message });
  }
};


// Get manager by ID
export const getManagerById = async (req, res) => {
  try {
    const manager = await prisma.hiringManager.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manager', error: error.message });
  }
};

//  Create new manager
export const createManager = async (req, res) => {
  try {
    const { firstName, lastName, email, department } = req.body;
    const manager = await prisma.hiringManager.create({
      data: { firstName, lastName, email, department },
    });
    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create manager', error: error.message });
  }
};


// Update manager by ID
export const updateManager = async (req, res) => {
  try {
    const manager = await prisma.hiringManager.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update manager', error: error.message });
  }
};


// Delete manager by ID
export const deleteManager = async (req, res) => {
  try {
    await prisma.hiringManager.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Manager deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete manager', error: error.message });
  }
};
