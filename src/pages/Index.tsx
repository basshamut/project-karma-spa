import { motion } from "framer-motion";
import StarField from "../components/StarField";
import KarmaStudy from "../components/KarmaStudy";
import mysticOrnament from "@/assets/mystic-ornament.jpg";
import PastLifeReading from "../components/PastLifeReading";
import AmbientAudio from "../components/AmbientAudio";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-mystic-glow relative">
      <StarField />
      <AmbientAudio />

      <div className="relative z-10">
        {/* Hero */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-16 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={mysticOrnament}
              alt=""
              width={160}
              height={160}
              className="mx-auto mb-6 opacity-60 rounded-full animate-pulse-glow"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 1.5 }}
            />
            <p className="text-xs font-sans text-muted-foreground uppercase tracking-[0.4em] mb-4">
              ✦ Registros del Alma ✦
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-gold-gradient leading-tight mb-4">
              Project Karma
            </h1>
            <p className="text-lg md:text-xl font-body text-foreground/70 max-w-xl mx-auto">
              Descubre tu deuda kármica y el eco de tus vidas anteriores,
              escrito en los números de tu nombre y las estrellas de tu nacimiento.
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
          <p>✦ Los astros han hablado ✦</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
