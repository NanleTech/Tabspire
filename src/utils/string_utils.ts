/**
 * Removes admin metadata from devotional content
 */
export const cleanDevotionalContent = (content: string): string => {
  let cleaned = content;
  
  // Remove admin metadata patterns (like "Conviction 44 minutes ago FOR THE CAUSE OF CHRIST by admin 0 0")
  // Look for patterns that start with a word and end with "by admin" followed by numbers
  cleaned = cleaned.replace(/^[^"]*?by admin\s+\d+\s+\d+/, '');
  
  // Alternative: Remove everything from the start until we find a quote or meaningful content
  // This handles cases where the admin metadata doesn't end with "by admin"
  if (cleaned.trim().startsWith('But what things') || cleaned.trim().startsWith('"')) {
    // If we still have admin metadata, try a different approach
    const firstQuoteIndex = cleaned.indexOf('"');
    if (firstQuoteIndex !== -1) {
      cleaned = cleaned.substring(firstQuoteIndex);
    } else {
      // If no quote found, look for the first meaningful sentence
      const meaningfulStart = cleaned.search(/[A-Z][^.]*\./);
      if (meaningfulStart !== -1) {
        cleaned = cleaned.substring(meaningfulStart);
      }
    }
  }
  
  // Remove everything from "Tags:" to the end
  const tagsIndex = cleaned.indexOf('Tags:');
  if (tagsIndex !== -1) {
    cleaned = cleaned.substring(0, tagsIndex).trim();
  }
  
  return cleaned.trim();
};

/**
 * Extracts Bible reading plan from devotional content
 */
export const extractBibleReadingPlan = (content: string): { plan: string; cleanedContent: string } => {
  const bibleReadingMatch = content.match(/Bible Reading Plan:.*?(?=\n|$)/);
  
  if (bibleReadingMatch) {
    const plan = bibleReadingMatch[0].trim();
    const cleanedContent = content.replace(bibleReadingMatch[0], '').trim();
    return { plan, cleanedContent };
  }
  
  return { plan: '', cleanedContent: content };
};

/**
 * Creates a preview of content by finding natural break points
 */
export const createContentPreview = (content: string, targetLength = 200): { preview: string; hasMore: boolean } => {
  const previewEnd = content.indexOf('. ', targetLength);
  
  if (previewEnd !== -1) {
    const preview = content.substring(0, previewEnd + 1);
    return { preview, hasMore: true };
  }
  
  const preview = content.substring(0, 300);
  return { preview, hasMore: content.length > 300 };
};

/**
 * Parses Bible reference to extract book and chapter
 */
export const parseBibleReference = (reference: string): { book: string; chapter: number } | null => {
  const simpleMatch = reference.match(/^([A-Za-z]+)\s+(\d+)/);
  
  if (!simpleMatch) {
    return null;
  }
  
  const [, book, chapter] = simpleMatch;
  return {
    book: book.toLowerCase(),
    chapter: Number.parseInt(chapter, 10),
  };
};

/**
 * Creates YouVersion URL from Bible reference
 */
export const createYouVersionUrl = (reference: string): string => {
  const parsed = parseBibleReference(reference);
  
  if (!parsed) {
    return '';
  }
  
  return `https://www.youversion.com/bible/1/${parsed.book}.${parsed.chapter}`;
};

/**
 * Creates Bible Gateway URL from Bible reference
 */
export const createBibleGatewayUrl = (reference: string, version = 'NIV'): string => {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${version}`;
};
