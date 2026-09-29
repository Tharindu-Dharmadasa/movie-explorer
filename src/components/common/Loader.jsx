import { Box, Skeleton } from "@mui/material";
import { gridSx } from "../movies/MovieGrid";

// Skeleton cards look nicer than a spinner and avoid layout jumps.
export default function Loader({ count = 10 }) {
  return (
    <Box sx={gridSx}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i}>
          <Skeleton
            variant="rounded"
            sx={{ aspectRatio: "2/3", height: "auto", width: "100%" }}
          />
          <Skeleton width="80%" sx={{ mt: 1 }} />
          <Skeleton width="40%" />
        </Box>
      ))}
    </Box>
  );
}
