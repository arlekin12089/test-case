import moviesSlice, { fetchMovies } from "../data/moviesSlice";
import { moviesMock } from "./movies.mocks";

describe("MovieSlice test", () => {
  it('should set loading to "loading" while action is pending', () => {
    const action = { type: fetchMovies.pending };
    const initialState = moviesSlice.reducer(
      { movies: [], fetchStatus: "" },
      action
    );
    expect(initialState.fetchStatus).toBe("loading");
  });

  it('should set movies and fetchStatus to "success" when action is fulfilled', () => {
    const action = {
      type: fetchMovies.fulfilled,
      payload: moviesMock,
    };
    const initialState = moviesSlice.reducer(
      { movies: [], fetchStatus: "" },
      action
    );
    expect(initialState.movies).toEqual(moviesMock);
    expect(initialState.fetchStatus).toBe("success");
  });

  it('should set fetchStatus to "error" when action is rejected', () => {
    const action = { type: fetchMovies.rejected };
    const initialState = moviesSlice.reducer(
      { movies: [], fetchStatus: "" },
      action
    );
    expect(initialState.fetchStatus).toBe("error");
  });
});
