import Movie from "../../components/Movie";
import PropTypes from "prop-types";
import "./styles.scss";
import { Link } from "react-router-dom";
import ghost from "../../assets/ghost.svg";

const Movies = ({ movies, viewTrailer, closeCard }) => {
  return (
    <div data-testid="movies">
      {movies.length === 0 ? (
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
      ) : (
        movies.movies.results?.map((movie) => (
          <Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />
        ))
      )}
    </div>
  );
};

Movies.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewTrailer: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
};
export default Movies;
