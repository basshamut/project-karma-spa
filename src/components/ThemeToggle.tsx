import { motion } from "framer-motion";
import { useTheme } from "../lib/theme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-md border border-gold/30 bg-background/70 backdrop-blur-sm text-sm hover:border-gold/60 hover:text-foreground transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === "night" ? "Modo día" : "Modo noche"}
    >
      {theme === "night" ? (
        <motion.span
          key="sun"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          ☀️
        </motion.span>
      ) : (
        <motion.span
          key="moon"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          🌙
        </motion.span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
