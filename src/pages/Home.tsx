import { Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, ArrowUpRight, ChevronDown, Eye, Target, Sparkles, ShieldCheck, TrendingUp, Handshake, Lightbulb, Truck, Globe2, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings, useBrands, useProducts, useEvents } from "../hooks/useApi";
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

        {/* values ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â pure typography flow */}
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

        {/* Stylized animated network ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â visual structure only, no invented regions */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
                          <svg viewBox="0 0 1024 1024" className="h-full w-full drop-shadow-[0_0_25px_rgba(212,169,92,0.2)]">
                <g transform="translate(0, 1024) scale(0.1, -0.1)">
                  <path d="M1211 10204 c-39 -30 -50 -34 -105 -34 -43 0 -97 -12 -183 -39 l-122
-39 -80 24 c-74 23 -81 28 -106 70 l-26 44 -44 -31 c-24 -17 -46 -41 -49 -54
-9 -36 -94 -114 -132 -121 -19 -3 -37 -10 -40 -16 -3 -5 -6 -78 -6 -163 l-1
-154 52 -120 c28 -67 51 -134 51 -153 -1 -18 -11 -83 -24 -143 -24 -120 -53
-173 -148 -280 -35 -39 -52 -71 -77 -147 l-32 -97 56 -142 c31 -78 54 -147 51
-153 -2 -6 -13 -35 -25 -64 l-21 -52 50 -55 c54 -60 53 -54 25 -148 -12 -40
-10 -49 37 -187 l50 -145 -161 -3690 c-89 -2030 -161 -3699 -161 -3710 0 -20
13 -21 813 -53 1447 -58 2761 -90 4007 -98 l1115 -6 40 71 c78 141 94 161 126
161 45 0 63 -36 55 -113 -4 -34 -10 -72 -13 -84 l-5 -23 618 0 c379 0 685 5
790 12 l171 12 35 -30 c20 -16 87 -75 150 -131 l115 -102 194 -12 195 -12 74
39 74 39 62 205 62 205 263 67 c144 37 266 71 270 75 6 7 189 554 189 566 0 3
60 -13 133 -34 l132 -38 183 182 c171 171 182 184 182 219 0 25 -11 55 -33 90
-19 29 -37 72 -40 96 -3 23 -19 64 -37 91 l-31 49 16 115 c14 105 14 121 0
175 -28 111 -14 212 31 212 8 0 36 -11 62 -25 40 -21 56 -24 100 -18 l53 6
-32 33 c-24 25 -42 34 -66 34 -36 0 -63 21 -88 69 -8 17 -20 31 -25 31 -18 0
-83 65 -136 137 -29 40 -66 79 -81 87 -16 8 -65 52 -111 99 -79 79 -83 85 -71
109 10 23 8 31 -10 57 -12 16 -33 56 -48 88 -14 32 -41 76 -59 99 -22 27 -35
56 -39 90 -4 27 -16 61 -26 76 -11 14 -22 41 -26 60 -10 52 -109 244 -162 311
-26 34 -55 84 -65 110 -10 26 -33 70 -51 97 -18 26 -36 65 -39 87 -11 54 -46
111 -115 182 -51 51 -61 67 -61 96 0 28 -8 40 -44 69 -31 26 -49 52 -65 94
-12 31 -37 82 -56 113 -19 31 -46 89 -61 130 -37 104 -107 229 -175 314 -41
51 -61 86 -69 120 -6 26 -9 50 -6 52 2 2 19 -3 36 -12 l32 -17 -26 35 c-31 41
-34 67 -6 67 31 0 26 46 -10 87 -16 18 -30 40 -30 48 0 8 -15 32 -34 52 -20
23 -36 54 -40 78 -9 49 -69 152 -107 183 -15 12 -33 39 -40 60 -23 72 -58 130
-103 169 -45 40 -81 107 -74 140 2 13 11 17 33 15 l30 -3 -22 18 c-13 10 -26
33 -29 51 -5 22 -16 38 -35 48 -34 17 -36 25 -10 48 14 13 24 14 45 6 15 -5
31 -10 36 -10 9 0 -11 71 -38 133 -17 38 -25 44 -76 60 -64 21 -153 97 -227
195 -24 31 -63 78 -86 104 -24 26 -43 52 -43 57 0 14 -130 182 -161 208 -28
24 -43 68 -54 163 -7 52 -10 57 -61 95 -32 23 -61 54 -70 74 -8 19 -23 40 -33
48 -30 21 -45 78 -31 114 20 48 7 208 -25 300 -21 61 -34 83 -66 108 -98 79
-147 288 -89 383 12 20 16 41 13 67 -5 33 -1 41 27 64 37 31 70 36 70 9 0 -10
14 -31 30 -47 17 -16 30 -35 30 -43 0 -9 12 -35 26 -60 22 -37 26 -56 26 -114
-1 -54 4 -77 18 -97 10 -14 26 -62 35 -106 15 -73 20 -84 63 -128 35 -36 50
-60 57 -94 9 -42 14 -48 43 -57 23 -6 47 -27 77 -66 24 -32 67 -76 95 -100 49
-41 50 -43 50 -96 0 -30 9 -76 19 -104 15 -40 18 -66 14 -128 -7 -95 11 -138
86 -203 29 -27 61 -68 80 -105 29 -60 32 -63 97 -85 l67 -24 33 -70 c18 -38
52 -92 74 -120 23 -27 53 -71 67 -98 18 -36 33 -52 61 -63 158 -64 159 -64
171 -104 9 -31 19 -41 59 -58 26 -11 70 -22 97 -26 57 -7 40 -21 171 149 l69
90 0 85 c0 64 -4 92 -17 112 -27 41 -13 114 40 217 24 47 50 114 57 147 8 34
23 80 35 103 15 30 20 58 19 99 -1 31 3 70 10 85 6 16 11 47 11 70 0 23 7 55
16 72 14 27 13 71 -2 126 -3 9 7 30 21 47 15 18 29 52 35 84 5 29 38 111 75
184 l65 131 -19 54 c-10 30 -23 91 -30 136 -7 48 -28 121 -50 176 -21 51 -69
189 -107 306 -72 224 -66 213 -131 236 -8 3 -8 14 -1 45 10 37 8 43 -12 65
-19 20 -22 31 -16 62 5 34 -9 74 -124 343 -72 168 -143 320 -159 339 l-28 34
-44 -17 c-23 -10 -58 -31 -76 -47 -47 -41 -134 -83 -228 -109 -66 -19 -95 -22
-170 -17 -49 3 -104 11 -122 17 -38 14 -86 1 -145 -37 -20 -14 -55 -27 -77
-30 -38 -5 -41 -4 -41 18 0 35 -27 69 -56 69 -13 0 -41 -15 -63 -35 -33 -30
-46 -35 -87 -35 -40 0 -53 -5 -80 -31 l-32 -31 -70 12 c-69 13 -70 13 -118 75
-42 54 -153 145 -177 145 -4 0 -23 -10 -41 -22 -26 -17 -38 -35 -51 -80 -18
-56 -18 -57 -67 -68 -41 -10 -52 -10 -73 4 -20 14 -25 25 -25 61 l0 45 -108 0
-108 0 -47 48 c-40 41 -47 53 -47 88 0 39 2 41 65 75 69 36 85 67 46 89 -38
20 -75 11 -145 -36 -82 -55 -66 -57 -272 41 -120 57 -138 63 -237 74 -126 14
-151 10 -277 -39 -127 -50 -254 -69 -310 -46 -22 9 -43 16 -46 16 -3 0 -28
-47 -55 -104 -41 -85 -55 -106 -80 -117 -29 -11 -30 -13 -14 -25 17 -12 16
-14 -9 -24 -41 -15 -46 -13 -97 30 -26 22 -50 40 -53 40 -3 0 -67 -48 -143
-108 -208 -162 -295 -221 -442 -301 -122 -66 -140 -73 -205 -78 -90 -6 -131
10 -269 110 -56 41 -132 90 -169 110 -66 37 -68 37 -230 47 -149 9 -283 22
-365 35 -39 7 -63 42 -72 104 -6 45 -7 46 -41 43 -19 -2 -65 -19 -102 -38 -51
-26 -80 -34 -120 -34 -52 0 -54 1 -125 72 -54 54 -73 79 -73 99 0 29 -15 39
-59 39 -15 0 -67 15 -115 34 -91 36 -206 66 -252 66 -15 0 -41 9 -58 19 -24
15 -58 21 -151 26 -174 9 -316 50 -410 118 -46 33 -89 55 -125 64 -75 17 -79
17 -129 -23z" fill="#d4a95c" fillOpacity="0.1" stroke="#d4a95c" strokeWidth="15" strokeLinejoin="round" />
                </g>

                {/* The River Nile */}
                <path d="M 725 985 C 720 970, 720 960, 720 950 C 740 910, 700 890, 710 860 C 720 830, 680 820, 680 750 C 680 720, 700 700, 695 690 C 690 680, 650 675, 615 675 C 580 675, 595 640, 585 620 C 575 600, 580 570, 585 550 C 590 530, 605 490, 600 450 C 595 410, 610 400, 605 380 C 600 360, 615 330, 625 310" fill="none" stroke="#d4a95c" strokeWidth="3" strokeOpacity="0.4" strokeLinecap="round" />
                {/* Delta Branches */}
                <path d="M 625 310 C 620 280, 590 260, 560 220 C 530 180, 510 130, 480 60" fill="none" stroke="#d4a95c" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
                <path d="M 625 310 C 630 280, 645 250, 650 210 C 655 170, 690 130, 705 60" fill="none" stroke="#d4a95c" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />

                
                {/* Distribution nodes over the map */}
                {[
                  [650, 350], [550, 250], [700, 700], [750, 850], [800, 500], [400, 450], [600, 500]
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="10" fill="#d4a95c" fillOpacity="0.9" />
                    <circle cx={x} cy={y} r="25" fill="none" stroke="#d4a95c" strokeOpacity="0.5" strokeWidth="3">
                      <animate attributeName="r" values="10;35" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                      <animate attributeName="stroke-opacity" values="0.8;0" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
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
  const { data: eventsList, isLoading, isError, refetch } = useEvents();
  const { language } = useLanguage();

  return (
    <section className="relative z-20 py-28 md:py-40">
      <div className="container-ov">
        <SectionHead label={t("home.news_label")} title={t("home.news_title")} />
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !eventsList?.length ? (
          <EmptyState message={t("events.empty")} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {eventsList.slice(0, 3).map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08}>
                <article className="card-surface group h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                  <div className="relative h-52 overflow-hidden">
                    <Img src={b.image_path} alt={b.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <span className="t-small inline-flex items-center gap-2 text-gold-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {(b.date ? new Date(b.date) : new Date(b.created_at)).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <h3 className="t-h3 font-display mt-3 line-clamp-2 text-cream-50">{b.title}</h3>
                    <p className="t-small mt-3 line-clamp-2 text-cream-300/70">{stripHtml(b.description).slice(0, 120)}</p>
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








