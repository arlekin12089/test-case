import React, { useEffect, useState, useCallback } from "react";
import {
  Routes,
  Route,
  createSearchParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "reactjs-popup/dist/index.css";
import { fetchMovies } from "./data/moviesSlice";
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
import { Link } from "react-router-dom";
import ghost from "./assets/ghost.svg";

const App = () => {
  const { movies } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const closeCard = () => {
    setIsModalOpen(false);
  };

  // Fetch movies based on search query.
  const getSearchResults = useCallback(
    (query) => {
      if (query !== "") {
        const endpoint = `${ENDPOINT_SEARCH}&query=${query}`;
        dispatch(fetchMovies(endpoint)).catch((err) => setError(err.message));
        setSearchParams(createSearchParams({ search: query }));
      } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER));
        setSearchParams();
      }
    },
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
    (query) => {
      navigate("/");
      getSearchResults(query);
    },
    [navigate, getSearchResults]
  );

  const getMovies = useCallback(() => {
    if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}`))
        .then((response) => {
          // Check if no movies were found
          if (response.payload.results.length === 0) {
            setError(
              <>
                <div className="no-trailer-message">
                  <h2>
                    4
                    <span>
                      <img src={ghost} />
                    </span>
                    4
                  </h2>
                  <h3>Ooops!</h3>
                  <p>No trailer available for this movie.</p>
                  <Link to="/" data-testid="home" className="btn btn-light">
                    Back to home
                  </Link>
                </div>
              </>
            );
          } else {
            setError(null);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER)).then((response) => {
        // Check if no movies were found
        if (response.payload.results.length === 0) {
          setError("No movies found.");
        } else {
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
