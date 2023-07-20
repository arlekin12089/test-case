import ReactPlayer from "react-player";
import "./styles.scss";
import { Link } from "react-router-dom";
import ghost from "../../assets/ghost.svg";

const YoutubeModal = ({ videoKey, onClose }) => (
  <>
    {videoKey ? (
      <ReactPlayer
        className="video-player"
        url={`https://www.youtube.com/watch?v=${videoKey}`}
        controls
        playing
        data-testid="youtube-player"
      />
    ) : (
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
    )}
    <button className="close-btn" onClick={onClose}></button>
  </>
);

export default YoutubeModal;
