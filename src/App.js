import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';
//import logo from '/assets/images/bloc_jams_logo.png';

class App extends Component {
  render() {
    return (
      <div className="App">
          <div className="sidenav">
             <Link to="/"><img className="logo" src="/assets/images/bloc_jams_logo.png" alt="Bloc Jams Logo"/></Link>
             <nav>
              <Link to="/"><span className="sidenav-icon ion-home"></span>Home</Link>
              <Link to="/library"><span className="sidenav-icon ion-ios-albums"></span>Library</Link>
             </nav>
          </div>


            <main>
              <Route exact path="/" component={Landing} />
              <Route path="/library" component={Library} />
              <Route path="/album/:slug" component={Album} />
            </main>
      </div>

    );
  }
}

export default App;
