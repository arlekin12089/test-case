import Movie from "../../components/Movie";
import PropTypes from "prop-types";
import "./styles.scss";
import { Link } from "react-router-dom";
import ghost from "../../assets/ghost.svg";

const Movies = ({ movies, viewTrailer, closeCard }) => {
  const results = movies.movies.results || [];

  return (
    <div>
      {results.length === 0 ? (
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
          {results.map((movie) => {
            return (
              <Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />
            );
          })}
        </div>
      )}
    </div>
  );
};

Movies.propTypes = {
  movies: PropTypes.shape({
    fetchStatus: PropTypes.string.isRequired,
    movies: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  viewTrailer: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
};

export default Movies;
