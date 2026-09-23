import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSettings, useSocials } from "../hooks/useApi";
import { Reveal, PageHero, SectionHead } from "../components/ui";
import { submitContact } from "../api/services";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const { data: socials } = useSocials();
  const { language } = useLanguage();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const wa = socials?.find((s) => s.url?.includes("whatsapp"));
  const inquiryOptions = Object.entries(t("inquiry", { returnObjects: true }) as Record<string, string>);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSending(true);
    try {
      await submitContact(
        {
          name: String(f.get("name") || ""),
          email: String(f.get("email") || ""),
          subject: `[${f.get("inquiry_type")}] ${f.get("subject") || "—"}`,
          message: String(f.get("message") || ""),
        },
        language
      );
      setDone(true);
      toast.success(t("contact.success"));
    } catch {
      toast.error(t("states.error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero label={t("contact.label")} title={t("contact.title")} sub={t("contact.sub")} />

      {/* Info cards */}
      <section className="relative py-20">
        <div className="container-ov grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {settings?.addresse && (
            <Reveal>
              <div className="card-surface h-full rounded-3xl p-7">
                <MapPin className="mb-5 h-6 w-6 text-gold-400" strokeWidth={1.6} />
                <h3 className="t-body mb-2 font-bold text-cream-50">{t("contact.hq")}</h3>
                <p className="t-small text-cream-300/70">{settings.addresse.replace("_", ", ")}</p>
              </div>
            </Reveal>
          )}
          {settings?.phone && (
            <Reveal delay={0.08}>
              <a href={`tel:+${settings.phone}`} className="card-surface block h-full rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                <Phone className="mb-5 h-6 w-6 text-gold-400" strokeWidth={1.6} />
                <h3 className="t-body mb-2 font-bold text-cream-50">{t("contact.phone")}</h3>
                <p className="t-small text-cream-300/70" dir="ltr">+{settings.phone}</p>
              </a>
            </Reveal>
          )}
          {settings?.email && (
            <Reveal delay={0.16}>
              <a href={`mailto:${settings.email}`} className="card-surface block h-full rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                <Mail className="mb-5 h-6 w-6 text-gold-400" strokeWidth={1.6} />
                <h3 className="t-body mb-2 font-bold text-cream-50">{t("contact.email")}</h3>
                <p className="t-small text-cream-300/70">{settings.email}</p>
              </a>
            </Reveal>
          )}
          {wa && (
            <Reveal delay={0.24}>
              <a href={wa.url} target="_blank" rel="noopener noreferrer" className="card-surface block h-full rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                <MessageCircle className="mb-5 h-6 w-6 text-gold-400" strokeWidth={1.6} />
                <h3 className="t-body mb-2 font-bold text-cream-50">WhatsApp</h3>
                <p className="t-small text-cream-300/70">{t("actions.whatsapp")}</p>
              </a>
            </Reveal>
          )}
        </div>

        {settings && (
          <Reveal delay={0.3}>
            <div className="container-ov mt-6">
              <div className="glass flex items-center gap-3 rounded-2xl border border-white/8 px-7 py-4">
                <Clock className="h-4 w-4 shrink-0 text-gold-400" />
                <span className="t-small text-cream-300/80">
                  <strong className="text-cream-50">{t("contact.hours")}:</strong> {t("contact.hours_val")}
                </span>
              </div>
            </div>
          </Reveal>
        )}
      </section>

      {/* Contact form */}
      <section className="relative py-20 pb-28">
        <div className="container-ov max-w-3xl">
          <SectionHead label={t("contact.label")} title={t("contact.form_title")} />

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface flex flex-col items-center gap-6 rounded-3xl p-14 text-center"
            >
              <CheckCircle2 className="h-14 w-14 text-gold-400" strokeWidth={1.4} />
              <p className="t-h3 font-display text-cream-50">{t("contact.success")}</p>
            </motion.div>
          ) : (
            <Reveal>
              <form onSubmit={onSubmit} className="card-surface grid gap-5 rounded-3xl p-8 md:grid-cols-2 md:p-10">
                <div>
                  <label className="field-label" htmlFor="c-name">{t("contact.name")} *</label>
                  <input id="c-name" name="name" required className="field" autoComplete="name" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-company">{t("contact.company")}</label>
                  <input id="c-company" name="company" className="field" autoComplete="organization" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-email">{t("contact.email")} *</label>
                  <input id="c-email" name="email" type="email" required className="field" autoComplete="email" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-phone">{t("contact.phone")}</label>
                  <input id="c-phone" name="phone" type="tel" className="field" dir="ltr" autoComplete="tel" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-type">{t("contact.inquiry_type")}</label>
                  <select id="c-type" name="inquiry_type" className="field">
                    {inquiryOptions.map(([k, v]) => (
                      <option key={k} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="c-subject">{t("contact.subject")}</label>
                  <input id="c-subject" name="subject" className="field" />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label" htmlFor="c-msg">{t("contact.message")} *</label>
                  <textarea id="c-msg" name="message" required rows={6} className="field" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
                    <Send className="h-4 w-4" />
                    {sending ? t("states.loading") : t("contact.send")}
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
