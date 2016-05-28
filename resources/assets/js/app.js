import React from 'react';
import ReactDOM from 'react-dom';
import store from './store.js';
import Menu from './components/Menu.js';
import Game from './components/Game.js';
import Loader from './components/Loader.js';

import '../sass/app.scss';

function addMyKeyboardEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
};

var SokoBanGame = React.createClass({

  componentWillMount:function() {
     addMyKeyboardEvent(document, "keydown", function (e) {
      e = e || window.event;
      const state = this.props.store.getState();
      if (state.state=='GAME' &&
        state.level.finished &&
        e.keyCode==32) {
        this.progressLevel(e);
      }

      if (state.state=='GAME' && 
          e.keyCode=='27') {
        this.resetLevel(e);
      }

      if (state.state=='GAME' &&
          !state.level.finished) {
      switch (e.keyCode) {
        case 38:
          this.props.store.dispatch({
            type: 'MOVEUP'
          });
          break;
        case 40:
          this.props.store.dispatch({
            type: 'MOVEDOWN'
          });
          break;
        case 37:
          this.props.store.dispatch({
            type: 'MOVELEFT'
          });
          break;
        case 39:
          this.props.store.dispatch({
            type: 'MOVERIGHT'
          });
          break;
      }
    }
    }.bind(this));

  },

  resetLevel: function(event) {
    event && event.preventDefault();
    this.props.store.dispatch({
        type:'LOADLEVEL',
        scenario: this.props.store.getState().scenario
    });
  },

  progressLevel: function(event) {
    event && event.preventDefault();

    this.props.store.dispatch({
        type: 'PROGRESSLEVEL'
    });
    this.props.store.dispatch({
        type: 'LOADLEVEL',
        scenario: this.props.store.getState().scenario
    });
  },

  render: function () {
    let gameState = '';
  	const state = this.props.store.getState();

  	switch (state.state) {
      case 'GAME':
        gameState = <Game
          store={this.props.store}
          resetLevel={this.resetLevel}
          progressLevel={this.progressLevel}
         />;
        break;

      case 'LOADING':
        gameState = <Loader/>;
        break;

      case 'ERROR':
        gameState = (<div>Error happened</div>);
        break;

  		default: 
  			gameState = (
          <Menu
            store={this.props.store}
            onStartGame={this.startGame}
            onLoadGame={this.loadGame}
            onAboutGame={this.aboutGame}
          />
        );
        break;
  	}

    return (
      <div className="container">
        {gameState}
      </div>
    )
  },

  startGame: function() {
    this.loadScenario('mappack1');
  },

  loadScenario: function(scenario) {
    this.props.store.dispatch({type:'LOADING'});
    fetch('/index.php/scenario/'+scenario+'.json',{
      method: 'get'
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();  
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(function(data) {
      this.props.store.dispatch({
        type: 'LOADSCENARIO',
        scenario: data
      });
      this.props.store.dispatch({
        type: 'LOADLEVEL',
        scenario: this.props.store.getState().scenario
      });
    }.bind(this))
    .catch(function(error) {
      this.props.store.dispatch({type:'ERROR'});
      console.log(error);
    }.bind(this));
  }
})

const render = () => {
  ReactDOM.render(
    <SokoBanGame store={store} />,
    document.getElementById('SokoBanGame')
  )
};

store.subscribe(render)
render();
