import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx';
import ProjectDetails from './page/ProjectDetails.jsx';
import Admin from './page/Admin.jsx';

import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import './components/ui/ui.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
