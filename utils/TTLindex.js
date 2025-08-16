const Url = require('../models/url.model');

// one time script to enable auto removal of shorten url data for 7-day of inactivity
const createTTLIndex = async () => {
    try {
        await Url.collection.createIndex(
            { "updatedAt": 1 },
            { expireAfterSeconds: 7 * 24 * 3600 }
        );
        console.log('TTL index is created in Url updatedAt column');
    } catch (error) {
        console.error('Failed to create TTL index:', error.message);
    }
}

module.exports = { createTTLIndex };