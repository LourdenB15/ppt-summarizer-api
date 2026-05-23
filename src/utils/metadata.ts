export function calculateMetadata(summary: string, summaryTimeMs: number) {
  const words = summary.trim().split(/\s+/).length;
  const sentences = summary.split(/[.!?]+/).filter(Boolean).length;
  const readingTime = Math.ceil(words / 200);

  return {
    wordCount: words,
    sentences,
    readingTime: `~${readingTime} mins`,
    summaryTime: `${(summaryTimeMs / 1000).toFixed(1)}s`,
  };
}
