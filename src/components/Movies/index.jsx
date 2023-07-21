import React from "react";
import Movie from "../../components/Movie";
import PropTypes from "prop-types";
import "./styles.scss";
import { Link } from "react-router-dom";
import ghost from "../../assets/ghost.svg";

const Movies = ({ movies, viewTrailer, closeCard }) => {
  const { results } = movies.movies;

  if (results.length === 0) {
    return (
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
    );
  }

  return (
    <div data-testid="movies" className="movies">
      {results.map((movie) => (
        <Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />
      ))}
    </div>
  );
};

Movies.propTypes = {
  movies: PropTypes.object.isRequired,
  viewTrailer: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
};

export default Movies;
