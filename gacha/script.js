// --- グローバル変数とDOM要素の定義 ---
let isPlaying = false;
let gachaSettings = {}; // ガチャの設定を保持するオブジェクト

// DOM要素
const gachaHandle = document.getElementById('gacha-handle');
const capsuleContainer = document.getElementById('capsule-container');
const resultOverlay = document.getElementById('result-overlay');
const superWinContent = document.getElementById('super-win-content');
const normalWinContent = document.getElementById('normal-win-content');
const loseContent = document.getElementById('lose-content');
const stockCountSpan = document.getElementById('stock-count');

// 設定パネル関連のDOM要素
const openAdminButton = document.getElementById('open-admin-button');
const closeAdminButton = document.getElementById('close-admin-button');
const saveSettingsButton = document.getElementById('save-settings-button');
const adminPanel = document.getElementById('admin-panel');
const totalCapsulesInput = document.getElementById('total-capsules-input');
const superWinRateInput = document.getElementById('super-win-rate-input');
const winRateInput = document.getElementById('win-rate-input');


// --- 初期化処理 ---
function initializeApp() {
    loadSettings();
    updateDisplay();
    setupEventListeners();
}

function loadSettings() {
    const savedSettings = localStorage.getItem('gachaAppSettings');
    if (savedSettings) {
        gachaSettings = JSON.parse(savedSettings);
    } else {
        // 初回起動時のデフォルト値
        gachaSettings = {
            totalStock: 100,
            currentStock: 100,
            superWinRate: 5,   // 大当たり確率 5%
            winRate: 25        // 当たり確率 25%
        };
        saveSettings();
    }
}

function saveSettings() {
    localStorage.setItem('gachaAppSettings', JSON.stringify(gachaSettings));
}

function updateDisplay() {
    stockCountSpan.textContent = gachaSettings.currentStock;
    totalCapsulesInput.value = gachaSettings.totalStock;
    superWinRateInput.value = gachaSettings.superWinRate;
    winRateInput.value = gachaSettings.winRate;

    if (gachaSettings.currentStock <= 0) {
        gachaHandle.style.opacity = 0.5;
        gachaHandle.style.cursor = 'not-allowed';
    } else {
        gachaHandle.style.opacity = 1;
        gachaHandle.style.cursor = 'pointer';
    }
}


// --- イベントリスナーの設定 ---
function setupEventListeners() {
    gachaHandle.addEventListener('click', () => {
        if (isPlaying || gachaSettings.currentStock <= 0) {
            if (gachaSettings.currentStock <= 0) {
                alert('カプセルが売り切れです！設定画面から在庫を補充してください。');
            }
            return;
        }
        isPlaying = true;
        gachaHandle.classList.add('rotating');

        setTimeout(() => {
            gachaHandle.classList.remove('rotating');
            gachaSettings.currentStock--;
            saveSettings();
            updateDisplay();
            createCapsule();
        }, 500);
    });

    resultOverlay.addEventListener('click', () => {
        resultOverlay.classList.add('hidden');
        superWinContent.classList.add('hidden');
        normalWinContent.classList.add('hidden');
        loseContent.classList.add('hidden');
        document.body.classList.remove('result-shown', 'lose-bg');
        isPlaying = false;
    });

    openAdminButton.addEventListener('click', () => {
        adminPanel.classList.remove('hidden');
    });

    closeAdminButton.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });

    saveSettingsButton.addEventListener('click', () => {
        const newTotal = parseInt(totalCapsulesInput.value, 10);
        const newSuperRate = parseInt(superWinRateInput.value, 10);
        const newRate = parseInt(winRateInput.value, 10);

        if (isNaN(newTotal) || isNaN(newSuperRate) || isNaN(newRate) || newTotal < 0 || newSuperRate < 0 || newRate < 0) {
            alert('有効な数値を入力してください。');
            return;
        }
        if (newSuperRate + newRate > 100) {
            alert('大当たりと当たりの確率の合計は100%以下にしてください。');
            return;
        }

        gachaSettings.totalStock = newTotal;
        gachaSettings.currentStock = newTotal;
        gachaSettings.superWinRate = newSuperRate;
        gachaSettings.winRate = newRate;

        saveSettings();
        updateDisplay();
        alert('設定を保存しました。');
        adminPanel.classList.add('hidden');
    });
}


// --- ガチャのメイン機能 ---
const capsuleStyles = [
    { colorClass: 'capsule-yellow' }, { colorClass: 'capsule-green' },
    { colorClass: 'capsule-blue' }, { colorClass: 'capsule-purple' },
    { colorClass: 'capsule-pink' }
];

function createCapsule() {
    capsuleContainer.innerHTML = '';
    const capsule = document.createElement('div');
    capsule.classList.add('capsule');
    const randomIndex = Math.floor(Math.random() * capsuleStyles.length);
    capsule.classList.add(capsuleStyles[randomIndex].colorClass);
    capsuleContainer.appendChild(capsule);
    capsule.addEventListener('click', () => {
        openResult();
        capsule.remove();
    });
}

function openResult() {
    const superWinPercent = gachaSettings.superWinRate / 100;
    const normalWinPercent = gachaSettings.winRate / 100;
    const rand = Math.random();

    document.body.classList.add('result-shown');
    resultOverlay.classList.remove('hidden');

    if (rand < superWinPercent) {
        // 大当たり
        superWinContent.classList.remove('hidden');
        fireConfetti();
    } else if (rand < superWinPercent + normalWinPercent) {
        // 当たり
        normalWinContent.classList.remove('hidden');
    } else {
        // はずれ
        document.body.classList.add('lose-bg');
        loseContent.classList.remove('hidden');
    }
}

function fireConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) { requestAnimationFrame(frame); }
    }());
}

// --- アプリケーションの実行開始 ---
initializeApp();