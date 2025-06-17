// --- グローバル変数とDOM要素の定義 ---
let isPlaying = false;
let menuList = [];

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
        menuList = ["カレーライス", "ハンバーグステーキ", "鶏の唐揚げ", "ミートソースパスタ", "豚骨ラーメン", "お寿司の盛り合わせ", "肉じゃが", "豚の生姜焼き"];
        saveMenuList();
    }
}

function saveMenuList() {
    localStorage.setItem('kondateGachaMenuList', JSON.stringify(menuList));
}

function updateAdminPanel() {
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

        // ハンドルを回転させる命令
        gachaHandle.classList.add('rotating');

        setTimeout(() => {
            // 回転アニメーションが終わったらクラスを削除
            gachaHandle.classList.remove('rotating');
            createCapsule();
        }, 500); // 0.5秒（CSSのアニメーション時間と合わせる）
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
    
    const randomColor = capsuleColors[Math.floor(Math.random() * capsuleColors.length)];
    capsule.classList.add(randomColor);
    
    capsuleContainer.appendChild(capsule);

    capsule.addEventListener('click', () => {
        openResult();
        capsule.remove();
    });
}

function openResult() {
    const randomIndex = Math.floor(Math.random() * menuList.length);
    const selectedMenu = menuList[randomIndex];

    menuResultDiv.textContent = selectedMenu;
    adjustFontSize(menuResultDiv);
    resultOverlay.classList.remove('hidden');
}

function adjustFontSize(element) {
    element.style.fontSize = ''; 
    const parentWidth = element.parentElement.clientWidth;
    let currentSize = parseFloat(window.getComputedStyle(element).fontSize);

    while (element.scrollWidth > parentWidth && currentSize > 10) {
        currentSize -= 1;
        element.style.fontSize = currentSize + 'px';
    }
}

// --- アプリケーションの実行開始 ---
initializeApp();