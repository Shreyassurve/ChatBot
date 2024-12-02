document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');
    const typingIndicator = document.getElementById('typing-indicator');
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const emojiButton = document.getElementById('emoji-btn');
    const emojiContainer = document.getElementById('emoji-container');
    const fileInput = document.getElementById('file-input');
    const downloadBtn = document.getElementById('download-chat');
    const voiceBtn = document.getElementById('voice-btn');  // Voice button element

    const username = 'User'; // Set username
    document.getElementById('username').textContent = username;

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // You can change the language as needed
    recognition.interimResults = false; // Set to true if you want real-time results

    // Start voice recognition when the voice button is clicked
    voiceBtn.addEventListener('click', () => {
        recognition.start(); // Start speech recognition
    });

    // When speech is detected, fill the message input with the transcribed text
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;  // Set the transcribed text to the input field
    };

    // Handle any errors with speech recognition
    recognition.onerror = function(event) {
        console.error("Error with speech recognition: ", event.error);
    };

    // GitHub Emoji Map
    const emojiMap = {
        ':smile:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f604.png',
        ':heart:': 'https://github.githubassets.com/images/icons/emoji/unicode/2764.png',
        ':thumbsup:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png',
        ':laughing:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f606.png',
        ':wink:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f609.png',
        ':cry:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f622.png',
        ':thumbsdown:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png',
        ':clap:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f44f.png',
        ':star:': 'https://github.githubassets.com/images/icons/emoji/unicode/2b50.png',
        ':fire:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f525.png',
        ':sunglasses:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f60e.png',
        ':tada:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f389.png',
        ':muscle:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f4aa.png',
        ':hugs:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f917.png',
        ':pizza:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f355.png',
        ':coffee:': 'https://github.githubassets.com/images/icons/emoji/unicode/2615.png',
        ':sunny:': 'https://github.githubassets.com/images/icons/emoji/unicode/2600.png',
        ':earth_africa:': 'https://github.githubassets.com/images/icons/emoji/unicode/1f30d.png',
    };

    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return; // Don't send empty messages

        // Add user message to chat
        addMessageToChat(message, 'user');

        // Save chat to localStorage
        saveChatToLocalStorage();

        // Clear input field
        messageInput.value = '';

        // Simulate bot response after a short delay
        typingIndicator.style.display = 'block';
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            addMessageToChat(generateBotResponse(message), 'bot');
            saveChatToLocalStorage(); // Save chat after bot responds
        }, 1000);
    }

    // Add message to chat window
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        // Create message content element
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = convertTextToEmojis(message); // Convert emojis before adding content
        messageElement.appendChild(messageContent);

        // Timestamp
        const timestamp = document.createElement('span');
        timestamp.classList.add('time');
        const date = new Date();
        timestamp.textContent = `${date.getHours()}:${date.getMinutes()}`;
        messageElement.appendChild(timestamp);

        // Add actions for user messages (edit and delete buttons)
        if (sender === 'user') {
            const messageActions = document.createElement('div');
            messageActions.classList.add('message-actions');

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            messageActions.appendChild(editBtn);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            messageActions.appendChild(deleteBtn);

            messageElement.appendChild(messageActions);
        }

        // Add read receipt for bot's message
        if (sender === 'bot') {
            const readReceipt = document.createElement('span');
            readReceipt.classList.add('read-receipt');
            readReceipt.textContent = '✔️'; // Checkmark symbol for read receipt
            messageElement.appendChild(readReceipt);

            // Simulate bot reading the message after a short delay
            setTimeout(() => {
                readReceipt.style.display = 'inline'; // Show the read receipt after the message is read
            }, 500); // You can adjust the delay as needed
        }

        // Append message to chat window
        chatWindow.appendChild(messageElement);

        // Scroll to the bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Convert text message to display emojis (if applicable)
    function convertTextToEmojis(text) {
        return text.replace(/(:\w+:)/g, (match) => {
            return emojiMap[match] ? `<img src="${emojiMap[match]}" alt="${match}" class="emoji" />` : match;
        });
    }

    // Simulate bot response based on user message with more varied replies
    function generateBotResponse(userMessage) {
        const responses = [
            `You said: ${userMessage}`,
            `How can I assist you with "${userMessage}"?`,
            `That's interesting! Could you elaborate on "${userMessage}"?`,
            `Tell me more about "${userMessage}". I'm curious!`,
            `I see you're talking about "${userMessage}". What else can I help you with?`,
            `I’m not sure about "${userMessage}". Do you want to know something else?`,
            `Sounds fun! What else do you want to talk about?`,
            `Let me think about "${userMessage}". Meanwhile, is there anything else?`,
            `"${userMessage}" sounds exciting! Have you tried exploring it more?`,
            `That's cool! "${userMessage}" is definitely worth discussing.`,
            `Oh, "${userMessage}" reminds me of something! Let's dive deeper.`,
            `"${userMessage}" could be a great topic to learn about. What do you think?`,
            `I'm here to chat! Tell me more about "${userMessage}" or ask me something else.`,
            `"${userMessage}" has so much to unpack! Where should we start?`,
            `Interesting! "${userMessage}" could lead us to many other topics.`,
            `Hmm, "${userMessage}" makes me curious. Want to explore it together?`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Save the current chat to localStorage
    function saveChatToLocalStorage() {
        const chatMessages = chatWindow.innerHTML;
        localStorage.setItem('chatMessages', chatMessages);
    }

    // Load chat from localStorage on page load
    function loadChatFromLocalStorage() {
        const savedChat = localStorage.getItem('chatMessages');
        if (savedChat) {
            chatWindow.innerHTML = savedChat;
        }
    }

    // Download chat as a text file
    downloadBtn.addEventListener('click', () => {
        const chatText = chatWindow.innerText;
        const blob = new Blob([chatText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'chat.txt';
        link.click();
    });

    // Toggle night mode
if (localStorage.getItem('nightMode') === 'true') {
    document.body.classList.add('night-mode');
}

nightModeToggle.addEventListener('click', function () {
    // Toggle the 'night-mode' class on the body
    document.body.classList.toggle('night-mode');

    // Night mode toggle
    nightModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
    
    // Save the night mode state in localStorage
    localStorage.setItem('nightMode', document.body.classList.contains('night-mode') ? 'true' : 'false');
});


    // Show emoji container
    emojiButton.addEventListener('click', () => {
        emojiContainer.style.display = emojiContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Fetch emojis and display them
    function fetchEmojis() {
        const emojiNames = Object.keys(emojiMap);
        emojiNames.forEach(name => {
            const emojiElement = document.createElement('img');
            emojiElement.src = emojiMap[name];
            emojiElement.alt = `:${name}:`;
            emojiElement.classList.add('emoji');
            emojiElement.style.width = '32px';
            emojiElement.style.cursor = 'pointer';
            emojiElement.addEventListener('click', () => {
                messageInput.value += `:${name}:`;
                emojiContainer.style.display = 'none';
            });
            emojiContainer.appendChild(emojiElement);
        });
    }

    // Handle file uploads
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const message = `📎 <a href="${URL.createObjectURL(file)}" target="_blank">${file.name}</a>`;
            addMessageToChat(message, 'user');
        }
    });

    // Typing indicator
    messageInput.addEventListener('input', () => {
        typingIndicator.textContent = `${username} is typing...`;
        typingIndicator.style.display = 'block';
        clearTimeout(window.typingTimeout);
        window.typingTimeout = setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 1000);
    });

    // Edit and delete message actions
    chatWindow.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const messageContent = event.target.closest('.message').querySelector('.message-content');
            const newText = prompt('Edit your message:', messageContent.textContent);
            if (newText) {
                messageContent.innerHTML = convertTextToEmojis(newText);
            }
        }

        if (event.target.classList.contains('delete-btn')) {
            event.target.closest('.message').remove();
        }
    });

    // Initialize emoji container and fetch emojis
    fetchEmojis();

    // Load the chat history from localStorage when the page loads
    loadChatFromLocalStorage();

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key press
    messageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
