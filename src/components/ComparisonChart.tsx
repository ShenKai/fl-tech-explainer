import { motion } from "framer-motion";
import { Layers, LayoutGrid } from "lucide-react";

export function ComparisonChart() {
  const comparisons = [
    {
      aspect: "Data Split",
      horizontal: "By samples (rows)",
      vertical: "By features (columns)",
    },
    {
      aspect: "Same Users?",
      horizontal: "No - different users",
      vertical: "Yes - same users",
    },
    {
      aspect: "Same Features?",
      horizontal: "Yes - identical features",
      vertical: "No - different features",
    },
    {
      aspect: "Use Case",
      horizontal: "Multiple hospitals with patient data",
      vertical: "Bank + Retailer collaborating",
    },
    {
      aspect: "Aggregation",
      horizontal: "Average model weights",
      vertical: "Combine embeddings",
    },
    {
      aspect: "Privacy Focus",
      horizontal: "Protect sample data",
      vertical: "Protect feature data",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 overflow-hidden"
    >
      <h3 className="text-lg font-semibold mb-4 text-center">Quick Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Aspect</th>
              <th className="py-3 px-4">
                <div className="flex items-center justify-center gap-2 text-[hsl(200_85%_45%)]">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="font-semibold">Horizontal FL</span>
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center justify-center gap-2 text-[hsl(165_70%_40%)]">
                  <Layers className="w-4 h-4" />
                  <span className="font-semibold">Vertical FL</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, i) => (
              <motion.tr
                key={row.aspect}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-3 px-4 font-medium">{row.aspect}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{row.horizontal}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{row.vertical}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
