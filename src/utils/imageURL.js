const IMAGE_BASE =
  process.env.REACT_APP_TMDB_IMAGE_URL || "https://image.tmdb.org/t/p";

export const posterUrl = (path, size = "w500") =>
  path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder.svg";

export const backdropUrl = (path) =>
  path ? `${IMAGE_BASE}/w1280${path}` : null;

export const profileUrl = (path) =>
  path ? `${IMAGE_BASE}/w185${path}` : "/placeholder.svg";
