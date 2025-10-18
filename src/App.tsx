import Feature1 from "./components/LandingPage/FeatureSection/FeaturePage1/Feature1"
import Feature2 from "./components/LandingPage/FeatureSection/FeaturePage2/Feature2"
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
      <Section>
        <Feature2 />
      </Section>
    </>
  )
}

export default App
