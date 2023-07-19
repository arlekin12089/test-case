import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header", () => {
  it("renders the header with navigation links", () => {
    render(
      <MemoryRouter>
        <Header searchMovies={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Starred")).toBeInTheDocument();
    expect(screen.getByText("Watch Later")).toBeInTheDocument();
  });

  it("invokes searchMovies with empty query when clicking home link", () => {
    const searchMovies = jest.fn();
    render(
      <MemoryRouter>
        <Header searchMovies={searchMovies} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText("Home");
    fireEvent.click(homeLink);

    expect(searchMovies).toHaveBeenCalledWith("");
  });

  it("invokes searchMovies with entered query when typing in search input", () => {
    const searchMovies = jest.fn();
    render(
      <MemoryRouter>
        <Header searchMovies={searchMovies} />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId("search-movies");
    fireEvent.change(searchInput, { target: { value: "forrest gump" } });

    expect(searchMovies).toHaveBeenCalledWith("forrest gump");
  });
});
