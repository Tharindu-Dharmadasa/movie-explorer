import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "./MovieCard";
import { FavoritesProvider } from "../../context/FavoritesContext";

const movie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/x.jpg",
  release_date: "2020-01-01",
  vote_average: 8.2,
};

const renderCard = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <FavoritesProvider>
        <MovieCard movie={movie} />
      </FavoritesProvider>
    </MemoryRouter>,
  );

beforeEach(() => localStorage.clear());

test("shows title, year and rating", () => {
  renderCard();
  expect(screen.getByText("Test Movie")).toBeInTheDocument();
  expect(screen.getByText("2020")).toBeInTheDocument();
  expect(screen.getByText("8.2")).toBeInTheDocument();
});

test("toggles favorite and saves it to localStorage", () => {
  renderCard();
  fireEvent.click(screen.getByLabelText(/add to favorites/i));
  expect(screen.getByLabelText(/remove from favorites/i)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("me_favorites_guest"))).toHaveLength(
    1,
  );
});
