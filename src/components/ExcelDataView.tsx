import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOCK_PEOPLE } from "@/data/mockPeopleDataset";
import { Table } from "lucide-react";

interface ExcelDataViewProps {
  type: "horizontal" | "vertical";
}

const headers = ["", "A", "B", "C", "D", "E"];
const colLabels = ["Name", "Age", "City", "Income", "Class"];

export function ExcelDataView({ type }: ExcelDataViewProps) {
  const rows = MOCK_PEOPLE.map((p, i) => [
    p.name,
    p.age,
    p.city,
    p.income,
    p.class,
  ]);

  // HFL highlights: rows 0-2 client A, 3-5 client B, 6-8 client C
  const hflColors: Record<number, string> = {};
  if (type === "horizontal") {
    [0, 1, 2].forEach((r) => (hflColors[r] = "bg-[hsl(var(--client-a)/0.15)]"));
    [3, 4, 5].forEach((r) => (hflColors[r] = "bg-[hsl(var(--client-b)/0.15)]"));
    [6, 7, 8].forEach((r) => (hflColors[r] = "bg-[hsl(var(--client-c)/0.15)]"));
  }

  // VFL highlights: cols 1-2 client A (Age, City), cols 3-4 client B (Income, Class)
  // Col 0 (Name) is shared join key
  const vflColColors: Record<number, string> = {};
  if (type === "vertical") {
    [1, 2].forEach((c) => (vflColColors[c] = "bg-[hsl(var(--client-a)/0.15)]"));
    [3, 4].forEach((c) => (vflColColors[c] = "bg-[hsl(var(--client-b)/0.15)]"));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Table className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">
          {type === "horizontal"
            ? "How Horizontal FL splits the data (by rows)"
            : "How Vertical FL splits the data (by columns)"}
        </h4>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {type === "horizontal"
          ? "Think of an Excel spreadsheet: each client gets a different set of rows (people), but every client sees all columns (features)."
          : "Think of an Excel spreadsheet: every client has all the rows (same people), but each client only sees certain columns (features). The Name column acts as a shared key to link records."}
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Excel-style toolbar */}
          <div className="flex items-center gap-1 px-2 py-1.5 bg-muted/60 rounded-t-lg border border-b-0 border-border/50">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-[hsl(35_90%_55%/0.6)]" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <span className="ml-2 text-[10px] font-mono text-muted-foreground">dataset.xlsx — Sheet 1</span>
          </div>

          <table className="w-full border-collapse border border-border/50 text-xs font-mono">
            {/* Column letters */}
            <thead>
              <tr className="bg-muted/40">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      "px-2 py-1 text-center text-[10px] font-semibold text-muted-foreground border border-border/30 min-w-[40px]",
                      i === 0 && "w-8",
                      type === "vertical" && i > 0 && vflColColors[i - 1] !== undefined && "relative"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
              {/* Column headers row */}
              <tr className="bg-muted/20">
                <td className="px-2 py-1 text-center text-[10px] font-semibold text-muted-foreground border border-border/30 bg-muted/40">
                  
                </td>
                {colLabels.map((label, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "px-2 py-1.5 text-center text-[10px] font-bold border border-border/30",
                      type === "vertical" && vflColColors[ci],
                      type === "vertical" && ci === 0 && "bg-muted/30"
                    )}
                  >
                    {label}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <motion.tr
                  key={ri}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + ri * 0.03 }}
                >
                  {/* Row number */}
                  <td className="px-2 py-1 text-center text-[10px] text-muted-foreground border border-border/30 bg-muted/40 font-semibold">
                    {ri + 1}
                  </td>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={cn(
                        "px-2 py-1.5 text-center border border-border/30 transition-colors",
                        type === "horizontal" && hflColors[ri],
                        type === "vertical" && vflColColors[ci],
                        type === "vertical" && ci === 0 && "bg-muted/30 font-semibold"
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {type === "horizontal" ? (
          <>
            <LegendItem color="bg-[hsl(var(--client-a)/0.3)]" label="Client A — Rows 1-3" />
            <LegendItem color="bg-[hsl(var(--client-b)/0.3)]" label="Client B — Rows 4-6" />
            <LegendItem color="bg-[hsl(var(--client-c)/0.3)]" label="Client C — Rows 7-9" />
          </>
        ) : (
          <>
            <LegendItem color="bg-muted/50" label="Name — Shared join key" />
            <LegendItem color="bg-[hsl(var(--client-a)/0.3)]" label="Client A — Age, City" />
            <LegendItem color="bg-[hsl(var(--client-b)/0.3)]" label="Client B — Income, Class" />
          </>
        )}
      </div>
    </motion.div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span className={cn("w-3 h-3 rounded-sm border border-border/30", color)} />
      {label}
    </div>
  );
}
