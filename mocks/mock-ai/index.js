const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid

const app = express();
const PORT = 3001;
const AI_API_KEY = process.env.AI_API_KEY || 'your-secret-ai-key-fallback'; // Read from environment or use fallback

const STATUS_ENUM = [
    'INGESTING',
    'CHUNKING',
    'EMBEDDING',
    'INDEXING',
    'INDEXED'
];

// --- Middlewares ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// --- SSE Helper Function ---
function sendSse(res, event, data) {
    const id = uuidv4(); // Generate a new UUID v4 for each message
    const sseString = `id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    res.write(sseString);
}

// --- Random Delay Helper ---
function randomDelay(min = 500, max = 2000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}

// --- /ingest Endpoint ---
app.post('/ingest', async (req, res) => {
    // 1. Validate Headers
    const apiKey = req.get('X-API-Key');
    const contentType = req.get('Content-Type');

    if (apiKey !== AI_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid X-API-Key' });
    }
    if (contentType !== 'application/json') {
        return res.status(400).json({ error: 'Bad Request: Content-Type must be application/json' });
    }

    // 2. Validate Body
    const { documentId, documentUrl } = req.body;
    if (!documentId || !documentUrl) {
        return res.status(400).json({ error: 'Bad Request: Missing documentId or documentUrl in body' });
    }

    console.log(`[INGEST START] Document ID: ${documentId}, URL: ${documentUrl}`);

    // 3. Set SSE Headers for Streaming Response
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    res.flushHeaders();

    // Handle client disconnection
    req.on('close', () => {
        console.log(`[CLIENT DISCONNECTED] Document ID: ${documentId}`);
        // Do NOT call res.end() here, let the finally block handle it
    });

    try {
        // 4. Stream a sequence of status events with random delays
        for (const status of STATUS_ENUM) {
            await randomDelay();
            const eventData = {
                status: status,
                timestamp: new Date().toISOString(),
            };
            sendSse(res, 'status', eventData);
            console.log(`[STATUS UPDATE] DocID ${documentId}: ${status}`);
        }

        console.log(`[INGEST COMPLETE] Document ID: ${documentId}`);

    } catch (error) {
        // This will only catch errors if the response stream is still writable
        console.error('An error occurred during streaming:', error);
    } finally {
        // End the response stream once all events are sent
        res.end();
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Mock AI Server listening on http://localhost:${PORT}`);
    console.log(`Required X-API-Key: ${AI_API_KEY}`);
});
