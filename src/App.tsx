import Feature1 from "./components/LandingPage/FeatureSection/FeaturePage1/Feature1"
import Hero from "./components/LandingPage/HeroSection/Hero"
import Section from "./components/LandingPage/Section"

function App() {
  return (
    <>
      <Section>
        <Hero />
      </Section>
      <Section>
        <Feature1 />
      </Section>
    </>
  )
}

export default App
