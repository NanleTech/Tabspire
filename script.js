import { scriptures } from "./scriptures.js";

const apiKey = process.env.UNSPLASH_API_KEY || "";


function getRandomScripture() {
  const randomIndex = Math.floor(Math.random() * scriptures.length);
  return scriptures[randomIndex];
}

async function fetchRandomImage() {
  const url = `https://api.unsplash.com/photos/random?query=nature&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    document.body.style.backgroundImage = `url(${data.urls.full})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
  }
}

document.getElementById("scripture").textContent = getRandomScripture();
fetchRandomImage();
