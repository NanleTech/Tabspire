import { useCallback, useEffect, useRef, useState } from "react";
import AudioService from "../utils/audio-service";

interface UseAudioOptions {
	voice?: string; // Voice preference (optional)
}

export const useAudio = ({ voice }: UseAudioOptions = {}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const audioServiceRef = useRef<AudioService | null>(null);

	// Initialize audio service
	useEffect(() => {
		audioServiceRef.current = new AudioService({ voice });
	}, [voice]);

	const stopAudio = useCallback(() => {
		if (audioServiceRef.current) {
			audioServiceRef.current.stop();
		}
		setIsPlaying(false);
		setError(null);
	}, []);

	const playText = useCallback(
		async (text: string) => {
			if (!audioServiceRef.current) {
				setError("Audio service not configured");
				return;
			}

			if (isPlaying) {
				stopAudio();
				return;
			}

			try {
				setIsLoading(true);
				setError(null);
				setIsPlaying(true);

				await audioServiceRef.current.playText(text);

				// Audio finished playing
				setIsPlaying(false);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
				setError(errorMessage);
				setIsPlaying(false);
				console.error("Audio playback error:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[isPlaying, stopAudio],
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (audioServiceRef.current) {
				audioServiceRef.current.stop();
			}
		};
	}, []);

	return {
		isPlaying,
		isLoading,
		error,
		playText,
		stopAudio,
		clearError,
	};
};
