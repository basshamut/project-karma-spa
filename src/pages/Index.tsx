import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StarField from "../components/StarField";
import KarmaStudy from "../components/KarmaStudy";
import mysticOrnament from "@/assets/mystic-ornament.jpg";
import PastLifeReading from "../components/PastLifeReading";
import AmbientAudio from "../components/AmbientAudio";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";

const Index = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("app.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("app.description"));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", t("app.title"));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", t("app.description"));
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen bg-background bg-mystic-glow relative">
      <StarField />
      <AmbientAudio />

      <div className="relative z-10">
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Hero */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-16 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={mysticOrnament}
              alt={t("hero.ornamentAlt")}
              width={160}
              height={160}
              className="mx-auto mb-6 opacity-60 rounded-full animate-pulse-glow"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 1.5 }}
            />
            <p className="text-xs font-sans text-muted-foreground uppercase tracking-[0.4em] mb-4">
              {t("hero.subtitle")}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-gold-gradient leading-tight mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl font-body text-foreground/70 max-w-xl mx-auto">
              {t("hero.description")}
            </p>
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-8 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          />
        </header>

        {/* Main content */}
        <main className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8">
          <KarmaStudy />
          <PastLifeReading />
        </main>

        {/* Footer */}
        <footer className="text-center pb-8 text-muted-foreground font-sans text-xs tracking-widest uppercase">
          <p>{t("footer")}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
