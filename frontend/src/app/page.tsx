import { Hero } from "@/components/home/hero";
import { FeaturesSection } from "@/components/home/features-section";
import { TechStackSection } from "@/components/home/tech-stack-section";
import { EngineeringSection } from "@/components/home/engineering-section";
import { ArchitectureSection } from "@/components/home/architecture-section";
import { CtaSection } from "@/components/home/cta-section";

// The homepage is a Server Component — it's static marketing content with no
// interactivity, so it ships no client-side JavaScript of its own.
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <TechStackSection />
      <EngineeringSection />
      <ArchitectureSection />
      <CtaSection />
    </>
  );
}
