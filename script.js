let coins = 0;
let gameActive = false;
let currentMode = '';
let isGambleUsed = false;

function startGame(mode) {
    currentMode = mode;
    coins = 0;
    document.getElementById('coin-count').innerText = "0";
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('hud').classList.remove('hidden');
    gameActive = true;
    
    const area = document.getElementById('game-area');
    area.innerHTML = '';

    if (mode === 'Catch') {
        runCatchLoop();
    } else if (mode === 'Tiles') {
        renderTileGame();
    } else if (mode === 'Fruit') {
        runFruitLoop();
    }
}

// --- GAME 1: COIN CATCH ---
function runCatchLoop() {
    if (!gameActive || currentMode !== 'Catch') return;
    const isHazard = Math.random() < (0.15 + (coins * 0.01));
    createTarget(isHazard);
    setTimeout(runCatchLoop, Math.max(400, 1000 - (coins * 20)));
}

function createTarget(isHazard) {
    const area = document.getElementById('game-area');
    const target = document.createElement('div');
    target.className = `target ${isHazard ? 'hazard' : 'gold'}`;
    target.innerText = isHazard ? '💀' : '🪙';
    target.style.left = Math.random() * (window.innerWidth - 80) + 'px';
    target.style.top = Math.random() * (window.innerHeight - 200) + 100 + 'px';

    target.onclick = () => {
        if (isHazard) gameOver("Security Breach! You hit a hazard.");
        else { coins++; updateHUD(); }
        target.remove();
    };
    area.appendChild(target);
    setTimeout(() => target.remove(), 1500);
}

// --- GAME 2: FRUIT SLASHER ---
function runFruitLoop() {
    if (!gameActive || currentMode !== 'Fruit') return;
    spawnFruit();
    setTimeout(runFruitLoop, Math.max(500, 1200 - (coins * 25)));
}

function spawnFruit() {
    const area = document.getElementById('game-area');
    const item = document.createElement('div');
    const isBomb = Math.random() < 0.2;
    const types = ['🍎', '🍉', '🍍', '🍓'];
    
    item.className = 'fruit';
    item.innerText = isBomb ? '💣' : types[Math.floor(Math.random() * types.length)];
    item.dataset.type = isBomb ? 'bomb' : 'fruit';
    item.style.left = Math.random() * (window.innerWidth - 80) + 'px';
    item.style.bottom = "-100px";

    area.appendChild(item);

    // Physics: Rise and Fall
    let bottom = -100;
    let up = true;
    const move = setInterval(() => {
        if (!gameActive) { clearInterval(move); return; }
        if (up) { bottom += 8; if (bottom > 350) up = false; } 
        else { bottom -= 6; }
        item.style.bottom = bottom + 'px';
        if (bottom < -120) { clearInterval(move); item.remove(); }
    }, 20);

    // Slicing mechanic
    item.onmouseover = () => {
        if (item.dataset.type === 'bomb') gameOver("BOOM! You sliced a bomb!");
        else {
            coins++; updateHUD();
            item.innerText = '✨';
            setTimeout(() => item.remove(), 100);
        }
    };
}

// --- GAME 3: TILE MATCH ---
function renderTileGame() {
    const area = document.getElementById('game-area');
    area.style.display = 'flex'; area.style.flexWrap = 'wrap'; area.style.justifyContent = 'center';
    area.style.marginTop = '120px';
    
    const deck = ['🍎','🍎','💎','💎','🍀','🍀','🍌','🍌','💀','💀'].sort(() => Math.random() - 0.5);
    deck.forEach(icon => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.innerText = '?';
        tile.onclick = () => {
            if (icon === '💀') gameOver("The Puzzle Trapped You!");
            else {
                tile.innerText = icon; tile.style.background = '#22c55e';
                coins += 2; updateHUD();
                tile.onclick = null;
            }
        };
        area.appendChild(tile);
    });
}

// --- GLOBAL UTILITIES ---
function updateHUD() {
    document.getElementById('coin-count').innerText = coins;
    const tag = document.getElementById('difficulty-tag');
    if (coins > 15) tag.innerText = "MODE: UNSTABLE";
    if (coins > 35) tag.innerText = "MODE: INSANE";
}

function gameOver(msg) {
    gameActive = false;
    alert(msg);
    showRewardScreen();
}

function showRewardScreen() {
    gameActive = false;
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('reward-screen').classList.remove('hidden');
    updateRewardUI();
}

function triggerGreedMechanic() {
    if (isGambleUsed) return;
    isGambleUsed = true;
    const win = Math.random() > 0.5;
    coins = win ? coins * 2 : Math.floor(coins / 2);
    alert(win ? "LUCKY! Coins Doubled!" : "BUSTED! Coins Halved.");
    document.getElementById('gamble-btn').disabled = true;
    updateRewardUI();
}

function shareToBoost() {
    const text = `I unlocked a ${coins}% discount on VoucherVault! Can you survive the bombs? Play here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    coins += 5;
    updateRewardUI();
}

function updateRewardUI() {
    document.getElementById('final-discount').innerText = `${coins}%`;
    document.getElementById('coupon-code').innerText = `VAULT-${coins}-OFF`;
}
