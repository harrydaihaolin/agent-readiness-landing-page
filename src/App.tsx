import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import OpenSourceCallout from './components/OpenSourceCallout';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import RoiCalculator from './components/RoiCalculator';

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <OpenSourceCallout />
      <Pricing />
      <Faq />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/roi" element={<RoiCalculator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
