interface AudioServiceConfig {
	voice?: string; // Voice preference (for future use)
}

class AudioService {
	private config: AudioServiceConfig;

	constructor(config: AudioServiceConfig = {}) {
		this.config = config;
	}

	async playText(text: string): Promise<void> {
		// Use the Web Speech API
		if (!("speechSynthesis" in window)) {
			throw new Error("Speech synthesis not supported in this browser");
		}

		return new Promise((resolve, reject) => {
			// Cancel any ongoing speech
			speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);

			// Get available voices and find the best human-sounding one
			const voices = speechSynthesis.getVoices();

			if (voices.length > 0) {
				console.log("Available voices:", voices.map((v) => `${v.name} (${v.lang})`).join(", "));

				// Score each voice based on quality indicators
				const scoreVoice = (voice: SpeechSynthesisVoice): number => {
					let score = 0;
					const name = voice.name.toLowerCase();
					const lang = voice.lang.toLowerCase();

					// Prefer English voices
					if (lang.startsWith("en")) score += 10;

					// PREMIUM QUALITY - Highest priority
					if (name.includes("premium")) score += 50;
					if (name.includes("enhanced")) score += 45;
					if (name.includes("natural")) score += 40;
					if (name.includes("neural")) score += 40;
					if (name.includes("hd")) score += 35;
					if (name.includes("high quality")) score += 35;

					// Top-tier premium voices by name
					if (name.includes("samantha")) score += 50; // Apple's premium voice
					if (name.includes("google") && name.includes("us")) score += 45;
					if (name.includes("zira")) score += 40; // Microsoft premium
					if (name.includes("ava")) score += 40; // Apple premium
					if (name.includes("allison")) score += 38; // Apple premium

					// Prefer Google, Microsoft, or Apple voices
					if (name.includes("google")) score += 25;
					if (name.includes("microsoft")) score += 20;
					if (name.includes("apple")) score += 18;

					// Female voices (often more pleasant for narration)
					if (
						name.includes("female") ||
						name.includes("samantha") ||
						name.includes("zira") ||
						name.includes("susan") ||
						name.includes("karen") ||
						name.includes("moira") ||
						name.includes("tessa") ||
						name.includes("ava") ||
						name.includes("allison") ||
						name.includes("victoria") ||
						name.includes("hazel")
					)
						score += 12;

					// Prefer local voices (better quality, faster)
					if (voice.localService) score += 10;

					// US English preferred over other English variants
					if (lang.includes("en-us")) score += 8;
					if (lang.includes("en-gb")) score += 5; // British is second preference

					return score;
				};

				// Find the best voice
				const rankedVoices = voices
					.map((voice) => ({ voice, score: scoreVoice(voice) }))
					.sort((a, b) => b.score - a.score);

				const bestVoice = rankedVoices[0].voice;
				utterance.voice = bestVoice;

				console.log(
					`Selected voice: ${bestVoice.name} (${bestVoice.lang}) with score ${rankedVoices[0].score}`,
				);
				console.log(
					"Top 3 voices:",
					rankedVoices
						.slice(0, 3)
						.map((r) => `${r.voice.name} (score: ${r.score})`)
						.join(", "),
				);
			}

			utterance.rate = 0.9; // Slightly slower for better clarity
			utterance.pitch = 1.0;
			utterance.volume = 1.0;

			utterance.onend = () => resolve();
			utterance.onerror = (event) => {
				console.error("Web Speech API error:", event);
				reject(new Error(`Web Speech API error: ${event.error}`));
			};

			speechSynthesis.speak(utterance);
		});
	}

	stop(): void {
		// Stop Web Speech API if it's speaking
		if ("speechSynthesis" in window && speechSynthesis.speaking) {
			speechSynthesis.cancel();
		}
	}

	isPlaying(): boolean {
		return "speechSynthesis" in window && speechSynthesis.speaking;
	}

	// Update voice preference
	setVoice(voice: string): void {
		this.config.voice = voice;
	}
}

export default AudioService;
