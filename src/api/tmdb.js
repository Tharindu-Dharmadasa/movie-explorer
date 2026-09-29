import axios from "axios";

// One shared axios instance: every request automatically includes the API key.
const tmdb = axios.create({
  baseURL: process.env.REACT_APP_TMDB_BASE_URL || "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: "en-US",
  },
  timeout: 10000,
});

// Turn technical errors into messages a user can understand.
tmdb.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    let message = "Something went wrong. Please try again.";
    if (!error.response) {
      message = "Can't reach the server. Please check your internet connection.";
    } else {
      const { status } = error.response;
      if (status === 401) message = "Invalid API key. Please check your configuration.";
      else if (status === 404) message = "We couldn't find what you were looking for.";
      else if (status === 429) message = "Too many requests. Please wait a moment and try again.";
      else if (status >= 500) message = "The movie service is having problems. Try again later.";
    }
    return Promise.reject(new Error(message));
  }
);

export default tmdb;