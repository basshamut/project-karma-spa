import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MysticCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const MysticCard = ({ children, className = "", delay = 0 }: MysticCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={`bg-card-mystic border border-border rounded-lg p-6 md:p-8 shadow-mystic relative overflow-hidden ${className}`}
  >
    {/* Corner ornaments */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/30 rounded-tl-lg" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/30 rounded-tr-lg" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/30 rounded-bl-lg" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/30 rounded-br-lg" />
    {children}
  </motion.div>
);

export default MysticCard;
