import { Link } from "react-router-dom";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBrands, useProducts } from "../hooks/useApi";
import { Reveal, PageHero, Img, Loader, ErrorState, EmptyState } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

export default function Brands() {
  const { t } = useTranslation();
  const { data: brands, isLoading, isError, refetch } = useBrands();
  const { data: products } = useProducts();
  const { dir } = useLanguage();

  const countFor = (brandId: number) =>
    products?.filter((p) => p.cafe_id === brandId).length ?? 0;

  return (
    <>
      <PageHero label={t("brands.label")} title={t("brands.title")} sub={t("home.brands_sub")} />

      <section className="relative py-20 md:py-28">
        <div className="container-ov">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !brands?.length ? (
            <EmptyState message={t("brands.empty")} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {brands.map((b, i) => (
                <Reveal key={b.id} delay={Math.min(i * 0.07, 0.4)}>
                  <Link
                    to={`/brands/${b.slug}`}
                    className="card-surface group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40"
                  >
                    <div className="relative h-64 overflow-hidden bg-espresso-900/60 md:h-72">
                      <Img
                        src={b.cover || b.logo_path}
                        alt={b.name}
                        className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/20 to-transparent" />
                      {b.logo_path && (
                        <div className="glass absolute top-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 ltr:left-5 rtl:right-5">
                          <img src={b.logo_path} alt="" className="h-full w-full object-contain p-2" loading="lazy" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <h2 className="t-h3 font-display text-cream-50">{b.name}</h2>
                      <span className="t-small mt-2 text-cream-300/60">
                        {countFor(b.id)} {t("brands.products_count")}
                      </span>
                      <span className="t-body mt-auto inline-flex items-center gap-2 pt-6 font-bold text-gold-400">
                        {t("brands.explore")}
                        {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
