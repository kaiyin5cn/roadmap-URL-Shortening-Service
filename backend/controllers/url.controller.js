const axios = require('axios');
const validator = require('validator');
const Url = require('../models/url.model');
const ShortUniqueId = require('short-unique-id');
const { randomUUID } = new ShortUniqueId({ length: 7 });

const getHomePage = (req, res) => {
    try {
        res.send("This is Home Page")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const shortenUrl = await Url.findOne({ shortCode: shortCode });
        if (shortenUrl) {
            await Url.updateOne(
                { _id: shortenUrl._id },
                { $inc: { accessCount: 1 } },
            );
            res.redirect(shortenUrl.url);
        } else {
            res.status(404).json({ message: "Short URL not found." });
        }
    } catch (err) {
        console.error("Error in getUrl:", err);
        res.status(500).json({ message: err.message })
    }
}

const createUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || !validator.isURL(url, { require_protocol: true })) {
            return res.status(400)
                .json({ message: "Invalid URL format. Please provide a full URL with protocol (e.g., http://example.com)." });
        }
        // check whether the url provided is valid
        const availability = await checkUrlAvailability(url);
        if (availability) {
            let shortenUrl = await Url.findOne({ url: url });
            if (!shortenUrl) {
                const newShortenUrl = new Url({ url: url, shortCode: randomUUID() });
                await newShortenUrl.save();
                res.status(201).json(newShortenUrl);
            } else {
                res.status(200).json(shortenUrl);
            }
        } else {
            return res.status(400).json({ message: "The provided URL is not reachable or available." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const checkUrlAvailability = async (url) => {
    try {
        const res = await axios.head(url, { timeout: 5000 });
        return res.status >= 200 && res.status < 300;
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return false;
    }
}

module.exports = {
    getHomePage,
    getUrl,
    createUrl,
}