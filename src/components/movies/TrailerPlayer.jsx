import { Box, Typography } from "@mui/material";

export default function TrailerPlayer({ videos = [] }) {
  // Prefer an official YouTube "Trailer", otherwise any YouTube video.
  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube");

  if (!trailer) {
    return (
      <Typography color="text.secondary">No trailer available.</Typography>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        pt: "56.25%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* 56.25% padding = 16:9 responsive box */}
      <iframe
        title={trailer.name}
        src={`https://www.youtube.com/embed/${trailer.key}`}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </Box>
  );
}
