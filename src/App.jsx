import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import AIChat from "./pages/AIChat";
import ThemeProvider from "./components/ThemeProvider/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <main className="bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/aichat" element={<AIChat />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
