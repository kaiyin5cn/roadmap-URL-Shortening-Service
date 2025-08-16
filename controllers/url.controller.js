const axios = require('axios');
const validator = require('validator');
const Url = require('../models/url.model');
const ShortUniqueId = require('short-unique-id');
const { randomUUID } = new ShortUniqueId({ length: 7 });


const getUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const shortenUrl = await Url.findOne({ shortCode });
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
            res.status(400)
                .json({ message: "Invalid URL format. Please provide a full URL with protocol (e.g., http://example.com)." });
        }
        const availability = await checkUrlAvailability(url);
        if (availability) {
            let shortenUrl = await Url.findOne({ url });
            if (!shortenUrl) {
                const newShortenUrl = new Url({ url, shortCode: randomUUID() });
                await newShortenUrl.save();
                res.status(201).json(newShortenUrl);
            } else {
                res.status(200).json(shortenUrl);
            }
        } else {
            res.status(400).json({ message: "The provided URL is not reachable or available." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateUrl = async (req, res) => {
    try {
        const data = req.body;
        if (!data.url || data.shortCode.length != 7 || !validator.isURL(data.url, { require_protocol: true })) {
            res.status(400)
                .json({ message: "Invalid url or short code" });
        }
        const repeatedData = await Url.findOne({ shortCode: data.shortCode, url: data.url });
        if (repeatedData) {
            res.status(400)
                .json({ message: "Repeated data" });
        } else {
            const shortenUrl = await Url.findByIdAndUpdate(data._id, { ...data });
            if (shortenUrl) {
                res.status(200).send(`successfully updated`);
            } else {
                res.status(400).json({ message: "Provided data is not valid." });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteUrl = async (req, res) => {
    try {
        const data = req.body;
        const shortenUrl = await Url.findByIdAndDelete(data._id);
        if (shortenUrl) {
            res.status(200).send(`successfully deleted`);
        } else {
            res.status(400).json({ message: "Provided data is not valid." });
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
    getUrl,
    createUrl,
    updateUrl,
    deleteUrl,
}