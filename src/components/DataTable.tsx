import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: string[][];
  highlightRows?: number[];
  highlightCols?: number[];
  clientColor?: "a" | "b" | "c";
  compact?: boolean;
  showHeaders?: boolean;
  headers?: string[];
  animateDelay?: number;
}

const clientColors = {
  a: "bg-[hsl(200_85%_50%/0.15)] border-[hsl(200_85%_50%/0.3)]",
  b: "bg-[hsl(280_70%_55%/0.15)] border-[hsl(280_70%_55%/0.3)]",
  c: "bg-[hsl(35_90%_55%/0.15)] border-[hsl(35_90%_55%/0.3)]",
};

const clientTextColors = {
  a: "text-[hsl(200_85%_40%)]",
  b: "text-[hsl(280_70%_45%)]",
  c: "text-[hsl(35_90%_40%)]",
};

export function DataTable({
  data,
  highlightRows = [],
  highlightCols = [],
  clientColor,
  compact = false,
  showHeaders = false,
  headers = [],
  animateDelay = 0,
}: DataTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: animateDelay, duration: 0.4 }}
      className={cn(
        "rounded-lg border overflow-hidden",
        clientColor ? clientColors[clientColor] : "bg-card border-border"
      )}
    >
      <table className="w-full">
        {showHeaders && headers.length > 0 && (
          <thead>
            <tr className="border-b border-border/50">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white",
                    highlightCols.includes(i) && clientColor && clientTextColors[clientColor]
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animateDelay + rowIndex * 0.05, duration: 0.3 }}
              className={cn(
                "border-b border-border/30 last:border-0",
                highlightRows.includes(rowIndex) && "bg-primary/5"
              )}
            >
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={cn(
                    "data-cell text-center",
                    compact ? "px-1.5 py-1" : "px-3 py-2",
                    highlightCols.includes(colIndex) && clientColor && clientTextColors[clientColor],
                    highlightCols.includes(colIndex) && "font-semibold"
                  )}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
