import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpLeft, ArrowUpRight, Package, Ruler, MapPin, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProducts, useSettings } from "../hooks/useApi";
import { Reveal, Img, Loader, ErrorState, EmptyState, SectionHead } from "../components/ui";
import { stripHtml } from "../api/client";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: products, isLoading, isError, refetch } = useProducts();
  const { data: settings } = useSettings();

  const product = useMemo(
    () => products?.find((p) => String(p.id) === id),
    [products, id]
  );

  const related = useMemo(
    () =>
      product
        ? products?.filter((p) => p.id !== product.id && p.cafe_id === product.cafe_id).slice(0, 4) ?? []
        : [],
    [products, product]
  );

  if (isLoading) return <Loader full />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-24 text-center">
        <EmptyState message={t("products.empty")} />
        <Link to="/products" className="btn-ghost">{t("home.products_all")}</Link>
      </div>
    );
  }

  const gallery = [product.image_path, ...(product.media?.map((m) => m.image_path) ?? [])].filter(Boolean) as string[];
  const description = stripHtml(product.description);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-36">
        <div className="container-ov grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="card-surface relative overflow-hidden rounded-[2rem]">
              <Img src={product.image_path} alt={product.name} className="aspect-square w-full object-cover" eager />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Link
                to={`/brands/${product.category?.slug ?? ""}`}
                className="t-small inline-flex items-center gap-2 rounded-full border border-gold-600/40 bg-gold-500/10 px-4 py-2 font-semibold text-gold-300"
              >
                <Package className="h-3.5 w-3.5" />
                {t("products.from_brand")} {product.category?.name}
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="t-h1 font-display mt-6 text-cream-50">{product.name}</h1>
            </Reveal>
            {description && (
              <Reveal delay={0.2}>
                <p className="t-lead mt-6 whitespace-pre-line text-cream-300/85">{description}</p>
              </Reveal>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              {(product.weight || product.country_origin) && (
                <>
                  {product.weight && (
                    <Reveal delay={0.25}>
                      <span className="t-small glass inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-cream-100/90">
                        <Ruler className="h-4 w-4 text-gold-400" /> {t("products.weight")}: {product.weight}
                      </span>
                    </Reveal>
                  )}
                  {product.country_origin && (
                    <Reveal delay={0.3}>
                      <span className="t-small glass inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-cream-100/90">
                        <MapPin className="h-4 w-4 text-gold-400" /> {t("products.origin")}: {product.country_origin}
                      </span>
                    </Reveal>
                  )}
                </>
              )}
            </div>

            <Reveal delay={0.35}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">
                  <Send className="h-4 w-4" /> {t("products.request_info")}
                </Link>
                {product.category?.slug && (
                  <Link to={`/brands/${product.category.slug}`} className="btn-ghost">
                    {t("brands.explore")}
                    <ArrowUpRight className="h-4 w-4 rtl:hidden" />
                    <ArrowUpLeft className="h-4 w-4 ltr:hidden" />
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 1 && (
        <section className="relative py-16">
          <div className="container-ov">
            <SectionHead label={product.name} title={t("products.details")} align="start" />
            <div className="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4">
              {gallery.map((g, i) => (
                <div key={i} className="card-surface w-[260px] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-[340px]">
                  <Img src={g} alt={`${product.name} ${i + 1}`} className="h-72 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="relative py-20">
          <div className="container-ov">
            <SectionHead label={product.category?.name ?? ""} title={t("products.related")} align="start" />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <Link to={`/products/${p.id}`} className="card-surface group block overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                    <div className="h-44 overflow-hidden bg-espresso-900/70">
                      <Img src={p.image_path} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-4">
                      <h3 className="t-small line-clamp-2 font-bold text-cream-50">{p.name}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
