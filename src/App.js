import { Routes, Route } from "react-router-dom";

//Components

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import './styles/App.css';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default App;
