const express = require('express');
const {
  createRecord,
  getAllModels,
  updateModel,
  deleteModel,
} = require('../controllers/models.controller');

const router = express.Router();

router.post('/', createRecord);
router.get('/', getAllModels);
router.put('/:id', updateModel);
router.delete('/:id', deleteModel);

module.exports = router;
