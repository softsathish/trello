import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import PlanningComponent from './container/planning';

class App extends Component {
  render() {
    return (
      <div id="classic-body" className="container">
        <PlanningComponent></PlanningComponent>
      </div>
    );
  }
}

export default App;
