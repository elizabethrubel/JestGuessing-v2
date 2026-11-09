const thumbnailCache = new Map<string, string | null>();

export async function fetchWikipediaThumbnail(wikiSlug: string): Promise<string | null> {
  if (!wikiSlug) return null;
  
  if (thumbnailCache.has(wikiSlug)) {
    return thumbnailCache.get(wikiSlug) || null;
  }

  try {
    const encodedSlug = encodeURIComponent(wikiSlug.trim().replace(/ /g, '_'));
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodedSlug}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      thumbnailCache.set(wikiSlug, null);
      return null;
    }

    const data = await response.json();
    const sourceUrl = data.thumbnail?.source || data.originalimage?.source || null;
    thumbnailCache.set(wikiSlug, sourceUrl);
    return sourceUrl;
  } catch (err) {
    console.warn(`Wikipedia thumbnail fetch failed for ${wikiSlug}`, err);
    thumbnailCache.set(wikiSlug, null);
    return null;
  }
}
