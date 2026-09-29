import tmdb from "./tmdb";

// Each function returns response.data so components stay clean.

export const getTrending = async (page = 1) => {
  const { data } = await tmdb.get("/trending/movie/week", { params: { page } });
  return data; // page results
};

export const searchMovies = async (query, page = 1, year) => {
  const { data } = await tmdb.get("/search/movie", {
    params: { query, page, year: year || undefined }, // undefined params are skipped by axios
  });
  return data;
};

export const discoverMovies = async ({ genre, year, rating, page = 1 }) => {
  const { data } = await tmdb.get("/discover/movie", {
    params: {
      page,
      sort_by: "popularity.desc",
      with_genres: genre || undefined,
      primary_release_year: year || undefined,
      "vote_average.gte": rating || undefined,
      "vote_count.gte": rating ? 50 : undefined, // avoids 10/10 movies with 1 vote
    },
  });
  return data;
};

// One request returns details + trailers + cast.
export const getMovieDetails = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "videos,credits" },
  });
  return data;
};

export const getGenres = async () => {
  const { data } = await tmdb.get("/genre/movie/list");
  return data.genres; // [{ id, name }]
};
