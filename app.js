// GUY'S APPLICATOR - CORE DATA & FUNCTIONS

// ==================== DATA STORAGE ====================
let appState = {
    currentScreen: 'main',
    currentJobType: null,
    currentCV: null,
    companyName: '',
    contactEmail: '',
    contactWhatsApp: '',
    jobTitle: '',
    jobDescription: '',
    generatedContent: null
};

// Default CV templates (users can edit these)
let cvTemplates = {
    salesGeneral: {
        name: 'Sales - General',
        summary: 'Results-driven Sales Professional with 3+ years of experience in direct sales, customer relationship management, and territory expansion. Proven track record of exceeding targets and building lasting client relationships.',
        experience: [
            'Sales Officer | Goodwill Ceramics (Sept 2025–Present)',
            'Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)',
            'Sales Representative | Milvik Insurance (Jan 2024–Dec 2024)',
            'Sales Assistant | DWL Organic TZ (Apr 2022–Oct 2023)'
        ],
        skills: ['Direct Sales', 'Client Relationships', 'Objection Handling', 'Territory Management', 'Negotiation'],
        education: 'CSEE Division I (2018)'
    },
    salesLeadership: {
        name: 'Sales - Team Leadership',
        summary: 'Sales professional with demonstrated leadership experience, mentoring teams while maintaining personal sales targets. Skilled in training, coaching, and improving team performance.',
        experience: [
            'Sales Officer | Team Mentor | Goodwill Ceramics (Sept 2025–Present)',
            'Sales Agent | Field Team Coordinator | Blue Carbon Technology (Nov 2023–Aug 2025)',
            'Sales Representative | Milvik Insurance (Jan 2024–Dec 2024)',
            'Sales Assistant | DWL Organic TZ (Apr 2022–Oct 2023)'
        ],
        skills: ['Team Leadership', 'Mentoring', 'Sales Training', 'Performance Monitoring', 'Direct Sales'],
        education: 'CSEE Division I (2018)'
    },
    customerService: {
        name: 'Customer Service',
        summary: 'Customer-focused professional with strong communication skills and experience handling inquiries, resolving complaints, and ensuring client satisfaction across multiple industries.',
        experience: [
            'Sales Officer | Goodwill Ceramics (Sept 2025–Present)',
            'Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)',
            'Sales Representative | Milvik Insurance (Jan 2024–Dec 2024)',
            'Sales Assistant | DWL Organic TZ (Apr 2022–Oct 2023)'
        ],
        skills: ['Customer Service', 'Complaint Resolution', 'Communication', 'Patience', 'Problem Solving'],
        education: 'CSEE Division I (2018)'
    },
    automotive: {
        name: 'Sales - Automotive Focus',
        summary: 'Sales professional with valid driver\'s license and experience selling technical products. Skilled in client consultation, test drives, and closing high-value deals.',
        experience: [
            'Sales Officer | Goodwill Ceramics (Sept 2025–Present)',
            'Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)',
            'Sales Representative | Milvik Insurance (Jan 2024–Dec 2024)',
            'Sales Assistant | DWL Organic TZ (Apr 2022–Oct 2023)'
        ],
        skills: ['Valid Driver\'s License', 'Vehicle Knowledge', 'Client Consultation', 'Test Drives', 'Negotiation'],
        education: 'CSEE Division I (2018)'
    }
};

// Tracker storage
let applicationTracker = [];

// Load from localStorage on startup
function loadData() {
    const savedCVs = localStorage.getItem('guyApplicator_cvs');
    const savedTracker = localStorage.getItem('guyApplicator_tracker');
    
    if (savedCVs) {
        try {
            cvTemplates = JSON.parse(savedCVs);
        } catch (e) {
            console.error('Failed to load CVs');
        }
    }
    
    if (savedTracker) {
        try {
            applicationTracker = JSON.parse(savedTracker);
        } catch (e) {
            console.error('Failed to load tracker');
        }
    }
}

// Save to localStorage
function saveData() {
    localStorage.setItem('guyApplicator_cvs', JSON.stringify(cvTemplates));
    localStorage.setItem('guyApplicator_tracker', JSON.stringify(applicationTracker));
}

// ==================== UI RENDERING ====================
const terminalBody = document.getElementById('terminalBody');

function renderScreen(content) {
    terminalBody.innerHTML = content;
}

function showMainMenu() {
    appState.currentScreen = 'main';
    const menu = `
        <div class="prompt-line">🔥 GUY'S APPLICATOR v1.0</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Your personal job application assistant</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">Select option:</div>
        <div class="prompt-line"> </div>
        <div class="menu-option" onclick="showNewApplication()">1. New Application</div>
        <div class="menu-option" onclick="showManageCVs()">2. Manage My CVs</div>
        <div class="menu-option" onclick="showTracker()">3. View My Tracker</div>
        <div class="menu-option" onclick="showSettings()">4. Settings</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">Enter number (1-4):</div>
        <input type="text" class="user-input" id="menuInput" placeholder="Type number and press Enter" onkeypress="handleMainMenuKey(event)">
    `;
    renderScreen(menu);
}

function handleMainMenuKey(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('menuInput').value;
        if (input === '1') showNewApplication();
        else if (input === '2') showManageCVs();
        else if (input === '3') showTracker();
        else if (input === '4') showSettings();
        else {
            alert('Invalid option. Please enter 1-4');
            showMainMenu();
        }
    }
}

// Initialize
window.onload = function() {
    loadData();
    showMainMenu();
};

// ==================== NEW APPLICATION FLOW ====================
function showNewApplication() {
    appState.currentScreen = 'jobType';
    const screen = `
        <div class="prompt-line">🔥 NEW APPLICATION</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Select job type:</div>
        <div class="prompt-line"> </div>
        <div class="menu-option" onclick="selectJobType('sales')">1. Sales & Marketing</div>
        <div class="menu-option" onclick="selectJobType('customer')">2. Customer Service</div>
        <div class="menu-option" onclick="selectJobType('management')">3. Management/Leadership</div>
        <div class="menu-option" onclick="selectJobType('creative')">4. Creative/Media</div>
        <div class="menu-option" onclick="selectJobType('admin')">5. Admin/Operations</div>
        <div class="menu-option" onclick="selectJobType('other')">6. Other (custom)</div>
        <div class="prompt-line"> </div>
        <div class="menu-option" onclick="showMainMenu()">← Back to Main Menu</div>
    `;
    renderScreen(screen);
}

function selectJobType(type) {
    appState.currentJobType = type;
    showSelectCV();
}

function showSelectCV() {
    let options = '';
    let index = 1;
    for (let key in cvTemplates) {
        options += `<div class="menu-option" onclick="selectCV('${key}')">${index}. ${cvTemplates[key].name}</div>`;
        index++;
    }
    
    const screen = `
        <div class="prompt-line">🔥 SELECT CV VERSION</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Choose a CV template:</div>
        <div class="prompt-line"> </div>
        ${options}
        <div class="prompt-line"> </div>
        <div class="menu-option" onclick="showNewApplication()">← Back</div>
    `;
    renderScreen(screen);
}

function selectCV(cvKey) {
    appState.currentCV = cvTemplates[cvKey];
    showCompanyDetails();
}

function showCompanyDetails() {
    const screen = `
        <div class="prompt-line">🔥 COMPANY DETAILS</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Enter company information:</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">Company name:</div>
        <input type="text" class="user-input" id="companyName" placeholder="e.g. Elite Future Properties">
        <div class="prompt-line">Contact email:</div>
        <input type="email" class="user-input" id="contactEmail" placeholder="hr@company.com">
        <div class="prompt-line">WhatsApp number (with country code):</div>
        <input type="text" class="user-input" id="contactWhatsApp" placeholder="e.g. 255712345678">
        <div class="prompt-line">Job title:</div>
        <input type="text" class="user-input" id="jobTitle" placeholder="e.g. Sales Executive">
        <div class="prompt-line">Job description (paste or type key requirements):</div>
        <textarea class="user-input" id="jobDescription" rows="4" placeholder="Paste job ad here..."></textarea>
        <div class="prompt-line"> </div>
        <button class="button" onclick="saveCompanyDetails()">Continue →</button>
        <button class="button" onclick="showSelectCV()">← Back</button>
    `;
    renderScreen(screen);
}

function saveCompanyDetails() {
    appState.companyName = document.getElementById('companyName').value;
    appState.contactEmail = document.getElementById('contactEmail').value;
    appState.contactWhatsApp = document.getElementById('contactWhatsApp').value;
    appState.jobTitle = document.getElementById('jobTitle').value;
    appState.jobDescription = document.getElementById('jobDescription').value;
    
    showGenerateOptions();
}

function showGenerateOptions() {
    const screen = `
        <div class="prompt-line">🔥 GENERATE APPLICATION</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">What would you like to generate?</div>
        <div class="prompt-line"> </div>
        <button class="button" onclick="generateCoverLetter()">1. Cover Letter only</button>
        <button class="button" onclick="generateCVText()">2. CV text only</button>
        <button class="button" onclick="generateCVPDF()">3. CV as PDF</button>
        <button class="button" onclick="generateEmailDraft()">4. Email draft</button>
        <button class="button" onclick="generateWhatsApp()">5. WhatsApp message</button>
        <button class="button" onclick="generateAll()">6. ALL OF THE ABOVE ⚡</button>
        <div class="prompt-line"> </div>
        <button class="button" onclick="showCompanyDetails()">← Back</button>
    `;
    renderScreen(screen);
}

// ==================== GENERATION FUNCTIONS ====================
function generateCoverLetter() {
    const coverLetter = `Dear Hiring Team,

I am writing to apply for the ${appState.jobTitle} position at ${appState.companyName}, as advertised.

${appState.currentCV.summary}

My experience includes:
${appState.currentCV.experience.map(exp => `• ${exp}`).join('\n')}

I possess strong skills in: ${appState.currentCV.skills.join(', ')}.

I am confident in my ability to contribute to your team and would welcome the opportunity to discuss my application further.

Yours sincerely,
Feisal Sinani Kitimla
+255 759 968 552`;

    appState.generatedContent = { coverLetter };
    
    const screen = `
        <div class="prompt-line">✅ COVER LETTER GENERATED</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">${coverLetter.replace(/\n/g, '<br>')}</div>
        <button class="button" onclick="copyToClipboard('${coverLetter.replace(/'/g, "\\'")}')">📋 Copy</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateCVText() {
    const cv = `FEISAL SINANI KITIMLA
${appState.currentCV.name}
+255 759 968 552 | feistyfella@gmail.com | Dar es Salaam

PROFESSIONAL SUMMARY
${appState.currentCV.summary}

WORK EXPERIENCE
${appState.currentCV.experience.map(exp => exp).join('\n')}

KEY SKILLS
${appState.currentCV.skills.map(skill => `• ${skill}`).join('\n')}

EDUCATION
${appState.currentCV.education}`;

    appState.generatedContent = { cv };
    
    const screen = `
        <div class="prompt-line">✅ CV TEXT GENERATED</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">${cv.replace(/\n/g, '<br>')}</div>
        <button class="button" onclick="copyToClipboard('${cv.replace(/'/g, "\\'")}')">📋 Copy</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateEmailDraft() {
    const subject = `Application for ${appState.jobTitle} - Feisal Sinani Kitimla`;
    const body = `Dear Hiring Team,

I am writing to apply for the ${appState.jobTitle} position at ${appState.companyName}, as advertised.

${appState.currentCV.summary}

My experience includes:
${appState.currentCV.experience.map(exp => `• ${exp}`).join('\n')}

I possess strong skills in: ${appState.currentCV.skills.join(', ')}.

My CV is attached for your review. I look forward to hearing from you.

Yours sincerely,
Feisal Sinani Kitimla
+255 759 968 552
feistyfella@gmail.com`;

    const mailtoLink = `mailto:${appState.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    const screen = `
        <div class="prompt-line">✅ EMAIL DRAFT READY</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">To: ${appState.contactEmail}\nSubject: ${subject}\n\n${body}</div>
        <button class="button" onclick="window.location.href='${mailtoLink}'">📧 Open in Email App</button>
        <button class="button" onclick="copyToClipboard('${subject}\\n\\n${body.replace(/'/g, "\\'")}')">📋 Copy</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateWhatsApp() {
    const message = `Hello, I am applying for the ${appState.jobTitle} position at ${appState.companyName}. I have ${appState.currentCV.experience.length}+ years of experience in ${appState.currentCV.skills.slice(0,3).join(', ')}. My CV is ready. Thank you.`;
    
    const waLink = `https://wa.me/${appState.contactWhatsApp}?text=${encodeURIComponent(message)}`;
    
    const screen = `
        <div class="prompt-line">✅ WHATSAPP MESSAGE READY</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">${message}</div>
        <button class="button" onclick="window.location.href='${waLink}'">💬 Open WhatsApp</button>
        <button class="button" onclick="copyToClipboard('${message.replace(/'/g, "\\'")}')">📋 Copy</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateAll() {
    generateEmailDraft();
    // In a full version, this would show all options at once
}

// ==================== CV MANAGEMENT ====================
function showManageCVs() {
    let cvList = '';
    let index = 1;
    for (let key in cvTemplates) {
        cvList += `<div class="menu-option" onclick="viewCV('${key}')">${index}. ${cvTemplates[key].name}</div>`;
        index++;
    }
    
    const screen = `
        <div class="prompt-line">📁 MANAGE YOUR CVs</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Your stored CV versions:</div>
        <div class="prompt-line"> </div>
        ${cvList}
        <div class="prompt-line"> </div>
        <button class="button" onclick="createNewCV()">➕ Create New CV</button>
        <button class="button" onclick="showMainMenu()">← Main Menu</button>
    `;
    renderScreen(screen);
}

function viewCV(key) {
    const cv = cvTemplates[key];
    const screen = `
        <div class="prompt-line">📄 ${cv.name}</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">
            <strong>Summary:</strong> ${cv.summary}<br><br>
            <strong>Experience:</strong><br>${cv.experience.map(exp => `• ${exp}`).join('<br>')}<br><br>
            <strong>Skills:</strong> ${cv.skills.join(', ')}<br><br>
            <strong>Education:</strong> ${cv.education}
        </div>
        <button class="button" onclick="editCV('${key}')">✏️ Edit</button>
        <button class="button" onclick="duplicateCV('${key}')">📋 Duplicate</button>
        <button class="button" onclick="deleteCV('${key}')">🗑️ Delete</button>
        <button class="button" onclick="showManageCVs()">← Back</button>
    `;
    renderScreen(screen);
}

function createNewCV() {
    const newKey = 'custom' + Date.now();
    cvTemplates[newKey] = {
        name: 'New CV Template',
        summary: 'Enter your professional summary here',
        experience: ['Job 1 | Company | Date'],
        skills: ['Skill 1', 'Skill 2'],
        education: 'Your education'
    };
    saveData();
    editCV(newKey);
}

function editCV(key) {
    const cv = cvTemplates[key];
    const screen = `
        <div class="prompt-line">✏️ EDIT CV: ${cv.name}</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">CV Name:</div>
        <input type="text" class="user-input" id="editName" value="${cv.name}">
        <div class="prompt-line">Summary:</div>
        <textarea class="user-input" id="editSummary" rows="3">${cv.summary}</textarea>
        <div class="prompt-line">Experience (one per line):</div>
        <textarea class="user-input" id="editExperience" rows="4">${cv.experience.join('\n')}</textarea>
        <div class="prompt-line">Skills (comma separated):</div>
        <input type="text" class="user-input" id="editSkills" value="${cv.skills.join(', ')}">
        <div class="prompt-line">Education:</div>
        <input type="text" class="user-input" id="editEducation" value="${cv.education}">
        <div class="prompt-line"> </div>
        <button class="button" onclick="saveCVEdit('${key}')">💾 Save</button>
        <button class="button" onclick="viewCV('${key}')">← Cancel</button>
    `;
    renderScreen(screen);
}

function saveCVEdit(key) {
    cvTemplates[key] = {
        name: document.getElementById('editName').value,
        summary: document.getElementById('editSummary').value,
        experience: document.getElementById('editExperience').value.split('\n').filter(line => line.trim() !== ''),
        skills: document.getElementById('editSkills').value.split(',').map(s => s.trim()),
        education: document.getElementById('editEducation').value
    };
    saveData();
    viewCV(key);
}

function duplicateCV(key) {
    const newKey = key + '_copy_' + Date.now();
    cvTemplates[newKey] = JSON.parse(JSON.stringify(cvTemplates[key]));
    cvTemplates[newKey].name += ' (Copy)';
    saveData();
    showManageCVs();
}

function deleteCV(key) {
    if (confirm(`Delete ${cvTemplates[key].name}?`)) {
        delete cvTemplates[key];
        saveData();
        showManageCVs();
    }
}

// ==================== TRACKER ====================
function showTracker() {
    let trackerHtml = '';
    if (applicationTracker.length === 0) {
        trackerHtml = '<div class="prompt-line">No applications logged yet.</div>';
    } else {
        applicationTracker.slice().reverse().forEach((app, index) => {
            trackerHtml += `
                <div class="prompt-line">${index+1}. ${app.company} | ${app.role} | ${app.date} | ${app.status}</div>
            `;
        });
    }
    
    const screen = `
        <div class="prompt-line">📊 APPLICATION TRACKER</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Recent applications:</div>
        <div class="prompt-line"> </div>
        ${trackerHtml}
        <div class="prompt-line"> </div>
        <div class="prompt-line">Summary:</div>
        <div class="prompt-line">📤 Total: ${applicationTracker.length}</div>
        <div class="prompt-line"> </div>
        <button class="button" onclick="exportTracker()">📥 Export CSV</button>
        <button class="button" onclick="showMainMenu()">← Back</button>
    `;
    renderScreen(screen);
}

function logApplication() {
    const app = {
        company: appState.companyName || 'Unknown',
        role: appState.jobTitle || 'Unknown',
        date: new Date().toLocaleDateString('en-GB'),
        status: 'Applied',
        notes: ''
    };
    applicationTracker.push(app);
    saveData();
    
    alert('Application logged!');
    showTracker();
}

function exportTracker() {
    let csv = 'Company,Role,Date,Status,Notes\n';
    applicationTracker.forEach(app => {
        csv += `"${app.company}","${app.role}","${app.date}","${app.status}","${app.notes || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guy_applicator_tracker.csv';
    a.click();
}

// ==================== SETTINGS ====================
function showSettings() {
    const screen = `
        <div class="prompt-line">⚙️ SETTINGS</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Your profile:</div>
        <div class="prompt-line">Name: Feisal Sinani Kitimla</div>
        <div class="prompt-line">Phone: +255 759 968 552</div>
        <div class="prompt-line">Email: feistyfella@gmail.com</div>
        <div class="prompt-line"> </div>
        <button class="button" onclick="exportAllData()">📤 Export All Data</button>
        <button class="button" onclick="importAllData()">📥 Import Data</button>
        <button class="button" onclick="resetAllData()">⚠️ Reset All Data</button>
        <div class="prompt-line"> </div>
        <button class="button" onclick="showMainMenu()">← Back</button>
    `;
    renderScreen(screen);
}

function exportAllData() {
    const data = {
        cvs: cvTemplates,
        tracker: applicationTracker
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guy_applicator_backup.json';
    a.click();
}

function importAllData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.cvs) cvTemplates = data.cvs;
                if (data.tracker) applicationTracker = data.tracker;
                saveData();
                alert('Data imported successfully!');
                showMainMenu();
            } catch (err) {
                alert('Invalid file format');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetAllData() {
    if (confirm('⚠️ This will delete ALL your CVs and tracker data. Are you sure?')) {
        localStorage.removeItem('guyApplicator_cvs');
        localStorage.removeItem('guyApplicator_tracker');
        loadData(); // Reload defaults
        showMainMenu();
    }
}

// ==================== UTILITIES ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}
