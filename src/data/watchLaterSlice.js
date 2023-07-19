import { createSlice } from "@reduxjs/toolkit";

const watchLaterSlice = createSlice({
  name: "watch-later",
  initialState: {
    watchLaterMovies: [],
  },
  reducers: {
    addToWatchLater: (state, action) => {
      state.watchLaterMovies = [action.payload, ...state.watchLaterMovies];
    },
    removeFromWatchLater: (state, action) => {
      const movieIndex = state.watchLaterMovies.findIndex(
        (movie) => movie.id === action.payload.id
      );
      // Only try to remove the movie if it's found in the array
      if (movieIndex !== -1) {
        state.watchLaterMovies.splice(movieIndex, 1);
      }
    },
    clearWatchLater: (state) => {
      // Remove all movies from the array
      state.watchLaterMovies = [];
    },
  },
});

export default watchLaterSlice;
