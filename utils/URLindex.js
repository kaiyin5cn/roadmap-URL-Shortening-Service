const Url = require('../models/url.model');

// one time script to enable auto removal of shorten url data for 7-day of inactivity
const createURLIndex = async () => {
    try {
        await Url.init();
        console.log("URL-ShortCode index is created.")
    } catch (error) {
        console.error("URL-ShortCode index create error: ", error)
    }
}

module.exports = { createURLIndex };