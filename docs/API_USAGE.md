# API Usage

Movie Explorer uses the [TMDb API v3](https://developers.themoviedb.org/3). All calls are made from `src/api/movieService.js` using the shared axios instance in `src/api/tmdb.js`.

## Configuration

| Variable | Value | Purpose |
|---|---|---|
| `REACT_APP_TMDB_API_KEY` | your v3 key | Sent as the `api_key` query parameter on every request |
| `REACT_APP_TMDB_BASE_URL` | `https://api.themoviedb.org/3` | Base URL |
| `REACT_APP_TMDB_IMAGE_URL` | `https://image.tmdb.org/t/p` | Base URL for posters and photos |

Default parameters added to every request: `api_key`, `language=en-US`. Requests time out after 10 seconds.

## Endpoints

### Trending movies
`GET /trending/movie/week`

| Param | Used for |
|---|---|
| `page` | Page number (1 by default) |

The app requests page 1 and keeps the first **18** results.

### Search movies
`GET /search/movie`

| Param | Used for |
|---|---|
| `query` | The text typed in the search bar |
| `page` | Page number for infinite scroll / Load More |
| `year` | Optional release year from the filter bar |

Search cannot filter by genre or rating, so those two filters are applied in the browser on the returned results.

### Discover (filters)
`GET /discover/movie`

| Param | Filter |
|---|---|
| `with_genres` | Genre ID |
| `primary_release_year` | Year |
| `vote_average.gte` | Minimum rating |
| `vote_count.gte` | Set to 50 when a rating filter is used, so movies with one or two votes don't dominate |
| `sort_by` | `popularity.desc` |
| `page` | Page number |

Used when filters are active and the search box is empty.

### Movie details, cast and trailers
`GET /movie/{id}?append_to_response=videos,credits`

One request returns everything for the details page:

| Field | Shown as |
|---|---|
| `title`, `tagline`, `overview` | Heading and description |
| `release_date` | Year |
| `runtime` | "2h 15m" |
| `vote_average` | Rating chip |
| `genres[]` | Genre chips |
| `poster_path`, `backdrop_path` | Images |
| `credits.cast[]` | Top 10 cast (photo, name, character) |
| `videos.results[]` | First entry where `site === "YouTube"` and `type === "Trailer"` |

### Genre list
`GET /genre/movie/list`

Returns `{ genres: [{ id, name }] }`. Populates the genre dropdown.

## Response shape for lists

```json
{
  "page": 1,
  "results": [
    { "id": 550, "title": "Fight Club", "poster_path": "/abc.jpg",
      "release_date": "1999-10-15", "vote_average": 8.4, "genre_ids": [18, 53] }
  ],
  "total_pages": 500,
  "total_results": 10000
}
```

## Images

| Use | URL pattern |
|---|---|
| Poster (cards, details) | `https://image.tmdb.org/t/p/w500{poster_path}` |
| Login poster wall | `.../w342{poster_path}` |
| Backdrop | `.../w1280{backdrop_path}` |
| Cast photo | `.../w185{profile_path}` |
| Missing image | `/placeholder.svg` (local file) |

## Trailer embed
`https://www.youtube.com/embed/{video.key}` inside a responsive 16:9 iframe.

## Error handling

An axios interceptor maps failures to friendly messages:

| Case | Message shown |
|---|---|
| No response | Can't reach the server. Please check your internet connection. |
| 401 | Invalid API key. Please check your configuration. |
| 404 | We couldn't find what you were looking for. |
| 429 | Too many requests. Please wait a moment and try again. |
| 5xx | The movie service is having problems. Try again later. |
| Other | Something went wrong. Please try again. |

Screens show these messages with a **Retry** button.

## Limits and notes

- Search input is debounced (500ms) and outdated responses are ignored, to keep the number of calls low.
- The API key is sent from the browser, so it is visible in network requests. For production it should be moved behind a backend proxy.

