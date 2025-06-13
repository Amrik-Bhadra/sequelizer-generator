const express = require('express');
const {
  createRecord,
  getAllModels,
  getOneModel,
  getOneModelByID,
  updateModel,
  deleteModel,
} = require('../controllers/models.controller');

const router = express.Router();

router.post('/', createRecord);
router.get('/', getAllModels);
router.get('/:modelName', getOneModel);
router.get('/getbyid/:id', getOneModelByID);
router.put('/:id', updateModel);
router.delete('/:id', deleteModel);

module.exports = router;
