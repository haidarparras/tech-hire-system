import { useState, useEffect, useMemo } from "react";
import { MOCK_CANDIDATES } from "../mocks/candidates";

export function useCandidates(tab = "semua", search = "", sort = "skor") {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading with 1 second delay
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, []);

  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((candidate) => {
      if (tab === "direkomendasikan") {
        return candidate.recommendation === "Direkomendasikan";
      }

      if (tab === "review") {
        return candidate.recommendation === "Perlu review";
      }

      return true;
    })
      .filter((candidate) =>
        candidate.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "skor") {
          return b.score - a.score;
        }

        return a.name.localeCompare(b.name);
      });
  }, [tab, search, sort]);

  const stats = useMemo(() => {
    const totalCandidates = MOCK_CANDIDATES.length;

    const passedCandidates = MOCK_CANDIDATES.filter(
      (candidate) => candidate.recommendation === "Direkomendasikan",
    ).length;

    const averageScore = Math.round(
      MOCK_CANDIDATES.reduce((sum, candidate) => sum + candidate.score, 0) /
        totalCandidates,
    );

    return {
      totalCandidates,
      passedCandidates,
      averageScore,
    };
  }, []);

  return {
    loading,
    candidates: filteredCandidates,
    stats,
  };
}
