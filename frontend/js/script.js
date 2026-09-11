/* =========================
   BIDVAULT FRONTEND SCRIPT
========================= */

// Simple countdown timer
let remainingTime = 2 * 60 * 60 + 34 * 60 + 15;

function updateTimer() {

    if (remainingTime <= 0) {
        return;
    }

    remainingTime--;

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const formatted =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    const timer = document.getElementById("heroTimer");

    if (timer) {
        timer.textContent = formatted;
    }
}

setInterval(updateTimer, 1000);