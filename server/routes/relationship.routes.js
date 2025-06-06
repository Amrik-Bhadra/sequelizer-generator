const {updateRelationship} = require("../controllers/relationship.controller")
const express = require('express');
const router = express.Router();

router.post('/update', updateRelationship);
module.exports = router;
