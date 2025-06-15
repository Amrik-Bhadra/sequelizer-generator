const {updateRelationship, deleteRelationship} = require("../controllers/relationship.controller")
const express = require('express');
const checkCredentials = require("../middlewares/auth.middleware");
const router = express.Router();

router.post('/update', checkCredentials, updateRelationship);
router.post('/delete', checkCredentials, deleteRelationship)
module.exports = router;
