import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Hero from "./components/LandingPage/HeroSection/Hero";
import Section from "./components/LandingPage/Section";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <Section>
              <Hero />
            </Section>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Add other routes here later like /shop, /admin, etc */}
      </Routes>
    </Router>
  );
}

export default App;
