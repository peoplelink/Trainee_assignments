import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Home from './components/Home';
import Assignment6 from './components/Assignment6'

function App(){
  return(
    <div className="baseContainer">
      <Router>
        <Routes>
          <Route exact path="/" element={<Assignment6/>}/>
        </Routes>
      </Router>
    </div>
  )
  }
  export default App;
