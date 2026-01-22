import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArrowProps {
  direction: "up" | "down" | "left" | "right";
  label?: string;
  animated?: boolean;
  className?: string;
}

export function Arrow({ direction, label, animated = false, className }: ArrowProps) {
  const isVertical = direction === "up" || direction === "down";
  const isReverse = direction === "up" || direction === "left";

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1",
        isVertical ? "flex-col" : "flex-row",
        isReverse && (isVertical ? "flex-col-reverse" : "flex-row-reverse"),
        className
      )}
    >
      <motion.div
        className={cn(
          "flex items-center justify-center",
          isVertical ? "flex-col h-12" : "flex-row w-16"
        )}
        animate={animated ? { opacity: [0.4, 1, 0.4] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div
          className={cn(
            "bg-gradient-to-r from-primary/60 to-primary rounded-full",
            isVertical ? "w-0.5 h-full" : "h-0.5 w-full"
          )}
        />
        <div
          className={cn(
            "w-0 h-0 border-primary",
            isVertical
              ? direction === "down"
                ? "border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px]"
                : "border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px]"
              : direction === "right"
              ? "border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px]"
              : "border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px]"
          )}
        />
      </motion.div>
      {label && (
        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
