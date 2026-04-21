let coins = 0;
let gameActive = false;
let currentMode = '';
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let isGambleUsed = false;

const btsMembers = ['rm', 'jin', 'suga', 'jhope', 'jimin', 'v', 'jungkook'];

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

    if (mode === 'BTS') renderBTSGame();
    else if (mode === 'Fruit') runFruitLoop();
    else if (mode === 'Catch') runCatchLoop();
}

// --- BTS MAHJONG ---
function renderBTSGame() {
    const area = document.getElementById('game-area');
    area.style.display = 'flex'; area.style.flexWrap = 'wrap'; area.style.justifyContent = 'center';
    area.style.marginTop = '100px';

    let deck = [...btsMembers, ...btsMembers, 'bomb'].sort(() => Math.random() - 0.5);
    deck.forEach(member => {
        const tile = document.createElement('div');
        tile.className = 'bts-tile';
        tile.dataset.member = member;
        tile.onclick = () => {
            if (lockBoard || tile === firstCard) return;
            if (member === 'bomb') {
                tile.innerText = '💣'; tile.style.background = 'red';
                setTimeout(() => { alert("BOOM! Security Trap!"); showRewardScreen(); }, 500);
                return;
            }
            tile.style.backgroundImage = `url('assets/bts/${member}.jpg')`;
            if (!firstCard) { firstCard = tile; return; }
            secondCard = tile;
            lockBoard = true;
            if (firstCard.dataset.member === secondCard.dataset.member) {
                coins += 10; updateHUD(); resetCards();
            } else {
                setTimeout(() => {
                    firstCard.style.backgroundImage = '';
                    secondCard.style.backgroundImage = '';
                    resetCards();
                }, 800);
            }
        };
        area.appendChild(tile);
    });
}

function resetCards() { [firstCard, secondCard] = [null, null]; lockBoard = false; }

// --- FRUIT SLASHER ---
function runFruitLoop() {
    if (!gameActive || currentMode !== 'Fruit') return;
    const area = document.getElementById('game-area');
    const item = document.createElement('div');
    const isBomb = Math.random() < 0.2;
    item.className = 'fruit';
    item.innerText = isBomb ? '💣' : ['🍎','🍉','🍓'][Math.floor(Math.random()*3)];
    item.style.left = Math.random() * (window.innerWidth - 60) + 'px';
    item.style.bottom = "-100px";
    area.appendChild(item);

    let bottom = -100; let up = true;
    const move = setInterval(() => {
        if (!gameActive) { clearInterval(move); return; }
        bottom = up ? bottom + 8 : bottom - 6;
        if (bottom > 350) up = false;
        item.style.bottom = bottom + 'px';
        if (bottom < -120) { clearInterval(move); item.remove(); }
    }, 20);

    item.onmouseover = () => {
        if (isBomb) { gameActive = false; alert("BOOM!"); showRewardScreen(); }
        else { coins++; updateHUD(); item.innerText = '✨'; setTimeout(()=>item.remove(), 100); }
    };
    setTimeout(runFruitLoop, Math.max(400, 1000 - (coins * 10)));
}

// --- COIN CATCH ---
function runCatchLoop() {
    if (!gameActive || currentMode !== 'Catch') return;
    const area = document.getElementById('game-area');
    const target = document.createElement('div');
    const isHazard = Math.random() < 0.2;
    target.className = `target ${isHazard ? 'hazard' : 'gold'}`;
    target.innerText = isHazard ? '💀' : '🪙';
    target.style.left = Math.random() * (window.innerWidth - 70) + 'px';
    target.style.top = Math.random() * (window.innerHeight - 200) + 100 + 'px';
    target.onclick = () => {
        if (isHazard) { alert("Game Over!"); showRewardScreen(); }
        else { coins++; updateHUD(); target.remove(); }
    };
    area.appendChild(target);
    setTimeout(() => target.remove(), 1500);
    setTimeout(runCatchLoop, Math.max(400, 1000 - (coins * 15)));
}

function updateHUD() {
    document.getElementById('coin-count').innerText = coins;
}

function showRewardScreen() {
    gameActive = false;
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('reward-screen').classList.remove('hidden');
    document.getElementById('final-discount').innerText = `${coins}%`;
    document.getElementById('coupon-code').innerText = `VAULT-${coins}-OFF`;
}

function triggerGreedMechanic() {
    if (isGambleUsed) return;
    isGambleUsed = true;
    const win = Math.random() > 0.5;
    coins = win ? coins * 2 : Math.floor(coins / 2);
    alert(win ? "LUCKY! Doubled!" : "BUSTED!");
    document.getElementById('final-discount').innerText = `${coins}%`;
}

function shareToBoost() {
    window.open(`https://wa.me/?text=I unlocked ${coins}% on VoucherVault!`, '_blank');
    coins += 5;
    document.getElementById('final-discount').innerText = `${coins}%`;
}
