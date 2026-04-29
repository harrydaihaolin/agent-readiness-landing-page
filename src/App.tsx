import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import OpenSourceCallout from './components/OpenSourceCallout';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <OpenSourceCallout />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
