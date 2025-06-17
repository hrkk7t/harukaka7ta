// --- グローバル変数とDOM要素の定義 ---
let isPlaying = false;
let menuList = []; // 献立リストを保持する配列

// DOM要素
const gachaHandle = document.getElementById('gacha-handle');
const capsuleContainer = document.getElementById('capsule-container');
const resultOverlay = document.getElementById('result-overlay');
const menuResultDiv = document.getElementById('menu-result');

const openAdminButton = document.getElementById('open-admin-button');
const closeAdminButton = document.getElementById('close-admin-button');
const saveSettingsButton = document.getElementById('save-settings-button');
const adminPanel = document.getElementById('admin-panel');
const menuListInput = document.getElementById('menu-list-input');


// --- 初期化処理 ---
function initializeApp() {
    loadMenuList();
    updateAdminPanel();
    setupEventListeners();
}

function loadMenuList() {
    const savedMenuList = localStorage.getItem('kondateGachaMenuList');
    if (savedMenuList) {
        menuList = JSON.parse(savedMenuList);
    } else {
        // 初回起動時のデフォルト献立リスト
        menuList = ["カレー", "ハンバーグ", "唐揚げ", "パスタ", "ラーメン", "お寿司", "肉じゃが", "生姜焼き"];
        saveMenuList();
    }
}

function saveMenuList() {
    localStorage.setItem('kondateGachaMenuList', JSON.stringify(menuList));
}

function updateAdminPanel() {
    // 配列を改行区切りのテキストに変換してtextareaに表示
    menuListInput.value = menuList.join('\n');
}

// --- イベントリスナーの設定 ---
function setupEventListeners() {
    gachaHandle.addEventListener('click', () => {
        if (isPlaying) return;
        if (menuList.length === 0) {
            alert('献立がありません！設定画面からメニューを追加してください。');
            return;
        }
        
        isPlaying = true;
        gachaHandle.classList.add('rotating');

        setTimeout(() => {
            gachaHandle.classList.remove('rotating');
            createCapsule();
        }, 500);
    });

    resultOverlay.addEventListener('click', () => {
        resultOverlay.classList.add('hidden');
        isPlaying = false;
    });

    openAdminButton.addEventListener('click', () => {
        adminPanel.classList.remove('hidden');
    });

    closeAdminButton.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });

    saveSettingsButton.addEventListener('click', () => {
        // textareaの内容を改行で分割し、空の行は除外して配列にする
        const newMenuList = menuListInput.value.split('\n').filter(item => item.trim() !== '');
        
        if (newMenuList.length === 0) {
            alert('献立を1つ以上入力してください。');
            return;
        }

        menuList = newMenuList;
        saveMenuList();
        alert('献立リストを保存しました。');
        adminPanel.classList.add('hidden');
    });
}

// --- ガチャのメイン機能 ---
const capsuleColors = ['color1', 'color2', 'color3', 'color4', 'color5'];

function createCapsule() {
    capsuleContainer.innerHTML = '';
    const capsule = document.createElement('div');
    capsule.classList.add('capsule');
    
    // カプセルの色をランダムに決める
    const randomColor = capsuleColors[Math.floor(Math.random() * capsuleColors.length)];
    capsule.classList.add(randomColor);
    
    capsuleContainer.appendChild(capsule);

    capsule.addEventListener('click', () => {
        openResult();
        capsule.remove();
    });
}

function openResult() {
    // 献立リストからランダムに1つ選ぶ
    const randomIndex = Math.floor(Math.random() * menuList.length);
    const selectedMenu = menuList[randomIndex];

    // 結果を表示
    menuResultDiv.textContent = selectedMenu;
    resultOverlay.classList.remove('hidden');
}

// --- アプリケーションの実行開始 ---
initializeApp();