import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Feature1 from "./components/LandingPage/FeatureSection/FeaturePage1/Feature1"
import Feature2 from "./components/LandingPage/FeatureSection/FeaturePage2/Feature2"
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
    <>
      <Section>
        <Hero />
      </Section>
      <Section>
        <Feature1 />
      </Section>
      <Section>
        <Feature2 />
      </Section>
    </>
  )
}

export default App;
