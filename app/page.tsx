import Feature1 from "@/components/LandingPage/Feature1";
import Feature2 from "@/components/LandingPage/Feature2";
import Hero from "@/components/LandingPage/Hero";
import Section from "@/components/LandingPage/Section";

export default function LandingPage() {
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
  );
}
