import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, ArrowUpRight, ArrowUpLeft, BookOpen, Share2, Check, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useBlogs, useBlog } from "../hooks/useApi";
import { Reveal, PageHero, Img, Loader, ErrorState, EmptyState } from "../components/ui";
import { stripHtml } from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function Blog() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { language, dir } = useLanguage();
  const [copied, setCopied] = useState(false);

  const { data: blogData, isLoading: isLoadingSingle, isError: isErrorSingle, refetch: refetchSingle } = useBlog(id);
  const { data: blogsList, isLoading: isLoadingList, isError: isErrorList, refetch: refetchList } = useBlogs();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(language === "ar" ? "تم نسخ رابط المقال" : "Article link copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // --- Single Article Reading View ---
  if (id) {
    if (isLoadingSingle) return <Loader full />;
    if (isErrorSingle || !blogData) return <ErrorState onRetry={() => refetchSingle()} />;

    const post = blogData;
    const postDate = post.created_at ? new Date(post.created_at) : new Date();
    const plainText = stripHtml(post.content || "");
    const readMinutes = Math.max(1, Math.round(plainText.split(/\s+/).length / 180));

    return (
      <>
        <PageHero
          label={t("blog.label")}
          title={post.title}
          image={post.image_path || undefined}
        />

        <article className="relative py-20">
          <div className="container-ov max-w-4xl">
            {/* Meta bar */}
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 text-gold-400">
                <div className="flex flex-wrap items-center gap-4 t-small">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {postDate.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="inline-flex items-center gap-1.5 text-cream-300/70">
                    <Clock className="h-3.5 w-3.5 text-gold-500" />
                    {readMinutes} {language === "ar" ? "دقائق قراءة" : "min read"}
                  </span>
                </div>

                <button
                  onClick={handleShare}
                  className="glass inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-cream-100 transition-colors hover:border-gold-500 hover:text-gold-300"
                  aria-label={t("blog.share")}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                  <span>{copied ? (language === "ar" ? "تم النسخ" : "Copied") : t("blog.share")}</span>
                </button>
              </div>
            </Reveal>

            {/* Featured Image */}
            {post.image_path && (
              <Reveal delay={0.1}>
                <div className="group relative mt-10 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                  <Img
                    src={post.image_path}
                    alt={post.title}
                    className="aspect-video w-full object-cover"
                    eager
                  />

                  {/* Bottom Image Overlay & Actions */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-gradient-to-t from-espresso-950/95 via-espresso-950/50 to-transparent p-5 pt-20 sm:p-7 sm:pt-24 md:p-8 md:pt-28 pointer-events-none">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 pointer-events-auto">
                      <Link
                        to="/brands"
                        className="btn-primary !px-5 !py-2.5 sm:!px-6 sm:!py-3 !text-xs sm:!text-sm shadow-[0_8px_25px_-6px_rgba(212,169,92,0.6)]"
                      >
                        <span>{t("blog.explore_brands", "Explore Our Brands")}</span>
                        {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </Link>

                      <Link
                        to="/contact"
                        className="glass inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/40 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-cream-100 transition-all duration-300 hover:border-gold-400 hover:text-gold-300 hover:shadow-[0_8px_25px_-6px_rgba(212,169,92,0.3)] hover:-translate-y-0.5"
                      >
                        <span>{t("blog.become_partner", "Become Our Business Partner")}</span>
                        {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4 text-gold-400" /> : <ArrowUpRight className="h-4 w-4 text-gold-400" />}
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Article Content */}
            <Reveal delay={0.2}>
              <div
                className="rich-text t-lead mt-12 text-cream-300/90 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </Reveal>

            {/* Bottom Actions */}
            <Reveal delay={0.3}>
              <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
                <Link to="/blog" className="btn-ghost">
                  {dir === "rtl" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowUpLeft className="h-4 w-4" />}
                  <span>{t("blog.back")}</span>
                </Link>

                <button
                  onClick={handleShare}
                  className="glass inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-5 py-2.5 text-xs font-semibold text-cream-100 hover:border-gold-500 hover:text-gold-300 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-gold-400" />
                  <span>{t("blog.share")}</span>
                </button>
              </div>
            </Reveal>
          </div>
        </article>
      </>
    );
  }

  // --- Blog Listing View ---
  if (isLoadingList) return <Loader full />;
  if (isErrorList) return <ErrorState onRetry={() => refetchList()} />;

  return (
    <>
      <PageHero
        label={t("blog.label")}
        title={t("blog.title")}
        sub={t("blog.subtitle")}
      />

      <section className="relative pb-32 pt-8">
        <div className="container-ov">
          {!blogsList?.length ? (
            <EmptyState message={t("blog.empty")} />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogsList.map((post, idx) => {
                const postDate = post.created_at ? new Date(post.created_at) : new Date();
                const excerpt = stripHtml(post.content).slice(0, 150);

                return (
                  <Reveal key={post.id} delay={Math.min(idx * 0.08, 0.3)}>
                    <Link
                      to={`/blog/${post.id}`}
                      className="card-surface group flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40"
                    >
                      {/* Image Box */}
                      <div className="relative aspect-video w-full overflow-hidden bg-espresso-900/60">
                        {post.image_path ? (
                          <Img
                            src={post.image_path}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-espresso-900/80 text-gold-500/40">
                            <BookOpen className="h-12 w-12" />
                          </div>
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="flex flex-1 flex-col justify-between p-7">
                        <div>
                          <span className="t-small inline-flex items-center gap-2 text-gold-400 font-medium">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {postDate.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>

                          <h3 className="t-h3 font-display mt-3 line-clamp-2 text-cream-50 group-hover:text-gold-300 transition-colors">
                            {post.title}
                          </h3>

                          {excerpt && (
                            <p className="t-small mt-3 line-clamp-3 text-cream-300/70 leading-relaxed font-sans">
                              {excerpt}...
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="t-small inline-flex items-center gap-2 font-bold text-gold-400 group-hover:underline">
                            {t("blog.read")}
                            {dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
