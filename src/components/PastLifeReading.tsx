import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import MysticCard from "./MysticCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const MONTHS = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

const MONTH_KEYS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
];

const YEARS = Array.from({ length: 100 }, (_, i) => String(1999 - i));

interface PastLifeResult {
  sexInPastLife: string;
  country: string;
  yearApprox: string;
  profession: string;
  personalitySymbol: string;
  personality: string;
}

const symbolEmoji: Record<string, string> = {
  "Triángulo": "△",
  "Círculo": "○",
  "Cuadrado": "□",
  "Estrella": "☆",
  "Rombo": "◇",
  "Luna": "☽",
  "Sol": "☉",
};

const PastLifeReading = () => {
  const { t, i18n } = useTranslation();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [sex, setSex] = useState("");
  const [result, setResult] = useState<PastLifeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = day && month && year && sex;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/karma-api/v1/past-life?day=${day}&month=${month}&year=${year}&sex=${sex}&lang=${i18n.language}`;
      const resp = await fetch(url);
      const json = await resp.json();
      if (json.data) {
        setResult(json.data);
      } else {
        setError(t("pastLife.error"));
      }
    } catch {
      setError(t("pastLife.errorConnection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MysticCard delay={0.4}>
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-display text-gold-gradient mb-2">
          {t("pastLife.title")}
        </h2>
        <p className="text-muted-foreground font-body text-lg">
          {t("pastLife.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-sans text-muted-foreground mb-2 uppercase tracking-widest">{t("pastLife.day")}</label>
            <Input
              type="number"
              min={1}
              max={31}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="15"
              className="bg-muted/50 border-border text-foreground font-body text-lg h-12 text-center"
            />
          </div>
          <div>
            <label className="block text-xs font-sans text-muted-foreground mb-2 uppercase tracking-widest">{t("pastLife.month")}</label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="bg-muted/50 border-border text-foreground font-body h-12">
                <SelectValue placeholder={t("pastLife.month")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={m} className="font-body">
                    {t(`months.label.${MONTH_KEYS[i]}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-sans text-muted-foreground mb-2 uppercase tracking-widest">{t("pastLife.year")}</label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="bg-muted/50 border-border text-foreground font-body h-12">
                <SelectValue placeholder={t("pastLife.year")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y} className="font-body">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans text-muted-foreground mb-2 uppercase tracking-widest">
            {t("pastLife.biologicalSex")}
          </label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger className="bg-muted/50 border-border text-foreground font-body h-12">
              <SelectValue placeholder={t("pastLife.selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="M" className="font-body">{t("pastLife.male")}</SelectItem>
              <SelectItem value="F" className="font-body">{t("pastLife.female")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={loading || !canSubmit}
          className="w-full h-12 bg-primary text-primary-foreground font-display text-sm uppercase tracking-[0.2em] hover:shadow-gold transition-shadow duration-500"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {t("pastLife.loading")}
            </motion.span>
          ) : (
            t("pastLife.submit")
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
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-gold/40 bg-secondary/50 mb-4"
              >
                <span className="text-3xl text-gold">
                  {symbolEmoji[result.personalitySymbol] || "✦"}
                </span>
              </motion.div>
              <p className="text-xs font-sans text-muted-foreground uppercase tracking-[0.3em]">
                {t("pastLife.symbolLabel", { symbol: result.personalitySymbol })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: t("pastLife.country"), value: result.country, icon: "🌍" },
                { label: t("pastLife.yearApprox"), value: result.yearApprox, icon: "⏳" },
                { label: t("pastLife.sexInPast"), value: result.sexInPastLife, icon: "⚤" },
                { label: t("pastLife.symbol"), value: result.personalitySymbol, icon: "◈" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-muted/30 rounded-md p-4 text-center border border-border/50"
                >
                  <span className="text-xl mb-1 block">{item.icon}</span>
                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="font-display text-foreground text-sm">{item.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <div className="border border-border/50 rounded-md p-5 bg-muted/20">
                <span className="text-gold/80 font-sans text-xs uppercase tracking-widest">
                  {t("pastLife.previousProfession")}
                </span>
                <p className="text-foreground/90 font-body text-base mt-2 leading-relaxed">
                  {result.profession}
                </p>
              </div>
              <div className="border border-border/50 rounded-md p-5 bg-muted/20">
                <span className="text-gold/80 font-sans text-xs uppercase tracking-widest">
                  {t("pastLife.personality")}
                </span>
                <p className="text-foreground/90 font-body text-base mt-2 leading-relaxed">
                  {result.personality}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MysticCard>
  );
};

export default PastLifeReading;
