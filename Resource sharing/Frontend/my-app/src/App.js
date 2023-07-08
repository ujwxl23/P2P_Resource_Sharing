import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import StakingPage from './pages/StakingPage';
import DevicePage from './pages/DevicePage';

const App = () => {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
        <Route exact path="/" element={<DevicePage></DevicePage> } />
          <Route path="/stake" element={<StakingPage></StakingPage>} />
        </Routes>
    </BrowserRouter>
  );
};



export default App;
