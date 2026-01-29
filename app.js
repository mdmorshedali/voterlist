// md morshed ali
const toBengaliNumbers = (input) => {
    const numbers = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    return String(input).replace(/[0123456789]/g, (s) => numbers[s]);
};

const toEnglishNumbers = (str) => {
    const banglaNums = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    return String(str).replace(/[০-৯]/g, s => banglaNums[s]);
};

const formatNumber = (num) => {
    return toBengaliNumbers(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
};

// md morshed ali
const convertToBengaliNumbers = (str) => {
    if (!str) return str;
    return str.toString().replace(/[0-9]/g, (digit) => {
        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliDigits[parseInt(digit)];
    });
};

// md morshed ali
const containsOnlyNumbers = (str) => {
    const cleaned = str.replace(/\s/g, '');
    return /^[0-9০-৯]+$/.test(cleaned);
};

// md morshed ali
const containsNumbers = (str) => {
    const numberRegex = /[0-9০-৯]/;
    return numberRegex.test(str);
};

// md morshed ali
let state = {
    searchType: 'name',
    searchQuery: '',
    searchResults: [],
    selectedVoter: null,
    showResults: false,
    showNotFound: false,
    darkMode: false,
    loading: false,
    error: '',
    inputValid: true,
    hintMessage: 'আপনার নামের যে কোন অংশ বাংলায় লিখুন'',
    totalVoters: voterDatabase.totalVoters,
    maleVoters: voterDatabase.maleVoters,
    femaleVoters: voterDatabase.femaleVoters,
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: 1,
    allSearchResults: []
};

// md morshed ali
const headerContainer = document.getElementById('header-container');
const statsContainer = document.getElementById('stats-container');
const searchContainer = document.getElementById('search-container');
const actionButtonsContainer = document.getElementById('action-buttons-container');
const voterListContainer = document.getElementById('voter-list-container');
const voterProfileContainer = document.getElementById('voter-profile-container');
const notFoundContainer = document.getElementById('not-found-container');
const footerContainer = document.getElementById('footer-container');

// md morshed ali
function updateHintMessage() {
    if (state.searchType === 'voter_id') {
        if (state.searchQuery.trim() === '') {
            state.hintMessage = '💡 আপনার ভোটার  নাম্বার দিন';
            state.inputValid = true;
        } else if (!containsOnlyNumbers(state.searchQuery)) {
            state.hintMessage = '❌ শুধুমাত্র ভোটার নাম্বার দিন';
            state.inputValid = false;
        } else {
            state.hintMessage = '✅ সঠিক ভোটার নাম্বার দিন';
            state.inputValid = true;
        }
    } else if (state.searchType === 'name') {
        if (state.searchQuery.trim() === '') {
            state.hintMessage = '💡 আপনার নাম লিখুন (পুরো নাম বা অংশ)';
            state.inputValid = true;
        } else if (state.searchQuery.trim().length < 2) {
            state.hintMessage = '⚠️ অন্তত ২টি অক্ষর লিখুন';
            state.inputValid = true;
        } else if (containsNumbers(state.searchQuery)) {
            state.hintMessage = '❌ নামে সংখ্যা ব্যবহার করবেন না';
            state.inputValid = false;
        } else {
            state.hintMessage = '✅ সঠিক নাম দিন';
            state.inputValid = true;
        }
    }
}

// md morshed ali
function updateInputField() {
    const inputField = document.getElementById('search-input-field');
    const hintElement = document.getElementById('search-hint');
    const searchButton = document.getElementById('search-button');
    
    if (!inputField) return;
    
    let inputClass = '';
    if (state.searchQuery.trim() !== '') {
        inputClass = state.inputValid ? 'success' : 'error';
    }
    inputField.className = `search-input ${inputClass}`;
    
    if (hintElement) {
        hintElement.innerHTML = state.hintMessage;
        const hintClass = state.hintMessage.includes('❌') ? 'error' : 
                         state.hintMessage.includes('✅') ? 'success' : 
                         state.hintMessage.includes('⚠️') ? 'warning' : '';
        hintElement.className = `search-hint ${hintClass}`;
    }
    
    if (searchButton) {
        searchButton.disabled = state.loading || !state.inputValid || state.searchQuery.trim() === '';
    }
}

// md morshed ali
function getPaginatedResults(results, page, perPage) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return results.slice(startIndex, endIndex);
}

function updatePagination() {
    state.totalPages = Math.ceil(state.allSearchResults.length / state.itemsPerPage);
    if (state.totalPages === 0) state.totalPages = 1;
    if (state.currentPage > state.totalPages) {
        state.currentPage = 1;
    }
    state.searchResults = getPaginatedResults(state.allSearchResults, state.currentPage, state.itemsPerPage);
}

//md morshed ali
function performInstantSearch(query, searchType) {
    if (searchType === 'voter_id') {
        const searchId = toEnglishNumbers(query);
        return voterDatabase.searchByVoterId(searchId);
    } else {
        // md morshed ali
        return voterDatabase.searchByName(query);
    }
}


function renderHeader() {
    headerContainer.innerHTML = `
        <header class="header">
            <div class="header-overlay"></div>
            <div class="logo-container animate-bounce-slow">
                <img 
                    src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ5QybHVZ1JLEBlRi7SEOHJfZSOu-ZtSIB_CRS91uo6QkVHYXjy" 
                    alt="হাতনাবাদ ভোটার সার্চিং সিস্টেম লোগো" 
                    class="logo"
                />
            </div>
            
            <div class="header-content">
                <p class="subtitle">চলো একসাথে গড়ি বাংলাদেশ</p>
                <h1 class="title">হাতনাবাদ ভোটার তথ্য</h1>
                <div class="tagline-badge">
                    ন্যায্যতা ও ইনসাফের বাংলাদেশ গড়তে <b class="text-yellow-400">দাঁড়িপাল্লায়</b> ভোট দিন
                </div>
            </div>
            
            <button 
                class="dark-mode-toggle"
                onclick="toggleDarkMode()"
                aria-label="${state.darkMode ? "লাইট মোডে পরিবর্তন করুন" : "ডার্ক মোডে পরিবর্তন করুন"}"
            >
                <i class="fas ${state.darkMode ? 'fa-sun' : 'fa-moon'}"></i>
            </button>
        </header>
    `;
}

function renderStats() {
    statsContainer.innerHTML = `
        <div class="stats-container animate-fade-in">
            <div class="stat-card">
                <div class="stat-icon" style="background: #ecfdf5; color: #10b981;">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3 class="stat-label">মোট ভোটার</h3>
                    <p class="stat-number">${toBengaliNumbers(state.totalVoters)}</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-info">
                    <h3 class="stat-label">পুরুষ ভোটার</h3>
                    <p class="stat-number">${toBengaliNumbers(state.maleVoters)}</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #fdf2f8; color: #ec4899;">
                    <i class="fas fa-user-times"></i>
                </div>
                <div class="stat-info">
                    <h3 class="stat-label">মহিলা ভোটার</h3>
                    <p class="stat-number">${toBengaliNumbers(state.femaleVoters)}</p>
                </div>
            </div>
        </div>
    `;
}

function renderSearchBox() {
    updateHintMessage();
    
    const placeholder = state.searchType === 'voter_id' 
        ? 'আপনার ভোটার নম্বর লিখুন'
        : 'আপনার নাম লিখুন (পুরো নাম বা অংশ)';
        
    const inputClass = state.inputValid && state.searchQuery.trim() !== '' ? 'success' : 
                      !state.inputValid && state.searchQuery.trim() !== '' ? 'error' : '';
    
    const hintClass = state.hintMessage.includes('❌') ? 'error' : 
                     state.hintMessage.includes('✅') ? 'success' : 
                     state.hintMessage.includes('⚠️') ? 'warning' : '';
        
    searchContainer.innerHTML = `
        <section class="search-box animate-fade-in">
            <div class="search-input-group">
                <div class="search-type-wrapper">
                    <select 
                        value="${state.searchType}"
                        onchange="handleSearchTypeChange(this.value)"
                        class="search-type"
                        id="search-type-select"
                    >
                        <option value="voter_id">#️⃣ ভোটার নম্বর</option>
                        <option value="name">👤 ভোটার নাম</option>
                    </select>
                </div>
                
                <div class="search-field-wrapper">
                    <i class="fas fa-search"></i>
                    <input 
                        type="text"
                        value="${state.searchQuery}"
                        oninput="handleSearchQueryChange(this.value)"
                        onkeypress="handleKeyPress(event)"
                        placeholder="${placeholder}"
                        class="search-input ${inputClass}"
                        id="search-input-field"
                        autocomplete="off"
                    />
                </div>
                
                <button 
                    onclick="handleSearch()"
                    ${state.loading || !state.inputValid || state.searchQuery.trim() === '' ? 'disabled' : ''}
                    class="search-button"
                    id="search-button"
                >
                    ${state.loading ? `
                        <i class="fas fa-spinner fa-spin"></i> অনুসন্ধান চলছে...
                    ` : `
                        <i class="fas fa-search"></i> অনুসন্ধান করুন
                    `}
                </button>
            </div>
            
            ${state.error ? `
                <div class="error-message animate-shake">
                    <i class="fas fa-exclamation-circle"></i> ${state.error}
                </div>
            ` : ''}
            
            <p class="search-hint ${hintClass}" id="search-hint">
                ${state.hintMessage}
            </p>
        </section>
    `;
    
    const selectElement = document.getElementById('search-type-select');
    if (selectElement) {
        selectElement.value = state.searchType;
    }
}

function renderActionButtons() {
    if (!state.showResults && !state.selectedVoter) {
        actionButtonsContainer.innerHTML = '';
        return;
    }

    actionButtonsContainer.innerHTML = `
        <div class="action-buttons">
            ${state.selectedVoter ? `
                <button 
                    onclick="handleBackToList()"
                    class="action-button back-button"
                >
                    <i class="fas fa-arrow-left"></i> তালিকায় ফিরে যান
                </button>
            ` : ''}
            
            <button 
                onclick="resetSearch()"
                class="action-button reset-button"
            >
                <i class="fas fa-sync-alt"></i> নতুন করে খুঁজুন
            </button>
        </div>
    `;
}

function renderVoterList() {
    if (!state.showResults || state.searchResults.length === 0 || state.selectedVoter) {
        voterListContainer.innerHTML = '';
        return;
    }

    const startIndex = (state.currentPage - 1) * state.itemsPerPage + 1;
    const endIndex = Math.min(startIndex + state.itemsPerPage - 1, state.allSearchResults.length);
    
    voterListContainer.innerHTML = `
        <div class="results-list">
            <h3 class="results-title">
                <i class="fas fa-list-ol"></i> 
                ${toBengaliNumbers(state.allSearchResults.length)} জন ভোটার পাওয়া গেছে
                ${state.allSearchResults.length > state.itemsPerPage ? 
                    `(দেখানো হচ্ছে: ${toBengaliNumbers(startIndex)} - ${toBengaliNumbers(endIndex)})` : 
                    ''}
            </h3>
            
            <div class="voter-list">
                ${state.searchResults.map((voter, index) => `
                    <div 
                        class="voter-card animate-fade-in"
                        style="animation-delay: ${index * 0.05}s"
                        onclick="handleSelectVoter('${voter.serial}')"
                        role="button"
                        tabindex="0"
                        onkeypress="if(event.key === 'Enter') handleSelectVoter('${voter.serial}')"
                    >
                        <div class="voter-info">
                            <div class="voter-header">
                                <strong class="voter-name">${voter.name}</strong>
                                <span class="voter-serial">#${toBengaliNumbers(voter.serial)}</span>
                            </div>
                            <div class="voter-father">পিতা: ${voter.father}</div>
                            <div class="voter-details">
                                <span class="voter-nid">ভোটার: ${convertToBengaliNumbers(voter.voter_no)}</span>
                                <span class="voter-gender ${voter.gender === 'পুরুষ' ? 'male' : 'female'}">
                                    <i class="fas ${voter.gender === 'পুরুষ' ? 'fa-mars' : 'fa-venus'}"></i>
                                    ${voter.gender}
                                </span>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right text-gray-300"></i>
                    </div>
                `).join('')}
            </div>
            
            ${state.totalPages > 1 ? renderPaginationControls() : ''}
        </div>
    `;
}

function renderPaginationControls() {
    return `
        <div class="pagination-controls">
            <button 
                onclick="goToPage(${state.currentPage - 1})"
                ${state.currentPage === 1 ? 'disabled' : ''}
                class="pagination-button prev-button"
            >
                <i class="fas fa-chevron-left"></i> পূর্বের পৃষ্ঠা
            </button>
            
            <span class="page-info">
                পৃষ্ঠা ${toBengaliNumbers(state.currentPage)} / ${toBengaliNumbers(state.totalPages)}
            </span>
            
            <button 
                onclick="goToPage(${state.currentPage + 1})"
                ${state.currentPage === state.totalPages ? 'disabled' : ''}
                class="pagination-button next-button"
            >
                পরবর্তী পৃষ্ঠা <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
}

function renderVoterProfile() {
    if (!state.selectedVoter) {
        voterProfileContainer.innerHTML = '';
        return;
    }

    const voter = state.selectedVoter;
    const bengaliVoterID = convertToBengaliNumbers(voter.voter_no);
    
    voterProfileContainer.innerHTML = `
        <div class="voter-profile animate-fade-up">
            <div class="profile-header">
                <div 
                    class="profile-avatar ${voter.gender === 'পুরুষ' ? 'male' : 'female'}"
                >
                    <i class="fas fa-user-tie"></i>
                </div>
                
                <h2 class="profile-name">${voter.name}</h2>
                <p class="profile-serial">ক্রমিক নং: ${toBengaliNumbers(voter.serial)}</p>
            </div>
            
            <div class="profile-details">
                <div class="detail-card">
                    <div class="detail-label">
                        <i class="fas fa-user"></i> পিতার নাম
                    </div>
                    <div class="detail-value">${voter.father}</div>
                </div>
                
                <div class="detail-card">
                    <div class="detail-label">
                        <i class="fas fa-user"></i> মাতার নাম
                    </div>
                    <div class="detail-value">${voter.mother}</div>
                </div>
                
                <div class="detail-card">
                    <div class="detail-label">
                        <i class="fas fa-birthday-cake"></i> জন্ম তারিখ
                    </div>
                    <div class="detail-value">${voter.dob}</div>
                </div>
                
                <div class="detail-card">
                    <div class="detail-label">
                        <i class="fas fa-id-card"></i> ভোটার নম্বর
                    </div>
                    <div class="detail-value">${bengaliVoterID}</div>
                </div>
                
                <div class="detail-card">
                    <div class="detail-label">
                        <i class="fas ${voter.gender === 'পুরুষ' ? 'fa-mars' : 'fa-venus'}"></i> লিঙ্গ
                    </div>
                    <div class="detail-value">${voter.gender}</div>
                </div>
                
                <div class="detail-card">
                    <div class="detail-label">
                        <i class="fas fa-briefcase"></i> পেশা
                    </div>
                    <div class="detail-value">${voter.profession}</div>
                </div>
                
                <div class="detail-card full-width">
                    <div class="detail-label">
                        <i class="fas fa-home"></i> ঠিকানা
                    </div>
                    <div class="detail-value">${voter.address}</div>
                </div>
            </div>
            
            <div class="profile-actions">
                <button 
                    onclick="printVoterCard()"
                    class="print-button"
                    aria-label="ভোটার তথ্য প্রিন্ট করুন"
                >
                    <i class="fas fa-print"></i> প্রিন্ট করুন
                </button>
                
                <button 
                    onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
                    class="scroll-top-button"
                    aria-label="পৃষ্ঠার শীর্ষে যান"
                >
                    <i class="fas fa-arrow-up"></i> উপরে যান
                </button>
            </div>
        </div>
    `;
}

function renderNotFound() {
    if (!state.showNotFound) {
        notFoundContainer.innerHTML = '';
        return;
    }

    notFoundContainer.innerHTML = `
        <div class="not-found animate-head-shake">
            <div class="not-found-icon">
                <i class="fas fa-user-slash"></i>
            </div>
            <h2 class="not-found-title">ভোটার পাওয়া যায়নি!</h2>
            <p class="not-found-message">
                আপনার প্রদানকৃত তথ্যটি পুনরায় যাচাই করুন। সঠিক তথ্য পেতে ভোটার নম্বরটি ভালো করে যাচাই করে নিন।
            </p>
            <div class="not-found-tips">
                <div class="tip">
                    <i class="fas fa-lightbulb"></i>
                    <span>নাম সার্চের ক্ষেত্রে এনআইডি অনুযায়ী নাম লিখুন</span>
                </div>
                <div class="tip">
                    <i class="fas fa-lightbulb"></i>
                    <span>অথবা নামের আংশিক অংশ লিখুন</span>
                </div> 
                <div class="tip">
                    <i class="fas fa-lightbulb"></i>
                    <span>কোন সমস্যা, উপদেশ এর জন্য সরাসরি ০১৩০৬৯৬০১৬১ নম্বরে কল করুন</span>
                </div>
            </div>
        </div>
    `;
}

function renderFooter() {
    const currentYear = new Date().getFullYear();
    footerContainer.innerHTML = `
        <footer class="footer">
            <div class="footer-stats">
                <div class="stat">
                    <i class="fas fa-users"></i>
                    <span>মোট ভোটার: <b>${toBengaliNumbers(state.totalVoters)}</b></span>
                </div>
                <div class="stat">
                    <i class="fas fa-mars"></i>
                    <span>পুরুষ: <b>${toBengaliNumbers(state.maleVoters)}</b></span>
                </div>
                <div class="stat">
                    <i class="fas fa-venus"></i>
                    <span>মহিলা: <b>${toBengaliNumbers(state.femaleVoters)}</b></span>
                </div>
            </div>
            
            <div class="footer-message">
                <p class="main-message">
                    ত্রয়োদশ জাতীয় সংসদ নির্বাচন ${toBengaliNumbers(currentYear)} এ দাঁড়িপাল্লায় ভোট দিন, বাংলাদেশ বুঝে নিন।
                </p>
                <p class="sub-message">ভোটার সার্চিং সিস্টেম | হাতনাবাদ ৩ নং ওয়ার্ড</p>
            </div>
            
            <div class="footer-credits">
                <p class="credit">
                    &copy; সিস্টেম ডেভেলপ করেছেন |
                    <a 
                        href="https://gravatar.com/mdmorshedali" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="developer-link"
                    >
                        মোঃ মোর্শেদ আলী
                    </a>
                </p>
                <p class="contact">
                    <i class="fas fa-phone"></i> যোগাযোগ: ০১৩০৬৯৬০১৬১
                </p>
            </div>
            
            <div class="footer-note">
                <p>
                    <i class="fas fa-info-circle"></i> 
                    এই সিস্টেমটি শুধুমাত্র হাতনাবাদ এলাকার ভোটার তথ্য প্রদর্শন এর জন্য তৈরী করা হয়েছে।
                </p>
            </div>
        </footer>
    `;
}

function renderAll() {
    renderHeader();
    renderStats();
    renderSearchBox();
    renderActionButtons();
    renderVoterList();
    renderVoterProfile();
    renderNotFound();
    renderFooter();
}

// md morshed ali
window.toggleDarkMode = function() {
    state.darkMode = !state.darkMode;
    if (state.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    renderAll();
};

window.handleSearchTypeChange = function(value) {
    state.searchType = value;
    state.searchQuery = '';
    state.error = '';
    state.inputValid = true;
    state.currentPage = 1;
    updateHintMessage();
    renderSearchBox();
    setTimeout(() => {
        const inputField = document.getElementById('search-input-field');
        if (inputField) inputField.focus();
    }, 100);
};

window.handleSearchQueryChange = function(value) {
    state.searchQuery = value;
    state.error = '';
    state.currentPage = 1;
    updateHintMessage();
    updateInputField();
};

window.handleKeyPress = function(e) {
    const allowedKeys = /[a-zA-Z0-9০-৯ঀ-৿\s]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Tab|Enter|Escape/;
    if (!allowedKeys.test(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        return;
    }
    
    if (e.key === 'Enter' && state.inputValid && state.searchQuery.trim() !== '') {
        handleSearch();
    }
};


window.handleSearch = function() {
   
    if (state.searchType === 'voter_id' && !containsOnlyNumbers(state.searchQuery)) {
        state.error = 'শুধুমাত্র ভোটার সংখ্যা লিখুন!';
        updateInputField();
        return;
    }
    
    if (state.searchType === 'name' && containsNumbers(state.searchQuery)) {
        state.error = 'নামে শুধুমাত্র অক্ষর লিখুন!';
        updateInputField();
        return;
    }
    
    if (!state.searchQuery.trim()) {
        state.error = 'দয়া করে কিছু লিখুন!';
        updateInputField();
        return;
    }
    
    if (state.searchType === 'name' && state.searchQuery.trim().length < 2) {
        state.error = 'অন্তত ২টি অক্ষর লিখুন!';
        updateInputField();
        return;
    }
    
    state.error = '';
    state.loading = true;
    state.selectedVoter = null;
    state.showNotFound = false;
    state.currentPage = 1;
    updateInputField();
    
    
    const query = state.searchType === 'voter_id' 
        ? toEnglishNumbers(state.searchQuery.trim())
        : state.searchQuery.trim();
    
    
    const results = performInstantSearch(query, state.searchType);
    
    state.allSearchResults = results;
    updatePagination();
    state.loading = false;
    
    if (results.length === 0) {
        state.showNotFound = true;
        state.showResults = false;
    } else if (results.length === 1) {
        state.selectedVoter = results[0];
        state.showResults = true;
    } else {
        state.showResults = true;
    }
    
    renderAll();
    
    
    setTimeout(() => {
        const resultsSection = document.querySelector('.results-list');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 50);
};

window.goToPage = function(pageNumber) {
    if (pageNumber < 1 || pageNumber > state.totalPages) return;
    state.currentPage = pageNumber;
    updatePagination();
    renderAll();
    setTimeout(() => {
        const resultsSection = document.querySelector('.results-list');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 50);
};

window.resetSearch = function() {
    state.searchQuery = '';
    state.searchResults = [];
    state.allSearchResults = [];
    state.selectedVoter = null;
    state.showResults = false;
    state.showNotFound = false;
    state.error = '';
    state.inputValid = true;
    state.currentPage = 1;
    state.totalPages = 1;
    updateHintMessage();
    renderAll();
    setTimeout(() => {
        const inputField = document.getElementById('search-input-field');
        if (inputField) inputField.focus();
    }, 100);
};

window.handleSelectVoter = function(serial) {
    const voter = voterDatabase.voters.find(v => v.serial === serial.toString().padStart(3, '0'));
    if (voter) {
        state.selectedVoter = voter;
        renderAll();
    }
};

window.handleBackToList = function() {
    state.selectedVoter = null;
    renderAll();
};

window.printVoterCard = function() {
    if (!state.selectedVoter) return;
    
    const voter = state.selectedVoter;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="bn">
        <head>
            <meta charset="UTF-8">
            <title>ভোটার তথ্য - ${voter.name}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .print-header { text-align: center; margin-bottom: 30px; }
                .print-header h1 { color: #006A4E; }
                .voter-info { border: 2px solid #006A4E; padding: 20px; border-radius: 10px; }
                .info-row { display: flex; margin-bottom: 10px; }
                .info-label { width: 150px; font-weight: bold; }
                .info-value { flex: 1; }
                .print-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>হাতনাবাদ ভোটার তথ্য</h1>
                <p>হাতনাবাদ ৩ নং ওয়ার্ড</p>
            </div>
            
            <div class="voter-info">
                <div class="info-row">
                    <div class="info-label">নাম:</div>
                    <div class="info-value">${voter.name}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">পিতা:</div>
                    <div class="info-value">${voter.father}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">মাতা:</div>
                    <div class="info-value">${voter.mother}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">ভোটার নম্বর:</div>
                    <div class="info-value">${voter.voter_no}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">জন্ম তারিখ:</div>
                    <div class="info-value">${voter.dob}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">লিঙ্গ:</div>
                    <div class="info-value">${voter.gender}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">পেশা:</div>
                    <div class="info-value">${voter.profession}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">ঠিকানা:</div>
                    <div class="info-value">${voter.address}</div>
                </div>
            </div>
            
            <div class="print-footer">
                <p>প্রিন্টের তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
                <p>সিস্টেম ডেভেলপার: মোঃ মোর্শেদ আলী - ০১৩০৬৯৬০১৬১</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};


renderAll();

setTimeout(() => {
    const inputField = document.getElementById('search-input-field');
    if (inputField) inputField.focus();
}, 500);






