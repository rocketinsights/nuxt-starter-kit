import isNumber from 'lodash/isNumber';
import { useState, useRef } from 'react';

export default function VideoPlayerControls(props) {
  const {
    chromecastActive,
    chromecastPlaying,
    isBuffering,
    isIOS,
    isMobileDevice,
    isPlaying,
    videos
  } = props;

  const [isControlsTabOpen, setControlsTabOpen] = useState(true);
  const [isWatchWithTabOpen, setWatchWithTabOpen] = useState(false);
  const timelineRef = useRef(null);

  const onWatchWithTabClick = (event) => {
    setControlsTabOpen(false);
    setWatchWithTabOpen(true);
    event.stopPropagation();
  };

  const onControlsTabClick = (event) => {
    setWatchWithTabOpen(false);
    setControlsTabOpen(true);
    event.stopPropagation();
  };

  const onWatchWithStarClick = (event) => {
    props.onWatchWithStarClick(event);
    setWatchWithTabOpen(false);
    setControlsTabOpen(true);
    event.stopPropagation();
  }

  const onSkipAheadClick = (event) => {
    let newTime = props.currentTime + 30;
    if (newTime > props.duration) newTime = props.duration;
    props.seekTo(newTime);
    event.stopPropagation();
  };

  const onSkipBackClick = (event) => {
    let newTime = props.currentTime - 30;
    if (newTime < 0) newTime = 0;
    props.seekTo(newTime);
    event.stopPropagation();
  };

  const onSeekClick = (event) => {
    const newTime = getNewTimeFromClickEvent(event);
    props.seekTo(newTime);
    event.stopPropagation();
  };

  const getNewTimeFromClickEvent = (event) => {
    const timeline = timelineRef.current;
    const rect = timeline.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const percentage = xPos / event.target.offsetWidth;
    event.stopPropagation();
    return Math.round(props.duration * percentage);
  };

  const singleDigit = (value) => {
    if (!isNumber(value)) { return false; }
    return value >= 0 && value < 10;
  };

  const formatTime = (value) => {
    let hours = Math.floor(value / 3600);
    let minutes = Math.floor(value % 3600 / 60);
    let seconds = Math.floor(value % 3600 % 60);

    hours = singleDigit(hours) ? `0${hours}` : hours;
    minutes = singleDigit(minutes) ? `0${minutes}` : minutes;
    seconds = singleDigit(seconds) ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`;
  };

  const getProgressOffset = (duration, currentTime) => {
    if (!timelineRef.current) return;
    const totalWidth = timelineRef.current.clientWidth;
    const percentage = currentTime / duration;
    return totalWidth * percentage;
  };

  const offset = getProgressOffset(props.duration, props.currentTime);
  const styles = {
    progress: {
      width: `${offset}px`,
      pointerEvents: 'none'
    }
  };

  const classNames = {
    playbackControls: isControlsTabOpen ? 'video-player__controls-playback' : 'kill',
    timelineControls: isControlsTabOpen ? 'video-player__controls-timeline' : 'kill',
    watchWithControls: isWatchWithTabOpen ? 'watch-with-controls' : 'kill',
    tabControls: isControlsTabOpen ? 'video-player__tab active' : 'video-player__tab',
    tabWatchWith: isWatchWithTabOpen ? 'video-player__tab active' : 'video-player__tab'
  };

  const { watchWith } = videos;

  let showLoadingIcon = false;
  let showPlayButton = false;
  let showPauseButton = false;

  if (isBuffering) {
    showLoadingIcon = true;
  } else if (chromecastActive) {
    showPlayButton = !chromecastPlaying;
    showPauseButton = chromecastPlaying;
  } else {
    showPlayButton = !isPlaying;
    showPauseButton = isPlaying;
  }

  return (
    <div
      className='video-player-controls-container'
      onTouchEnd={props.onContainerTouch}
    >
      <div className='video-player__controls'>
        <div className='video-player__controls-nav'>
          <ul
            className='video-player__tabs'
            clickable='true'
            style={{display: 'none'}}
          >
            <div className='video-player__tabs-wrapper'>
              <li
                className={classNames.tabControls}
                onClick={onControlsTabClick}
                onTouchEnd={onControlsTabClick}
              >
                <p>Controls</p>
              </li>
              <li
                className={classNames.tabWatchWith}
                onClick={onWatchWithTabClick}
                onTouchEnd={onWatchWithTabClick}
              >
                <div className='video-player__tab-icon' />
                <p>WatchWith&trade;</p>
              </li>
            </div>
          </ul>

          <div className='video-player__sizes'>
            <div
              className='video-player__size icon chromecast'
              clickable='true'
            >
              <google-cast-launcher />
            </div>
            {props.isAirPlayAvailable && (
            <img
              className='video-player__size icon airplay'
              alt='Airplay'
              src='/icons/player/airplay.svg'
              clickable='true'
              onClick={props.onAirPlayClick}
              onTouchEnd={props.onAirPlayClick}
            />
            )}
            <img
              className='video-player__size icon fullscreen'
              alt='Fullscreen'
              src='/icons/player/fullscreen.svg'
              clickable='true'
              onClick={props.onFullscreenClick}
              onTouchEnd={props.onFullscreenClick}
            />
          </div>{/* video-player__sizes */}
        </div>{/* video-player__controls-nav */}
        <div className={classNames.playbackControls}>
          <div className='video-player__controls-icons'>
            <img
              className='video-player__playback icon rewind'
              alt='Jump back 30 seconds'
              src='/icons/player/30-rwd.svg'
              clickable='true'
              disabled={!isPlaying || isBuffering}
              onClick={onSkipBackClick}
              onTouchEnd={onSkipBackClick}
            />
            {showLoadingIcon && (
            <object
              className='video-player__playback icon loading'
              type='image/svg+xml'
              data='/icons/player/loading.svg'
            />
            )}
            {showPlayButton && (
            <img
              className='video-player__playback icon play'
              alt='Play video'
              src='/icons/player/play.svg'
              clickable='true'
              onClick={props.onPlayClick}
              onTouchEnd={props.onPlayClick}
            />
            )}
            {showPauseButton && (
            <img
              className='video-player__playback icon pause'
              alt='Pause video'
              src='/icons/player/pause.svg'
              clickable='true'
              onClick={props.onPauseClick}
              onTouchEnd={props.onPauseClick}
            />
            )}
            <img
              className='video-player__playback icon forward'
              alt='Jump ahead 30 seconds'
              src='/icons/player/30-fwd.svg'
              clickable='true'
              disabled={!isPlaying || isBuffering}
              onClick={onSkipAheadClick}
              onTouchEnd={onSkipAheadClick}
            />
          </div>{/* video-player__controls-icons */}
        </div>{/* video-player__controls-playback */}
        <div className={classNames.timelineControls}>
          <div className='video-player__times'>
            <span className='video-player__current-time'>
              {formatTime(props.currentTime)}
            </span>
            <span className='video-player__total-time'>
              {formatTime(props.duration)}
            </span>
          </div>
          <div
            className='video-player__timeline'
            onClick={onSeekClick}
            ref={timelineRef}
          >
            <div
              className='video-player__timeline-progress'
              style={styles.progress}
              clickable='true'
            />
          </div>
        </div>{/* video-player__controls-timeline */}
        <div className={classNames.watchWithControls}>
          <h1 className='heading'>Select a star to WatchWith&trade;</h1>
          <ul className='watch-with-stars'>
            {watchWith.map(({ name, avatarUrl, assetId }) => (
              <li
                className='watch-with-star'
                clickable='true'
                data-asset-id={assetId} /* this is important */
                active={props.activeAssetId === assetId ? 'true' : null}
                key={name}
                onClick={onWatchWithStarClick}
                onTouchEnd={onWatchWithStarClick}
              >                
                <div className='avatar' style={{ backgroundImage: `url('${avatarUrl}')` }}>
                  <div className="avatar__close-icon">
                    <img src='/icons/player/close.svg' />
                  </div>
                </div>
                <span className='watch-with-name'>
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>{/* watch-with-controls */}
      </div>{/* video-player__controls */}
    </div>
  );
}
