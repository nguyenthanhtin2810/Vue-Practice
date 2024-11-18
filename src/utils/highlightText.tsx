export const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === query.toLowerCase();
    return isMatch
      ? `<span key="highlight-${index}" class="bg-yellow-300">${part}</span>`
      : `<span key="normal-${index}">${part}</span>`;
  }).join('');
};
