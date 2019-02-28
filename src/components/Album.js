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
    this.audioElement.volume = 0.5;
  }

  componentDidMount() {
    this.eventListeners = {
         timeupdate: e => {
           this.setState({ currentTime: this.audioElement.currentTime });
         },
         durationchange: e => {
           this.setState({ duration: this.audioElement.duration });
         },
         volumeupdate: e => {
           this.setState({ currentVolume: this.audioElement.currentVolume});
         },
         lengthchange: e => {
           this.setState({ length: this.audioElement.length});
         }
       };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
    this.audioElement.addEventListener('lengthchange', this.eventListeners.lengthchange);
}

  componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
     this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
     this.audioElement.removeEventListener('lengthchange', this.eventListeners.lengthchange);
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

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
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
    const newIndex = Math.max(0, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e){
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ Volume: newVolume });
  }


  displayIcon(song, index) {
    if(this.state.isPlaying !== true && this.state.hoveredSong === index ) {
        return <span className="ion-md-play"></span>
    } else if (this.state.isPlaying === true && this.state.currentSong === song) {
        return <span className="ion-md-pause"></span>
    } else if (this.state.isPlaying !== true && this.state.currentSong === song && this.state.hoveredSong === index) {
        return <span className="ion-md-play"></span>
    }
    return index + 1
  }

  formatTime(time) {
    if (time <= 0) {
        return '-:--';
    }

    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    let secondsString = seconds;

    if (seconds < 10) {
        secondsString = '0' + seconds;
    }

    return `${minutes}:${secondsString}`;
}


  hoverOn(index) {
    this.setState({ hoveredSong: index });
    console.log('hovered');

  };

  hoverOff() {
    this.setState({ hoveredSong: false })
  };


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
        <PlayerBar
             isPlaying={this.state.isPlaying}
             currentSong={this.state.currentSong}
             currentTime={this.audioElement.currentTime}
             duration={this.audioElement.duration}
             currentVolume={this.audioElement.currentVolume}
             length={this.audioElement.length}
             handleSongClick={() => this.handleSongClick(this.state.currentSong)}
             handlePrevClick={() => this.handlePrevClick()}
             handleNextClick={() => this.handleNextClick()}
             handleTimeChange={(e) => this.handleTimeChange(e)}
             handleVolumeChange={(e) => this.handleVolumeChange(e)}
             formatTime={(time) => this.formatTime(time)}
           />
        </section>
      );
    }
  }
export default Album;
