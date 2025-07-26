let countdownInterval;
let timeLeft = 0;
let isPaused = false;
let isRunning = false;
let bubbleInterval;
let activeBubbles = [];

function startCountdown() {
  const minutesInput = document.getElementById("minutesInput");
  const minutes = parseInt(minutesInput.value);

  if (isNaN(minutes) || minutes <= 0 || minutes > 60) {

    minutesInput.classList.add("shake");

    setTimeout(() => {
      minutesInput.classList.remove("shake");
    }, 200);

    return;
  }

  isRunning = true;
  startBubbles();
  timeLeft = minutes * 60;
  isPaused = false;
  document.getElementById("pauseBtn").textContent = "Pause";
  document.getElementById("pauseBtn").style.display = "inline-block";

  updateDisplay(timeLeft);
  clearInterval(countdownInterval);
  countdownInterval = setInterval(tick, 1000);

  document.getElementById("startControls").style.display = "none";
  document.getElementById("activeControls").style.display = "flex";
}

function tick() {
  if (!isPaused) {
    timeLeft--;
    updateDisplay(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      isRunning = false;
      stopBubbles();
      popBubbles();
      document.getElementById("time").textContent = "Time's up!";
      document.getElementById("pauseBtn").style.display = "none";

      const popSound = document.getElementById("popSound");
      popSound.currentTime = 0;
      popSound.play();
    }
  }
}

function togglePause() {
  if (timeLeft <= 0) return;

  isPaused = !isPaused;
  document.getElementById("pauseBtn").textContent = isPaused ? "Continue" : "Pause";

  if (isPaused) {
    pauseBubbles();
  } else {
    resumeBubbles();
  }
}

function cancelCountdown() {
  if (timeLeft > 0) {
    const popSound = document.getElementById("popSound");
    popSound.pause();
    popSound.currentTime = 0;
    popSound.play().catch(e => {
      console.warn("Sound error");
    });
  }

  isRunning = false;
  stopBubbles();
  popBubbles();
  clearInterval(countdownInterval);
  timeLeft = 0;
  isPaused = false;
  document.getElementById("pauseBtn").textContent = "Pause";
  updateDisplay(timeLeft);

  document.getElementById("startControls").style.display = "flex";
  document.getElementById("activeControls").style.display = "none";
}

function updateDisplay(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  document.getElementById("time").textContent = `${mins}:${secs}`;
}

function startBubbles() {
  bubbleInterval = setInterval(() => {
    if (activeBubbles.length >= 6 || isPaused || !isRunning) return;

    const bubble = document.createElement("img");
    const bubbleImages = ["assets/bubble1.svg", "assets/bubble2.svg", "assets/bubble3.svg"];
    bubble.src = bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
    bubble.className = "bubble";

    const size = Math.random() * 80 + 80;
    bubble.style.width = size + "px";
    bubble.style.top = (Math.random() * 60 + 20) + "%";
    bubble.style.animationDuration = (Math.random() * 10 + 10) + "s";

    document.getElementById("bubbleContainer").appendChild(bubble);
    activeBubbles.push(bubble);

    bubble.addEventListener("animationend", () => {
      bubble.remove();
      activeBubbles = activeBubbles.filter(b => b !== bubble);
    });
  }, 1700);
}

function stopBubbles() {
  clearInterval(bubbleInterval);
}

function pauseBubbles() {
  activeBubbles.forEach(b => b.classList.add("paused"));
}

function resumeBubbles() {
  activeBubbles.forEach(b => b.classList.remove("paused"));
}

function popBubbles() {
  activeBubbles.forEach(bubble => {
    const rect = bubble.getBoundingClientRect();
    const width = bubble.offsetWidth;
    const height = bubble.offsetHeight;

    bubble.style.transition = "none";
    bubble.style.transform = "scale(1)";
    bubble.style.opacity = "1";

    const splash = document.createElement("img");
    const splashImages = ["assets/splash1.svg", "assets/splash2.svg", "assets/splash3.svg"];
    splash.src = splashImages[Math.floor(Math.random() * splashImages.length)];
    splash.className = "splash";

    const scaleFactor = 1.2;
    splash.style.position = "absolute";
    splash.style.left = rect.left - (width * (scaleFactor - 1)) / 2 + "px";
    splash.style.top = rect.top - (height * (scaleFactor - 1)) / 2 + "px";
    splash.style.width = width * scaleFactor + "px";
    splash.style.height = height * scaleFactor + "px";
    splash.style.pointerEvents = "none";
    splash.style.zIndex = "0";
    splash.style.transform = "scale(1.0)";
    splash.style.opacity = "0";
    splash.style.transition = "transform 0.15s ease, opacity 0.2s";

    document.body.appendChild(splash);

    requestAnimationFrame(() => {
      splash.style.transform = "scale(1.2)";
      splash.style.opacity = "1";
    });

    setTimeout(() => splash.style.opacity = "0", 150);
    setTimeout(() => splash.remove(), 800);

    requestAnimationFrame(() => {
      bubble.style.transition = "transform 0.8s ease, opacity 0s";
      bubble.style.transform = "scale(1.4)";
      bubble.style.opacity = "0";
    });

    setTimeout(() => bubble.remove(), 1000);
  });

  activeBubbles = [];
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startBtn').addEventListener('click', startCountdown);
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  document.getElementById('cancelBtn').addEventListener('click', cancelCountdown);
});