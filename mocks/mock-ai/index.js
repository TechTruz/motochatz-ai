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

const CHAT_STATUS_ENUM = [
    'ENCODING QUERY',
    'RETRIEVING KNOWLEDGE',
    'AUGMENTING',
    'GENERATING ANSWER'
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
        'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();

    // Handle client disconnection
    req.on('close', () => {
        console.log(`[CLIENT DISCONNECTED] Document ID: ${documentId}`);
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
        console.error('An error occurred during streaming:', error);
    } finally {
        res.end();
    }
});

// --- /chat/stream Endpoint ---
app.post('/chat/stream', async (req, res) => {
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
    const { query, history } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Bad Request: Missing query in body' });
    }

    console.log(`[CHAT START] Query: ${query}`);

    // 3. Set SSE Headers for Streaming Response
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();

    // Handle client disconnection
    req.on('close', () => {
        console.log(`[CLIENT DISCONNECTED] Chat Query: ${query}`);
    });

    try {
        // 4. Stream status events
        for (const status of CHAT_STATUS_ENUM) {
            await randomDelay(300, 800);
            const eventData = {
                status: status,
                timestamp: new Date().toISOString(),
            };
            sendSse(res, 'status', eventData);
            console.log(`[CHAT STATUS] ${status}`);
        }

        // 5. Stream message content chunks
        const technicalSentences = [
            "The engine efficiency is optimized by the precision of the fuel injection system.",
            "Regular maintenance of your motorcycle ensures long-term reliability and peak performance.",
            "Always check the tire pressure and brake fluid levels before embarking on long distance rides.",
            "The exhaust system plays a crucial role in reducing harmful emissions and maintaining back pressure.",
            "Using genuine spare parts for all repairs is essential to maintain your factory warranty.",
            "Chain lubrication should be performed every 500 kilometers to prevent premature wear and tear.",
            "The cooling system requires periodic flushing to avoid mineral buildup and potential overheating.",
            "Suspension settings can be adjusted to match the rider's weight and intended terrain type.",
            "Battery health is vital for modern motorcycles with complex electronic control units.",
            "Proper air filter cleaning improves the air-to-fuel ratio and prevents engine contaminants.",
            "Electronic Stability Control (ESC) helps maintain traction during aggressive cornering maneuvers.",
            "Brake pads should be inspected regularly for thickness to ensure consistent stopping power.",
            "The drive belt tension must be within manufacturer specifications to avoid power loss.",
            "Valve clearances need adjustment at specific intervals to prevent engine damage and noise.",
            "Spark plugs should be replaced according to the service manual to maintain ignition quality."
        ];

        const totalSentences = Math.floor(Math.random() * 5) + 4; // 4 to 8 sentences
        let dummyResponse = "";
        
        for (let i = 0; i < totalSentences; i++) {
            const randomSentence = technicalSentences[Math.floor(Math.random() * technicalSentences.length)];
            dummyResponse += randomSentence + " ";
            
            // Randomly insert a paragraph break after the 3rd or 4th sentence if there are enough sentences
            if (i === 3 && totalSentences > 5) {
                dummyResponse += "\n\n";
            }
        }

        const chunks = dummyResponse.trim().split(' ');

        for (const chunk of chunks) {
            await randomDelay(50, 150);
            const messageData = {
                content: chunk + ' ',
                timestamp: new Date().toISOString()
            };
            sendSse(res, 'message', messageData);
        }

        // 6. Final status event with document references
        await randomDelay(200, 500);
        const finalStatusData = {
            status: 'ANSWERED',
            timestamp: new Date().toISOString(),
            documentReferenceId: [] // In a real scenario, this would have document IDs
        };
        sendSse(res, 'status', finalStatusData);
        console.log(`[CHAT STATUS] ANSWERED`);

    } catch (error) {
        console.error('An error occurred during chat streaming:', error);
    } finally {
        res.end();
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Mock AI Server listening on http://localhost:${PORT}`);
    console.log(`Required X-API-Key: ${AI_API_KEY}`);
});
