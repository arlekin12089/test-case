import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./test/utils";
import App from "./App";

it('renders the "Watch Later" link in the navigation bar', () => {
  renderWithProviders(<App />);
  const linkElement = screen.getByRole("link", { name: /watch later/i });
  expect(linkElement).toBeInTheDocument();
});

it("searches for movies and displays the movie in the search results", async () => {
  renderWithProviders(<App />);
  await userEvent.type(screen.getByTestId("search-movies"), "forrest gump");
  await waitFor(() => {
    expect(
      screen.getByText("Through the Eyes of Forrest Gump")
    ).toBeInTheDocument();
  });
  const viewTrailerBtn = screen.getByText("View Trailer");
  await userEvent.click(viewTrailerBtn);
  await waitFor(() => {
    expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
  });
});

it('renders the "Watch Later" component', async () => {
  renderWithProviders(<App />);
  const watchLaterLink = screen.getByRole("link", { name: /watch later/i });
  await userEvent.click(watchLaterLink);
  expect(
    screen.getByText(/You have no movies saved to watch later/i)
  ).toBeInTheDocument();
});

it('renders the "Starred" component', async () => {
  renderWithProviders(<App />);
  const starredLink = screen.getByTestId("nav-starred");
  await userEvent.click(starredLink);
  expect(screen.getByText(/There are no starred movies/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByTestId("starred")).toBeInTheDocument();
  });
});
