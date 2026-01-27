// <This code written by Md Morshed Ali>

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('nid');
    const searchType = document.getElementById('searchType');
    const searchExample = document.getElementById('searchExample');
    const errorMsg = document.getElementById('errorMsg');
    const inputWrapper = document.getElementById('inputWrapper');
    const resultList = document.getElementById('resultList');
    const resultSection = document.getElementById('resultSection');
    const notFoundSection = document.getElementById('notFoundSection');
    const backBtn = document.getElementById('backToList');
    const mainResetBtn = document.getElementById('mainResetBtn');
    const profileImgIcon = document.getElementById('profileImg');

    searchType.addEventListener('change', function() {
        clearError();
        if (this.value === 'name') {
            searchInput.placeholder = 'জাতীয় পরিচয়পত্রর (NID) নাম দিন';
            searchExample.innerHTML = 'উদাহরণ: মোঃ মোর্শেদ আলী';
        } else {
            searchInput.placeholder = 'জাতীয় পরিচয়পত্র (NID) নম্বর দিন';
            searchExample.innerHTML = 'উদাহরণ: ৮১০৩৯৯৭৫২৯১০ অথবা 810399752910';
        }
        searchInput.value = '';
    });

    // <This code written by Md Morshed Ali>
    searchInput.addEventListener('input', function() {
        clearError();
        const type = searchType.value;
        const rawQuery = this.value.trim();
        const queryInEnglish = toEnglishNumber(rawQuery);

        if (rawQuery === '') return; 

        if (type === 'name' && !isNaN(queryInEnglish)) {
            showError('দয়া করে নাম লিখুন!');
        } else if (type === 'nid' && isNaN(queryInEnglish)) {
            showError('দয়া করে নাম্বার দিন!');
        }
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        inputWrapper.classList.add('input-error');
    }

    // <This code written by Md Morshed Ali>


    function clearError() {
        errorMsg.style.display = 'none';
        inputWrapper.classList.remove('input-error');
    }

    function replaceNumbers(input) {
        const numbers = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
        return String(input).replace(/[0123456789]/g, (s) => numbers[s]);
    }

    function toEnglishNumber(str) {
        const banglaNums = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
        return String(str).replace(/[০-৯]/g, s => banglaNums[s]);
    }


    // <This code written by Md Morshed Ali>



    function performSearch() {
        clearError();
        let rawQuery = searchInput.value.trim();
        let queryInEnglish = toEnglishNumber(rawQuery);
        const type = searchType.value;

        if (!rawQuery) {
            showError('দয়া করে কিছু লিখুন!');
            return;
        }

        if (type === 'name' && !isNaN(queryInEnglish)) {
            showError('জাতীয় পরিচয়পত্রর (NID) নাম দিন');
            return;
        }
        
        if (type === 'nid' && isNaN(queryInEnglish)) {


// <This code written by Md Morshed Ali>

            showError('জাতীয় পরিচয়পত্র (NID) নম্বর দিন');
            return;
        }

        resultList.innerHTML = '';
        resultSection.style.display = 'none';
        notFoundSection.style.display = 'none';
        backBtn.style.display = 'none';
        mainResetBtn.style.display = 'none';

        const searchTermEng = queryInEnglish.toLowerCase();

        const results = voterDatabase.voters.filter(v => {
            const voterNoEng = toEnglishNumber(v.voter_no);
            const voterName = v.name.toLowerCase();
            
            if (type === 'nid') {
                return voterNoEng === searchTermEng;
            } else {
                return voterName.includes(rawQuery.toLowerCase()) || voterName.includes(searchTermEng);
            }
        });

        if (results.length === 1) {
            showVoter(results[0]);
            mainResetBtn.style.display = 'flex';
        } else if (results.length > 1) {
            showList(results);
            mainResetBtn.style.display = 'flex';
        } else {
            notFoundSection.style.display = 'block';
            mainResetBtn.style.display = 'flex';
        }
    }

    // <This code written by Md Morshed Ali>



    function showList(list) {
        resultList.innerHTML = `<h3 style="margin-bottom:15px; color:var(--primary)">${replaceNumbers(list.length)} জন ভোটার পাওয়া গেছে:</h3>`;
        list.forEach(voter => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `<div><strong>${voter.name}</strong><br><small>পিতা: ${voter.father}</small></div><i class="fas fa-chevron-right" style="color:#ccc"></i>`;
            item.onclick = () => { showVoter(voter); backBtn.style.display = 'flex'; };
            resultList.appendChild(item);
        });
        resultList.style.display = 'block';
        window.scrollTo({ top: resultList.offsetTop - 20, behavior: 'smooth' });
    }

    function showVoter(voter) {
        resultList.style.display = 'none';
        resultSection.style.display = 'block';

        if (voter.gender === 'পুরুষ') {
            profileImgIcon.style.backgroundColor = '#1E88E5';
        } else if (voter.gender === 'মহিলা') {
            profileImgIcon.style.backgroundColor = '#E91E63';
        }

        // <This code written by Md Morshed Ali>



        document.getElementById('resSerial').textContent = `ক্রমিক নং: ${replaceNumbers(voter.serial)}`;
        document.getElementById('resName').textContent = voter.name;
        document.getElementById('resFather').textContent = voter.father;
        document.getElementById('resMother').textContent = voter.mother;
        document.getElementById('resDob').textContent = replaceNumbers(voter.dob);
        document.getElementById('resNid').textContent = replaceNumbers(voter.voter_no);
        document.getElementById('resGender').textContent = voter.gender;
        document.getElementById('resProfession').textContent = voter.profession;
        document.getElementById('resProfessionTop').textContent = voter.profession;
        document.getElementById('resAddress').textContent = voter.address;
        
        window.scrollTo({ top: resultSection.offsetTop - 20, behavior: 'smooth' });
    }

    window.resetSearch = function() {
        resultSection.style.display = 'none';
        resultList.style.display = 'none';
        notFoundSection.style.display = 'none';
        backBtn.style.display = 'none';
        mainResetBtn.style.display = 'none';
        searchInput.value = '';
        clearError();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
// <This code written by Md Morshed Ali>
    backBtn.onclick = () => {
        resultSection.style.display = 'none';
        resultList.style.display = 'block';
        backBtn.style.display = 'none';
        window.scrollTo({ top: resultList.offsetTop - 20, behavior: 'smooth' });
    };

    const updateStats = () => {
        const total = replaceNumbers(voterDatabase.totalVoters);
        const male = replaceNumbers(voterDatabase.maleVoters);
        const female = replaceNumbers(voterDatabase.femaleVoters);
        document.getElementById('totalVoters').textContent = total;
        document.getElementById('maleVoters').textContent = male;
        document.getElementById('femaleVoters').textContent = female;
        document.getElementById('statsTotal').textContent = total;
        document.getElementById('statsMale').textContent = male;
        document.getElementById('statsFemale').textContent = female;
    };

    updateStats();
    searchBtn.onclick = performSearch;
    searchInput.addEventListener('input', clearError);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
});
// <This code written by Md Morshed Ali>