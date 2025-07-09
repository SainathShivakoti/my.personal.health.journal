// --- script.js: Full Final Version with Manual Save, Autosave Toast, and Export ---

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const journal = document.getElementById("journal");
const authSection = document.getElementById('auth-section');
const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');
const welcomeSection = document.getElementById('welcome-section');
const journalContainer = document.getElementById('journal-container');

const regUsernameInput = document.getElementById('reg-username');
const regPasswordInput = document.getElementById('reg-password');
const registerBtn = document.getElementById('register-btn');
const regMessage = document.getElementById('reg-message');

const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginMessage = document.getElementById('login-message');

const welcomeMessage = document.getElementById('welcome-message');
const logoutLink = document.getElementById('logout-link');

const showLoginLink = document.getElementById('show-login');
const showRegisterLink = document.getElementById('show-register');

const forgotPasswordForm = document.getElementById('forgot-password-form');
const showForgotPasswordLink = document.getElementById('show-forgot-password');
const forgotUsernameInput = document.getElementById('forgot-username');
const newPasswordInput = document.getElementById('new-password');
const resetPasswordBtn = document.getElementById('reset-password-btn');
const forgotMessage = document.getElementById('forgot-message');
const backToLoginLink = document.getElementById('back-to-login');

const BACKEND_URL = 'http://127.0.0.1:5000';

function showLoginForm() {
    registrationForm.style.display = 'none';
    loginForm.style.display = 'block';
    forgotPasswordForm.style.display = 'none';
    regMessage.textContent = '';
    loginMessage.textContent = '';
    forgotMessage.textContent = '';
    regUsernameInput.value = '';
    regPasswordInput.value = '';
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
    forgotUsernameInput.value = '';
    newPasswordInput.value = '';
}

function showRegistrationForm() {
    registrationForm.style.display = 'block';
    loginForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    regMessage.textContent = '';
    loginMessage.textContent = '';
    forgotMessage.textContent = '';
    regUsernameInput.value = '';
    regPasswordInput.value = '';
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
    forgotUsernameInput.value = '';
    newPasswordInput.value = '';
}

function showForgotPasswordForm() {
    registrationForm.style.display = 'none';
    loginForm.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
    regMessage.textContent = '';
    loginMessage.textContent = '';
    forgotMessage.textContent = '';
    regUsernameInput.value = '';
    regPasswordInput.value = '';
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
    forgotUsernameInput.value = '';
    newPasswordInput.value = '';
}

// function showJournal(username) {
//     authSection.style.display = 'none';
//     journalContainer.style.display = 'block';
//     welcomeMessage.textContent = "Welcome, " + username + "!";
//     welcomeSection.style.display = 'flex';

//     if (logoutLink) {
//         // logoutLink.style.cursor = 'pointer';
//         // logoutLink.style.textDecoration = 'underline';
//         // logoutLink.style.color = '#007bff';
//         logoutLink.removeEventListener('click', handleLogout);
//         logoutLink.addEventListener('click', handleLogout);
//     }

//     loadJournalEntries(username);
// }

function showJournal(username) {
    authSection.style.display = 'none';
    journalContainer.style.display = 'block';
    welcomeMessage.textContent = "Welcome, " + username + "!";
    welcomeSection.style.display = 'flex';

    if (logoutLink) {
        logoutLink.removeEventListener('click', handleLogout);
        logoutLink.addEventListener('click', handleLogout);
    }

    loadJournalEntries(username);
    addManualSaveButton();
    addExportButton();
}

function showAuthForms() {
    authSection.style.display = 'block';
    welcomeSection.style.display = 'none';
    journalContainer.style.display = 'none';
    showLoginForm();
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    document.querySelectorAll('.entry-input').forEach(input => input.value = '');
    showAuthForms();
}

showLoginLink.addEventListener('click', e => { e.preventDefault(); showLoginForm(); });
showRegisterLink.addEventListener('click', e => { e.preventDefault(); showRegistrationForm(); });
showForgotPasswordLink.addEventListener('click', e => { e.preventDefault(); showForgotPasswordForm(); });
backToLoginLink.addEventListener('click', e => { e.preventDefault(); showLoginForm(); });

registerBtn.addEventListener('click', async () => {
    const username = regUsernameInput.value;
    const password = regPasswordInput.value;
    if (!username || !password) {
        regMessage.style.color = 'red';
        regMessage.textContent = 'Please fill in both username and password.';
        return;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        regMessage.textContent = data.message;
        regMessage.style.color = res.ok ? 'green' : 'red';
        if (res.ok) setTimeout(showLoginForm, 1500);
    } catch (err) {
        regMessage.style.color = 'red';
        regMessage.textContent = 'Network error. Please ensure your backend is running.';
    }
});

loginBtn.addEventListener('click', async () => {
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;
    if (!username || !password) {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Please fill in both username and password.';
        return;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        loginMessage.textContent = data.message;
        loginMessage.style.color = res.ok ? 'green' : 'red';
        if (res.ok) {
            localStorage.setItem('loggedInUser', username);
            showJournal(username);
            document.getElementById('manual-save-btn')?.remove();
            document.getElementById('export-btn')?.remove();
            addManualSaveButton();
            addExportButton();
            addDarkModeToggle();
        }
    } catch (err) {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Network error. Please ensure your backend is running.';
    }
});

resetPasswordBtn.addEventListener('click', async () => {
    const username = forgotUsernameInput.value;
    const newPassword = newPasswordInput.value;
    if (!username || !newPassword) {
        forgotMessage.style.color = 'red';
        forgotMessage.textContent = 'Please enter both username and new password.';
        return;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/reset-password`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, new_password: newPassword })
        });
        const data = await res.json();
        forgotMessage.textContent = data.message;
        forgotMessage.style.color = res.ok ? 'green' : 'red';
        if (res.ok) setTimeout(showLoginForm, 2000);
    } catch (err) {
        forgotMessage.style.color = 'red';
        forgotMessage.textContent = 'Network error. Please ensure your backend is running.';
    }
});

function generateJournal() {
    journal.innerHTML = '';
    for (let month = 0; month < 12; month++) {
        const year = 2025;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const container = document.createElement("div");
        container.className = "month";
        const title = document.createElement("h2");
        title.className = "nameOfMonth"
        title.textContent = `${monthNames[month]} ${year}`;
        container.appendChild(title);

        const headerRow = document.createElement("div");
        headerRow.className = "calendar";
        daysOfWeek.forEach(d => {
            const cell = document.createElement("div");
            cell.className = "day-header";
            cell.textContent = d;
            headerRow.appendChild(cell);
        });
        container.appendChild(headerRow);

        const grid = document.createElement("div");
        grid.className = "calendar";

        for (let i = 0; i < firstDay; i++) {
            const pad = document.createElement("div");
            pad.className = "day empty-day-placeholder";
            grid.appendChild(pad);
        }

        for (let date = 1; date <= daysInMonth; date++) {
            const dayBox = document.createElement("div");
            dayBox.className = "day";
            const dateContainer = document.createElement("div");
            dateContainer.className = "date";

            const dayOfWeekMobile = document.createElement("span");
            dayOfWeekMobile.className = "day-of-week-mobile";
            const currentDayIndex = (firstDay + date - 1) % 7;
            dayOfWeekMobile.textContent = daysOfWeek[currentDayIndex];
            dateContainer.appendChild(dayOfWeekMobile);

            const dateLabel = document.createElement("span");
            dateLabel.textContent = date;
            dateContainer.appendChild(dateLabel);
            dayBox.appendChild(dateContainer);

            ["Breakfast", "Lunch", "Dinner", "Snacks", "Migraine Notes", "Other"].forEach(label => {
                const entryLine = document.createElement("div");
                entryLine.className = "entry-line";

                const entryLabel = document.createElement("span");
                entryLabel.className = "entry-label";
                entryLabel.innerHTML = `${label.split(' ').join('<br>')}:`;

                const input = document.createElement("textarea");
                input.className = "entry-input";
                input.rows = 3;
                input.maxLength = 60;
                input.name = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}-${label.replace(/\s/g, '')}`;

                entryLine.appendChild(entryLabel);
                entryLine.appendChild(input);
                dayBox.appendChild(entryLine);
            });
            grid.appendChild(dayBox);
        }
        container.appendChild(grid);
        journal.appendChild(container);
    }

    document.querySelectorAll('.entry-input').forEach(input => {
        input.addEventListener('input', (event) => {
            const currentUser = localStorage.getItem('loggedInUser');
            if (currentUser && event.target.value.trim()) {
                saveJournalEntry(currentUser, input.name, input.value);
                originalValues.set(input.name, input.value);
            }
        });
    });
    trackOriginalValues();
    addManualSaveButton();
    addExportButton();
}

async function loadJournalEntries(username) {
    try {
        const response = await fetch(`${BACKEND_URL}/journal/load?username=${username}`);
        if (response.ok) {
            const entries = await response.json();
            entries.forEach(entry => {
                const input = document.querySelector(`.entry-input[name="${entry.field_id}"]`);
                if (input) input.value = entry.content;
            });
            trackOriginalValues();
        }
    } catch (error) {
        alert("Could not load journal entries. Ensure the server is running.");
    }
}

async function saveJournalEntry(username, fieldId, content) {
    try {
        const res = await fetch(`${BACKEND_URL}/journal/save`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, field_id: fieldId, content })
        });
    } catch (err) {
        console.error("Error saving entry", err);
    }
}

const originalValues = new Map();
function trackOriginalValues() {
    document.querySelectorAll('.entry-input').forEach(input => {
        originalValues.set(input.name, input.value);
    });
}
function getModifiedEntries() {
    const modified = [];
    document.querySelectorAll('.entry-input').forEach(input => {
        const original = originalValues.get(input.name);
        if (input.value && input.value !== original) {
            modified.push({ name: input.name, value: input.value });
        }
    });
    return modified;
}
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '10px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    toast.style.opacity = '0.95';
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

function addManualSaveButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Save Journal';
    btn.id = 'manual-save-btn';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '20px', right: '20px', padding: '10px 20px', zIndex: '10000',
        backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
    });
    btn.addEventListener('click', () => {
        const currentUser = localStorage.getItem('loggedInUser');
        if (!currentUser) return alert('Login required.');
        getModifiedEntries().forEach(({ name, value }) => saveJournalEntry(currentUser, name, value));
        showToast('Journal enties saved successfully!');
    });
    document.body.appendChild(btn);
}

function addExportButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Export Journal';
    btn.id = 'export-btn';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '70px', right: '20px', padding: '10px 20px', zIndex: '10000',
        backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
    });
    btn.addEventListener('click', async () => {
        const currentUser = localStorage.getItem('loggedInUser');
        if (!currentUser) return alert('Login required.');
        try {
            const res = await fetch(`${BACKEND_URL}/journal/load?username=${currentUser}`);
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentUser}_journal.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Export failed.');
        }
    });
    document.body.appendChild(btn);
}

setInterval(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
        const modified = getModifiedEntries();
        if (modified.length) {
            modified.forEach(({ name, value }) => {
                saveJournalEntry(user, name, value);
                originalValues.set(name, value);
            });
            showToast('Auto-saved at ' + new Date().toLocaleTimeString());
        }
    }
}, 300000);

document.addEventListener('DOMContentLoaded', () => {
    generateJournal();
    const user = localStorage.getItem('loggedInUser');
    if (user) {
        showJournal(user);
    } else {
        showAuthForms();
    }
});

// --- DARK MODE TOGGLE ---
function addDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'dark-toggle';

    function applyDarkModeStyles() {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '☀️';
        toggle.style.backgroundColor = '#fff';
        toggle.style.color = '#333';
    }

    function applyLightModeStyles() {
        document.body.classList.remove('dark-mode');
        toggle.innerHTML = '🌙';
        toggle.style.backgroundColor = '#333';
        toggle.style.color = '#fff';
    }

    // Initialize styles
    toggle.style.border = 'none';
    toggle.style.borderRadius = '5px';
    toggle.style.padding = '8px 12px';
    toggle.style.cursor = 'pointer';
    toggle.style.fontSize = '16px';
    toggle.style.marginRight = '10px';

    // Load saved mode
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        applyDarkModeStyles();
    } else {
        applyLightModeStyles();
    }

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        if (isDark) {
            applyDarkModeStyles();
        } else {
            applyLightModeStyles();
        }
    });

    const welcomeSection = document.getElementById('welcome-section');
    if (welcomeSection && !document.getElementById('dark-toggle')) {
        welcomeSection.insertBefore(toggle, welcomeSection.firstChild);
    }
}
