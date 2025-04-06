// Helper function for truncation
export const truncateUrl = (url: string, maxLength = 60): string => {
  if (url.length <= maxLength) {
    return url;
  }
  const start = url.substring(0, maxLength / 2);
  const end = url.substring(url.length - maxLength / 2);
  return `${start}...${end}`;
};