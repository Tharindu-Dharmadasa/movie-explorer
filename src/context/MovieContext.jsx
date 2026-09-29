import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getTrending, searchMovies, discoverMovies } from "../api/movieService";
import { getStorage, setStorage } from "../utils/storage";

const MovieContext = createContext(null);

const DEFAULT_FILTERS = { genre: "", year: "", rating: 0 };
const cleanYear = (y) => (/^\d{4}$/.test(String(y)) ? String(y) : ""); // only valid 4-digit years

export function MovieProvider({ children }) {
  /* ---------- Trending ---------- */
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  const loadTrending = useCallback(async () => {
    setTrendingLoading(true);
    setTrendingError(null);
    try {
      const data = await getTrending();
      setTrending(data.results.slice(0, 18)); // only show top 18 trending movies
    } catch (e) {
      setTrendingError(e.message);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  /* ---------- Search + filters ---------- */
  const [query, setQuery] = useState(() => getStorage("me_last_search", "")); // restored from localStorage
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Used to ignore responses that arrive after a newer request was made (race condition).
  const requestId = useRef(0);

  const isSearchActive = useMemo(
    () =>
      Boolean(query) ||
      Boolean(filters.genre) ||
      Boolean(cleanYear(filters.year)) ||
      filters.rating > 0,
    [query, filters],
  );

  const fetchPage = useCallback(async (q, f, pageToLoad) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const year = cleanYear(f.year);
      let data;
      let items;

      if (q) {
        // /search/movie only supports `year`, so genre and rating are filtered here.
        data = await searchMovies(q, pageToLoad, year);
        items = data.results.filter(
          (m) =>
            (!f.genre || m.genre_ids?.includes(Number(f.genre))) &&
            (!f.rating || m.vote_average >= f.rating),
        );
      } else {
        data = await discoverMovies({
          genre: f.genre,
          year,
          rating: f.rating,
          page: pageToLoad,
        });
        items = data.results;
      }

      if (id !== requestId.current) return; // stale response, ignore

      // Append for page > 1, and remove duplicates by id.
      setResults((prev) => {
        const merged = pageToLoad === 1 ? items : [...prev, ...items];
        return Array.from(new Map(merged.map((m) => [m.id, m])).values());
      });
      setPage(data.page);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDb caps pagination at 500
    } catch (e) {
      if (id === requestId.current) setError(e.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Run a fresh search whenever the query or filters change.
  useEffect(() => {
    setResults([]);
    setPage(0);
    setTotalPages(1);
    setError(null);

    if (!isSearchActive) {
      requestId.current++; // cancel anything in flight
      setLoading(false);
      return;
    }
    fetchPage(query, filters, 1);
  }, [query, filters, isSearchActive, fetchPage]);

  // Persist the last searched movie name.
  useEffect(() => {
    setStorage("me_last_search", query);
  }, [query]);

  const hasMore = results.length > 0 && page < totalPages;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchPage(query, filters, page + 1);
  }, [loading, hasMore, fetchPage, query, filters, page]);

  const retry = useCallback(
    () => fetchPage(query, filters, page + 1),
    [fetchPage, query, filters, page],
  );

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const value = {
    trending,
    trendingLoading,
    trendingError,
    loadTrending,
    query,
    setQuery,
    filters,
    setFilters,
    clearFilters,
    results,
    loading,
    error,
    hasMore,
    isSearchActive,
    loadMore,
    retry,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}

export const useMovies = () => useContext(MovieContext);
