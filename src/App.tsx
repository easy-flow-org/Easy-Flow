import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feature1 from "./components/LandingPage/FeatureSection/FeaturePage1/Feature1"
import Hero from "./components/LandingPage/HeroSection/Hero"
import AboutMe from "./components/LandingPage/AboutMeSection/AboutMe"
import Section from "./components/LandingPage/Section"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Section>
              <Hero /> 
            </Section>
            <Section>
              <Feature1 />
            </Section>
          </>
        } />
        <Route path="/about-us" element={
          <Section>
            <AboutMe />
          </Section>
        } />
      </Routes>
    </Router>
  )
}

export default App
