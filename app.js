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
        skills: ['Direct Sales', 'Client Relationships', 'Objection Handling', 'Territory Management', 'Negotiation', 'Fluent English & Swahili'],
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
    },
    realEstate: {
        name: 'Sales - Real Estate Focus',
        summary: 'Target-driven Sales Professional with experience in B2B and B2C sales. Skilled in consultative selling, lead conversion, and maintaining long-term client relationships.',
        experience: [
            'Sales Officer | Goodwill Ceramics (Sept 2025–Present)',
            'Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)',
            'Sales Representative | Milvik Insurance (Jan 2024–Dec 2024)',
            'Sales Assistant | DWL Organic TZ (Apr 2022–Oct 2023)'
        ],
        skills: ['Lead Conversion', 'Client Relationships', 'Negotiation', 'Property Showings', 'Market Knowledge'],
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
        <div class="menu-option" onclick="showApplicationHistory()">3. Application History</div>
        <div class="menu-option" onclick="showTracker()">4. View Stats</div>
        <div class="menu-option" onclick="showSettings()">5. Settings</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">Enter number (1-5):</div>
        <input type="text" class="user-input" id="menuInput" placeholder="Type number and press Enter" onkeypress="handleMainMenuKey(event)">
    `;
    renderScreen(menu);
}

function handleMainMenuKey(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('menuInput').value;
        if (input === '1') showNewApplication();
        else if (input === '2') showManageCVs();
        else if (input === '3') showApplicationHistory();
        else if (input === '4') showTracker();
        else if (input === '5') showSettings();
        else {
            alert('Invalid option. Please enter 1-5');
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
    
    // Filter CVs based on job type
    let filteredCVs = {};
    
    if (type === 'sales') {
        // Show all sales-related CVs
        for (let key in cvTemplates) {
            if (key.includes('sales') || key.includes('Sales') || key.includes('automotive') || key.includes('realEstate')) {
                filteredCVs[key] = cvTemplates[key];
            }
        }
    } else if (type === 'customer') {
        // Show customer service CVs
        for (let key in cvTemplates) {
            if (key.includes('customer') || key.includes('service') || key.includes('Customer')) {
                filteredCVs[key] = cvTemplates[key];
            }
        }
    } else if (type === 'management') {
        // Show management/leadership CVs
        for (let key in cvTemplates) {
            if (key.includes('leader') || key.includes('Leadership') || key.includes('manage')) {
                filteredCVs[key] = cvTemplates[key];
            }
        }
    } else if (type === 'creative') {
        // Show creative/media CVs (if any exist)
        for (let key in cvTemplates) {
            if (key.includes('creative') || key.includes('media')) {
                filteredCVs[key] = cvTemplates[key];
            }
        }
    } else if (type === 'admin') {
        // Show admin/operations CVs (if any exist)
        for (let key in cvTemplates) {
            if (key.includes('admin') || key.includes('operations')) {
                filteredCVs[key] = cvTemplates[key];
            }
        }
    } else {
        // Other/custom - show ALL CVs
        filteredCVs = cvTemplates;
    }
    
    // If no filtered CVs, show all
    if (Object.keys(filteredCVs).length === 0) {
        filteredCVs = cvTemplates;
    }
    
    showSelectCV(filteredCVs);
}

function showSelectCV(filteredCVs) {
    let options = '';
    let index = 1;
    for (let key in filteredCVs) {
        options += `<div class="menu-option" onclick="selectCV('${key}')">${index}. ${filteredCVs[key].name}</div>`;
        index++;
    }
    
    const screen = `
        <div class="prompt-line">🔥 SELECT CV VERSION</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Choose a CV template:</div>
        <div class="prompt-line"> </div>
        ${options}
        <div class="prompt-line"> </div>
        <div class="menu-option" onclick="showNewApplication()">← Back to Job Types</div>
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
        <input type="text" class="user-input" id="companyName" placeholder="e.g. Elite Future Properties" value="${appState.companyName || ''}">
        <div class="prompt-line">Contact email:</div>
        <input type="email" class="user-input" id="contactEmail" placeholder="hr@company.com" value="${appState.contactEmail || ''}">
        <div class="prompt-line">WhatsApp number (with country code):</div>
        <input type="text" class="user-input" id="contactWhatsApp" placeholder="e.g. 255712345678" value="${appState.contactWhatsApp || ''}">
        <div class="prompt-line">Job title:</div>
        <input type="text" class="user-input" id="jobTitle" placeholder="e.g. Sales Executive" value="${appState.jobTitle || ''}">
        <div class="prompt-line">Job description (paste or type key requirements):</div>
        <textarea class="user-input" id="jobDescription" rows="4" placeholder="Paste job ad here...">${appState.jobDescription || ''}</textarea>
        <div class="prompt-line"> </div>
        <button class="button" onclick="saveCompanyDetails()">Continue →</button>
        <button class="button" onclick="showSelectCV(cvTemplates)">← Back</button>
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
    let experienceText = '';
    if (appState.currentCV && appState.currentCV.experience) {
        experienceText = appState.currentCV.experience.map(exp => `• ${exp}`).join('\n');
    }
    
    let skillsText = '';
    if (appState.currentCV && appState.currentCV.skills) {
        skillsText = appState.currentCV.skills.join(', ');
    }
    
    const coverLetter = `Dear Hiring Team,

I am writing to apply for the ${appState.jobTitle || 'Sales'} position at ${appState.companyName || 'your company'}, as advertised.

${appState.currentCV ? appState.currentCV.summary : 'Results-driven Sales Professional with 3+ years of experience.'}

My experience includes:
${experienceText || '• Sales Officer | Goodwill Ceramics (Sept 2025–Present)\n• Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)'}

I possess strong skills in: ${skillsText || 'Direct Sales, Client Relationships, Negotiation'}.

I am confident in my ability to contribute to your team and would welcome the opportunity to discuss my application further.

Yours sincerely,
Feisal Sinani Kitimla
+255 759 968 552`;

    appState.generatedContent = { coverLetter };
    
    const screen = `
        <div class="prompt-line">✅ COVER LETTER GENERATED</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">${coverLetter.replace(/\n/g, '<br>')}</div>
        <button class="button" onclick="copyToClipboard(\`${coverLetter.replace(/`/g, '\\`')}\`)">📋 Copy</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateCVText() {
    let experienceText = '';
    if (appState.currentCV && appState.currentCV.experience) {
        experienceText = appState.currentCV.experience.map(exp => exp).join('\n');
    }
    
    let skillsText = '';
    if (appState.currentCV && appState.currentCV.skills) {
        skillsText = appState.currentCV.skills.map(skill => `• ${skill}`).join('\n');
    }
    
    const cv = `FEISAL SINANI KITIMLA
${appState.currentCV ? appState.currentCV.name : 'Sales Professional'}
+255 759 968 552 | feistyfella@gmail.com | Dar es Salaam

PROFESSIONAL SUMMARY
${appState.currentCV ? appState.currentCV.summary : 'Results-driven Sales Professional with 3+ years of experience.'}

WORK EXPERIENCE
${experienceText || 'Sales Officer | Goodwill Ceramics (Sept 2025–Present)\nSales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)'}

KEY SKILLS
${skillsText || '• Direct Sales\n• Client Relationships\n• Negotiation'}

EDUCATION
${appState.currentCV ? appState.currentCV.education : 'CSEE Division I (2018)'}`;

    appState.generatedContent = { cv };
    
    const screen = `
        <div class="prompt-line">✅ CV TEXT GENERATED</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">${cv.replace(/\n/g, '<br>')}</div>
        <button class="button" onclick="copyToClipboard(\`${cv.replace(/`/g, '\\`')}\`)">📋 Copy</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateCVPDF() {
    // Create CV content as HTML with proper styling
    let experienceList = '';
    if (appState.currentCV && appState.currentCV.experience) {
        experienceList = appState.currentCV.experience.map(exp => `<li><strong>${exp}</strong></li>`).join('');
    } else {
        experienceList = '<li><strong>Sales Officer | Goodwill Ceramics (Sept 2025–Present)</strong></li><li><strong>Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)</strong></li>';
    }
    
    let skillsText = '';
    if (appState.currentCV && appState.currentCV.skills) {
        skillsText = appState.currentCV.skills.join(' • ');
    } else {
        skillsText = 'Direct Sales • Client Relations • Negotiation';
    }
    
    let summaryText = appState.currentCV ? appState.currentCV.summary : 'Results-driven Sales Professional with 3+ years of experience.';
    let educationText = appState.currentCV ? appState.currentCV.education : 'CSEE Division I (2018)';
    
    const cvContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Feisal Sinani Kitimla - CV</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                }
                h1 { text-align: center; color: #000; margin-bottom: 5px; }
                .contact { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                h2 { color: #000; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                ul { margin-top: 5px; }
                li { margin-bottom: 5px; }
                .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <h1>FEISAL SINANI KITIMLA</h1>
            <div class="contact">
                +255 759 968 552 | feistyfella@gmail.com | Dar es Salaam
            </div>
            
            <h2>PROFESSIONAL SUMMARY</h2>
            <p>${summaryText}</p>
            
            <h2>WORK EXPERIENCE</h2>
            <ul>
            ${experienceList}
            </ul>
            
            <h2>KEY SKILLS</h2>
            <p>${skillsText}</p>
            
            <h2>EDUCATION</h2>
            <p>${educationText}</p>
            
            <div class="footer">
                References available upon request
            </div>
        </body>
        </html>
    `;

    // Create blob and download as .pdf file
    const blob = new Blob([cvContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Feisal_Sinani_CV.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    const screen = `
        <div class="prompt-line">✅ CV PDF GENERATED</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line success">CV saved as "Feisal_Sinani_CV.pdf"</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">📎 File is ready to attach to emails</div>
        <div class="prompt-line"> </div>
        <button class="button" onclick="generateEmailDraft()">📧 Continue to Email</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateEmailDraft() {
    const subject = `Application for ${appState.jobTitle || 'Position'} - Feisal Sinani Kitimla`;
    
    let experienceText = '';
    if (appState.currentCV && appState.currentCV.experience) {
        experienceText = appState.currentCV.experience.map(exp => `• ${exp}`).join('\n');
    } else {
        experienceText = '• Sales Officer | Goodwill Ceramics (Sept 2025–Present)\n• Sales Agent | Blue Carbon Technology (Nov 2023–Aug 2025)';
    }
    
    let skillsText = '';
    if (appState.currentCV && appState.currentCV.skills) {
        skillsText = appState.currentCV.skills.join(', ');
    } else {
        skillsText = 'Direct Sales, Client Relationships, Negotiation';
    }
    
    let summaryText = appState.currentCV ? appState.currentCV.summary : 'Results-driven Sales Professional with 3+ years of experience in direct sales, customer relationship management, and territory expansion.';
    
    const body = `Dear Hiring Team,

I am writing to apply for the ${appState.jobTitle || 'Sales'} position at ${appState.companyName || 'your company'}, as advertised.

${summaryText}

My experience includes:
${experienceText}

I possess strong skills in: ${skillsText}.

My CV is attached for your review. I look forward to hearing from you.

Yours sincerely,
Feisal Sinani Kitimla
+255 759 968 552
feistyfella@gmail.com`;

    // Create mailto link
    const mailtoLink = `mailto:${appState.contactEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    const screen = `
        <div class="prompt-line">✅ EMAIL DRAFT READY</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">To: ${appState.contactEmail || '[email address]'}\nSubject: ${subject}\n\n${body.substring(0, 200)}...</div>
        <div class="prompt-line"> </div>
        <button class="button" onclick="window.open('${mailtoLink}', '_blank')">📧 Open Email App</button>
        <button class="button" onclick="copyToClipboard(\`${body.replace(/`/g, '\\`')}\`)">📋 Copy Body</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateWhatsApp() {
    let skillsPreview = '';
    if (appState.currentCV && appState.currentCV.skills) {
        skillsPreview = appState.currentCV.skills.slice(0, 3).join(', ');
    } else {
        skillsPreview = 'Direct Sales, Client Relations, Negotiation';
    }
    
    const message = `Hello, I am applying for the ${appState.jobTitle || 'Sales'} position at ${appState.companyName || 'your company'}. I have 3+ years of experience in ${skillsPreview}. My CV is ready. Thank you.`;
    
    let waNumber = appState.contactWhatsApp || '255712345678';
    // Remove any + or spaces
    waNumber = waNumber.replace(/[+\s]/g, '');
    
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    const screen = `
        <div class="prompt-line">✅ WHATSAPP MESSAGE READY</div>
        <div class="prompt-line">================================</div>
        <div class="output-box">${message}</div>
        <div class="prompt-line"> </div>
        <button class="button" onclick="window.open('${waLink}', '_blank')">💬 Open WhatsApp</button>
        <button class="button" onclick="copyToClipboard(\`${message.replace(/`/g, '\\`')}\`)">📋 Copy Message</button>
        <button class="button" onclick="showGenerateOptions()">← Back</button>
        <button class="button" onclick="logApplication()">📊 Log Application</button>
    `;
    renderScreen(screen);
}

function generateAll() {
    // Generate all options in sequence
    generateEmailDraft();
    // Note: In a full version, this would show all options at once
    // For now, it just goes to email draft
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

// ==================== APPLICATION HISTORY ====================
function showApplicationHistory() {
    if (applicationTracker.length === 0) {
        const screen = `
            <div class="prompt-line">📋 APPLICATION HISTORY</div>
            <div class="prompt-line">================================</div>
            <div class="prompt-line">No applications logged yet.</div>
            <div class="prompt-line"> </div>
            <button class="button" onclick="showMainMenu()">← Back</button>
        `;
        renderScreen(screen);
        return;
    }

    let historyList = '';
    applicationTracker.slice().reverse().forEach((app, index) => {
        const originalIndex = applicationTracker.length - 1 - index;
        historyList += `
            <div class="menu-option" onclick="viewApplication(${originalIndex})">
                ${index+1}. ${app.company || 'Unknown'} | ${app.role || 'Unknown'} | ${app.date || 'No date'} | ${app.status || 'Applied'}
            </div>
        `;
    });

    const screen = `
        <div class="prompt-line">📋 APPLICATION HISTORY</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Click on any application to view details:</div>
        <div class="prompt-line"> </div>
        ${historyList}
        <div class="prompt-line"> </div>
        <button class="button" onclick="showTracker()">📊 View Stats</button>
        <button class="button" onclick="showMainMenu()">← Back</button>
    `;
    renderScreen(screen);
}

function viewApplication(index) {
    const app = applicationTracker[index];
    
    const screen = `
        <div class="prompt-line">📋 APPLICATION DETAILS</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line"><strong>Company:</strong> ${app.company || 'Unknown'}</div>
        <div class="prompt-line"><strong>Role:</strong> ${app.role || 'Unknown'}</div>
        <div class="prompt-line"><strong>Date:</strong> ${app.date || 'Unknown'}</div>
        <div class="prompt-line"><strong>Status:</strong> ${app.status || 'Applied'}</div>
        <div class="prompt-line"><strong>Notes:</strong> ${app.notes || 'None'}</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">Options:</div>
        <button class="button" onclick="prepareToResendApplication(${index})">📧 Resend Application</button>
        <button class="button" onclick="editApplicationNotes(${index})">✏️ Edit Notes</button>
        <button class="button" onclick="deleteApplication(${index})">🗑️ Delete</button>
        <div class="prompt-line"> </div>
        <button class="button" onclick="showApplicationHistory()">← Back to History</button>
    `;
    renderScreen(screen);
}

function prepareToResendApplication(index) {
    const app = applicationTracker[index];
    
    // Pre-fill appState with this application's data
    appState.companyName = app.company || '';
    appState.jobTitle = app.role || '';
    
    // Find matching CV (use first one as default)
    for (let key in cvTemplates) {
        appState.currentCV = cvTemplates[key];
        break;
    }
    
    showCompanyDetails();
}

function editApplicationNotes(index) {
    const screen = `
        <div class="prompt-line">✏️ EDIT NOTES</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Application: ${applicationTracker[index].company || 'Unknown'} - ${applicationTracker[index].role || 'Unknown'}</div>
        <div class="prompt-line"> </div>
        <div class="prompt-line">Current notes:</div>
        <div class="output-box">${applicationTracker[index].notes || 'None'}</div>
        <div class="prompt-line">New notes:</div>
        <textarea class="user-input" id="newNotes" rows="4">${applicationTracker[index].notes || ''}</textarea>
        <div class="prompt-line"> </div>
        <button class="button" onclick="saveApplicationNotes(${index})">💾 Save</button>
        <button class="button" onclick="viewApplication(${index})">← Cancel</button>
    `;
    renderScreen(screen);
}

function saveApplicationNotes(index) {
    const newNotes = document.getElementById('newNotes').value;
    applicationTracker[index].notes = newNotes;
    saveData();
    viewApplication(index);
}

function deleteApplication(index) {
    if (confirm(`Delete application for ${applicationTracker[index].company || 'this company'}?`)) {
        applicationTracker.splice(index, 1);
        saveData();
        showApplicationHistory();
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
                <div class="prompt-line">${index+1}. ${app.company || 'Unknown'} | ${app.role || 'Unknown'} | ${app.date || 'No date'} | ${app.status || 'Applied'}</div>
            `;
        });
    }
    
    // Calculate stats
    const total = applicationTracker.length;
    const applied = applicationTracker.filter(a => a.status === 'Applied' || !a.status).length;
    const interviewed = applicationTracker.filter(a => a.status === 'Interview').length;
    const offered = applicationTracker.filter(a => a.status === 'Offer').length;
    const rejected = applicationTracker.filter(a => a.status === 'Rejected').length;
    
    const screen = `
        <div class="prompt-line">📊 APPLICATION TRACKER</div>
        <div class="prompt-line">================================</div>
        <div class="prompt-line">Recent applications:</div>
        <div class="prompt-line"> </div>
        ${trackerHtml}
        <div class="prompt-line"> </div>
        <div class="prompt-line">Summary:</div>
        <div class="prompt-line">📤 Total: ${total}</div>
        <div class="prompt-line">✅ Applied: ${applied}</div>
        <div class="prompt-line">🎤 Interviews: ${interviewed}</div>
        <div class="prompt-line">💼 Offers: ${offered}</div>
        <div class="prompt-line">❌ Rejected: ${rejected}</div>
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
        csv += `"${app.company || ''}","${app.role || ''}","${app.date || ''}","${app.status || ''}","${app.notes || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guy_applicator_tracker.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
    window.URL.revokeObjectURL(url);
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
        // Reset to defaults by reloading the page
        window.location.reload();
    }
}

// ==================== UTILITIES ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied to clipboard!');
    });
}
