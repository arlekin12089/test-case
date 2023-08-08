import { createSlice } from "@reduxjs/toolkit";

const starredSlice = createSlice({
  name: "starred",
  initialState: {
    starredMovies: [],
  },
  reducers: {
    addStarredMovie: (state, action) => {
      state.starredMovies = [action.payload, ...state.starredMovies];
    },
    removeStarredMovie: (state, action) => {
      const indexOfMovie = state.starredMovies.findIndex(
        (movie) => movie.id === action.payload.id
      );
      if (indexOfMovie !== -1) {
        //only performs splice when a movie is found.
        state.starredMovies.splice(indexOfMovie, 1);
      }
    },
    removeAllStarredMovies: (state) => {
      state.starredMovies = [];
    },
  },
});

export default starredSlice;
