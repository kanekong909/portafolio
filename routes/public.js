const express = require('express');
const router = express.Router();
const { Project } = require('../models');

router.get('/', async (req, res) => {
  const featured = await Project.findAll({
    where: { featured: true, status: 'published' },
    order: [['order', 'ASC']]
  });
  const all = await Project.findAll({
    where: { status: 'published' },
    order: [['order', 'ASC'], ['createdAt', 'DESC']]
  });
  res.render('index', { featured, projects: all });
});

router.get('/proyecto/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project || project.status !== 'published') return res.redirect('/');
  res.render('project', { project });
});

module.exports = router;
