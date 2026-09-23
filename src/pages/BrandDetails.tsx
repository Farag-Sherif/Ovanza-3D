import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpLeft, ArrowUpRight, Download, Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBrands, useProducts, useSettings, useSocials } from "../hooks/useApi";
import { Reveal, Img, Loader, ErrorState, EmptyState, SectionHead } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";
import { stripHtml } from "../api/client";

export default function BrandDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: brands, isLoading, isError, refetch } = useBrands();
  const { data: products } = useProducts();
  const { data: settings } = useSettings();
  const { data: socials } = useSocials();
  const { language, dir } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const brand = useMemo(() => brands?.find((b) => b.slug === slug), [brands, slug]);
  const brandProducts = useMemo(
    () => (brand ? products?.filter((p) => p.cafe_id === brand.id) ?? [] : []),
    [brand, products]
  );
  const wa = socials?.find((s) => s.url?.includes("whatsapp"));

  if (isLoading) return <Loader full />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!brand) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-24 text-center">
        <EmptyState message={t("brands.empty")} />
        <Link to="/brands" className="btn-ghost">{t("brands.back")}</Link>
      </div>
    );
  }

  const story = stripHtml(brand.translations?.find((tr) => tr.locale === language)?.description || "") ||
    stripHtml(brand.translations?.find((tr) => tr.locale === "en")?.description || "") ||
    (brand as unknown as { description?: string | null }).description || "";

  return (
    <>
      {/* ---------- Brand Hero ---------- */}
      <section ref={heroRef} className="relative flex min-h-[92svh] items-end overflow-hidden pb-20">
        <motion.div style={{ y: bgY }} className="absolute inset-0 -top-1/4 h-[125%]">
          <Img src={brand.cover || brand.logo_path} alt={brand.name} className="h-full w-full" eager />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/60 to-espresso-950/30" />

        <motion.div style={{ opacity: fade }} className="container-ov relative z-10">
          <Reveal>
            <Link to="/brands" className="u-sweep t-small inline-flex items-center gap-2 text-gold-400">
              {dir === "rtl" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowUpLeft className="h-4 w-4" />}
              {t("brands.back")}
            </Link>
          </Reveal>
          {brand.logo_path && (
            <Reveal delay={0.1}>
              <div className="glass mt-8 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/10 md:h-32 md:w-32">
                <img src={brand.logo_path} alt={brand.name} className="h-full w-full object-contain p-3" />
              </div>
            </Reveal>
          )}
          <Reveal delay={0.2}>
            <h1 className="t-hero font-display mt-8 text-cream-50">{brand.name}</h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="t-lead mt-4 text-cream-300/80">
              {brandProducts.length} {t("brands.products_count")} · Ovanza {t("brands.label")}
            </p>
          </Reveal>
        </motion.div>
      </section>

      {/* ---------- Brand Story (only real data) ---------- */}
      {story ? (
        <section className="relative py-24">
          <div className="container-ov grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <span className="t-label text-gold-500">{t("brands.story")}</span>
              <h2 className="t-h2 font-display mt-6 text-cream-50">{brand.name}</h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="t-lead whitespace-pre-line text-cream-300/85">{story}</p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ---------- Product Collection ---------- */}
      <section className="relative py-24">
        <div className="container-ov">
          <SectionHead label={brand.name} title={t("brands.collection")} align="start" />
          {brandProducts.length === 0 ? (
            <EmptyState message={t("brands.no_products")} />
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {brandProducts.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.05, 0.35)}>
                  <Link
                    to={`/products/${p.id}`}
                    className="card-surface group block overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40"
                  >
                    <div className="relative h-52 overflow-hidden bg-espresso-900/70 md:h-60">
                      <Img src={p.image_path} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-4">
                      <h3 className="t-small line-clamp-2 font-bold text-cream-50">{p.name}</h3>
                      {p.weight && <span className="t-small mt-1 block text-cream-300/50">{p.weight}</span>}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Brand Contact ---------- */}
      <section className="relative py-24">
        <div className="container-ov">
          <SectionHead label={brand.name} title={t("contact.title")} />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {settings?.phone && (
              <a href={`tel:+${settings.phone}`} className="btn-ghost"><Phone className="h-4 w-4" /> {t("contact.phone")}</a>
            )}
            {wa && (
              <a href={wa.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="btn-ghost"><Mail className="h-4 w-4" /> Email</a>
            )}
            {brand.url && (
              <a href={brand.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Globe className="h-4 w-4" /> {t("brands.visit")}
              </a>
            )}
            {settings?.about_file_path && (
              <a href={settings.about_file_path} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Download className="h-4 w-4" /> {t("footer.profile")}
              </a>
            )}
          </div>

          {/* social buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {socials?.filter((s) => !s.url?.includes("whatsapp")).map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/60"
              >
                {s.icon_path ? (
                  <img src={s.icon_path} alt="" className="h-5 w-5 object-contain invert" loading="lazy" />
                ) : (
                  <Globe className="h-5 w-5 text-gold-400" />
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
