import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBlogs } from "../hooks/useApi";
import { Reveal, PageHero, Img, Loader, ErrorState, EmptyState } from "../components/ui";
import { stripHtml } from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function Events() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: blogs, isLoading, isError, refetch } = useBlogs();
  const { language } = useLanguage();

  const single = useMemo(() => blogs?.find((b) => String(b.id) === id), [blogs, id]);
  const byYear = useMemo(() => {
    const map = new Map<string, typeof blogs>();
    (blogs ?? []).forEach((b) => {
      const y = new Date(b.created_at).getFullYear().toString();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(b);
    });
    return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [blogs]);

  if (isLoading) return <Loader full />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  /* ---- single event/news view ---- */
  if (single) {
    return (
      <>
        <PageHero label={t("events.label")} title={single.title} image={single.image_path} />
        <section className="relative py-20">
          <div className="container-ov max-w-3xl">
            <Reveal>
              <span className="t-small inline-flex items-center gap-2 text-gold-400">
                <CalendarDays className="h-4 w-4" />
                {new Date(single.created_at).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <div
                className="rich-text t-lead mt-8 text-cream-300/85"
                dangerouslySetInnerHTML={{ __html: single.content || "" }}
              />
            </Reveal>
            {single.image_path && (
              <Reveal delay={0.2}>
                <Img src={single.image_path} alt={single.title} className="mt-12 aspect-video w-full rounded-3xl object-cover" />
              </Reveal>
            )}
            <Reveal delay={0.25}>
              <div className="mt-14 text-center">
                <Link to="/events" className="btn-ghost">{t("home.news_cta")}</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  /* ---- timeline listing ---- */
  return (
    <>
      <PageHero label={t("events.label")} title={t("events.title")} />
      <section className="relative pb-28 pt-4">
        <div className="container-ov">
          {!blogs?.length ? (
            <EmptyState message={t("events.empty")} />
          ) : (
            <div className="relative">
              {/* timeline spine */}
              <span className="absolute top-0 h-full w-px bg-gradient-to-b from-gold-600/50 via-white/10 to-transparent ltr:left-0 rtl:right-0 md:ltr:left-1/2 md:rtl:right-1/2" />
              {byYear.map(([year, items]) => (
                <div key={year} className="relative mb-16">
                  <Reveal>
                    <span className="font-display t-h2 gold-text relative z-10 mb-10 block ltr:md:text-center">
                      {year}
                    </span>
                  </Reveal>
                  <div className="flex flex-col gap-8">
                    {items.map((b, i) => (
                      <Reveal key={b.id} delay={Math.min(i * 0.08, 0.3)}>
                        <Link
                          to={`/events/${b.id}`}
                          className={`card-surface group grid overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 md:grid-cols-[280px_1fr] ${
                            i % 2 === 1 ? "md:ltr:ml-[8%]" : ""
                          }`}
                        >
                          <div className="relative h-52 overflow-hidden md:h-full">
                            <Img src={b.image_path} alt={b.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                          <div className="p-7">
                            <span className="t-small inline-flex items-center gap-2 text-gold-400">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(b.created_at).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                            <h3 className="t-h3 font-display mt-3 text-cream-50">{b.title}</h3>
                            <p className="t-small mt-3 line-clamp-2 text-cream-300/70">{stripHtml(b.content).slice(0, 160)}</p>
                            <span className="t-small mt-5 inline-flex items-center gap-2 font-bold text-gold-400">
                              {t("events.read")} <span aria-hidden>→</span>
                            </span>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
