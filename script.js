let score = 0;
const targetScore = 20;
const clickBtn = document.getElementById('click-me');
const scoreDisplay = document.getElementById('score');
const rewardSection = document.getElementById('reward-section');
const couponDisplay = document.getElementById('coupon-code');

// Simple obfuscation so the code isn't plain text in the file
const secretKey = "R0VULTI1LU9GRg=="; // This translates to "GET-25-OFF"

clickBtn.addEventListener('click', () => {
    score++;
    scoreDisplay.innerText = score;

    if (score >= targetScore) {
        unlockReward();
    }
});

function unlockReward() {
    // Disable the button and show the reward
    clickBtn.disabled = true;
    clickBtn.style.opacity = "0.5";
    
    // Reveal the coupon
    rewardSection.classList.remove('hidden');
    couponDisplay.innerText = atob(secretKey); 
}
