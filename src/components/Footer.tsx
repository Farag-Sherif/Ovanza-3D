import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings, useSocials, useBrands } from "../hooks/useApi";

export default function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const { data: socials } = useSocials();
  const { data: brands } = useBrands();

  const wa = socials?.find((s) => s.url?.includes("whatsapp"));

  return (
    <footer className="relative z-10 mt-24 border-t border-white/5 bg-espresso-900/80 pb-10 pt-20 backdrop-blur-sm">
      <div className="container-ov grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link to="/" className="mb-6 inline-flex items-center gap-3">
            {settings?.image_logo_path ? (
              <img src={settings.image_logo_path} alt="Ovanza" className="h-12 w-auto object-contain" loading="lazy" />
            ) : (
              <span className="font-display t-h2 text-cream-50">Ovanza</span>
            )}
          </Link>
          <p className="t-body max-w-sm text-cream-300/70">{t("hero.sub")}</p>
          <div className="mt-8 flex flex-col gap-3">
            {settings?.phone && (
              <a href={`tel:+${settings.phone}`} className="u-sweep t-small inline-flex items-center gap-3 text-cream-300/80" dir="ltr">
                <Phone className="h-4 w-4 text-gold-500" /> +{settings.phone}
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="u-sweep t-small inline-flex items-center gap-3 text-cream-300/80">
                <Mail className="h-4 w-4 text-gold-500" /> {settings.email}
              </a>
            )}
            {settings?.addresse && (
              <span className="t-small inline-flex items-center gap-3 text-cream-300/80">
                <MapPin className="h-4 w-4 text-gold-500" /> {settings.addresse.replace("_", ", ")}
              </span>
            )}
          </div>
        </div>

        {/* Company */}
        <nav aria-label={t("footer.company")}>
          <h3 className="t-label mb-6 text-gold-500">{t("footer.company")}</h3>
          <ul className="flex flex-col gap-3">
            <li><Link className="u-sweep t-small text-cream-300/80" to="/about">{t("nav.about")}</Link></li>
            <li><Link className="u-sweep t-small text-cream-300/80" to="/brands">{t("nav.brands")}</Link></li>
            <li><Link className="u-sweep t-small text-cream-300/80" to="/events">{t("nav.events")}</Link></li>
            <li><Link className="u-sweep t-small text-cream-300/80" to="/careers">{t("nav.careers")}</Link></li>
          </ul>
        </nav>

        {/* Business */}
        <nav aria-label={t("footer.business")}>
          <h3 className="t-label mb-6 text-gold-500">{t("footer.business")}</h3>
          <ul className="flex flex-col gap-3">
            <li><Link className="u-sweep t-small text-cream-300/80" to="/export">{t("nav.export")}</Link></li>
            <li><Link className="u-sweep t-small text-cream-300/80" to="/brands">{t("home.egypt_title")}</Link></li>
            <li><Link className="u-sweep t-small text-cream-300/80" to="/contact">{t("inquiry.partnership")}</Link></li>
            <li><Link className="u-sweep t-small text-cream-300/80" to="/products">{t("nav.products")}</Link></li>
          </ul>
        </nav>

        {/* Social + downloads */}
        <div>
          <h3 className="t-label mb-6 text-gold-500">{t("footer.social")}</h3>
          <div className="mb-10 flex flex-wrap gap-3">
            {socials?.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/60"
                aria-label="Ovanza social link"
              >
                {s.icon_path ? (
                  <img src={s.icon_path} alt="" className="h-4.5 w-4.5 h-5 w-5 object-contain invert" loading="lazy" />
                ) : (
                  <span className="font-display text-sm text-gold-400">O</span>
                )}
              </a>
            ))}
          </div>

          <h3 className="t-label mb-4 text-gold-500">{t("footer.downloads")}</h3>
          {settings?.about_file_path && (
            <a
              href={settings.about_file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-6 !py-3 text-sm"
            >
              <Download className="h-4 w-4" /> {t("footer.profile")}
            </a>
          )}
          {wa && (
            <a href={wa.url} target="_blank" rel="noopener noreferrer" className="t-small mt-4 block text-cream-300/70 underline decoration-gold-600/40 underline-offset-4">
              WhatsApp Business
            </a>
          )}
        </div>
      </div>

      <div className="container-ov mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
        <p className="t-small text-cream-300/50">{settings?.copyright || t("footer.rights")}</p>
        <div className="flex gap-6">
          {(brands ?? []).slice(0, 4).map((b) => (
            <Link key={b.id} to={`/brands/${b.slug}`} className="t-small text-cream-300/50 transition-colors hover:text-gold-400">
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
