import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="create" element={<CreateExercisePage />} />
            <Route path="edit/:id" element={<EditExercisePage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
