document.addEventListener('DOMContentLoaded', function () {
    // ====================================================================
    // --- SHARED STATE & DOM (COPIATO DA script.js)
    // ====================================================================
    let systemDate = new Date();
    let capsLock = false;
    let activeInput = null;

    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');

    // Initialize with the date from the image
    const initialDateParts = "20/06/2025".split('/');
    systemDate.setFullYear(parseInt(initialDateParts[2], 10));
    systemDate.setMonth(parseInt(initialDateParts[1], 10) - 1); // Month is 0-indexed
    systemDate.setDate(parseInt(initialDateParts[0], 10));

    // ====================================================================
    // --- DATETIME MODAL LOGIC
    // ====================================================================
    const datetimeTrigger = document.getElementById('datetime-trigger');
    const datetimeModalEl = document.getElementById('datetimeModal');
    const datetimeModal = new bootstrap.Modal(datetimeModalEl);
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const saveDatetimeBtn = document.getElementById('save-datetime');

    function updateClock() {
        systemDate.setSeconds(systemDate.getSeconds() + 1);
        const time = systemDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const date = systemDate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        if (timeEl) timeEl.textContent = time;
        if (dateEl) dateEl.textContent = date;
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTimeForInput(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    if (datetimeTrigger) {
        datetimeTrigger.addEventListener('click', () => {
            dateInput.value = formatDateForInput(systemDate);
            timeInput.value = formatTimeForInput(systemDate);
            datetimeModal.show();
        });
    }

    if (saveDatetimeBtn) {
        saveDatetimeBtn.addEventListener('click', () => {
            if (dateInput.value && timeInput.value) {
                const [year, month, day] = dateInput.value.split('-');
                const [hours, minutes, seconds] = timeInput.value.split(':');
                systemDate = new Date(year, month - 1, day, hours, minutes, seconds);
                updateClock();
            }
            datetimeModal.hide();
        });
    }

    // ====================================================================
    // --- LOGIN MODAL & VIRTUAL KEYBOARD LOGIC
    // ====================================================================
    const loginLockIcon = document.getElementById('login-lock-icon');
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl);
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');
    const keyboardContainer = document.getElementById('virtual-keyboard');

    const keyLayout = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
        ['space']
    ];

    function createKeyboard() {
        keyboardContainer.innerHTML = '';

        keyLayout.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('keyboard-row');

            row.forEach(key => {
                const keyElement = document.createElement('button');
                keyElement.classList.add('keyboard-key');
                keyElement.setAttribute('data-key', key);

                switch (key) {
                    case 'backspace':
                        keyElement.innerHTML = '<i class="fas fa-backspace"></i>';
                        keyElement.classList.add('key-backspace');
                        break;
                    case 'caps':
                        keyElement.textContent = 'Caps';
                        keyElement.classList.add('key-caps');
                        if (capsLock) keyElement.classList.add('active');
                        break;
                    case 'enter':
                        keyElement.textContent = 'Enter';
                        keyElement.classList.add('key-enter');
                        break;
                    case 'shift':
                        keyElement.textContent = 'Shift';
                        keyElement.classList.add('key-shift');
                        break;
                    case 'space':
                        keyElement.classList.add('key-space');
                        break;
                    default:
                        keyElement.textContent = capsLock ? key.toUpperCase() : key.toLowerCase();
                        break;
                }
                rowElement.appendChild(keyElement);
            });
            keyboardContainer.appendChild(rowElement);
        });
    }

    if (loginLockIcon) {
        loginLockIcon.addEventListener('click', () => {
            loginModal.show();
        });
    }

    loginModalEl.addEventListener('shown.bs.modal', () => {
        createKeyboard();
        activeInput = usernameInput;
        usernameInput.focus();
    });

    usernameInput.addEventListener('focus', () => activeInput = usernameInput);
    passwordInput.addEventListener('focus', () => activeInput = passwordInput);

    keyboardContainer.addEventListener('click', (e) => {
        const keyBtn = e.target.closest('.keyboard-key');
        if (!keyBtn || !activeInput) return;
        
        const key = keyBtn.dataset.key;

        if (key.length === 1) {
            let char = key;
            if (capsLock) {
                char = char.toUpperCase();
            }
            activeInput.value += char;
        } else {
            switch (key) {
                case 'backspace':
                    activeInput.value = activeInput.value.slice(0, -1);
                    break;
                case 'caps':
                    capsLock = !capsLock;
                    document.querySelector('.key-caps').classList.toggle('active', capsLock);
                    document.querySelectorAll('.keyboard-key').forEach(k => {
                        const keyData = k.dataset.key;
                        if (keyData.length === 1) {
                            k.textContent = capsLock ? keyData.toUpperCase() : keyData.toLowerCase();
                        }
                    });
                    break;
                case 'enter':
                    loginButton.click();
                    break;
                case 'space':
                    activeInput.value += ' ';
                    break;
            }
        }
    });

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            alert(`Username: ${usernameInput.value}\nPassword: ${passwordInput.value}`);
            usernameInput.value = '';
            passwordInput.value = '';
            loginModal.hide();
        });
    }

    // ====================================================================
    // --- ERROR MODAL LOGIC
    // ====================================================================
    const errorList = [
        "Errore 101: Sensore non rilevato.",
        "Errore 202: Pressione bassa sull'attuatore.",
        "Errore 303: Porta di sicurezza aperta.",
        "Errore 404: Comunicazione PLC assente.",
        "Errore 505: Temperatura fuori range."
    ];
    let currentError = 0;

    function updateErrorModal() {
        document.getElementById('error-message').textContent = errorList[currentError];
        document.getElementById('error-index').textContent = (currentError+1) + ' / ' + errorList.length;
    }

    const showErrorsBtn = document.getElementById('show-errors-btn');
    if(showErrorsBtn) {
        showErrorsBtn.addEventListener('click', function() {
            currentError = 0;
            updateErrorModal();
            const modal = new bootstrap.Modal(document.getElementById('errorsModal'));
            modal.show();
        });
    }

    const prevErrorBtn = document.getElementById('prev-error');
    const nextErrorBtn = document.getElementById('next-error');
    if(prevErrorBtn) {
        prevErrorBtn.addEventListener('click', function() {
            if(currentError > 0) {
                currentError--;
                updateErrorModal();
            }
        });
    }
    if(nextErrorBtn) {
        nextErrorBtn.addEventListener('click', function() {
            if(currentError < errorList.length-1) {
                currentError++;
                updateErrorModal();
            }
        });
    }

    // Swipe touch per mobile
    let startX = null;
    const errorMessageEl = document.getElementById('error-message');
    if(errorMessageEl) {
        errorMessageEl.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        errorMessageEl.addEventListener('touchend', function(e) {
            if(startX === null) return;
            let endX = e.changedTouches[0].clientX;
            if(endX - startX > 50) {
                if(currentError > 0) {
                    currentError--;
                    updateErrorModal();
                }
            } else if(startX - endX > 50) {
                if(currentError < errorList.length-1) {
                    currentError++;
                    updateErrorModal();
                }
            }
            startX = null;
        });
    }

    // ====================================================================
    // --- OPERATORE PAGE LOGIC
    // ====================================================================
    
    // Operatore navigation
    let currentOperator = 1;
    const operatorTitle = document.getElementById('operator-title');
    const prevOperatorBtn = document.getElementById('prev-operator');
    const nextOperatorBtn = document.getElementById('next-operator');

    function updateOperatorDisplay() {
        if (operatorTitle) {
            operatorTitle.textContent = `OPERATORE ${currentOperator}`;
        }
        // Qui puoi aggiungere logica per cambiare le opzioni in base all'operatore
        console.log(`Switched to Operatore ${currentOperator}`);
    }

    if (prevOperatorBtn) {
        prevOperatorBtn.addEventListener('click', function() {
            if (currentOperator > 1) {
                currentOperator--;
                updateOperatorDisplay();
            }
        });
    }

    if (nextOperatorBtn) {
        nextOperatorBtn.addEventListener('click', function() {
            if (currentOperator < 2) {
                currentOperator++;
                updateOperatorDisplay();
            }
        });
    }
    
    // Home button navigation
    const homeBtn = document.getElementById('home-btn');
    if(homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Toggle buttons logic
    const toggleButtons = document.querySelectorAll('.btn-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const optionName = this.dataset.option;
            const optionButtons = document.querySelectorAll(`[data-option="${optionName}"]`);
            
            // Remove active class from all buttons of this option
            optionButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Log the change (you can replace with actual PLC communication)
            console.log(`${optionName} set to: ${this.textContent}`);
        });
    });

    // Reset button logic
    const resetButtons = document.querySelectorAll('.btn-reset');
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const optionName = this.dataset.option;
            
            if(confirm('Sei sicuro di voler resettare i contatori?')) {
                console.log(`${optionName} executed`);
                alert('Contatori resettati con successo!');
            }
        });
    });

    // LOGICA MANO/AUTO
    const btnMano = document.getElementById('btn-mano');
    const btnAuto = document.getElementById('btn-auto');
    const imgMano = document.getElementById('img-mano');
    const imgAuto = document.getElementById('img-auto');

    if (imgMano) imgMano.style.transition = 'filter 0.3s, transform 0.3s, opacity 0.3s';
    if (imgAuto) imgAuto.style.transition = 'filter 0.3s, transform 0.3s, opacity 0.3s';

    let stato = 'auto';
    function animateImageChange(img, newSrc) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8) rotate(-10deg)';
        setTimeout(() => {
            img.src = newSrc;
            img.style.filter = 'blur(2px)';
            img.style.transform = 'scale(1.1) rotate(8deg)';
            setTimeout(() => {
                img.style.opacity = '1';
                img.style.filter = 'blur(0)';
                img.style.transform = 'scale(1) rotate(0deg)';
            }, 120);
        }, 180);
    }
    function aggiornaColori() {
        if (stato === 'mano') {
            animateImageChange(imgMano, 'Immagini PLC/MAN_ROSSA.PNG');
            animateImageChange(imgAuto, 'Immagini PLC/auto_blu.PNG');
        } else {
            animateImageChange(imgMano, 'Immagini PLC/MAN_BLU.PNG');
            animateImageChange(imgAuto, 'Immagini PLC/auto_rossa.PNG');
        }
    }
    if (btnMano && btnAuto && imgMano && imgAuto) {
        btnMano.addEventListener('click', function() {
            if (stato !== 'mano') {
                stato = 'mano';
                aggiornaColori();
            }
        });
        btnAuto.addEventListener('click', function() {
            if (stato !== 'auto') {
                stato = 'auto';
                aggiornaColori();
            }
        });
        aggiornaColori();
    }

    // Start clock
    setInterval(updateClock, 1000);
    updateClock();
});
