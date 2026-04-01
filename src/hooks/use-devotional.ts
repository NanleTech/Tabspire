import { useState, useEffect, useCallback } from "react";
import type { Devotional } from "../types";

const DEVOTIONAL_CACHE_KEY = "tabspire_devotional_cache";
const REQUEST_TIMEOUT_MS = 4500;
const TRIUMPH30_FEED_URLS = ["https://triumph30.org/feed/", "https://t30.org/feed/"];

interface DevotionalCacheEntry {
	dayKey: string;
	timestamp: number;
	data: Devotional;
}

const getDayKey = () => new Date().toISOString().slice(0, 10);

const fallbackDevotional: Devotional = {
	title: "Steady in Every Season",
	content:
		"Trust in the Lord with all your heart and lean not on your own understanding. In all your ways submit to him, and he will make your paths straight.\n\nWalk slowly, pray honestly, and let obedience become your daily rhythm.",
	date: new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}),
	reference: "Proverbs 3:5",
	url: "",
};

const getCachedDevotional = (): Devotional | null => {
	try {
		const raw = localStorage.getItem(DEVOTIONAL_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as DevotionalCacheEntry;
		if (!parsed?.data || parsed.dayKey !== getDayKey()) return null;
		return parsed.data;
	} catch {
		return null;
	}
};

const setCachedDevotional = (data: Devotional) => {
	try {
		const payload: DevotionalCacheEntry = {
			dayKey: getDayKey(),
			timestamp: Date.now(),
			data,
		};
		localStorage.setItem(DEVOTIONAL_CACHE_KEY, JSON.stringify(payload));
	} catch {
		// Ignore cache write failures
	}
};

const fetchWithTimeout = async (url: string, options?: RequestInit): Promise<Response> => {
	const controller = new AbortController();
	const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
	try {
		return await fetch(url, { ...(options || {}), signal: controller.signal });
	} finally {
		window.clearTimeout(timeoutId);
	}
};

export const useDevotional = () => {
	const [devotional, setDevotional] = useState<Devotional | null>(() => getCachedDevotional());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDevotional = useCallback(async (options?: { force?: boolean }) => {
		const force = options?.force === true;
		if (!force) {
			const cached = getCachedDevotional();
			if (cached) {
				setDevotional(cached);
				setError(null);
				return;
			}
		}

		setLoading(true);
		setError(null);

		// Function to fetch the full article content directly from the website
		const fetchFullArticle = async (
			url: string,
			articleTitle: string,
		): Promise<string | null> => {
			try {
				// Use a CORS proxy to fetch the full article
				const proxyUrl = "https://api.allorigins.win/raw?url=";
				const response = await fetchWithTimeout(proxyUrl + encodeURIComponent(url));

				if (!response.ok) {
					throw new Error("Failed to fetch full article");
				}

				const htmlText = await response.text();

				// Parse the HTML to extract the main content
				const parser = new DOMParser();
				const htmlDoc = parser.parseFromString(htmlText, "text/html");

				// Look for the main content area (adjust selector based on the website structure)
				const contentSelectors = [
					"article",
					".entry-content",
					".post-content",
					".content",
					"main",
					".main-content",
					"h1", // Look for the main heading and get its parent content
					"body", // Fallback to body if nothing else works
				];

				let contentElement: Element | null = null;
				let usedSelector = "";
				for (const selector of contentSelectors) {
					contentElement = htmlDoc.querySelector(selector);
					if (contentElement) {
						// For h1, get the parent element that contains the full content
						if (selector === "h1" && contentElement.parentElement) {
							contentElement = contentElement.parentElement;
						}
						usedSelector = selector;
						break;
					}
				}

				if (contentElement) {
					// Get the text content and clean it up
					let fullContent = contentElement.textContent || "";

					// Remove extra whitespace and normalize
					fullContent = fullContent
						.replace(/\s+/g, " ")
						.replace(/\n\s*\n/g, "\n\n")
						.trim();

					// If we got the body content, try to extract just the devotional part
					if (usedSelector === "body" && fullContent.length > 5000) {
						// Look for content between the title and the footer
						const titleMatch = fullContent.match(
							new RegExp(
								articleTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
								"i",
							),
						);
						if (titleMatch) {
							const startIndex = titleMatch.index || 0;
							const devotionalContent = fullContent.substring(startIndex);

							// Try to find a natural ending point - stop at Bible Reading Plan
							const endPatterns = [
								/Bible Reading Plan:/,
								/Tags:/,
								/Previous Article/,
								/Leave a Reply/,
								/About Triumph 30/,
							];

							let endIndex = devotionalContent.length;
							for (const pattern of endPatterns) {
								const match = devotionalContent.match(pattern);
								if (match?.index && match.index < endIndex) {
									endIndex = match.index;
								}
							}

							// If we found a Bible Reading Plan, include it in the content
							const bibleReadingMatch = devotionalContent.match(/Bible Reading Plan:.*?(?=\n|$)/);
							if (bibleReadingMatch?.index && bibleReadingMatch.index < endIndex) {
								// Include the Bible Reading Plan in our content
								const contentBeforePlan = devotionalContent.substring(0, endIndex).trim();
								const bibleReadingPlan = bibleReadingMatch[0].trim();
								fullContent = `${contentBeforePlan}\n\n${bibleReadingPlan}`;
							} else {
								fullContent = devotionalContent.substring(0, endIndex).trim();
							}
						}
					}

					return fullContent;
				}

				return null;
			} catch (err) {
				console.error("Error fetching full article:", err);
				return null;
			}
		};

		try {
			// Try multiple CORS proxies for reliability
			const proxies = ["https://api.allorigins.win/raw?url=", "https://thingproxy.freeboard.io/fetch/"];

			let response: Response | null = null;
			let lastError: Error | null = null;

			for (const rssUrl of TRIUMPH30_FEED_URLS) {
				for (const proxy of proxies) {
					try {
						const fullUrl = proxy + encodeURIComponent(rssUrl);

						response = await fetchWithTimeout(fullUrl, {
							method: "GET",
							headers: {
								Accept: "application/xml, text/xml, */*",
							},
						});

						if (response.ok) {
							break;
						}
					} catch (err) {
						lastError = err instanceof Error ? err : new Error("Proxy failed");
					}
				}

				if (response?.ok) break;
			}

			if (!response || !response.ok) {
				throw lastError || new Error("All proxies failed");
			}

			const xmlText = await response.text();

			// Parse the XML to extract the latest devotional
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xmlText, "text/xml");

			// Get the first (most recent) item
			const item = xmlDoc.querySelector("item");

			if (item) {
				const title = item.querySelector("title")?.textContent || "";
				const description =
					item.querySelector("description")?.textContent || "";
				const contentEncoded =
					item.querySelector("content\\:encoded")?.textContent || "";
				const date = item.querySelector("pubDate")?.textContent || "";
				const link = item.querySelector("link")?.textContent || "";

				// Use content:encoded if available, otherwise fall back to description
				const content = contentEncoded || description;

				// Check if we have the Bible Reading Plan (indicates full content)
				const hasBibleReadingPlan = content.includes("Bible Reading Plan:");

				// If content is truncated or missing Bible Reading Plan, try to fetch the full article
				let finalContent = content;
				if (!hasBibleReadingPlan || content.length < 1000) {
					try {
						const fullArticleContent = await fetchFullArticle(link, title);
						if (fullArticleContent) {
							finalContent = fullArticleContent;
						}
					} catch {
						// Ignore full-article fetch failures and continue with RSS excerpt
					}
				}

				// Extract Bible reference from content if available
				const referenceMatch = finalContent.match(/([A-Za-z]+\s+\d+:\d+)/);
				const reference = referenceMatch ? referenceMatch[1] : "";

				// Clean up the content (remove HTML tags but keep full content)
				const cleanContent = finalContent
					.replace(/<[^>]*>/g, "") // Remove all HTML tags
					.replace(/&nbsp;/g, " ") // Replace non-breaking spaces
					.replace(/&amp;/g, "&") // Replace ampersands
					.replace(/&lt;/g, "<") // Replace less than
					.replace(/&gt;/g, ">") // Replace greater than
					.replace(/&quot;/g, '"') // Replace quotes
					.replace(/&#8230;/g, "...") // Replace ellipsis
					.replace(/&#8217;/g, "'") // Replace right single quote
					.replace(/&#8216;/g, "'") // Replace left single quote
					.replace(/&#8220;/g, '"') // Replace left double quote
					.replace(/&#8221;/g, '"') // Replace right double quote
					.replace(/&#8211;/g, "–") // Replace en dash
					.replace(/&#8212;/g, "—") // Replace em dash
					.replace(/\n\s*\n/g, "\n\n") // Clean up multiple newlines
					.trim(); // Remove leading/trailing whitespace

				const devotionalData: Devotional = {
					title,
					content: cleanContent,
					date: new Date(date).toLocaleDateString("en-US", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
					reference,
					url: link,
				};

				setDevotional(devotionalData);
				setCachedDevotional(devotionalData);
			} else {
				throw new Error("No devotional found in RSS feed");
			}
		} catch (err) {
			const fallback = {
				...fallbackDevotional,
				date: new Date().toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
			};
			setDevotional(fallback);
			setCachedDevotional(fallback);
			setError(
				err instanceof Error ? err.message : "Failed to fetch devotional",
			);
			console.error("Error fetching devotional:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDevotional();
	}, [fetchDevotional]);

	return {
		devotional,
		loading,
		error,
		refetch: () => fetchDevotional({ force: true }),
	};
};
