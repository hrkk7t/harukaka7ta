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

async function openResult() {
    const randomIndex = Math.floor(Math.random() * menuList.length);
    const selectedMenu = menuList[randomIndex];

    // 結果表示の準備
    const recipeCard = document.querySelector('#result-box .card-body');
    recipeCard.style.opacity = 0; // いったん非表示に
    menuResultDiv.innerHTML = `「${selectedMenu}」<br>のレシピを考えています...<br>👨‍🍳`;
    menuResultDiv.style.textAlign = 'center';
    adjustFontSize(menuResultDiv);
    resultOverlay.classList.remove('hidden');

    try {
        const response = await fetch('/.netlify/functions/get-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menu: selectedMenu })
        });

        if (!response.ok) {
            throw new Error('AIシェフは今、休憩中のようです。');
        }

        const data = await response.json();
        
        // レシピ表示の準備
        recipeCard.style.opacity = 1;
        menuResultDiv.style.textAlign = 'left';
        menuResultDiv.innerHTML = data.recipe.replace(/\n/g, '<br>');

    } catch (error) {
        recipeCard.style.opacity = 1;
        menuResultDiv.textContent = 'エラーが発生しました。少し時間をおいて再度お試しください。';
        console.error(error);
    }
    
    adjustFontSize(menuResultDiv);
}

function adjustFontSize(element) {
    element.style.fontSize = '16px'; // レシピ用に基本サイズをリセット
    const parent = element.closest('.card-body');
    if (!parent) return;

    // コンテナの利用可能な高さを取得 (paddingなどを考慮)
    const availableHeight = parent.clientHeight - 40; // 上下のpadding分を引く

    // 文字の高さがコンテナの高さを超える限りループ
    while (element.scrollHeight > availableHeight && parseFloat(element.style.fontSize) > 10) {
        let currentSize = parseFloat(element.style.fontSize);
        element.style.fontSize = (currentSize - 1) + 'px';
    }
}

// --- アプリケーションの実行開始 ---
initializeApp();