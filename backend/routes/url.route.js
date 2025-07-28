const express = require('express');
const router = express.Router();
const {getHomePage, getUrl, createUrl} = require('../controllers/url.controller');

router.get("/", getHomePage);

router.get("/:shortCode", getUrl);

router.post("/", createUrl);

// router.put("/:shortCode", updateUrl);

// router.delete("/:shortCode", deleteUrl);


module.exports = router;

