import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MysticCard from "./MysticCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface KarmaResult {
  number: number;
  missing: string;
  situation: string;
  improve: string;
}

const KarmaStudy = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [results, setResults] = useState<KarmaResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return;
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/karma-api/v1/karmas/study?name=${encodeURIComponent(fullName)}`
      );
      const json = await resp.json();
      if (json.data && json.data.length > 0) {
        setResults(json.data);
      } else {
        setResults([]);
      }
    } catch {
      setError("No se pudo conectar con el oráculo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MysticCard delay={0.2}>
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-display text-gold-gradient mb-2">
          Deuda Kármica
        </h2>
        <p className="text-muted-foreground font-body text-lg">
          Descubre las lecciones que tu alma aún debe aprender
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-2 uppercase tracking-widest">
              Nombre(s)
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ingresa tu nombre..."
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 font-body text-lg h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-2 uppercase tracking-widest">
              Apellido(s)
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ingresa tu apellido..."
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 font-body text-lg h-12"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading || !firstName.trim()}
          className="w-full h-12 bg-primary text-primary-foreground font-display text-sm uppercase tracking-[0.2em] hover:shadow-gold transition-shadow duration-500"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Consultando el cosmos...
            </motion.span>
          ) : (
            "Revelar Karma"
          )}
        </Button>
      </form>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-center mt-4 font-body"
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {results !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-4"
          >
            {results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gold font-display text-xl mb-2">✦ Alma en Equilibrio ✦</p>
                <p className="text-muted-foreground font-body text-lg">
                  No se encontraron deudas kármicas pendientes para este nombre.
                </p>
              </div>
            ) : (
              results.map((k, i) => (
                <motion.div
                  key={k.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="border border-border rounded-md p-5 bg-muted/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-display text-primary text-lg">
                      {k.number}
                    </span>
                    <h3 className="font-display text-foreground text-sm uppercase tracking-wider">
                      Número Kármico {k.number}
                    </h3>
                  </div>
                  <div className="space-y-3 font-body text-base leading-relaxed">
                    <div>
                      <span className="text-gold/80 font-sans text-xs uppercase tracking-widest">Lo que faltó</span>
                      <p className="text-foreground/90 mt-1">{k.missing}</p>
                    </div>
                    <div>
                      <span className="text-gold/80 font-sans text-xs uppercase tracking-widest">Situación actual</span>
                      <p className="text-foreground/90 mt-1">{k.situation}</p>
                    </div>
                    <div>
                      <span className="text-gold/80 font-sans text-xs uppercase tracking-widest">Cómo mejorar</span>
                      <p className="text-foreground/90 mt-1">{k.improve}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </MysticCard>
  );
};

export default KarmaStudy;
