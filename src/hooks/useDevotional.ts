import { useState, useEffect, useCallback } from "react";
import type { Devotional } from "../types";

export const useDevotional = () => {
	const [devotional, setDevotional] = useState<Devotional | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDevotional = useCallback(async () => {
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
				const response = await fetch(proxyUrl + encodeURIComponent(url));

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
			const proxies = [
				"https://api.allorigins.win/raw?url=",
				"https://cors-anywhere.herokuapp.com/",
				"https://thingproxy.freeboard.io/fetch/",
			];

			let response: Response | null = null;
			let lastError: Error | null = null;

			for (const proxy of proxies) {
				try {
					const rssUrl = "https://t30.org/feed/";
					const fullUrl = proxy + encodeURIComponent(rssUrl);

					response = await fetch(fullUrl, {
						method: "GET",
						headers: {
							Accept: "application/xml, text/xml, */*",
						},
					});

					if (response.ok) {
						break; // Success, exit the loop
					}
				} catch (err) {
					lastError = err instanceof Error ? err : new Error("Proxy failed");
				}
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

				console.log("=== RSS FEED DEBUG ===");
				console.log("Title:", title);
				console.log("Link:", link);
				console.log("Description length:", description.length);
				console.log("Content encoded length:", contentEncoded.length);
				console.log("Final content length:", content.length);
				console.log("Content preview:", `${content.substring(0, 200)}...`);

				// Check if we have the Bible Reading Plan (indicates full content)
				const hasBibleReadingPlan = content.includes("Bible Reading Plan:");
				console.log("Has Bible Reading Plan:", hasBibleReadingPlan);

				// If content is truncated or missing Bible Reading Plan, try to fetch the full article
				let finalContent = content;
				if (!hasBibleReadingPlan || content.length < 1000) {
					console.log(
						"Content appears truncated, attempting to fetch full article...",
					);
					try {
						const fullArticleContent = await fetchFullArticle(link, title);
						if (fullArticleContent) {
							finalContent = fullArticleContent;
							console.log(
								"Successfully fetched full article, length:",
								fullArticleContent.length,
							);
						}
					} catch (err) {
						console.log("Failed to fetch full article:", err);
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

				console.log("Final cleaned content length:", cleanContent.length);
				console.log(
					"Final content ends with:",
					cleanContent.substring(cleanContent.length - 100),
				);
				console.log("=== END DEBUG ===");

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
			} else {
				throw new Error("No devotional found in RSS feed");
			}
		} catch (err) {
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

	return { devotional, loading, error, refetch: fetchDevotional };
};
