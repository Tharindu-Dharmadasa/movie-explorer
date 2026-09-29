import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getStorage, setStorage } from "../utils/storage";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() =>
    getStorage("me_favorites", []),
  );

  // Save to localStorage whenever the list changes.
  useEffect(() => setStorage("me_favorites", favorites), [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [
            // Store only the fields we need (keeps localStorage small).
            ...prev,
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
            },
          ],
    );
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
