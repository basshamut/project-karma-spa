import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "es", label: "language.es", flag: "🇪🇸" },
  { code: "en", label: "language.en", flag: "🇬🇧" },
  { code: "ca", label: "language.ca", flag: "🏳️" },
  { code: "pt-BR", label: "language.pt-BR", flag: "🇧🇷" },
  { code: "fr", label: "language.fr", flag: "🇫🇷" },
];

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    setOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div>
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-gold/30 bg-background/70 backdrop-blur-sm text-xs font-sans text-muted-foreground uppercase tracking-widest hover:border-gold/60 hover:text-foreground transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{current.flag}</span>
        <span>{current.code}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▾
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg overflow-hidden"
          >
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-body transition-colors duration-200 ${
                  i18n.language === lang.code
                    ? "text-gold bg-gold/5"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                }`}
                whileHover={{ x: 2 }}
              >
                <span>{lang.flag}</span>
                <span>{t(lang.label)}</span>
                {i18n.language === lang.code && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-gold"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
