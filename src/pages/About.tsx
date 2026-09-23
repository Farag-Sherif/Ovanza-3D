import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowUpRight, Factory, Truck, Megaphone, Gem, FlaskConical, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useApi";
import { Reveal, PageHero, Counter, Img, Loader } from "../components/ui";
import { stripHtml } from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useTranslation();
  const { data: s, isLoading } = useSettings();
  const { dir } = useLanguage();

  const capabilities = [
    { icon: Factory, key: "cap_manufacturing" },
    { icon: Truck, key: "cap_distribution" },
    { icon: Megaphone, key: "cap_marketing" },
    { icon: Gem, key: "cap_brand" },
    { icon: FlaskConical, key: "cap_product" },
    { icon: Globe2, key: "cap_export" },
  ];

  return (
    <>
      <PageHero label={t("about.label")} title={t("about.title")} sub={t("hero.sub")} image={s?.about_image_path} />

      {/* Company overview — real API copy */}
      <section className="relative py-24 md:py-32">
        <div className="container-ov grid items-start gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <Reveal>
                  <span className="t-label text-gold-500">{t("about.story_label")}</span>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="t-lead mt-8 whitespace-pre-line text-cream-300/85">
                    {stripHtml(s?.about_us) || ""}
                  </p>
                </Reveal>
              </>
            )}
          </div>

          {/* Counters rail */}
          <div className="card-surface rounded-3xl p-10 lg:sticky lg:top-28">
            <span className="t-label text-gold-500">Ovanza</span>
            <div className="mt-8 flex flex-col gap-10">
              {s && (
                <>
                  <Counter value={s.experience_count ?? 0} label={t("home.counters_years")} />
                  <div className="h-px w-full bg-white/5" />
                  <Counter value={s.employees_count ?? 0} suffix="" label={t("home.counters_employees")} />
                  <div className="h-px w-full bg-white/5" />
                  <Counter value={s.vehicles_count ?? 0} suffix="" label={t("home.counters_vehicles")} />
                </>
              )}
            </div>
            {s?.about_file_path && (
              <a
                href={s.about_file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-10 w-full"
              >
                <Download className="h-4 w-4" /> {t("about.profile_btn")}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative py-24 md:py-32">
        <div className="container-ov">
          <Reveal>
            <span className="t-label text-gold-500">{t("about.capabilities_label")}</span>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.key} delay={i * 0.06}>
                <div className="card-surface group flex items-center gap-5 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 transition-colors duration-500 group-hover:bg-gold-500 group-hover:text-espresso-950">
                    <c.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="t-body font-bold text-cream-50">{t(`about.${c.key}`)}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Presence summary — real facts only */}
      <section className="relative py-24 text-center">
        <div className="container-ov">
          <Reveal>
            <h2 className="t-h2 font-display mx-auto max-w-3xl text-cream-50">{t("home.global_text")}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/brands" className="btn-ghost">{t("nav.brands")}</Link>
              <Link to="/export" className="btn-primary">
                {t("nav.export")}
                {dir === "rtl" ? null : <ArrowUpRight className="h-4 w-4" />}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
