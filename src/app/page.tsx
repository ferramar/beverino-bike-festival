import { Countdown } from "../components/countdown";
// import EventHighlights from "../components/EventHighlights";
import FeaturesSection from "../components/FeatureSection";
import HomeBanner from "../components/homeBanner";
import KidsMTBSection from "../components/KidsMTBSection";
import SponsorsCarouselWrapper from "../components/SponsorCarouselWrapper";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <Countdown />
      <KidsMTBSection />
      <FeaturesSection />
      <SponsorsCarouselWrapper />
      {/* <EventHighlights /> */}
    </>
  );
}
