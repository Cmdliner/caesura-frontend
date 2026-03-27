import Hero from "@/components/home/hero";
import Header from "@/components/layout/header";
import Features from "@/components/home/features";
import Trending from "@/components/home/trending";
import Stats from "@/components/home/stats";
import Testimonials from "@/components/home/testimonials";
import Cta from "@/components/home/cta";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Trending />
        <Stats />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </>
  );
}