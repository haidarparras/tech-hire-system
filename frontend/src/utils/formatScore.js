export function formatScore(score) {
  if (score === null || score === undefined || isNaN(score)) {
    return '0%';
  }

  return `${Math.round(score)}%`;
}