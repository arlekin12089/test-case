import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { API_KEY, ENDPOINT } from "../api";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ apiUrl, page }, { rejectWithValue }) => {
    const response = await fetch(`${apiUrl}&page=${page}`);
    if (!response.ok) {
      return rejectWithValue(response.statusText);
    }
    const data = await response.json();
    return { movies: data.results, totalPages: data.total_pages };
  }
);

const moviesAdapter = createEntityAdapter({
  selectId: (movie) => movie.id, // Ensure the correct ID field
  sortComparer: (a, b) => b.vote_average - a.vote_average, // Sort by vote_average
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: moviesAdapter.getInitialState({
    fetchStatus: "idle",
    currentPage: 1,
    totalPages: 0,
    error: null,
    searchQuery: "",
  }),
  reducers: {
    resetMovies: moviesAdapter.getInitialState,
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        moviesAdapter.upsertMany(state, action.payload.movies);
        state.currentPage += 1;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Create the selectors
const {
  selectAll: selectAllMovies,
  selectById: selectMovieById,
  // pass in a selector that returns the posts slice of state
} = moviesAdapter.getSelectors((state) => state.movies);

export { selectAllMovies, selectMovieById };

export default moviesSlice;
