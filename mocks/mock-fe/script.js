const API_BASE_URL = 'http://localhost:8080/api';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const authMessage = document.getElementById('auth-message');
const authSection = document.getElementById('auth-section');
const uploadSection = document.getElementById('upload-section');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const uploadMessage = document.getElementById('upload-message');
const logoutButton = document.getElementById('logout-button');

const documentsList = document.getElementById('documents-list');
const documentsMessage = document.getElementById('documents-message');
const documentsSection = document.getElementById('documents-section');

// Chat DOM elements
const chatsSection = document.getElementById('chats-section');
const chatsList = document.getElementById('chats-list');
const chatsMessage = document.getElementById('chats-message');
const createChatButton = document.getElementById('create-chat-button');
const chatWindowSection = document.getElementById('chat-window-section');
const chatTitle = document.getElementById('chat-title');
const messagesList = document.getElementById('messages-list');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatStatusDisplay = document.getElementById('chat-status-display');
const backToChatsButton = document.getElementById('back-to-chats-button');
const sendMessageButton = document.getElementById('send-message-button');

// New elements for ingest stream test
const ingestStreamSection = document.getElementById('ingest-stream-section');
const ingestDocumentIdInput = document.getElementById('ingest-document-id');
const startIngestButton = document.getElementById('start-ingest-button');
const stopIngestButton = document.getElementById('stop-ingest-button');
const ingestEventsOutput = document.getElementById('ingest-events');
const ingestStatusDisplay = document.getElementById('ingest-status-display');

let authToken = null;
let ingestAbortController = null; // For cancelling the ingest stream
let chatAbortController = null; // For cancelling the chat stream
let currentChatId = null;

// Helper function to decode JWT
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
}

// Helper function to display messages
function displayMessage(element, message, isError = true) {
    element.textContent = message;
    element.style.color = isError ? 'red' : 'green';
}

// Helper function to convert bytes to megabytes
function bytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2); // Convert to MB and fix to 2 decimal places
}

// Function to fetch and display documents
async function fetchDocuments() {
    documentsList.innerHTML = ''; // Clear previous list
    displayMessage(documentsMessage, 'Fetching documents...', false);

    if (!authToken) {
        displayMessage(documentsMessage, 'Not authenticated to fetch documents.');
        return;
    }

    const decodedToken = decodeJwt(authToken);
    if (!decodedToken || !decodedToken.garageId) {
        displayMessage(documentsMessage, 'Invalid token or missing garage ID.');
        return;
    }
    const garageId = decodedToken.garageId;

    try {
        const response = await fetch(`${API_BASE_URL}/documents?garageId=${garageId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            if (data.data && data.data.length > 0) {
                documentsMessage.textContent = ''; // Clear fetching message
                data.data.forEach(doc => {
                    const listItem = document.createElement('li');
                    listItem.dataset.documentId = doc.documentId; // Store documentId
                    listItem.style.cursor = 'pointer'; // Indicate clickable
                    listItem.innerHTML = `
                        <strong>${doc.fileName}</strong> (ID: ${doc.documentId}) (${doc.fileType}) - ${bytesToMB(doc.fileSize)} MB - Status: ${doc.status}
                        <a href="${doc.documentUrl}" target="_blank">View</a>
                    `;
                    listItem.addEventListener('click', () => startIngestStreamForDocument(doc.documentId));
                    documentsList.appendChild(listItem);
                });
            } else {
                displayMessage(documentsMessage, 'No documents found for this garage.', false);
            }
        } else {
            displayMessage(documentsMessage, data.message || 'Failed to fetch documents.');
        }
    } catch (error) {
        displayMessage(documentsMessage, 'Network error while fetching documents.');
        console.error('Fetch documents error:', error);
    }
}

// Function to fetch and display chat sessions
async function fetchChats() {
    chatsList.innerHTML = '';
    displayMessage(chatsMessage, 'Fetching chats...', false);

    if (!authToken) return;

    const decodedToken = decodeJwt(authToken);
    if (!decodedToken || !decodedToken.garageId) return;
    const garageId = decodedToken.garageId;

    try {
        const response = await fetch(`${API_BASE_URL}/chats?garageId=${garageId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (response.ok) {
            chatsMessage.textContent = '';
            if (data.data && data.data.length > 0) {
                data.data.forEach(chat => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        Chat ID: ${chat.chatId} - Status: ${chat.status} - Quota: ${chat.remainingQuota}
                        <button onclick="openChat('${chat.chatId}')">Open</button>
                    `;
                    chatsList.appendChild(listItem);
                });
            } else {
                displayMessage(chatsMessage, 'No chat sessions found.', false);
            }
        }
    } catch (error) {
        console.error('Fetch chats error:', error);
    }
}

// Function to create a new chat session
async function createChat() {
    try {
        const response = await fetch(`${API_BASE_URL}/chats`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        if (response.ok) {
            openChat(data.data.chatId);
        } else {
            alert('Failed to create chat: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Create chat error:', error);
    }
}

// Function to open a chat window
async function openChat(chatId) {
    currentChatId = chatId;
    chatTitle.textContent = `Chat: ${chatId}`;
    messagesList.innerHTML = '';
    
    chatsSection.style.display = 'none';
    documentsSection.style.display = 'none';
    uploadSection.style.display = 'none';
    ingestStreamSection.style.display = 'none';
    chatWindowSection.style.display = 'block';

    await fetchMessages(chatId);
}

// Function to fetch and display messages for a chat
async function fetchMessages(chatId) {
    try {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages?limit=50&sort=createdAt`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        if (response.ok) {
            data.data.forEach(msg => {
                appendMessage(msg.role === 'USER' ? 'User' : 'Assistant', msg.content);
            });
        }
    } catch (error) {
        console.error('Fetch messages error:', error);
    }
}

// Helper to append a message to the list
function appendMessage(sender, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender.toLowerCase()}`;
    msgDiv.innerHTML = `<strong>${sender}:</strong> <span class="content">${content}</span>`;
    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
    return msgDiv;
}

// Function to handle chat streaming
async function startChatStream(message) {
    if (!currentChatId) return;

    appendMessage('User', message);
    chatInput.value = '';
    
    const assistantMsgDiv = appendMessage('Assistant', '');
    const assistantContentSpan = assistantMsgDiv.querySelector('.content');

    chatStatusDisplay.textContent = 'Connecting...';
    sendMessageButton.disabled = true;

    chatAbortController = new AbortController();

    try {
        const response = await fetch(`${API_BASE_URL}/stream/chat?chatId=${currentChatId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message }),
            signal: chatAbortController.signal
        });

        if (!response.ok) throw new Error('Stream error');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let boundary;
            while ((boundary = buffer.indexOf('\n\n')) !== -1) {
                const raw = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 2);

                const lines = raw.split('\n');
                let event = 'message';
                let data = '';

                lines.forEach(line => {
                    if (line.startsWith('event:')) event = line.slice(6).trim();
                    else if (line.startsWith('data:')) data = line.slice(5).trim();
                });

                if (event === 'message') {
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        assistantContentSpan.textContent += parsed.content || parsed.message || '';
                    } catch (e) {
                        assistantContentSpan.textContent += data;
                    }
                } else if (event === 'status') {
                    try {
                        const parsed = JSON.parse(data);
                        chatStatusDisplay.textContent = parsed.status;
                    } catch (e) {}
                } else if (event === 'error') {
                    try {
                        const parsed = JSON.parse(data);
                        chatStatusDisplay.textContent = `Error: ${parsed.message}`;
                        assistantContentSpan.textContent = `[Error: ${parsed.message}]`;
                        assistantContentSpan.style.color = 'red';
                    } catch (e) {
                        chatStatusDisplay.textContent = 'Error: Unknown stream error';
                    }
                }
            }
        }
        chatStatusDisplay.textContent = 'Finished';
    } catch (error) {
        if (error.name === 'AbortError') {
            chatStatusDisplay.textContent = 'Aborted';
        } else {
            console.error('Chat stream error:', error);
            chatStatusDisplay.textContent = 'Error';
        }
    } finally {
        sendMessageButton.disabled = false;
        chatAbortController = null;
    }
}

// --- New Function: Start Ingest Stream for a specific Document ID ---
function startIngestStreamForDocument(documentId) {
    // Stop any existing stream first
    stopIngestStream(); 

    ingestDocumentIdInput.value = documentId; // Populate the input field
    startIngestStream(); // Programmatically start the stream
}

// --- New Function: Start Ingest Stream ---
async function startIngestStream() {
    const documentId = ingestDocumentIdInput.value.trim();
    if (!documentId) {
        alert('Please enter a Document ID to start the ingest stream.');
        return;
    }

    ingestEventsOutput.textContent = ''; // Clear previous output
    ingestStatusDisplay.textContent = 'Connecting...';
    startIngestButton.disabled = true;
    stopIngestButton.disabled = false;

    // Stop any previously running stream (handled by stopIngestStream before calling this)
    ingestAbortController = new AbortController();
    const signal = ingestAbortController.signal;

    try {
        const response = await fetch(`${API_BASE_URL}/stream/ingest?documentId=${documentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}` // Include auth token for your backend
            },
            signal: signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            ingestStatusDisplay.textContent = `Error: ${response.status} - ${errorText}`;
            throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        ingestStatusDisplay.textContent = 'Streaming...';

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log('Stream complete');
                ingestStatusDisplay.textContent = 'Stream Finished.';
                break;
            }

            buffer += decoder.decode(value, { stream: true });

            // Process buffered data for SSE messages
            let eventEndIndex;
            while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
                const message = buffer.slice(0, eventEndIndex + 2); // Include the \n\n
                buffer = buffer.slice(eventEndIndex + 2);

                ingestEventsOutput.textContent += message; // Display raw event
                ingestEventsOutput.scrollTop = ingestEventsOutput.scrollHeight; // Auto-scroll

                // Parse the event data
                const lines = message.split('\n').filter(line => line.trim() !== '');
                let eventType = 'message'; // Default event type
                let eventData = '';
                let eventId = '';

                for (const line of lines) {
                    if (line.startsWith('id:')) {
                        eventId = line.substring(3).trim();
                    } else if (line.startsWith('event:')) {
                        eventType = line.substring(6).trim();
                    } else if (line.startsWith('data:')) {
                        eventData = (eventData ? eventData + '\n' : '') + line.substring(5).trim();
                    }
                }
                
                if (eventType === 'status' && eventData) {
                    try {
                        const parsedData = JSON.parse(eventData);
                        ingestStatusDisplay.textContent = `Status: ${parsedData.status} (at ${new Date(parsedData.timestamp).toLocaleTimeString()})`;
                    } catch (e) {
                        console.error('Failed to parse SSE data JSON:', e);
                    }
                }
            }
        }
    } catch (error) {
        if (signal.aborted) {
            ingestStatusDisplay.textContent = 'Stream Aborted by User.';
        } else {
            console.error('Ingest stream error:', error);
            ingestStatusDisplay.textContent = `Stream Error: ${error.message}`;
        }
    } finally {
        startIngestButton.disabled = false;
        stopIngestButton.disabled = true;
        ingestAbortController = null;
    }
}

// --- New Function: Stop Ingest Stream ---
function stopIngestStream() {
    if (ingestAbortController) {
        ingestAbortController.abort();
        console.log('Ingest stream cancellation requested.');
        ingestStatusDisplay.textContent = 'Idle (Stream stopped).'; // Update status when explicitly stopped
        ingestEventsOutput.textContent = ''; // Clear raw events on stop
    }
    startIngestButton.disabled = false;
    stopIngestButton.disabled = true;
    ingestAbortController = null;
}

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const repeatPassword = document.getElementById('register-repeat-password').value;
    const firstName = document.getElementById('register-first-name').value;
    const garageName = document.getElementById('register-garage-name').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, repeatPassword, firstName, garageName }),
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage(authMessage, 'Registration successful! Please login.', false);
            registerForm.reset();
        } else {
            displayMessage(authMessage, data.message || 'Registration failed.');
        }
    } catch (error) {
        displayMessage(authMessage, 'Network error during registration.');
        console.error('Registration error:', error);
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login Response - response.ok:', response.ok);
        console.log('Login Response - data:', data);
        console.log('Login Response - data.data.accessToken:', data.data.accessToken);
        if (response.ok && data.data.accessToken) {
            authToken = data.data.accessToken;
            localStorage.setItem('authToken', authToken); // Store token
            displayMessage(authMessage, 'Login successful!', false);
            authSection.style.display = 'none';
            uploadSection.style.display = 'block';
            documentsSection.style.display = 'block'; // Show documents section
            chatsSection.style.display = 'block'; // Show chats section
            ingestStreamSection.style.display = 'block'; // Show ingest stream section
            fetchDocuments(); // Fetch documents after successful login
            fetchChats(); // Fetch chats after successful login
            loginForm.reset();
            // Clear registration message after successful login
            authMessage.textContent = '';
        } else {
            displayMessage(authMessage, data.message || 'Login failed.');
        }
    } catch (error) {
        displayMessage(authMessage, 'Network error during login.');
        console.error('Login error:', error);
    }
});

// Handle Logout
logoutButton.addEventListener('click', async () => {
    try {
        // Invalidate token on the backend (sends refreshToken cookie automatically)
        const response = await fetch(`${API_BASE_URL}/auth/token`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok || response.status === 204) { // 204 No Content is also a success
            localStorage.removeItem('authToken');
            authToken = null;
            displayMessage(authMessage, 'Logged out successfully!', false);
            authSection.style.display = 'block';
            uploadSection.style.display = 'none';
            documentsSection.style.display = 'none'; // Hide documents section on logout
            chatsSection.style.display = 'none'; // Hide chats section
            chatWindowSection.style.display = 'none';
            ingestStreamSection.style.display = 'none'; // Hide ingest stream section
            // Clear previous messages and document list
            uploadMessage.textContent = '';
            authMessage.textContent = '';
            documentsList.innerHTML = ''; // Clear documents list
            documentsMessage.textContent = ''; // Clear documents message
            chatsList.innerHTML = '';

            // Also stop and clear ingest stream display
            if (ingestAbortController) {
                ingestAbortController.abort();
            }
            if (chatAbortController) {
                chatAbortController.abort();
            }
            ingestEventsOutput.textContent = '';
            ingestStatusDisplay.textContent = 'Idle';
            startIngestButton.disabled = false;
            stopIngestButton.disabled = true;
        } else {
            const errorData = await response.json();
            displayMessage(authMessage, errorData.message || 'Logout failed on server.');
        }
    } catch (error) {
        displayMessage(authMessage, 'Network error during logout.');
        console.error('Logout error:', error);
    }
});


// Handle Document Upload
uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    displayMessage(uploadMessage, "Please select a file to upload.");
    return;
  }

  // Client-side validation for fileType and fileSize
  const allowedFileTypes = ["application/pdf", "text/plain"];
  if (!allowedFileTypes.includes(file.type)) {
    displayMessage(
      uploadMessage,
      "Unsupported file type. Only PDF and plain text files are allowed.",
    );
    return;
  }

  const MAX_FILE_SIZE = 1073741824; // 1 GB
  if (file.size > MAX_FILE_SIZE) {
    displayMessage(uploadMessage, "File size exceeds 1GB limit.");
    return;
  }

  const originalFileName = file.name;
  const lastDotIndex = originalFileName.lastIndexOf(".");
  const baseFileName =
    lastDotIndex === -1
      ? originalFileName
      : originalFileName.substring(0, lastDotIndex);

  // Client-side validation for fileName (base name)
  const fileNameRegex = /^[\w\-. ]+$/;
  if (!fileNameRegex.test(baseFileName)) {
    displayMessage(
      uploadMessage,
      "Invalid file name. Only alphanumerics, dots '.', underscores '_', dashes '-', or whitespaces ' ' are allowed.",
    );
    return;
  }
  if (baseFileName.length > 200) {
    displayMessage(
      uploadMessage,
      "File name exceeds 200 characters limit (excluding extension).",
    );
    return;
  }

  if (!authToken) {
    displayMessage(uploadMessage, "You must be logged in to upload a file.");
    authSection.style.display = "block";
    uploadSection.style.display = "none";
    return;
  }

  displayMessage(uploadMessage, "Requesting signed URL...", false);

  try {
    // 1. Request a signed URL from your backend
    const signedUrlResponse = await fetch(
      `${API_BASE_URL}/documents/signed-url?fileName=${encodeURIComponent(baseFileName)}&fileType=${encodeURIComponent(file.type)}&fileSize=${file.size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!signedUrlResponse.ok) {
      const errorData = await signedUrlResponse.json();
      displayMessage(
        uploadMessage,
        errorData.message || "Failed to get signed URL.",
      );
      console.error("Signed URL error:", errorData);
      return;
    }

    const { data } = await signedUrlResponse.json();
    const { signedUrl, documentUrl } = data;
    displayMessage(uploadMessage, "Uploading file...", false);

    // 2. Upload the file directly to the signed URL using XMLHttpRequest and FileReader/Blob
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const blob = new Blob([arrayBuffer], { type: file.type });

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          displayMessage(
            uploadMessage,
            `File uploaded successfully! Access at: ${documentUrl}`,
            false,
          );
          fileInput.value = ""; // Clear file input
        } else {
          displayMessage(
            uploadMessage,
            `File upload failed: ${xhr.status} ${xhr.statusText}. Server response: ${xhr.responseText}`,
          );
          console.error(
            "File upload failed:",
            xhr.status,
            xhr.statusText,
            xhr.responseText,
          );
        }
      };

      xhr.onerror = () => {
        displayMessage(uploadMessage, "Network error during file upload.");
        console.error("XHR error during file upload.");
      };

      xhr.send(blob);
    };

    reader.onerror = () => {
      displayMessage(uploadMessage, "Error reading file.");
      console.error("FileReader error.");
    };

    reader.readAsArrayBuffer(file);
  } catch (error) {
    displayMessage(uploadMessage, "Error during file upload process.");
    console.error("Upload process error:", error);
  }
});

// Attach event listeners for ingest stream buttons
startIngestButton.addEventListener('click', startIngestStream);
stopIngestButton.addEventListener('click', stopIngestStream);

// Chat event listeners
createChatButton.addEventListener('click', createChat);
backToChatsButton.addEventListener('click', () => {
    chatWindowSection.style.display = 'none';
    chatsSection.style.display = 'block';
    documentsSection.style.display = 'block';
    uploadSection.style.display = 'block';
    ingestStreamSection.style.display = 'block';
    fetchChats();
});
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (msg) startChatStream(msg);
});

// Check for existing token on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        authToken = storedToken;
        authSection.style.display = 'none';
        uploadSection.style.display = 'block';
        documentsSection.style.display = 'block'; // Show documents section
        chatsSection.style.display = 'block'; // Show chats section
        ingestStreamSection.style.display = 'block'; // Show ingest stream section
        fetchDocuments(); // Fetch documents on page load if logged in
        fetchChats(); // Fetch chats on page load
    } else {
        authSection.style.display = 'block';
        uploadSection.style.display = 'none';
        documentsSection.style.display = 'none';
        chatsSection.style.display = 'none';
        chatWindowSection.style.display = 'none';
        ingestStreamSection.style.display = 'none';
    }
});

// Global openChat for button onclick
window.openChat = openChat;

