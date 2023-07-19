import Movie from "../../components/Movie";
import PropTypes from "prop-types";
import "./styles.scss";

const Movies = ({ movies, viewTrailer, closeCard }) => {
  return (
    <div data-testid="movies">
      {movies.length === 0 ? (
        <p>Sorry, there are no movies found for the search query.</p>
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
