import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Routes,
  Route,
  useNavigate,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { fetchMovies, selectAllMovies } from "./data/moviesSlice";
import {
  ENDPOINT_SEARCH,
  ENDPOINT_DISCOVER,
  ENDPOINT,
  API_KEY,
} from "./api/index";
import Header from "./components/Header/index";
import Movies from "./components/Movies/index";
import Starred from "./components/Starred/index";
import WatchLater from "./components/WatchLater/index";
import YouTubePlayer from "./components/Modal";
import "./app.scss";
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const App = () => {
  const allMovies = useSelector(selectAllMovies);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState(allMovies);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  useEffect(() => {
    if (location.pathname === "/") {
      setMovies(allMovies);
    }
  }, [location, allMovies]); // Re-run this effect when location or allMovies changes

  const closeCard = () => {
    setIsModalOpen(false);
  };
  // Fetch movies based on search query.
  const getSearchResults = useCallback(
    debounce((query) => {
      if (query !== "") {
        const endpoint = `${ENDPOINT_SEARCH}&query=${query}`;
        setMovies([]); // Clear movies before new search
        dispatch(fetchMovies({ apiUrl: endpoint, page: 1 }))
          .then((response) => {
            if (response.payload && response.payload.movies.length > 0) {
              setMovies(response.payload.movies); // Set current movies to search results
            }
          })
          .catch((err) => setError(err.message));
        setSearchParams(createSearchParams({ search: query }));
      } else {
        setMovies([]); // Don't display any movies
        setSearchParams();
      }
    }, 500), // Debounce time of 500ms
    [dispatch, setSearchParams]
  );

  // Fetch movie and video details then set video key.
  const getMovie = useCallback(async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;
    try {
      const response = await fetch(URL);
      if (!response.ok) throw new Error("Error fetching movie details");

      const videoData = await response.json();

      if (videoData.videos && videoData.videos.results.length > 0) {
        const trailer = videoData.videos.results.find(
          (video) => video.type === "Trailer"
        );
        setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
      } else {
        throw new Error("No trailer found for this movie");
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const viewTrailer = useCallback(
    (movie) => {
      getMovie(movie.id);
      setIsModalOpen(true);
    },
    [getMovie]
  );
  // Search for movies based on a query.
  const searchMovies = useCallback(
    debounce((query) => {
      navigate("/");
      getSearchResults(query);
    }, 300), // Debounce time in ms
    [navigate, getSearchResults]
  );

  const getMovies = useCallback(() => {
    if (searchQuery) {
      dispatch(
        fetchMovies({
          apiUrl: `${ENDPOINT_SEARCH}&query=${searchQuery}`,
          page: 1,
        })
      )
        .then((response) => {
          // Check if no movies were found
          if (response.payload && response.payload.movies.length === 0) {
            setError("No movies found for the provided search.");
          } else {
            setMovies(response.payload.movies); // Set current movies to search results
            setError(null);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      dispatch(fetchMovies({ apiUrl: ENDPOINT_DISCOVER })).then((response) => {
        // Check if no movies were found
        if (response.payload && response.payload.movies.length === 0) {
          setError("No movies found.");
        } else {
          setMovies(response.payload.movies); // Set current movies to discovered movies
          setError(null);
        }
      });
    }
  }, [searchQuery, dispatch]);
  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className="container">
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <YouTubePlayer
                videoKey={videoKey}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Movies
                movies={movies}
                viewTrailer={viewTrailer}
                closeCard={closeCard}
              />
            }
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
};
export default App;
