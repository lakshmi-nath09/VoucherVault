let coins = 0;
let gameActive = false;
let isGambleUsed = false;

function startGame(type) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('hud').classList.remove('hidden');
    gameActive = true;
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;
    spawnTarget();
    
    // Scaling Difficulty: Faster spawn as coins increase
    let nextSpawn = Math.max(350, 1000 - (coins * 15));
    setTimeout(gameLoop, nextSpawn);
}

function spawnTarget() {
    const area = document.getElementById('game-area');
    const target = document.createElement('div');
    
    // Difficulty logic: Higher coins = higher chance of hazards
    const hazardChance = 0.15 + (coins * 0.015);
    const isHazard = Math.random() < hazardChance;
    
    target.className = `target ${isHazard ? 'hazard' : 'gold'}`;
    target.innerText = isHazard ? '💀' : '🪙';

    const x = Math.random() * (window.innerWidth - 70);
    const y = Math.random() * (window.innerHeight - 160) + 80;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    target.onclick = () => {
        if (isHazard) {
            coins = Math.max(0, coins - 10); // Heavy penalty makes "Easy" hard
            alert("Security Trap! -10 Coins");
        } else {
            coins++;
        }
        updateHUD();
        target.remove();
    };

    area.appendChild(target);
    setTimeout(() => target.remove(), 1500); // Disappears if missed
}

function updateHUD() {
    document.getElementById('coin-count').innerText = coins;
    const tag = document.getElementById('difficulty-tag');
    if (coins > 15) tag.innerText = "LEVEL: UNSTABLE";
    if (coins > 30) tag.innerText = "LEVEL: EXTREME";
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
    
    if (Math.random() > 0.5) {
        coins *= 2;
        alert("JACKPOT! Your discount doubled!");
    } else {
        coins = Math.floor(coins / 2);
        alert("BUST! You lost half your coins.");
    }
    document.getElementById('gamble-btn').disabled = true;
    document.getElementById('gamble-btn').style.opacity = "0.5";
    updateRewardUI();
}

function shareToBoost() {
    const text = `I just hit a ${coins}% discount on VoucherVault! Can you break the vault? Play here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    
    coins += 5; // Bonus for viral sharing
    alert("Share bonus added! +5%");
    updateRewardUI();
}

function updateRewardUI() {
    document.getElementById('final-discount').innerText = `${coins}%`;
    document.getElementById('coupon-code').innerText = `VAULT-${coins}-OFF`;
}
