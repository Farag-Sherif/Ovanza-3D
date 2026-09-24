import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../hooks/useApi";

export default function Header() {
  const { t } = useTranslation();
  const { language, dir, setLanguage } = useLanguage();
  const { data: settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/brands", label: t("nav.brands") },
    { to: "/events", label: t("nav.events") },
    { to: "/export", label: t("nav.export") },
    { to: "/careers", label: t("nav.careers") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b border-white/5 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container-ov flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Ovanza Cosmetics">
            {settings?.image_logo_path ? (
              <img
                src={settings.image_logo_path}
                alt="Ovanza"
                className="h-12 w-auto object-contain shrink-0 md:h-16"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            ) : (
              <span className="font-display text-2xl tracking-wide text-cream-50 hidden sm:block">
                Ovanza
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `u-sweep t-small font-semibold transition-colors duration-300 ${
                    isActive ? "active text-gold-400" : "text-cream-100/75 hover:text-cream-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="glass rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-cream-100 transition-colors hover:border-gold-500/60 hover:text-gold-300"
              aria-label="Switch language"
            >
              {language === "ar" ? "EN" : "ع"}
            </button>

            {/* CTA */}
            <Link to="/contact" className="btn-primary !hidden !py-2.5 !px-6 text-sm xl:!inline-flex whitespace-nowrap">
              {t("nav.partner")}
              {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="glass rounded-full border border-white/10 p-2.5 text-cream-50 xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-espresso-950/95 backdrop-blur-2xl xl:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-2 px-10 pt-20">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: dir === "rtl" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `t-h2 font-display block py-2 transition-colors ${
                        isActive ? "gold-text" : "text-cream-100/80"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-4"
              >
                <Link to="/contact" className="btn-primary flex-1">{t("nav.partner")}</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
