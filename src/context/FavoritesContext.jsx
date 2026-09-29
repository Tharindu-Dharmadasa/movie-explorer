import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getStorage, setStorage } from "../utils/storage";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const auth = useAuth(); // Get the current user from AuthContext

  // Each user gets their own list, e.g. "me_favorites_sam@mail.com"
  const storageKey = `me_favorites_${auth?.user?.email || "guest"}`;

  const [favorites, setFavorites] = useState(() => getStorage(storageKey, []));

  // Save to localStorage whenever the list changes.
  useEffect(() => setStorage(storageKey, favorites), [storageKey, favorites]);

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
