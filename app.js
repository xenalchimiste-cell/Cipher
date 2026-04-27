// State Management
let currentUser = JSON.parse(localStorage.getItem('cipher-user')) || null;
let activeChat = null;
let contacts = [
    { id: 1, name: 'Elara Vance', username: '@elara', phone: '0612345678', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara', status: 'Online', lastMsg: 'The payload is ready for deployment.', time: '21:04' },
    { id: 2, name: 'Kaelen Drass', username: '@kaelen', phone: '0687654321', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelen', status: 'Last seen 2h ago', lastMsg: 'Protocol Alpha-6 verified.', time: '18:30' },
    { id: 3, name: 'Lyra Thorne', username: '@lyra', phone: '0611223344', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lyra', status: 'Online', lastMsg: 'Awaiting signal.', time: 'Yesterday' }
];
let messages = JSON.parse(localStorage.getItem('cipher-messages')) || {};

// DOM Elements
const onboardingView = document.getElementById('onboarding-view');
const otpView = document.getElementById('otp-view');
const messengerView = document.getElementById('messenger-view');
const sidebar = document.getElementById('sidebar');
const chatView = document.getElementById('chat-view');
const chatList = document.getElementById('chat-list');
const messageArea = document.getElementById('message-area');
const messageInput = document.getElementById('message-input');
const btnSend = document.getElementById('btn-send');
const phoneInput = document.getElementById('phone-input');
const btnOnboardingNext = document.getElementById('btn-onboarding-next');
const btnOtpVerify = document.getElementById('btn-otp-verify');
const btnOtpResend = document.getElementById('btn-otp-resend');
const otpDigits = document.querySelectorAll('.otp-digit');
const otpPhoneDisplay = document.getElementById('otp-phone-display');
const backToList = document.getElementById('back-to-list');
const contactSearch = document.getElementById('contact-search');
const myProfileBtn = document.getElementById('my-profile-btn');
const profileModal = document.getElementById('profile-modal');
const profileSave = document.getElementById('profile-save');
const usernameInput = document.getElementById('username-input');
const btnAttach = document.getElementById('btn-attach');
const photoInput = document.getElementById('photo-input');
const avatarInput = document.getElementById('avatar-input');
const btnChangeAvatar = document.getElementById('btn-change-avatar');
const profilePreview = document.getElementById('profile-preview');
const myAvatar = document.getElementById('my-avatar');
const displayNameInput = document.getElementById('display-name-input');
const btnLogout = document.getElementById('btn-logout');
const profileClose = document.getElementById('profile-close');
const profilePhone = document.getElementById('profile-phone');

// Initialization
function init() {
    if (currentUser) {
        showMessenger();
    }
    
    renderChatList();
    initEventListeners();
}

function initEventListeners() {
    btnOnboardingNext.addEventListener('click', handleOnboarding);
    btnOtpVerify.addEventListener('click', verifyOTP);
    btnOtpResend.addEventListener('click', sendOTP);
    btnSend.addEventListener('click', sendMessage);
    
    // OTP Digits Auto-focus
    otpDigits.forEach((digit, idx) => {
        digit.addEventListener('keyup', (e) => {
            if (e.key >= 0 && e.key <= 9) {
                if (idx < otpDigits.length - 1) otpDigits[idx + 1].focus();
            } else if (e.key === 'Backspace') {
                if (idx > 0) otpDigits[idx - 1].focus();
            }
        });
    });
    backToList.addEventListener('click', hideChat);
    contactSearch.addEventListener('input', filterContacts);
    myProfileBtn.addEventListener('click', () => profileModal.classList.add('active'));
    document.getElementById('my-profile-btn-mobile').addEventListener('click', () => profileModal.classList.add('active'));
    profileSave.addEventListener('click', saveProfile);
    
    // Photo attachment
    btnAttach.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);

    // Profile photo
    btnChangeAvatar.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', handleProfilePhotoUpload);
    profileClose.addEventListener('click', () => profileModal.classList.remove('active'));
    btnLogout.addEventListener('click', logout);
    profileSave.addEventListener('click', saveProfile);
    
    // Mobile Nav
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (index === 2) profileModal.classList.add('active');
        });
    });

    // Chat Actions (Placeholders)
    document.querySelectorAll('.chat-actions .icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert("Encrypted Video/Audio call feature will be available in the next node update.");
        });
    });

    // Settings Items
    document.querySelectorAll('.settings-item').forEach(item => {
        item.addEventListener('click', () => {
            const label = item.querySelector('span').textContent;
            alert(`${label} settings are currently locked for maximum security.`);
        });
    });
    
    if (currentUser) {
        updateProfileUI();
    }
    
    // Enter key for messaging
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// --- Navigation ---
function showMessenger() {
    onboardingView.classList.remove('active');
    messengerView.classList.add('active');
}

function handleOnboarding() {
    const phone = phoneInput.value.trim();
    if (phone.length >= 8) {
        currentUser = { phone, username: '@user' + Math.floor(Math.random() * 1000) };
        sendOTP();
    }
}

let generatedOTP = null;

function sendOTP() {
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("CIPHER SECURITY NODE: Sent OTP code:", generatedOTP);
    alert(`CIPHER SECURITY NODE:\nVerification code sent to ${currentUser.phone}: ${generatedOTP}\n(Simulation Mode)`);
    
    otpPhoneDisplay.textContent = `We sent a code to +33 ${currentUser.phone}`;
    onboardingView.classList.remove('active');
    otpView.classList.add('active');
    setTimeout(() => otpDigits[0].focus(), 500);
}

function verifyOTP() {
    let enteredOTP = "";
    otpDigits.forEach(d => enteredOTP += d.value);
    
    if (enteredOTP === generatedOTP) {
        localStorage.setItem('cipher-user', JSON.stringify(currentUser));
        otpView.classList.remove('active');
        showMessenger();
    } else {
        alert("Invalid verification code. Please try again.");
        otpDigits.forEach(d => d.value = "");
        otpDigits[0].focus();
    }
}

function hideChat() {
    chatView.classList.remove('active');
    sidebar.classList.remove('hidden-mobile');
}

// --- Chat List & Contacts ---
function renderChatList(filter = '') {
    chatList.innerHTML = '';
    const filtered = contacts.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) || 
        c.username.toLowerCase().includes(filter.toLowerCase()) ||
        c.phone.includes(filter)
    );

    filtered.forEach(contact => {
        const item = document.createElement('div');
        item.className = `chat-item ${activeChat && activeChat.id === contact.id ? 'active' : ''}`;
        item.onclick = () => selectChat(contact);
        item.innerHTML = `
            <div class="chat-avatar">
                <img src="${contact.avatar}" alt="${contact.name}">
            </div>
            <div class="chat-info">
                <div class="chat-top">
                    <h4>${contact.name}</h4>
                    <span class="chat-time">${contact.time}</span>
                </div>
                <p class="chat-preview">${contact.lastMsg}</p>
            </div>
        `;
        chatList.appendChild(item);
    });
}

function filterContacts(e) {
    renderChatList(e.target.value);
}

// --- Messaging ---
function selectChat(contact) {
    activeChat = contact;
    renderChatList(); // Refresh active state
    
    // Update Header
    document.getElementById('active-avatar').src = contact.avatar;
    document.getElementById('active-name').textContent = contact.name;
    document.getElementById('active-status').textContent = contact.status;
    
    // Transition for mobile
    chatView.classList.add('active');
    sidebar.classList.add('hidden-mobile');
    
    renderMessages();
}

function renderMessages() {
    if (!activeChat) return;
    messageArea.innerHTML = '';
    
    const chatMsgs = messages[activeChat.id] || [];
    
    if (chatMsgs.length === 0) {
        messageArea.innerHTML = `
            <div class="empty-state">
                <i data-lucide="lock"></i>
                <p>Messages are end-to-end encrypted. No one outside of this chat can read them.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    chatMsgs.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        
        let content = msg.text;
        if (msg.type === 'image') {
            content = `<img src="${msg.image}" class="message-image">` + (msg.text ? `<p>${msg.text}</p>` : '');
        }

        msgEl.innerHTML = `
            ${content}
            <span class="msg-time">${msg.time}</span>
        `;
        messageArea.appendChild(msgEl);
    });
    
    scrollToBottom();
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !activeChat) return;

    const newMsg = {
        id: Date.now(),
        text: text,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!messages[activeChat.id]) messages[activeChat.id] = [];
    messages[activeChat.id].push(newMsg);
    
    // Update last message in contact list
    activeChat.lastMsg = text;
    activeChat.time = 'Now';
    
    saveData();
    renderMessages();
    renderChatList();
    
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Simulate Echo/Encrypted reply after 1s
    setTimeout(simulateReply, 1500);
}

function simulateReply() {
    if (!activeChat) return;
    const replies = [
        "Transmission received. Encrypting response...",
        "Acknowledged. Node is stable.",
        "Secure link established. Proceed.",
        "Payload verified. Stand by."
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMsg = {
        id: Date.now(),
        text: replyText,
        sender: 'other',
        type: 'text',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    messages[activeChat.id].push(replyMsg);
    activeChat.lastMsg = replyText;
    activeChat.time = 'Now';
    
    saveData();
    renderMessages();
    renderChatList();
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const newMsg = {
            id: Date.now(),
            text: '',
            image: event.target.result,
            type: 'image',
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (!messages[activeChat.id]) messages[activeChat.id] = [];
        messages[activeChat.id].push(newMsg);
        activeChat.lastMsg = '📷 Photo';
        activeChat.time = 'Now';

        saveData();
        renderMessages();
        renderChatList();
        scrollToBottom();
    };
    reader.readAsDataURL(file);
}

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

// --- Profile ---
function saveProfile() {
    const username = usernameInput.value.trim();
    const displayName = displayNameInput.value.trim();
    
    if (username.startsWith('@')) {
        currentUser.username = username;
        currentUser.name = displayName;
        localStorage.setItem('cipher-user', JSON.stringify(currentUser));
        updateProfileUI();
        profileModal.classList.remove('active');
    } else {
        alert('Username must start with @');
    }
}

function handleProfilePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        currentUser.avatar = event.target.result;
        localStorage.setItem('cipher-user', JSON.stringify(currentUser));
        updateProfileUI();
    };
    reader.readAsDataURL(file);
}

function updateProfileUI() {
    if (!currentUser) return;
    myAvatar.src = currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.phone}`;
    profilePreview.src = myAvatar.src;
    displayNameInput.value = currentUser.name || 'User';
    usernameInput.value = currentUser.username || '@user';
    profilePhone.textContent = currentUser.phone || 'Unknown';
}

function logout() {
    localStorage.removeItem('cipher-user');
    location.reload();
}

function saveData() {
    localStorage.setItem('cipher-messages', JSON.stringify(messages));
}

init();
lucide.createIcons();
