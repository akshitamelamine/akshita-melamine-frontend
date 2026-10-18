import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Collections from "@/components/collections/Collections";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import About from "@/components/about/About";
import WhyAkshita from "@/components/why-akshita/WhyAkshita";
import Lifestyle from "@/components/lifestyle/Lifestyle";
import FinalCTA from "@/components/cta/FinalCTA";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <main>
      {/* Main navigation */}
      <Navbar />

      {/* Cinematic first impression */}
      <Hero />

      {/* Product category discovery */}
      <Collections />

      {/* Featured products */}
      <FeaturedProducts />

      {/* Brand story */}
      <About />

      {/* Brand principles */}
      <WhyAkshita />

      {/* Lifestyle story */}
      <Lifestyle />

      {/* Final conversion section */}
      <FinalCTA />

      {/* Website footer */}
      <Footer />
    </main>
  );
}