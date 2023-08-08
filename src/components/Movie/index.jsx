import { useDispatch, useSelector } from "react-redux";
import starredSlice from "../../data/starredSlice";
import watchLaterSlice from "../../data/watchLaterSlice";
import placeholder from "../../assets/no-trailer.svg";

const Movie = ({ movie, viewTrailer }) => {
  const { id, overview, release_date, poster_path, title } = movie;
  const { starred, watchLater } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { addStarredMovie, removeStarredMovie } = starredSlice.actions;
  const { addToWatchLater, removeFromWatchLater } = watchLaterSlice.actions;

  const closeCardHandler = (e) => {
    // Ensure we have an event object
    e = e || window.e;
    e.stopPropagation();

    // Get the parent card element
    const cardElement = e.target.parentElement.parentElement;

    // Remove the 'opened' class from the card
    cardElement.classList.remove("opened");
  };

  return (
    <div className="wrapper">
      <div
        className="card"
        onClick={(e) => e.currentTarget.classList.add("opened")}
      >
        <div className="card-body text-center">
          <div className="overlay" />
          <div className="info_panel">
            <h6 className="title">{movie.title}</h6>
            <div className="overview">{movie.overview}</div>
            <div className="year">{movie.release_date?.substring(0, 4)}</div>
            {!starred.starredMovies
              .map((movie) => movie.id)
              .includes(movie.id) ? (
              <span
                className="btn-star"
                data-testid="starred-link"
                onClick={() =>
                  dispatch(
                    addStarredMovie({
                      id,
                      overview,
                      release_date: release_date?.substring(0, 4),
                      poster_path,
                      title,
                    })
                  )
                }
              >
                <i className="bi bi-star" />
              </span>
            ) : (
              <span
                className="btn-star"
                data-testid="unstar-link"
                onClick={() => dispatch(removeStarredMovie(movie))}
              >
                <i className="bi bi-star-fill" data-testid="star-fill" />
              </span>
            )}
            {!watchLater.watchLaterMovies
              .map((movie) => movie.id)
              .includes(movie.id) ? (
              <button
                type="button"
                data-testid="watch-later"
                className="btn btn-light btn-watch-later"
                onClick={() =>
                  dispatch(
                    addToWatchLater({
                      id,
                      overview,
                      release_date: release_date?.substring(0, 4),
                      poster_path,
                      title,
                    })
                  )
                }
              >
                Watch Later
              </button>
            ) : (
              <button
                type="button"
                data-testid="remove-watch-later"
                className="btn btn-light btn-watch-later blue"
                onClick={() => dispatch(removeFromWatchLater(movie))}
              >
                <i className="bi bi-check"></i>
              </button>
            )}
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => viewTrailer(movie)}
            >
              View Trailer
            </button>
          </div>
          <img
            className="center-block"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : placeholder
            }
            alt="Movie poster"
          />
        </div>
        <h6 className="title">{movie.title}</h6>
        <button
          type="button"
          className="close"
          onClick={(e) => closeCardHandler(e)}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default Movie;
