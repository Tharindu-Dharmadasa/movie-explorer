import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTrending } from "../api/movieService";

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  const loadTrending = useCallback(async () => {
    setTrendingLoading(true);
    setTrendingError(null);
    try {
      const data = await getTrending();
      setTrending(data.results);
    } catch (e) {
      setTrendingError(e.message);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  return (
    <MovieContext.Provider
      value={{ trending, trendingLoading, trendingError, loadTrending }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export const useMovies = () => useContext(MovieContext);
