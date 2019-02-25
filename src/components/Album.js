import React, { Component } from "react";
import albumData from "./../data/albums";
import PlayerBar from "./PlayerBar";

class Album extends Component {
  constructor(props) {
    super(props);
    const album = albumData.find(album => {
      return album.slug === this.props.match.params.slug;
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      volume: 0.5,
      isHovered: false,
    };

    this.audioElement = document.createElement("audio");
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.volume;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  componentDidMount() {
    this.eventListeners = {
     timeupdate: e => {
       this.setState({ currentTime: this.audioElement.currentTime });
     },
     durationchange: e => {
       this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

   componentWillUnmount() {
     this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }


  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  }

  handleVolumeUpClick(e) {
    if (this.state.volume < 1) {
      const newVolume = this.state.volume + 0.1;
      this.audioElement.volume = Math.min(newVolume, 1);
      this.setState({ volume: newVolume });
    } else this.setState({ volume: 1 });
  }

  handleVolumeDownClick(e) {
    if (this.state.volume > 0) {
      const newVolume = this.state.volume - 0.1;
      this.audioElement.volume = Math.max(0, newVolume);
      this.setState({ volume: newVolume });
    } else this.setState({ volume: 0 });
  }

  formatTime(time) {
    return time
      ? `${Math.floor(time / 60)}:${Number((time % 60) / 100)
          .toFixed(2)
          .substr(2, 3)}`
      : "-:--";
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
          <div className="album-details">
            <div id="album-title">{this.state.album.title}</div>
            <div className="artist">{this.state.album.artist}</div>
            <div id="release-info">{this.state.album.releaseInfo} </div>
          </div>
        </section>

          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            currentTime={this.state.currentTime}
            duration={this.state.duration}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
          />
        
      );

        <table id="song-list" align="center" className="table">
          <div> Songs from {this.state.album.title} </div>
					<colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody className ="list-group">
            <tr>
              <th>Track #</th>
              <th>Title</th>
              <th>Duration</th>
            </tr>
            {this.state.album.songs.map((song, index) => (
              <tr
                className="song"
                key={index}
                onClick={() => this.handleSongClick(song)}
                onMouseEnter={() => this.setState({ isHovered: index + 1 })}
                onMouseLeave={() => this.setState({ isHovered: false })}>
                <td className="song-actions">
                  <button id="song-action-buttons" className="btn btn-light">
                    {this.state.currentSong.title === song.title ?
										(<span className={this.state.isPlaying ? "ion-pause" : "ion-play"} />) :
										this.state.isHovered === index + 1 ? (<span className="ion-play" />) :
										(<span className="song-number">{index + 1}</span>)}
                  </button>
                </td>
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{this.formatTime(song.duration)} </td>
              </tr>
            ))}
          </tbody>
        </table>


      </section>
    );
  }
}

export default Album;
