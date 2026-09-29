import { useEffect, useState } from "react";
import { InputAdornment, IconButton, OutlinedInput } from "@mui/material";
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
    <OutlinedInput
      fullWidth
      placeholder="Search for a movie..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      inputProps={{ "aria-label": "search movies" }}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon color="action" />
        </InputAdornment>
      }
      endAdornment={
        input ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              edge="end"
              onClick={() => setInput("")}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null
      }
    />
  );
}
