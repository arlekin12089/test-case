import starredSlice from "../data/starredSlice";
import { moviesMock } from "./movies.mocks";

describe("starredSlice test", () => {
  const initialState = { starredMovies: [] };

  it("should set the initial state", () => {
    const action = { type: "" };
    const result = starredSlice.reducer(initialState, action);
    expect(result).toEqual(initialState);
  });

  it("should add a movie to starred", () => {
    const action = starredSlice.actions.addStarredMovie(moviesMock[0]);
    const result = starredSlice.reducer(initialState, action);
    expect(result.starredMovies).toContain(moviesMock[0]);
  });

  it("should remove a movie from starred", () => {
    const stateWithMovies = { starredMovies: moviesMock };
    const action = starredSlice.actions.removeStarredMovie(moviesMock[0]);
    const result = starredSlice.reducer(stateWithMovies, action);
    expect(result.starredMovies).not.toContain(moviesMock[0]);
  });

  it("should remove all movies from starred", () => {
    const stateWithMovies = { starredMovies: moviesMock };
    const action = starredSlice.actions.removeAllStarredMovies();
    const result = starredSlice.reducer(stateWithMovies, action);
    expect(result.starredMovies).toEqual([]);
  });
});
