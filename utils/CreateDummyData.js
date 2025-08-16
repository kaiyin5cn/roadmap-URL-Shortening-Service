const mongoose = require('mongoose');
const ShortUniqueId = require('short-unique-id');

// Initialize ShortUniqueId with length 7
const { randomUUID } = new ShortUniqueId({ length: 7 });

// Sample URLs to vary the dummy data
const sampleUrls = [
    'https://www.example.com',
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com',
    'https://www.wikipedia.org',
    'https://www.amazon.com',
    'https://www.reddit.com',
    'https://www.twitter.com'
];

// Mongoose schema (assuming it's defined in url.model.js)
const UrlSchema = mongoose.Schema(
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

UrlSchema.index({ url: 1, shortCode: 1 });

// Define the model
const Url = mongoose.model('Url', UrlSchema);

// MongoDB connection URI
const uri = "mongodb://localhost:27017/shortenURL";

async function generateDummyData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");

        // Generate 500,000 dummy records
        const dummyData = [];
        for (let i = 0; i < 500000; i++) {
            // Randomly select a URL from sampleUrls
            const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
            
            dummyData.push({
                url: `${randomUrl}/`, // Add unique path to avoid duplicates
                shortCode: randomUUID(),
                accessCount: Math.floor(Math.random() * 100) // Random access count between 0 and 99
            });

            // Insert in batches of 1000 to optimize performance
            if (dummyData.length === 1000 || i === 499999) {
                await Url.insertMany(dummyData);
                console.log(`Inserted batch of ${dummyData.length} documents (${i + 1} total)`);
                dummyData.length = 0; // Clear the array
            }
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log("MongoDB connection closed");
    }
}

// Run the function
generateDummyData().catch(console.error);