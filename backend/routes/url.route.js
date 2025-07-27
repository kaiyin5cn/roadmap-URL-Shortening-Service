const express = require('express');
const router = express.Router();
const {getUrls, getUrl, createUrl} = require('../controllers/url.controller');

router.get('/', getUrls);

router.get("/:shortCode", getUrl);

router.post("/", createUrl);

// router.put("/:shortCode", updateUrl);

// router.delete("/:shortCode", deleteUrl);


module.exports = router;

