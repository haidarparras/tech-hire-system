export function recommendationStyle(recommendation) {
  switch (recommendation) {
    case "Direkomendasikan":
      return {
        bg: "#052e16",
        color: "#22c55e",
        border: "#166534",
      };

    case "Perlu review":
      return {
        bg: "#451a03",
        color: "#f59e0b",
        border: "#92400e",
      };

    case "Tidak lolos":
      return {
        bg: "#450a0a",
        color: "#ef4444",
        border: "#991b1b",
      };

    default:
      return {
        bg: "#1f2937",
        color: "#9ca3af",
        border: "#374151",
      };
  }
}
