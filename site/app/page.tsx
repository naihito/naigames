import HeroSlider from "@/components/HeroSlider";
import GameCollection from "@/components/GameCollection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <GameCollection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
