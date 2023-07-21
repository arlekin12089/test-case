import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import starredSlice from "../../data/starredSlice";
import Movie from "../../components/Movie";
import "./styles.scss";

// Action destructuring for better readability.
const { removeAllStarredMovies } = starredSlice.actions;

const EmptyStarredMovieList = () => (
  <div className="text-center empty-cart">
    <i className="bi bi-star" />
    <p>There are no starred movies.</p>
    <p>
      Go to <Link to="/">Home</Link>
    </p>
  </div>
);

const StarredMovieList = ({ starredMovies, viewTrailer, onRemoveAll }) => (
  <div data-testid="starred-movies" className="starred-movies">
    <h2 className="header">Starred movies</h2>
    <div className="movies">
      {starredMovies.map((movie) => (
        <Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />
      ))}
    </div>
    <footer className="text-center">
      <button className="btn btn-primary" onClick={onRemoveAll}>
        Remove all starred
      </button>
    </footer>
  </div>
);

const Starred = ({ viewTrailer }) => {
  const { starred } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="starred" data-testid="starred">
      {starred.starredMovies.length > 0 ? (
        <StarredMovieList
          starredMovies={starred.starredMovies}
          viewTrailer={viewTrailer}
          onRemoveAll={() => dispatch(removeAllStarredMovies())}
        />
      ) : (
        <EmptyStarredMovieList />
      )}
    </div>
  );
};

export default Starred;
