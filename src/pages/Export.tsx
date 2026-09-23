import { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Send, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useBrands, useCategories } from "../hooks/useApi";
import { Reveal, PageHero, SectionHead } from "../components/ui";
import { submitContact } from "../api/services";
import { useLanguage } from "../context/LanguageContext";

export default function Export() {
  const { t } = useTranslation();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { language, dir } = useLanguage();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  /* The existing backend exposes a single POST /contact endpoint
     (name, email, subject, message). The export inquiry is composed
     into that contract — structured into subject/message — without
     inventing any new backend endpoint. */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const fields = [
      `${t("export.name")}: ${f.get("name")}`,
      `${t("export.company")}: ${f.get("company")}`,
      `${t("export.country")}: ${f.get("country")}`,
      `${t("export.city")}: ${f.get("city")}`,
      `${t("export.phone")}: ${f.get("phone")}`,
      `${t("export.business_type")}: ${f.get("business_type")}`,
      `${t("export.brand_interest")}: ${f.get("brand")}`,
      `${t("export.quantity")}: ${f.get("quantity")}`,
    ].join("\n");

    setSending(true);
    try {
      await submitContact(
        {
          name: String(f.get("name") || ""),
          email: String(f.get("email") || ""),
          subject: `[Export Inquiry] ${f.get("company") || f.get("name")}`,
          message: `${fields}\n\n${f.get("message") || ""}`,
        },
        language
      );
      setDone(true);
      toast.success(t("export.success"));
    } catch {
      toast.error(t("states.error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero label={t("export.label")} title={t("export.title")} sub={t("export.overview_title")} />

      {/* Export journey */}
      <section className="relative py-24">
        <div className="container-ov">
          <SectionHead label={t("export.label")} title={t("export.process_title")} />
          <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-7 lg:px-0">
            {t("export.process", { returnObjects: true }).map((step, i) => (
              <Reveal key={i} delay={i * 0.07} className="min-w-[150px] flex-1">
                <div className="group relative h-full rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center transition-all duration-500 hover:border-gold-500/40 hover:bg-white/[0.05]">
                  <span className="font-display mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-lg text-gold-400">
                    {i + 1}
                  </span>
                  <span className="t-small font-bold text-cream-100">{step}</span>
                  {i < 6 && (
                    <span className="absolute top-1/2 h-px w-4 bg-gold-600/40 ltr:-right-2 rtl:-left-2" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Available brands + categories — real API data */}
      <section className="relative py-24">
        <div className="container-ov grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead label={t("export.label")} title={t("export.brands")} align="start" />
            <div className="flex flex-wrap gap-3">
              {brands?.map((b, i) => (
                <Reveal key={b.id} delay={i * 0.05}>
                  <span className="t-small glass inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-semibold text-cream-100">
                    {b.logo_path && <img src={b.logo_path} alt="" className="h-5 w-5 object-contain" loading="lazy" />}
                    {b.name}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <SectionHead label={t("export.label")} title={t("export.categories")} align="start" />
            <div className="flex flex-wrap gap-3">
              {categories?.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.05}>
                  <span className="t-small rounded-full border border-gold-600/30 bg-gold-500/8 px-5 py-3 font-semibold text-gold-300">
                    {c.name}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Export inquiry form */}
      <section className="relative py-24">
        <div className="container-ov max-w-3xl">
          <SectionHead label={t("export.label")} title={t("export.form_title")} sub={t("export.form_sub")} />

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface flex flex-col items-center gap-6 rounded-3xl p-14 text-center"
            >
              <CheckCircle2 className="h-14 w-14 text-gold-400" strokeWidth={1.4} />
              <p className="t-h3 font-display text-cream-50">{t("export.success")}</p>
            </motion.div>
          ) : (
            <Reveal>
              <form onSubmit={onSubmit} className="card-surface grid gap-5 rounded-3xl p-8 md:grid-cols-2 md:p-10">
                <div>
                  <label className="field-label" htmlFor="x-name">{t("export.name")} *</label>
                  <input id="x-name" name="name" required className="field" autoComplete="name" />
                </div>
                <div>
                  <label className="field-label" htmlFor="x-company">{t("export.company")} *</label>
                  <input id="x-company" name="company" required className="field" autoComplete="organization" />
                </div>
                <div>
                  <label className="field-label" htmlFor="x-country">{t("export.country")} *</label>
                  <input id="x-country" name="country" required className="field" autoComplete="country-name" />
                </div>
                <div>
                  <label className="field-label" htmlFor="x-city">{t("export.city")}</label>
                  <input id="x-city" name="city" className="field" autoComplete="address-level2" />
                </div>
                <div>
                  <label className="field-label" htmlFor="x-phone">{t("export.phone")} *</label>
                  <input id="x-phone" name="phone" type="tel" required className="field" dir="ltr" autoComplete="tel" />
                </div>
                <div>
                  <label className="field-label" htmlFor="x-email">{t("export.email")} *</label>
                  <input id="x-email" name="email" type="email" required className="field" autoComplete="email" />
                </div>
                <div>
                  <label className="field-label" htmlFor="x-btype">{t("export.business_type")}</label>
                  <select id="x-btype" name="business_type" className="field">
                    <option value="importer">Importer</option>
                    <option value="distributor">Distributor</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="retailer">Retailer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="x-brand">{t("export.brand_interest")}</label>
                  <select id="x-brand" name="brand" className="field">
                    <option value="">{t("export.select_brand")}</option>
                    {brands?.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="field-label" htmlFor="x-qty">{t("export.quantity")}</label>
                  <input id="x-qty" name="quantity" className="field" />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label" htmlFor="x-msg">{t("export.message")}</label>
                  <textarea id="x-msg" name="message" className="field" rows={5} />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
                    <Send className="h-4 w-4" />
                    {sending ? t("states.loading") : t("export.submit")}
                  </button>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
