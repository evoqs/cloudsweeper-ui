import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Grid from '@mui/material/Grid';

import LandingPage from "./components/LandingPage";
import Home from './components/Home'
import Accounts from './components/Accounts';
import Pipeline from './components/Pipeline';
import PipelineSetup from './components/PipelineSetup';
import PolicyList from './components/Policies/List';
import PolicyCreate from './components/Policies/Create';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-primary">
        <a href="/home" className="navbar-brand"> CloudSweeper</a>
        {/* sessionStorage.token && <a href="/" className="navbar-brand">Logout</a> */}
      </nav>

      <div className="container mt-3">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Routes>
              <Route path="/" element={<LandingPage/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/accounts" element={<Accounts/>} />
              <Route path="/pipelines" element={<Pipeline/>} />
              <Route path="/pipelines/create" element={<PipelineSetup/>} />
              <Route path="/policies" element={<PolicyList/>} />
              <Route path="/policies/create" element={<PolicyCreate/>} />              

            </Routes>  
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
