import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies } from "../../data/moviesSlice";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { API_KEY, ENDPOINT } from "../../api/index";
import Movie from "../../components/Movie";
import PropTypes from "prop-types";
import "./styles.scss";
import { Link } from "react-router-dom";
import ghost from "../../assets/ghost.svg";
const Movies = ({ movies, viewTrailer, closeCard }) => {
  const dispatch = useDispatch();
  const fetchStatus = useSelector((state) => state.movies.fetchStatus);
  const currentPage = useSelector((state) => state.movies.currentPage);

  const fetchMoreMovies = () => {
    const apiUrl = `${ENDPOINT}/discover/movie?api_key=${API_KEY}&sort_by=vote_count.desc`;
    dispatch(fetchMovies({ apiUrl, page: currentPage }));
  };

  const lastElementRef = useInfiniteScroll(fetchMoreMovies);
  console.log(lastElementRef, "sccroll");
  console.log(movies, "from app");
  return (
    <div>
      {movies.length === 0 && fetchStatus !== "loading" ? (
        <div className="no-trailer-message">
          <h2>
            4
            <span>
              <img src={ghost} alt={ghost} />
            </span>
            4
          </h2>
          <h3>Ooops!</h3>
          <p>No trailer available for this movie.</p>
          <Link to="/" data-testid="home" className="btn btn-light">
            Back to home
          </Link>
        </div>
      ) : (
        <div data-testid="movies" className="movies">
          {movies.map((movie, index) => {
            if (movies.length === index + 1) {
              return (
                <div ref={lastElementRef} key={movie.id}>
                  <Movie
                    movie={movie}
                    viewTrailer={viewTrailer}
                    closeCard={closeCard}
                  />
                </div>
              );
            } else {
              return (
                <Movie
                  movie={movie}
                  key={movie.id}
                  viewTrailer={viewTrailer}
                  closeCard={closeCard}
                />
              );
            }
          })}
        </div>
      )}
      {fetchStatus === "loading" && <div>Loading...</div>}
      {fetchStatus === "error" && <div>Error loading movies.</div>}
    </div>
  );
};

Movies.propTypes = {
  viewTrailer: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
};

export default Movies;
