// add all routes here and redirect
const express = require('express');
const router = express.Router();

const userRoute = require('./user.routes');
const productRoute = require('./product.routes');
const projectRoute = require('./project.routes');
const taskRoute = require('./task.routes');
const { main_seed, seed_all } = require('../seeders/seedAll');

router.get(`/`, async (req, res) => {
  try {
    await main_seed();
    res.status(200).json({ message: 'Database seeded successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed', details: err.message });
  }
});

router.use(`/user`, userRoute);
router.use(`/product`, productRoute);
router.use(`/project`, projectRoute);
router.use(`/task`, taskRoute);

module.exports = router;