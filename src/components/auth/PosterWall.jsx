import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { getTrending } from "../../api/movieService";
import { posterUrl } from "../../utils/imageUrl";

const scrollUp = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
`;
const scrollDown = keyframes`
  from { transform: translateY(-50%); }
  to   { transform: translateY(0); }
`;

// If the request fails, it simply renders nothing and the gradient background remains.
export default function PosterWall() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    let active = true;
    getTrending()
      .then((data) => {
        if (active)
          setPosters(
            data.results.filter((m) => m.poster_path).map((m) => m.poster_path),
          );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (posters.length < 8) return null;

  // Split into 4 columns.
  const columns = [0, 1, 2, 3].map((i) =>
    posters.filter((_, index) => index % 4 === i),
  );

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: "-25%",
        display: "flex",
        justifyContent: "center",
        gap: 2,
        transform: "rotate(-8deg)",
        opacity: 0.4,
        pointerEvents: "none",
      }}
    >
      {columns.map((column, i) => (
        <Box
          key={i}
          sx={{
            width: { xs: 110, sm: 150, md: 190 },
            display: { xs: i > 2 ? "none" : "block", md: "block" },
            // Alternate direction and speed per column.
            animation: `${i % 2 ? scrollDown : scrollUp} ${42 + i * 9}s linear infinite`,
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          {/* Posters are listed twice so the loop is seamless (we scroll exactly half). */}
          {[...column, ...column].map((path, j) => (
            <Box
              key={j}
              component="img"
              src={posterUrl(path, "w342")}
              alt=""
              loading="lazy"
              sx={{ width: "100%", display: "block", borderRadius: 2, mb: 2 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
