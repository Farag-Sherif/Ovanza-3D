import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBrands, useCategories, useProducts } from "../hooks/useApi";
import { Reveal, PageHero, Img, Loader, ErrorState, EmptyState } from "../components/ui";

export default function Products() {
  const { t } = useTranslation();
  const { data: products, isLoading, isError, refetch } = useProducts();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const [params, setParams] = useSearchParams();

  const brandFilter = params.get("brand") || "";
  const catFilter = params.get("cat") || "";
  const search = params.get("q") || "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (brandFilter) list = list.filter((p) => p.category?.slug === brandFilter || String(p.cafe_id) === brandFilter);
    if (catFilter) list = list.filter((p) => String(p.sub_cafe_id) === catFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q));
    }
    return list;
  }, [products, brandFilter, catFilter, search]);

  return (
    <>
      <PageHero label={t("products.label")} title={t("products.title")} />

      <section className="relative pb-28 pt-4">
        <div className="container-ov">
          {/* Filters */}
          <Reveal>
            <div className="card-surface mb-12 flex flex-col gap-4 rounded-3xl p-6 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500 ltr:left-4 rtl:right-4" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setParam("q", e.target.value)}
                  placeholder={t("products.search")}
                  className="field ltr:pl-11 rtl:pr-11"
                  aria-label={t("products.search")}
                />
              </div>
              <div className="flex gap-4">
                <select
                  className="field lg:w-48"
                  value={brandFilter}
                  onChange={(e) => setParam("brand", e.target.value)}
                  aria-label={t("products.filter_brand")}
                >
                  <option value="">{t("products.filter_brand")} — {t("products.all")}</option>
                  {brands?.map((b) => (
                    <option key={b.id} value={b.slug}>{b.name}</option>
                  ))}
                </select>
                <select
                  className="field lg:w-48"
                  value={catFilter}
                  onChange={(e) => setParam("cat", e.target.value)}
                  aria-label={t("products.filter_category")}
                >
                  <option value="">{t("products.filter_category")} — {t("products.all")}</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Reveal>

          {isLoading ? (
            <Loader />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState message={products?.length ? t("products.empty") : t("products.empty_state")} />
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                  <Link
                    to={`/products/${p.id}`}
                    className="card-surface group block h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40"
                  >
                    <div className="relative h-52 overflow-hidden bg-espresso-900/70 md:h-64">
                      <Img src={p.image_path} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {p.category?.name && (
                        <span className="glass t-small absolute top-4 rounded-full border border-white/10 px-3 py-1 text-cream-100/90 ltr:left-4 rtl:right-4">
                          {p.category.name}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="t-body line-clamp-2 min-h-[2.6em] font-bold text-cream-50">{p.name}</h3>
                      {p.weight && <span className="t-small mt-2 block text-gold-400">{p.weight}</span>}
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
