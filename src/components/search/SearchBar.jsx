import { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useDebounce from "../../hooks/useDebounce";
import { useMovies } from "../../context/MovieContext";

export default function SearchBar() {
  const { query, setQuery } = useMovies();
  const [input, setInput] = useState(query); // starts with the restored last search
  const debounced = useDebounce(input, 500);

  // Only update the global query after the user pauses typing.
  useEffect(() => {
    setQuery(debounced.trim());
  }, [debounced, setQuery]);

  return (
    <TextField
      fullWidth
      placeholder="Search for a movie..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: input && (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={() => setInput("")}
              edge="end"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
