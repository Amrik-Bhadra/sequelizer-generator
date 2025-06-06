const {updateRelationship, deleteRelationship} = require("../controllers/relationship.controller")
const express = require('express');
const router = express.Router();

router.post('/update', updateRelationship);
router.post('/delete', deleteRelationship)
module.exports = router;
