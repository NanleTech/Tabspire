import { scriptures } from "./scriptures.js";


function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Apply a random gradient background with animation
function applyRandomGradient() {
  const colors = Array.from({ length: 5 }, getRandomColor).join(", ");
  document.body.style.background = `linear-gradient(120deg, ${colors})`;
  document.body.style.backgroundSize = "200% 200%";
  document.body.style.backgroundPosition = "center";
  document.body.style.animation = "gradientAnimation 10s ease infinite";
  document.body.style.opacity = 0.5; // Initial opacity for gradient
}

var apiKey = "AGlZBOSgLdZe7dl-gn4EI5Vc2yoVnd1itGVWVwI8yx8";

// Get a random scripture
function getRandomScripture() {
  const randomIndex = Math.floor(Math.random() * scriptures.length);
  return scriptures[randomIndex];
}

// Fetch a random background image from Unsplash
async function fetchRandomImage() {
  const url = `https://api.unsplash.com/photos/random?query=nature&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Apply the background image and set final opacity
    document.body.style.backgroundImage = `url(${data.urls.full})`;
    document.body.style.transition = "opacity 2s ease"; // Smooth transition
    document.body.style.opacity = 1; // Fade in after the image loads
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    document.body.style.opacity = 1; // Ensure opacity is set even if fetch fails
  }
}

// Set scripture text and initiate background effects
document.getElementById("scripture").textContent = getRandomScripture();

// Apply gradient and fetch image on load
window.addEventListener("load", () => {
  applyRandomGradient();
  fetchRandomImage();
});
