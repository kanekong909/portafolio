const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer'); 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
const { User, Project } = require('../models');

// Multer setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  }
});

const upload = multer({ storage });

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/admin/login');
  next();
};

// Login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('admin/login', { error: 'Credenciales incorrectas' });
  }
  req.session.user = { id: user.id, username: user.username };
  res.redirect('/admin');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Dashboard
router.get('/', requireAuth, async (req, res) => {
  const projects = await Project.findAll({ order: [['order', 'ASC'], ['createdAt', 'DESC']] });
  res.render('admin/dashboard', { projects });
});

// New project
router.get('/nuevo', requireAuth, (req, res) => {
  res.render('admin/project-form', { project: null, error: null });
});

router.post('/nuevo', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, longDescription, tags, liveUrl, githubUrl, featured, order, status } = req.body;
    
    // Obtener URLs existentes + nuevas
    const newImages = req.files ? req.files.map(f => f.path) : [];
    
    await Project.create({
      title, description, longDescription, tags,
      liveUrl, githubUrl,
      images: JSON.stringify(newImages),
      featured: featured === 'on',
      order: parseInt(order) || 0,
      status: status || 'published'
    });
    res.redirect('/admin');
  } catch (e) {
    res.render('admin/project-form', { project: null, error: e.message });
  }
});

// Edit project
router.get('/editar/:id', requireAuth, async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.redirect('/admin');
  res.render('admin/project-form', { project, error: null });
});

router.post('/editar/:id', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.redirect('/admin');
    const { title, description, longDescription, tags, liveUrl, githubUrl, featured, order, status } = req.body;

    const existingImages = JSON.parse(project.images || '[]');
    const newImages = req.files ? req.files.map(f => f.path) : [];
    const allImages = [...existingImages, ...newImages];

    await project.update({
      title, description, longDescription, tags,
      liveUrl, githubUrl,
      images: JSON.stringify(allImages),
      featured: featured === 'on',
      order: parseInt(order) || 0,
      status: status || 'published'
    });
    res.redirect('/admin');
  } catch (e) {
    const project = await Project.findByPk(req.params.id);
    res.render('admin/project-form', { project, error: e.message });
  }
});

// Delete
router.post('/eliminar/:id', requireAuth, async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (project) await project.destroy();
  res.redirect('/admin');
});

module.exports = router;
