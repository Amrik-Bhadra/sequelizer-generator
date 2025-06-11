const express = require('express');
const {
  createRecord,
  getAllModels,
  getOneModel,
  updateModel,
  deleteModel,
} = require('../controllers/models.controller');

const router = express.Router();

router.post('/', createRecord);
router.get('/', getAllModels);
router.get('/:modelId', getOneModel);
router.put('/:modelId', updateModel);
router.delete('/:id', deleteModel);

module.exports = router;