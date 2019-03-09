import React, { Component } from 'react';

class PlayerBar extends Component {
  render() {
    return (
      <section className="player-bar">
        <section id="buttons">
          <button id="previous" className="mdl-button mdl-js-button mdl-button--primary" onClick={this.props.handlePrevClick}>
            <span className="ion-md-skip-backward"></span>
          </button>
          <button id="play-pause" className="mdl-button mdl-js-button mdl-button--primary" onClick={this.props.handleSongClick}>
            <span className={this.props.isPlaying ? 'ion-md-pause' : 'ion-md-play'}></span>
          </button>
          <button id="next" className="mdl-button mdl-js-button mdl-button--primary" onClick={this.props.handleNextClick}>
            <span className="ion-md-skip-forward"></span>
          </button>
        </section>
        <section id="time-control">
          <div className="current-time">{this.props.formatTime(this.props.currentTime)}</div>
          <input
          type="range"
          className="seek-bar mdl-slider mdl-js-slider"
          value={(this.props.currentTime / this.props.duration) || 0.01}
          max="1"
          min="0"
          step="0.01"
          onChange={this.props.handleTimeChange}
          />
          <div className="total-time">{this.props.formatTime(this.props.duration)}</div>
        </section>
        <section id="volume-control">
          <div className="icon ion-md-volume-low"></div>
          <input type="range" className="seek-bar mdl-slider mdl-js-slider" max="1" min="0" step="0.01" value={this.props.currentVolume} onChange={this.props.handleVolumeChange}/>
          <div className="icon ion-md-volume-high"></div>
        </section>
      </section>
    );
  }
}

export default PlayerBar;
