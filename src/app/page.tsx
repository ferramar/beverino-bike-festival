import { Countdown } from "../components/countdown";
import EventHighlights from "../components/EventHighlights";
import FeaturesSection from "../components/FeatureSection";
import HomeBanner from "../components/homeBanner";

export default function Home() {
  return (
    <main>
      <HomeBanner />
      <Countdown />
      <FeaturesSection />
      <EventHighlights />
    </main>
  );
}
