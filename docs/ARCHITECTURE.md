# Architecture

This document explains how Movie Explorer is organized and why.

## 1. Overview

```
┌───────────────────────────── Browser ─────────────────────────────┐
│                                                                   │
│  Pages                Components              Hooks               │
│  ─ LoginPage          ─ Navbar                ─ useDebounce       │
│  ─ HomePage           ─ SearchBar             ─ useInfiniteScroll │
│  ─ MovieDetailsPage   ─ FilterBar                                 │
│  ─ FavoritesPage      ─ MovieCard / MovieGrid                     │
│  ─ NotFoundPage       ─ CastList / TrailerPlayer                  │
│         │             ─ Loader / ErrorMessage / PosterWall        │
│         ▼                                                         │
│  ┌──────────────────── Context layer ──────────────────────────┐  │
│  │ ThemeContext │ AuthContext │ FavoritesContext │ MovieContext│  │
│  └──────────────────────────┬──────────────────────────────────┘  │
│                             │                                     │
│                     ┌───────▼────────┐        ┌────────────────┐  │
│                     │ movieService   │        │  localStorage  │  │
│                     │ (api layer)    │        │ (utils/storage)│  │
│                     └───────┬────────┘        └────────────────┘  │
│                             │ axios + interceptor                 │
└─────────────────────────────┼─────────────────────────────────────┘
                              ▼
                       TMDb REST API v3
```

**Rule:** components never call axios directly.
`Component → Context / hook → movieService → axios → TMDb`

This keeps components simple, makes the API easy to change, and makes code easy to test.

## 2. Folder structure

```
src/
├── api/
│   ├── tmdb.js               # axios instance (base URL, API key, error interceptor)
│   └── movieService.js       # getTrending, searchMovies, discoverMovies, getMovieDetails, getGenres
├── components/
│   ├── auth/PosterWall.jsx   # animated poster background for the login page
│   ├── common/               # Loader (skeletons), ErrorMessage (with Retry)
│   ├── layout/               # Navbar, ProtectedRoute
│   ├── movies/               # MovieCard, MovieGrid, CastList, TrailerPlayer
│   └── search/               # SearchBar, FilterBar
├── context/
│   ├── ThemeContext.jsx      # light/dark mode + MUI theme
│   ├── AuthContext.jsx       # register, login, demo login, logout
│   ├── FavoritesContext.jsx  # per-user favorites
│   └── MovieContext.jsx      # trending, search, filters, pagination
├── hooks/
│   ├── useDebounce.js
│   └── useInfiniteScroll.js
├── pages/                    # one component per route
├── utils/
│   ├── storage.js            # safe localStorage wrappers
│   ├── imageUrl.js           # builds TMDb image URLs, with placeholder fallback
│   └── formatters.js         # getYear, formatRating, formatRuntime
├── App.js                    # providers + routes
└── index.js
```

## 3. Routes

| Path         | Page                                 | Access                                        |
| ------------ | ------------------------------------ | --------------------------------------------- |
| `/login`     | LoginPage (sign in / sign up / demo) | Public. Redirects to `/` if already logged in |
| `/`          | HomePage: trending, search, filters  | Protected                                     |
| `/movie/:id` | MovieDetailsPage                     | Protected                                     |
| `/favorites` | FavoritesPage                        | Protected                                     |
| `*`          | NotFoundPage                         | Public                                        |

`ProtectedRoute` redirects to `/login` when there is no logged-in user.

## 4. State management

The app uses the React Context API. The state is small and mostly independent, so Redux would add boilerplate without benefit.

| Context          | Holds                                                                             | Persisted in localStorage                  |
| ---------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| ThemeContext     | `mode`, `toggleTheme`                                                             | `me_theme`                                 |
| AuthContext      | `user`, `register`, `login`, `loginDemo`, `logout`                                | `me_user` (session), `me_users` (accounts) |
| FavoritesContext | `favorites`, `toggleFavorite`, `isFavorite`                                       | `me_favorites_<email>`                     |
| MovieContext     | trending, `query`, `filters`, `results`, `page`, `totalPages`, `loading`, `error` | `me_last_search_<email>`                   |

Another preference, the Load More toggle, is stored in `me_manual_load`.

### Per-user data

`UserScopedProviders` in `App.js` wraps `FavoritesProvider` and `MovieProvider` with `key={user email}`. When the user changes, React remounts them, so their in-memory state is rebuilt from that user's own storage keys. Without this, one account's favorites would show up in another account's session.

## 5. Key data flows

### Search with infinite scroll

```
User types → SearchBar (local state)
   → useDebounce (500ms) → MovieContext.setQuery(q)
   → effect: clear results, page = 0, fetchPage(q, filters, 1)
        request id++ ; call searchMovies or discoverMovies
        if a newer request started meanwhile → ignore this response
   → results set, totalPages stored
User scrolls → sentinel <div> enters view (IntersectionObserver)
   → loadMore() → fetchPage(..., page + 1) → results appended, duplicates removed by id
Stops when page >= totalPages
```

The observer is only active when: a search or filter is on, more pages exist, nothing is loading, and there's no error. That prevents duplicate requests and endless retry loops.

### Filters

| Situation              | Request                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| Filters only (no text) | `/discover/movie` with `with_genres`, `primary_release_year`, `vote_average.gte` |
| Text + filters         | `/search/movie` (with `year`), then genre and rating are filtered in the browser |

### Authentication (mock)

```
Sign up → validate form → hash(email:password) with SHA-256
        → save { name, email, passwordHash } in me_users → start session (me_user)
Sign in → find user by email → compare hashes → start session
Demo    → create the demo account if missing, then sign in
```

### Movie details

```
Card click → /movie/:id → getMovieDetails(id)
   GET /movie/{id}?append_to_response=videos,credits    (one request, not three)
   → render info, CastList (first 10), TrailerPlayer (first YouTube "Trailer")
```

## 6. Error handling

An axios response interceptor converts errors to readable messages:

| Situation             | Message                                                          |
| --------------------- | ---------------------------------------------------------------- |
| No response (offline) | "Can't reach the server. Please check your internet connection." |
| 401                   | "Invalid API key. Please check your configuration."              |
| 404                   | "We couldn't find what you were looking for."                    |
| 429                   | "Too many requests. Please wait a moment and try again."         |
| 5xx                   | "The movie service is having problems. Try again later."         |

Every screen has three states: **loading** (skeletons), **error** (message + Retry), and **empty** (helpful text). Missing posters fall back to a placeholder image, and a missing trailer shows "No trailer available."

## 7. Styling and responsiveness

- MUI with a custom theme (Inter font, red accent, rounded shapes) for light and dark modes.
- The movie grid is a CSS grid with responsive columns: 2 (phones), 3, 4, 5, 6 (large screens).
- The login page uses its own always-dark theme and CSS keyframe animations, disabled for users who prefer reduced motion.

## 8. Design decisions (and why)

1. **Service layer:** all HTTP in one folder, so an API change touches one place.
2. **Context over Redux:** small state, few consumers.
3. **Debounce:** avoids a request per keystroke.
4. **IntersectionObserver:** cheaper and simpler than scroll listeners.
5. **Request IDs:** stop slow, outdated responses from overwriting newer results.
6. **`append_to_response`:** one request for details, cast, and videos.
7. **Safe storage helpers:** `try/catch` around localStorage so private mode or corrupt data can't crash the app.
8. **Env variables:** the key is not committed. `.env.example` documents what is needed.

## 9. Known limitations

- No backend, so authentication is simulated and the API key is visible in the browser bundle.
- Data is stored per browser and is not synced.
- TMDb limits pagination to 500 pages.
