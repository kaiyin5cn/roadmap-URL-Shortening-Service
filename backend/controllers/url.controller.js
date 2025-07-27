const axios = require('axios');
const Url = require('../models/url.model');
const ShortUniqueId = require('short-unique-id');
const { error } = require('cros/common/logger');
const { randomUUID } = new ShortUniqueId({ length: 7 });

const getUrls = (req, res) => {
    try {
        res.redirect('/')
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        console.log(shortCode);
        const shortenUrl = await Url.find({ shortCode: shortCode });
        if (shortenUrl) {
            res.redirect(shortenUrl[0].url);
        } else {
            // TO IMPROVE
            res.status(404).json({ message: "no such url" })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const createUrl = async (req, res) => {
    try {
        const { url } = req.body;
        // check whether the url provided is valid
        const availability = await checkUrlAvailability(url);
        if (availability) {
            // find whether shorten url provided exists and return if exist
            let shortenUrl = await Url.find({ url: url });
            if (shortenUrl.length < 1) {
                // create and respond shorten url
                const newShortenUrl = new Url({ url: url, shortCode: randomUUID() });
                await newShortenUrl.save();
                res.status(200).json(newShortenUrl);
            }
        } else {
            throw new Error("Nope")
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
// {
//   "id": "1",
//   "url": "https://www.example.com/some/long/url",
//   "shortCode": "abc123",
//   "createdAt": "2021-09-01T12:00:00Z",
//   "updatedAt": "2021-09-01T12:00:00Z",
//   "accessCount": 10
// }
module.exports = {
    getUrls,
    getUrl,
    createUrl,
}