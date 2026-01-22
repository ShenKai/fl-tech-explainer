import { motion } from "framer-motion";
import { Database, Server, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientNodeProps {
  label: string;
  clientType: "a" | "b" | "c" | "server";
  description?: string;
  isActive?: boolean;
  delay?: number;
  children?: React.ReactNode;
}

const nodeStyles = {
  a: {
    bg: "bg-gradient-to-br from-[hsl(200_85%_50%)] to-[hsl(210_80%_45%)]",
    border: "border-[hsl(200_85%_50%/0.5)]",
    shadow: "shadow-[0_8px_30px_-6px_hsl(200_85%_50%/0.4)]",
    text: "text-white",
  },
  b: {
    bg: "bg-gradient-to-br from-[hsl(280_70%_55%)] to-[hsl(290_65%_50%)]",
    border: "border-[hsl(280_70%_55%/0.5)]",
    shadow: "shadow-[0_8px_30px_-6px_hsl(280_70%_55%/0.4)]",
    text: "text-white",
  },
  c: {
    bg: "bg-gradient-to-br from-[hsl(35_90%_55%)] to-[hsl(25_85%_50%)]",
    border: "border-[hsl(35_90%_55%/0.5)]",
    shadow: "shadow-[0_8px_30px_-6px_hsl(35_90%_55%/0.4)]",
    text: "text-white",
  },
  server: {
    bg: "bg-gradient-to-br from-[hsl(220_25%_20%)] to-[hsl(220_30%_15%)]",
    border: "border-[hsl(220_25%_30%)]",
    shadow: "shadow-[0_8px_30px_-6px_hsl(220_25%_10%/0.5)]",
    text: "text-white",
  },
};

export function ClientNode({
  label,
  clientType,
  description,
  isActive = false,
  delay = 0,
  children,
}: ClientNodeProps) {
  const styles = nodeStyles[clientType];
  const Icon = clientType === "server" ? Server : Database;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className={cn(
        "relative rounded-2xl border-2 p-4 transition-all duration-300",
        styles.bg,
        styles.border,
        styles.shadow,
        styles.text,
        isActive && "pulse-glow scale-[1.02]"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {description && (
        <p className="text-xs opacity-80 mb-3">{description}</p>
      )}
      {children}
    </motion.div>
  );
}
