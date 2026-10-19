import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  ArrowUpRight,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Images,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEvents, useEvent } from "../hooks/useApi";
import { Reveal, PageHero, Img, Loader, ErrorState, EmptyState } from "../components/ui";
import { cdnUrl, stripHtml } from "../api/client";
import { useLanguage } from "../context/LanguageContext";

function EventGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { dir } = useLanguage();

  if (images.length === 0) return null;

  const next = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowRight") dir === "rtl" ? prev() : next();
      else if (e.key === "ArrowLeft") dir === "rtl" ? next() : prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, dir, images.length]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen]);

  if (images.length === 1) {
    return (
      <>
        <div
          className="relative mt-12 overflow-hidden rounded-3xl group cursor-pointer shadow-2xl border border-white/10"
          onClick={() => setLightboxOpen(true)}
        >
          <Img
            src={images[0]}
            alt={title}
            className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="glass rounded-full p-3.5 text-cream-100 shadow-xl border border-white/20">
              <Maximize2 className="h-5 w-5" />
            </span>
          </div>
        </div>

        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/95 backdrop-blur-2xl p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 ltr:right-6 rtl:left-6 z-50 glass rounded-full p-3 text-cream-100 hover:text-gold-300 border border-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={images[0]}
              alt={title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mt-12 space-y-4">
      {/* Main Viewport */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl card-surface group shadow-2xl border border-white/10">
        <Img
          src={images[activeIdx]}
          alt={`${title} - ${activeIdx + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Counter Badge */}
        <div className="absolute top-4 ltr:left-4 rtl:right-4 z-10">
          <span className="glass inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-cream-100 shadow-lg backdrop-blur-md">
            <Images className="h-3.5 w-3.5 text-gold-400" />
            <span>{activeIdx + 1} / {images.length}</span>
          </span>
        </div>

        {/* Fullscreen Expand Button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 ltr:right-4 rtl:left-4 z-10 glass rounded-full p-2.5 text-cream-100 hover:text-gold-300 border border-white/15 shadow-lg transition-colors"
          aria-label="Fullscreen view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="pointer-events-auto glass rounded-full p-3 text-cream-100 hover:text-gold-300 border border-white/15 shadow-xl transition-all hover:scale-110 active:scale-95"
            aria-label="Previous image"
          >
            {dir === "rtl" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="pointer-events-auto glass rounded-full p-3 text-cream-100 hover:text-gold-300 border border-white/15 shadow-xl transition-all hover:scale-110 active:scale-95"
            aria-label="Next image"
          >
            {dir === "rtl" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto py-2 px-1">
        {images.map((img, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative h-16 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${
                isActive
                  ? "ring-2 ring-gold-400 scale-105 shadow-[0_0_20px_rgba(212,169,92,0.4)]"
                  : "opacity-60 hover:opacity-100 border border-white/10"
              }`}
              aria-label={`Select photo ${i + 1}`}
            >
              <Img src={img} alt={`thumb-${i}`} className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-espresso-950/95 backdrop-blur-2xl p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
            <span className="glass inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-cream-100">
              <Images className="h-4 w-4 text-gold-400" />
              <span>{activeIdx + 1} / {images.length}</span>
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="glass rounded-full p-3 text-cream-100 hover:text-gold-300 border border-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Large Viewport */}
          <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeIdx]}
              alt={`${title} - ${activeIdx + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />
            <div className="absolute inset-y-0 inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="pointer-events-auto glass rounded-full p-3 sm:p-4 text-cream-100 hover:text-gold-300 border border-white/20 shadow-2xl hover:scale-110 active:scale-95 transition-all"
                aria-label="Previous image"
              >
                {dir === "rtl" ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="pointer-events-auto glass rounded-full p-3 sm:p-4 text-cream-100 hover:text-gold-300 border border-white/20 shadow-2xl hover:scale-110 active:scale-95 transition-all"
                aria-label="Next image"
              >
                {dir === "rtl" ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-3xl no-scrollbar flex justify-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
                  i === activeIdx
                    ? "ring-2 ring-gold-400 scale-105 shadow-lg"
                    : "opacity-40 hover:opacity-100 border border-white/10"
                }`}
              >
                <img src={img} alt={`thumb-${i}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Events() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { language, dir } = useLanguage();

  const { data: eventData, isLoading: isLoadingSingle, isError: isErrorSingle, refetch: refetchSingle } = useEvent(id);
  const { data: eventsList, isLoading: isLoadingList, isError: isErrorList, refetch: refetchList } = useEvents();

  const byYear = useMemo(() => {
    const map = new Map<string, typeof eventsList>();
    (eventsList ?? []).forEach((b) => {
      const d = b.date ? new Date(b.date) : new Date(b.created_at);
      const y = d.getFullYear().toString();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(b);
    });
    return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [eventsList]);

  const singleImages = useMemo(() => {
    if (!eventData) return [];
    const urls: string[] = [];
    const add = (u?: string | null) => {
      if (!u) return;
      const res = cdnUrl(u) || u;
      if (res && !urls.includes(res)) urls.push(res);
    };

    add(eventData.image_path || eventData.image);

    const extra = (eventData.images || eventData.media || eventData.gallery || (eventData as any).event_images) ?? [];
    if (Array.isArray(extra)) {
      extra.forEach((item: any) => {
        if (typeof item === "string") add(item);
        else if (item && typeof item === "object") {
          add(item.image_path || item.image || item.url);
        }
      });
    }

    return urls;
  }, [eventData]);

  if (id) {
    if (isLoadingSingle) return <Loader full />;
    if (isErrorSingle || !eventData) return <ErrorState onRetry={() => refetchSingle()} />;
    
    const single = eventData;
    const d = single.date ? new Date(single.date) : new Date(single.created_at);

    return (
      <>
        <PageHero label={t("events.label")} title={single.title} image={singleImages[0] || single.image_path} />
        <section className="relative py-20">
          <div className="container-ov max-w-4xl">
            <Reveal>
              <span className="t-small inline-flex items-center gap-2 text-gold-400">
                <CalendarDays className="h-4 w-4" />
                {d.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
                  year: "numeric", month: "long", day: "numeric",
                })}
                {single.place && (
                  <>
                    <span className="mx-2 opacity-50">|</span>
                    <span>{single.place}</span>
                  </>
                )}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <div
                className="rich-text t-lead mt-8 text-cream-300/85"
                dangerouslySetInnerHTML={{ __html: single.description || "" }}
              />
            </Reveal>

            {/* Multi-Image Gallery or Single Image */}
            <Reveal delay={0.2}>
              <EventGallery images={singleImages} title={single.title} />
            </Reveal>

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

  if (isLoadingList) return <Loader full />;
  if (isErrorList) return <ErrorState onRetry={() => refetchList()} />;

  return (
    <>
      <PageHero label={t("events.label")} title={t("events.title")} />
      <section className="relative pb-28 pt-4">
        <div className="container-ov">
          {!eventsList?.length ? (
            <EmptyState message={t("events.empty")} />
          ) : (
            <div className="relative">
              <span className="absolute top-0 h-full w-px bg-gradient-to-b from-gold-600/50 via-white/10 to-transparent ltr:left-0 rtl:right-0 md:ltr:left-1/2 md:rtl:right-1/2" />
              {byYear.map(([year, items]) => (
                <div key={year} className="relative mb-16">
                  <Reveal>
                    <span className="font-display t-h2 gold-text relative z-10 mb-10 block ltr:md:text-center">
                      {year}
                    </span>
                  </Reveal>
                  <div className="flex flex-col gap-8">
                    {items.map((b, i) => {
                      const eventDate = b.date ? new Date(b.date) : new Date(b.created_at);
                      return (
                        <Reveal key={b.id} delay={Math.min(i * 0.08, 0.3)}>
                          <Link
                            to={`/events/${b.id}`}
                            className={`card-surface group grid overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 md:grid-cols-[280px_1fr] ${
                              i % 2 === 1 ? "md:ltr:ml-[8%]" : ""
                            }`}
                          >
                            <div className="relative h-52 overflow-hidden md:h-full">
                              <Img src={b.image_path} alt={b.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              {(b.images && b.images.length > 0) && (
                                <span className="absolute top-3 ltr:right-3 rtl:left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md border border-white/10 shadow-lg">
                                  <Images className="h-3.5 w-3.5" />
                                  <span>{1 + b.images.length}</span>
                                </span>
                              )}
                            </div>
                            <div className="p-7">
                              <span className="t-small inline-flex items-center gap-2 text-gold-400">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {eventDate.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
                              </span>
                              <h3 className="t-h3 font-display mt-3 text-cream-50">{b.title}</h3>
                              <p className="t-small mt-3 line-clamp-2 text-cream-300/70">{stripHtml(b.description).slice(0, 160)}</p>
                              <span className="t-small mt-5 inline-flex items-center gap-2 font-bold text-gold-400">
                                {t("events.read")} {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                              </span>
                            </div>
                          </Link>
                        </Reveal>
                      );
                    })}
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

