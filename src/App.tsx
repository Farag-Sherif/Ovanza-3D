import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyActions from "./components/StickyActions";
import { Loader } from "./components/ui";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Brands = lazy(() => import("./pages/Brands"));
const BrandDetails = lazy(() => import("./pages/BrandDetails"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Events = lazy(() => import("./pages/Events"));
const Export = lazy(() => import("./pages/Export"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <section className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="t-label text-gold-500 mb-6">404</p>
      <h1 className="t-h1 font-display mb-6">Page not found</h1>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </section>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <motion.main
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-10"
    >
      <Suspense fallback={<Loader full />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:slug" element={<BrandDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="/export" element={<Export />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </motion.main>
  );
}

function GlobalBackground() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // The home page has its own dynamic HeroScene background
  if (isHome) return null;

  return (
    <>
      {/* Base Radial Gradient (slightly brighter so it survives the fog) */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, #4a2e00 0%, #1a1000 50%, #000000 100%)" }}
        aria-hidden="true"
      />
      {/* Black Fog Overlay (Lighter so the gradient shows through) */}
      <div className="fixed inset-0 -z-20 pointer-events-none bg-black/40" aria-hidden="true" />
    </>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black">
      <GlobalBackground />
      <ScrollToTop />
      <Header />
      <AnimatedRoutes />
      <StickyActions />
      <Footer />
    </div>
  );
}
