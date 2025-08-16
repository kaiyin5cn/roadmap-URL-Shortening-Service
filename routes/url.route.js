const express = require('express');
const router = express.Router();
const {getUrl, createUrl, createTester, updateUrl, deleteUrl} = require('../controllers/url.controller');

router.get("/:shortCode", getUrl);

router.post("/", createUrl);

router.put("/", updateUrl);

router.delete("/", deleteUrl);


module.exports = router;

