import { Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, ArrowUpRight, ChevronDown, Eye, Target, Sparkles, ShieldCheck, TrendingUp, Handshake, Lightbulb, Truck, Globe2, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings, useBrands, useProducts, useBlogs } from "../hooks/useApi";
import { Reveal, SectionHead, Counter, Img, Loader, ErrorState, EmptyState } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";
import { stripHtml } from "../api/client";

const HeroScene = lazy(() => import("../components/three/HeroScene"));
const ThreeGuard = lazy(() => import("../components/three/ThreeGuard"));

/* ================= HERO ================= */
function Hero() {
  const { t } = useTranslation();
  const { data: settings, isLoading } = useSettings();
  const { dir } = useLanguage();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-espresso-950/40 via-transparent to-espresso-950" />

      <motion.div style={{ y: yText, opacity }} className="container-ov relative z-10 flex flex-col lg:flex-row items-center justify-between h-full w-full pointer-events-none pt-32 pb-20 lg:py-0">
        {isLoading ? (
          <div className="w-full flex justify-center pointer-events-auto"><Loader /></div>
        ) : (
          <>
            {/* Left Column */}
            <div className="flex flex-col justify-center items-start text-start w-full lg:w-5/12 z-20 pointer-events-auto">
              <motion.h1
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-6xl md:text-8xl text-cream-50 leading-[0.9]"
              >
                Ovanza <br /><span className="gold-text text-5xl md:text-7xl">Cosmetics</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.55 }}
                className="t-h3 mt-6 font-light tracking-wide text-cream-100/90 max-w-md"
              >
                {t("hero.statement")}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="t-body mt-4 max-w-md text-cream-300/70"
              >
                {t("hero.sub")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link to="/brands" className="btn-primary">
                  {t("hero.cta")}
                  {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </Link>
                <Link to="/contact" className="btn-ghost">{t("hero.partner")}</Link>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="hidden lg:flex flex-col justify-end items-end text-end w-full lg:w-4/12 z-20 pointer-events-auto pb-10 h-full">
              <motion.h2
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="font-display text-5xl xl:text-7xl text-cream-50 leading-[0.9]"
              >
                <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>Premium</span><br />
                Quality
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="mt-8 flex items-center gap-4 text-start bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center border border-gold-500/30 shrink-0">
                  <Sparkles className="text-gold-400 w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs tracking-widest text-cream-300/50 uppercase">Certified</div>
                  <div className="text-sm font-semibold text-cream-50">Premium Excellence</div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="t-label text-cream-300/50">{t("hero.scroll")}</span>
        <span className="scroll-cue" />
      </motion.div>
    </section>
  );
}

/* ================= INTRO + COUNTERS ================= */
function Intro() {
  const { t } = useTranslation();
  const { data: s } = useSettings();
  const { dir } = useLanguage();

  return (
    <section className="relative z-20 py-28 md:py-40">
      <div className="container-ov grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="t-label text-gold-500">{t("home.intro_label")}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="t-h2 font-display mt-6 text-cream-50">{t("home.intro_title")}</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="t-lead mt-8 whitespace-pre-line text-cream-300/80">
              {stripHtml(s?.about_us)?.slice(0, 460) || ""}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link to="/about" className="u-sweep t-body mt-8 inline-flex items-center gap-2 font-semibold text-gold-400">
              {t("nav.about")} {dir==="rtl" ? <ArrowUpLeft className="inline h-4 w-4" /> : <ArrowUpRight className="inline h-4 w-4" />}
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {s && (
            <>
              <Reveal delay={0.1}><Counter value={s.experience_count ?? 0} label={t("home.counters_years")} /></Reveal>
              <Reveal delay={0.2}><Counter value={s.employees_count ?? 0} label={t("home.counters_employees")} /></Reveal>
              <Reveal delay={0.3}><Counter value={s.vehicles_count ?? 0} label={t("home.counters_vehicles")} /></Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= VISION / MISSION / VALUES (editorial, no boxes) ================= */
function VisionMission() {
  const { t } = useTranslation();
  const values = [
    { icon: ShieldCheck, key: "value_quality" },
    { icon: Lightbulb, key: "value_innovation" },
    { icon: Eye, key: "value_trust" },
    { icon: TrendingUp, key: "value_growth" },
    { icon: Handshake, key: "value_partnership" },
  ];

  return (
    <section className="relative z-20 py-28 md:py-40">
      <div className="container-ov">
        <SectionHead label={t("home.vision_label")} title={t("home.vision_title")} />

        <div className="grid gap-20 md:grid-cols-2">
          {[
            { icon: Eye, title: t("home.vision_title"), text: t("home.vision_text") },
            { icon: Target, title: t("home.mission_title"), text: t("home.mission_text") },
          ].map((block, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="group relative border-t border-white/10 pt-10">
                <span className="font-display absolute -top-7 text-7xl text-gold-600/20 ltr:right-0 rtl:left-0 select-none" aria-hidden>
                  0{i + 1}
                </span>
                <block.icon className="mb-6 h-8 w-8 text-gold-500" strokeWidth={1.5} />
                <h3 className="t-h3 font-display mb-5 text-cream-50">{block.title}</h3>
                <p className="t-lead text-cream-300/75">{block.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* values — pure typography flow */}
        <div className="mt-24 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {values.map((v, i) => (
            <Reveal key={v.key} delay={i * 0.08}>
              <span className="t-h3 font-display inline-flex items-center gap-3 text-cream-100/45 transition-colors duration-500 hover:text-gold-400">
                <v.icon className="h-5 w-5 text-gold-600/70" strokeWidth={1.5} />
                {t(`home.${v.key}`)}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= EGYPT DISTRIBUTION (structural, API counters only) ================= */
function EgyptPresence() {
  const { t } = useTranslation();
  const { data: s } = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1000, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-40">
      <div className="container-ov grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal><span className="t-label text-gold-500">{t("home.egypt_label")}</span></Reveal>
          <Reveal delay={0.1}><h2 className="t-h2 font-display mt-6 text-cream-50">{t("home.egypt_title")}</h2></Reveal>
          <Reveal delay={0.2}><p className="t-lead mt-6 text-cream-300/80">{t("home.egypt_text")}</p></Reveal>
          <div className="mt-10 flex flex-wrap gap-12">
            {s && (
              <>
                <Reveal delay={0.25}><Counter value={s.vehicles_count ?? 0} suffix="" label={t("home.counters_vehicles")} /></Reveal>
                <Reveal delay={0.35}><Counter value={s.employees_count ?? 0} suffix="" label={t("home.counters_employees")} /></Reveal>
              </>
            )}
          </div>
        </div>

        {/* Stylized animated network — visual structure only, no invented regions */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <svg viewBox="0 0 400 400" className="h-full w-full">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d4a95c" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#d4a95c" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="180" fill="url(#glow)" opacity="0.4" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="#d4a95c" strokeOpacity="0.25" strokeWidth="1" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="#d4a95c" strokeOpacity="0.35" strokeWidth="1" />
              <circle cx="200" cy="200" r="50" fill="none" stroke="#d4a95c" strokeOpacity="0.5" strokeWidth="1" />
              {/* animated routes */}
              <motion.circle
                cx="200" cy="200" r="150" fill="none"
                stroke="#d4a95c" strokeWidth="1.5" strokeDasharray="8 16"
                style={{ pathLength: dashOffset, rotate: 0 }}
                transform="rotate(20 200 200)"
              />
              <motion.circle
                cx="200" cy="200" r="100" fill="none"
                stroke="#ecd9ac" strokeWidth="1.2" strokeDasharray="6 14"
                style={{ pathLength: dashOffset }}
                transform="rotate(-35 200 200)"
              />
              {/* hub + nodes */}
              <circle cx="200" cy="200" r="8" fill="#d4a95c" />
              <circle cx="200" cy="200" r="14" fill="none" stroke="#d4a95c" strokeOpacity="0.4">
                <animate attributeName="r" values="10;26" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {[
                [320, 130], [110, 90], [90, 280], [300, 300], [200, 60], [350, 220], [60, 190],
              ].map(([x, y], i) => (
                <g key={i}>
                  <line x1="200" y1="200" x2={x} y2={y} stroke="#d4a95c" strokeOpacity="0.3" strokeWidth="1">
                    <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                  </line>
                  <circle cx={x} cy={y} r="4" fill="#ecd9ac" opacity="0.9">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </svg>
            <div className="glass absolute bottom-6 start-1/2 -translate-x-1/2 rounded-full border border-white/10 px-6 py-3 ltr:left-1/2 rtl:right-1/2" style={{transform:'translateX(-50%)'}}>
              <span className="t-small inline-flex items-center gap-2 text-cream-100/90">
                <Truck className="h-4 w-4 text-gold-400" /> {t("home.egypt_title")}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= GLOBAL PRESENCE ================= */
function GlobalPresence() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  return (
    <section className="relative py-28 md:py-40">
      <div className="container-ov text-center">
        <Reveal><span className="t-label text-gold-500">{t("home.global_label")}</span></Reveal>
        <Reveal delay={0.1}>
          <h2 className="t-h1 font-display mt-6 text-cream-50">{t("home.global_title")}</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="t-lead mx-auto mt-6 max-w-2xl text-cream-300/80">{t("home.global_text")}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-6">
            <span className="t-small glass inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-cream-100/90">
              <Globe2 className="h-4 w-4 text-gold-400" /> Export since 2018
            </span>
            <Link to="/export" className="btn-primary">
              {t("home.global_cta")}
              {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= BRANDS ================= */
export function BrandsStrip() {
  const { t } = useTranslation();
  const { data: brands, isLoading, isError, refetch } = useBrands();
  const { dir } = useLanguage();

  return (
    <section className="relative z-20 py-28 md:py-40">
      <div className="container-ov">
        <SectionHead label={t("home.brands_label")} title={t("home.brands_title")} sub={t("home.brands_sub")} />
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !brands?.length ? (
          <EmptyState message={t("brands.empty")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b, i) => (
              <Reveal key={b.id} delay={Math.min(i * 0.06, 0.4)}>
                <Link
                  to={`/brands/${b.slug}`}
                  className="card-surface group relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40"
                >
                  <div className="relative mb-8 flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-espresso-900">
                    <Img src={b.logo_path} alt={b.name} className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <h3 className="t-h3 font-display mb-2 text-cream-50">{b.name}</h3>
                  <span className="t-small mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-gold-400">
                    {t("brands.explore")}
                    {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,169,92,0.12),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/brands" className="btn-ghost">{t("nav.brands")}</Link>
        </div>
      </div>
    </section>
  );
}

/* ================= PRODUCTS ================= */
function ProductsStrip() {
  const { t } = useTranslation();
  const { data: products, isLoading, isError, refetch } = useProducts();
  const { dir } = useLanguage();

  return (
    <section className="relative z-20 py-28 md:py-40">
      <div className="container-ov">
        <SectionHead label={t("home.products_label")} title={t("home.products_title")} />
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !products?.length ? (
          <EmptyState message={t("products.empty_state")} />
        ) : (
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
            {products.slice(0, 10).map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="card-surface group w-[240px] shrink-0 snap-start overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 sm:w-[280px] lg:w-[calc(25%-1.125rem)]"
              >
                <div className="relative h-64 overflow-hidden bg-espresso-900">
                  <Img src={p.image_path} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:scale-110" />
                  {p.category?.name && (
                    <span className="glass t-small absolute top-4 rounded-full border border-white/10 px-3 py-1 text-cream-100/90 ltr:left-4 rtl:right-4">
                      {p.category.name}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="t-body line-clamp-1 font-bold text-cream-50">{p.name}</h3>
                  <p className="t-small mt-1 text-gold-400">{p.category?.name || t(`brands.visit`)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/products" className="btn-ghost">{t("home.products_all")}</Link>
        </div>
      </div>
    </section>
  );
}

/* ================= EVENTS PREVIEW ================= */
function EventsPreview() {
  const { t } = useTranslation();
  const { data: blogs, isLoading, isError, refetch } = useBlogs();
  const { language } = useLanguage();

  return (
    <section className="relative z-20 py-28 md:py-40">
      <div className="container-ov">
        <SectionHead label={t("home.news_label")} title={t("home.news_title")} />
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !blogs?.length ? (
          <EmptyState message={t("events.empty")} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.slice(0, 3).map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08}>
                <article className="card-surface group h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                  <div className="relative h-52 overflow-hidden">
                    <Img src={b.image_path} alt={b.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <span className="t-small inline-flex items-center gap-2 text-gold-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(b.created_at).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <h3 className="t-h3 font-display mt-3 line-clamp-2 text-cream-50">{b.title}</h3>
                    <p className="t-small mt-3 line-clamp-2 text-cream-300/70">{stripHtml(b.content).slice(0, 120)}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/events" className="btn-ghost">{t("home.news_cta")}</Link>
        </div>
      </div>
    </section>
  );
}

/* ================= FINAL CTA ================= */
function FinalCTA() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,169,92,0.12),transparent_60%)]" />
      <div className="container-ov relative text-center">
        <Reveal>
          <Sparkles className="mx-auto mb-8 h-8 w-8 text-gold-500" strokeWidth={1.5} />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="t-h1 font-display mx-auto max-w-4xl text-cream-50">{t("home.cta_title")}</h2>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary">{t("home.cta_contact")}</Link>
            <Link to="/contact" className="btn-ghost">{t("home.cta_partner")}</Link>
            <Link to="/export" className="btn-ghost">{t("home.cta_export")}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const reduced = useReducedMotion();
  return (
    <>
      {!reduced && (
        <Suspense fallback={null}>
          <ThreeGuard>
            <HeroScene />
          </ThreeGuard>
        </Suspense>
      )}
      <Hero />
      <Intro />
      <VisionMission />
      <EgyptPresence />
      <GlobalPresence />
      <BrandsStrip />
      <ProductsStrip />
      <EventsPreview />
      <FinalCTA />
    </>
  );
}
