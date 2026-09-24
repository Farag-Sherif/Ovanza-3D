import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView as useInViewSense } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHead({
  label,
  title,
  sub,
  align = "center",
}: {
  label: string;
  title: string;
  sub?: string;
  align?: "center" | "start";
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-start";
  return (
    <div className={`flex flex-col gap-5 ${alignCls} mb-14`}>
      <Reveal>
        <span className="t-label inline-flex items-center gap-3 text-gold-500">
          <span className="h-px w-8 bg-gold-600/60" />
          {label}
          <span className="h-px w-8 bg-gold-600/60" />
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="t-h2 font-display text-cream-50 max-w-3xl">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="t-body max-w-xl text-cream-300/80">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Animated counter ---------------- */
export function Counter({
  value,
  suffix = "+",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewSense(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span className="t-h2 font-display gold-text tabular-nums">
        {display.toLocaleString()}
        {suffix}
      </span>
      <span className="t-small text-cream-300/70">{label}</span>
    </div>
  );
}

/* ---------------- Safe image ---------------- */
export function Img({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-espresso-800 ${className}`}
        aria-label={alt}
      >
        <span className="font-display text-2xl text-gold-600/50">O</span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-espresso-800" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-all duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

/* ---------------- Loader / States ---------------- */
export function Loader({ full = false }: { full?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${
        full ? "min-h-[70vh]" : "min-h-[40vh]"
      } w-full`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-14 w-14">
        <span className="absolute inset-0 animate-spin rounded-full border border-gold-600/20 border-t-gold-500" />
        <span className="font-display absolute inset-0 flex items-center justify-center text-lg text-gold-400">O</span>
      </span>
      <span className="t-label text-cream-300/60">OVANZA</span>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
      <span className="t-h3 font-display text-cream-100">{t("states.error")}</span>
      <button onClick={onRetry} className="btn-ghost">{t("states.retry")}</button>
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-display text-5xl text-gold-600/40">O</span>
      <p className="t-body text-cream-300/60">{message || t("states.empty")}</p>
    </div>
  );
}

/* ---------------- Marquee ---------------- */
export function Marquee({ children }: { children: ReactNode }) {
  const { dir } = useLanguage();
  return (
    <div className="relative w-full overflow-hidden" dir={dir}>
      <div className="marquee-track flex w-max items-center gap-16 sm:gap-24">
        {children}
        {children}
      </div>
    </div>
  );
}

/* ---------------- Page hero (inner pages) ---------------- */
export function PageHero({
  label,
  title,
  sub,
  image,
}: {
  label: string;
  title: string;
  sub?: string;
  image?: string | null;
}) {
  return (
    <section className="relative flex min-h-[45svh] items-end overflow-hidden pt-32 pb-16">
      {image && (
        <>
          <Img src={image} alt={title} className="absolute inset-0 h-full w-full" eager />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/70 to-espresso-950/40" />
        </>
      )}
      <div className="container-ov relative">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="t-label text-gold-500 mb-5 block"
        >
          {label}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="t-h1 font-display text-cream-50 max-w-4xl"
        >
          {title}
        </motion.h1>
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="t-lead mt-6 max-w-2xl text-cream-300/85"
          >
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  );
}

