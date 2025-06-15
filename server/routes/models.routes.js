const express = require('express');
const {
  createRecord,
  getAllModels,
  getOneModel,
  getOneModelByID,
  updateModel,
  deleteModel,
} = require('../controllers/models.controller');
const checkCredentials = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', checkCredentials, createRecord);
router.get('/', checkCredentials, getAllModels);
router.get('/:modelName', checkCredentials, getOneModel);
router.get('/getbyid/:id', checkCredentials, getOneModelByID);
router.put('/:id', checkCredentials, updateModel);
router.delete('/:id', checkCredentials, deleteModel);

module.exports = router;
