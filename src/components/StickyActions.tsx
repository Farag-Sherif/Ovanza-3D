import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Send, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { useSocials } from "../hooks/useApi";

export default function StickyActions() {
  const { t } = useTranslation();
  const { data: socials } = useSocials();

  const wa = socials?.find((s) => s.url?.includes("whatsapp"));

  const actions = [
    wa?.url && {
      label: t("actions.whatsapp"),
      href: wa.url,
      icon: <MessageCircle className="h-5 w-5" />,
    },
    { label: t("actions.contact"), href: "/contact", icon: <Send className="h-5 w-5" /> },
    { label: t("actions.export"), href: "/export", icon: <Globe className="h-5 w-5" /> },
  ].filter(Boolean) as { label: string; href: string; icon: ReactNode }[];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-8 z-40 flex flex-col gap-3 ltr:right-6 rtl:left-6"
      aria-label="Quick actions"
    >
      {actions.map((a, i) =>
        a.href.startsWith("http") ? (
          <a
            key={i}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 py-3 ltr:pr-4 ltr:pl-3 rtl:pr-3 rtl:pl-4 shadow-2xl transition-all duration-500 hover:border-gold-500/60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-espresso-950">
              {a.icon}
            </span>
            <span className="t-small max-w-0 overflow-hidden font-semibold whitespace-nowrap text-cream-100 opacity-0 transition-all duration-500 group-hover:max-w-[120px] group-hover:opacity-100">
              {a.label}
            </span>
          </a>
        ) : (
          <Link
            key={i}
            to={a.href}
            className="group glass pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 py-3 ltr:pr-4 ltr:pl-3 rtl:pr-3 rtl:pl-4 shadow-2xl transition-all duration-500 hover:border-gold-500/60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-espresso-950">
              {a.icon}
            </span>
            <span className="t-small max-w-0 overflow-hidden font-semibold whitespace-nowrap text-cream-100 opacity-0 transition-all duration-500 group-hover:max-w-[120px] group-hover:opacity-100">
              {a.label}
            </span>
          </Link>
        )
      )}
    </motion.aside>
  );
}
