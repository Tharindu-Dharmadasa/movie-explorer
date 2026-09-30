# Testing

## Automated tests

Tools: Jest and React Testing Library (included with Create React App).

```bash
npm test                          # watch mode; press "a" to run all tests
CI=true npm test                  # run once and exit (macOS / Linux / Git Bash)
$env:CI="true"; npm test          # run once and exit (Windows PowerShell)
```

### What is covered

| File | Tests |
|---|---|
| `src/utils/formatters.test.js` | `getYear`, `formatRating`, and `formatRuntime` including missing values |
| `src/components/movies/MovieCard.test.jsx` | Card shows title, year, and rating; clicking the heart toggles the favorite and saves it in localStorage |

**Result:** 2 test suites, 5 tests, all passing.

### Notes
- Tests avoid importing the axios layer, which keeps them fast and avoids a known Jest/ESM issue with axios in Create React App.

## Build check

Vercel builds with `CI=true`, which turns lint warnings into errors. Check locally before deploying:

```powershell
$env:CI="true"; npm run build
```
Expected: `Compiled successfully.`

## Manual test checklist

Run through this on the **live site in an incognito window**, and again on a phone.

### Authentication
- [ ] Sign up with valid details → lands on Home
- [ ] Sign up with an existing email → "account already exists" message
- [ ] Empty fields, bad email, short password, mismatched passwords → validation messages and the form shakes
- [ ] Sign out, then sign in with the same account → works
- [ ] Wrong password → "Invalid email or password."
- [ ] "Try demo account" → logs in immediately
- [ ] Visiting `/` while logged out → redirected to `/login`
- [ ] Visiting `/login` while logged in → redirected to Home

### Home, trending, and search
- [ ] Trending shows 18 posters with title, year, and rating
- [ ] Typing in search waits until you stop typing, then shows results
- [ ] Scrolling loads more results with no duplicates
- [ ] Clearing the search returns to trending
- [ ] A nonsense search shows the "No movies found" message
- [ ] Refresh → the last search and its results come back

### Filters and pagination
- [ ] Genre only, year only, and rating only each change the results
- [ ] Text + filters together give sensible results
- [ ] "Clear filters" resets everything
- [ ] "Use Load More button" switches to a button that loads the next page

### Details
- [ ] Clicking a card opens `/movie/:id` with poster, overview, genres, runtime, and rating
- [ ] Cast row shows photos and names
- [ ] The trailer plays; a movie without a trailer shows "No trailer available."
- [ ] Back button works
- [ ] Refreshing `/movie/550` still loads (not a 404)

### Favorites
- [ ] Heart on a card and on the details page both update the same list
- [ ] `/favorites` shows saved movies; removing one removes it immediately
- [ ] Empty list shows the empty state with a link to discover movies
- [ ] Refresh → favorites persist
- [ ] A **second account** sees its own empty list, and the first account's list is unchanged after logging back in

### Errors
- [ ] DevTools > Network > Offline, then search → friendly error with Retry
- [ ] Back online, click Retry → results load
- [ ] Open `/movie/999999999` → error message with Retry / Go back
- [ ] Unknown URL such as `/abc` → 404 page

### Appearance and responsiveness
- [ ] Light and dark mode on every page, including the details page text
- [ ] Theme choice survives a refresh
- [ ] Widths 360px, 768px, 1280px → no horizontal scrolling
- [ ] Login page animations run; browser console has no errors

### Storage keys to look for (DevTools > Application > Local Storage)
`me_theme`, `me_user`, `me_users`, `me_favorites_<email>`, `me_last_search_<email>`, `me_manual_load`
