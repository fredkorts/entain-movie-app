import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMovieDetail } from "../api/moviesApi";
import type { MovieDetail } from "../api/types";

export function useMovieDetail(id: string | undefined) {
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!id) return;
    
    let active = true;
    setLoading(true);
    setError(null);
    
    fetchMovieDetail(id)
      .then(movieData => {
        if (active) {
          setData(movieData);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || t("failed_to_load"));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    
    return () => {
      active = false;
    };
  }, [id, t, i18n.language]);

  return { data, loading, error };
}