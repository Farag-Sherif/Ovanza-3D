import { GraduationCap, TrendingUp, Lightbulb, Users, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useApi";
import { Reveal, PageHero, SectionHead, EmptyState } from "../components/ui";

export default function Careers() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();

  const why = [
    { icon: TrendingUp, title: t("careers.why_growth"), text: t("careers.why_growth_d") },
    { icon: GraduationCap, title: t("careers.why_learning"), text: t("careers.why_learning_d") },
    { icon: Lightbulb, title: t("careers.why_innovation"), text: t("careers.why_innovation_d") },
    { icon: Users, title: t("careers.why_team"), text: t("careers.why_team_d") },
  ];

  return (
    <>
      <PageHero label={t("careers.label")} title={t("careers.title")} sub={t("hero.sub")} image={settings?.banner_image_path ?? null} />

      {/* Culture */}
      <section className="relative py-24">
        <div className="container-ov max-w-3xl text-center">
          <Reveal>
            <h2 className="t-h2 font-display text-cream-50">{t("careers.culture_title")}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="t-lead mt-8 text-cream-300/80">
              {settings?.about_us ? String(settings.about_us).split("\n")[0] : t("hero.sub")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why join us — editorial tiles */}
      <section className="relative py-24">
        <div className="container-ov">
          <SectionHead label={t("careers.label")} title={t("careers.why_title")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="card-surface group h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400 transition-colors duration-500 group-hover:bg-gold-500 group-hover:text-espresso-950">
                    <w.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="t-h3 font-display mb-3 text-cream-50">{w.title}</h3>
                  <p className="t-body text-cream-300/75">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions — the backend exposes no jobs endpoint,
          so we show the honest empty state + direct email channel */}
      <section className="relative py-24">
        <div className="container-ov">
          <SectionHead label={t("careers.label")} title={t("careers.positions_title")} />
          <EmptyState message={t("careers.empty_positions")} />
          {settings?.email && (
            <Reveal delay={0.15}>
              <div className="mt-6 text-center">
                <a href={`mailto:${settings.email}?subject=Career Application`} className="btn-primary">
                  <Mail className="h-4 w-4" /> {t("careers.apply_email")}
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
