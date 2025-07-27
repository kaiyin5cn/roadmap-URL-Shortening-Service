const mongoose = require("mongoose");

const UrlSchema = mongoose.Schema(
    //     {
    //   "id": "1",
    //   "url": "https://www.example.com/some/long/url",
    //   "shortCode": "abc123",
    //   "createdAt": "2021-09-01T12:00:00Z",
    //   "updatedAt": "2021-09-01T12:00:00Z",
    //   "accessCount": 10
    // }
    {
        url: {
            type: String,
            required: [true, "Please enter url"],
        },

        shortCode: {
            type: String,
            required: true,
        },

        accessCount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true
    }
);


const Url = mongoose.model("Url", UrlSchema);

module.exports = Url;