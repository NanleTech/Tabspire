const fs = require("node:fs");
const path = require("node:path");

let sharp = null;
try {
	sharp = require("sharp");
} catch (_error) {
	sharp = null;
}

const sizes = [16, 48, 128];
const iconDir = path.join(__dirname, "../icons");
const sourceIcon = path.join(__dirname, "../tabspire.png");

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
	fs.mkdirSync(iconDir, { recursive: true });
}

const requiredIconsExist = sizes.every((size) =>
	fs.existsSync(path.join(iconDir, `icon${size}.png`)),
);

if (!sharp) {
	if (requiredIconsExist) {
		console.warn("sharp is unavailable; using existing icons in /icons.");
		process.exit(0);
	}
	console.error("sharp is unavailable and required icons are missing.");
	process.exit(1);
}

if (!fs.existsSync(sourceIcon)) {
	console.error("Source icon tabspire.png is missing.");
	process.exit(1);
}

Promise.all(
	sizes.map((size) =>
		sharp(sourceIcon)
			.resize(size, size)
			.png()
			.toFile(path.join(iconDir, `icon${size}.png`))
			.then(() => console.log(`Generated ${size}x${size} icon`)),
	),
)
	.catch((err) => {
		console.error("Error generating icons:", err);
		process.exit(1);
	});