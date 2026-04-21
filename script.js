let score = 0;
const targetScore = 20;
const clickBtn = document.getElementById('click-me');
const scoreDisplay = document.getElementById('score');
const rewardSection = document.getElementById('reward-section');
const couponDisplay = document.getElementById('coupon-code');

// This makes the button jump to a random position
function moveButton() {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    
    clickBtn.style.position = 'absolute';
    clickBtn.style.left = x + 'px';
    clickBtn.style.top = y + 'px';
}

clickBtn.addEventListener('click', () => {
    score++;
    scoreDisplay.innerText = score;

    if (score >= targetScore) {
        unlockReward();
    } else {
        moveButton(); // Move it every time it's clicked!
    }
});

function unlockReward() {
    clickBtn.style.display = "none"; // Hide the button
    rewardSection.classList.remove('hidden');
    couponDisplay.innerText = "VAULT-WIN-20"; 
}
