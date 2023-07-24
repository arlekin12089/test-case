import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isCancelled = useRef(false);

  useEffect(() => {
    return () => {
      isCancelled.current = true;
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setMovies(allMovies);
    }
  }, [location, allMovies]);

  const closeCard = () => {
    setIsModalOpen(false);
  };

  const getSearchResults = useCallback(
    debounce((query) => {
      if (query !== "") {
        const endpoint = `${ENDPOINT_SEARCH}&query=${query}`;
        dispatch(fetchMovies({ apiUrl: endpoint, page: 1 }));
        setSearchParams(createSearchParams({ search: query }));
      }
    }, 500),
    [dispatch, setSearchParams]
  );

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

  const searchMovies = useCallback(
    debounce((query) => {
      navigate("/");
      getSearchResults(query);
    }, 300),
    [navigate, getSearchResults]
  );

  const getMovies = useCallback(() => {
    const endpoint = searchQuery
      ? `${ENDPOINT_SEARCH}&query=${searchQuery}`
      : ENDPOINT_DISCOVER;
    dispatch(fetchMovies({ apiUrl: endpoint, page: 1 }));
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
