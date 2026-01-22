import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientNode } from "./ClientNode";
import { DataTable } from "./DataTable";
import { Arrow } from "./Arrow";
import { Button } from "./ui/button";
import { Play, RotateCcw, ChevronRight } from "lucide-react";

const fullData = [
  ["U1", "25", "NYC", "85K", "Gold", "12", "A"],
  ["U2", "32", "LA", "92K", "Silver", "8", "B"],
  ["U3", "28", "CHI", "78K", "Gold", "15", "A"],
  ["U4", "45", "NYC", "120K", "Platinum", "22", "C"],
  ["U5", "38", "SF", "105K", "Gold", "18", "B"],
];

const headers = ["ID", "Age", "City", "Income", "Tier", "Tenure", "Class"];

// Client A has ID, Age, City (cols 0, 1, 2)
const clientAData = fullData.map((row) => [row[0], row[1], row[2]]);
// Client B has Income, Tier (cols 3, 4)
const clientBData = fullData.map((row) => [row[0], row[3], row[4]]);
// Client C has Tenure, Class (cols 5, 6)
const clientCData = fullData.map((row) => [row[0], row[5], row[6]]);

type Step = "partition" | "embeddings" | "aggregate" | "result";

export function VerticalFLDemo() {
  const [step, setStep] = useState<Step>("partition");
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: { key: Step; label: string; description: string }[] = [
    {
      key: "partition",
      label: "Feature Partitioning",
      description: "Data is split by features (columns). Each client has the same users but different attributes.",
    },
    {
      key: "embeddings",
      label: "Local Embeddings",
      description: "Each client computes local embeddings from their features, preserving privacy.",
    },
    {
      key: "aggregate",
      label: "Secure Aggregation",
      description: "Embeddings are combined using secure computation (MPC, homomorphic encryption, etc.).",
    },
    {
      key: "result",
      label: "Joint Prediction",
      description: "The combined representation enables prediction without revealing raw features.",
    },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        const nextIndex = (stepIndex + 1) % steps.length;
        setStep(steps[nextIndex].key);
        if (nextIndex === 0) setIsPlaying(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, step, stepIndex, steps]);

  const nextStep = () => {
    const nextIndex = (stepIndex + 1) % steps.length;
    setStep(steps[nextIndex].key);
  };

  const reset = () => {
    setStep("partition");
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === s.key
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {i + 1}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {steps.find((s) => s.key === step)?.description}
        </p>
      </motion.div>

      {/* Visualization */}
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === "partition" && (
            <motion.div
              key="partition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Original Data */}
              <div className="glass-card p-4 max-w-3xl mx-auto">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-foreground" />
                  Complete Dataset (Split by Features)
                </h4>
                <DataTable
                  data={fullData}
                  headers={headers}
                  showHeaders
                  highlightCols={[1, 2]}
                />
                <div className="mt-3 flex gap-2 text-[10px] flex-wrap justify-center">
                  <span className="px-2 py-0.5 rounded bg-[hsl(200_85%_50%/0.2)] text-[hsl(200_85%_40%)]">Client A: Demographics</span>
                  <span className="px-2 py-0.5 rounded bg-[hsl(280_70%_55%/0.2)] text-[hsl(280_70%_45%)]">Client B: Financial</span>
                  <span className="px-2 py-0.5 rounded bg-[hsl(35_90%_55%/0.2)] text-[hsl(35_90%_40%)]">Client C: Behavioral</span>
                </div>
              </div>

              {/* Partitioned Data */}
              <div className="grid grid-cols-3 gap-4">
                <ClientNode label="Client A" clientType="a" description="Demographics" delay={0.2}>
                  <DataTable
                    data={clientAData}
                    headers={["ID", "Age", "City"]}
                    showHeaders
                    clientColor="a"
                    highlightCols={[1, 2]}
                    compact
                    animateDelay={0.3}
                  />
                </ClientNode>
                <ClientNode label="Client B" clientType="b" description="Financial Data" delay={0.3}>
                  <DataTable
                    data={clientBData}
                    headers={["ID", "Income", "Tier"]}
                    showHeaders
                    clientColor="b"
                    highlightCols={[1, 2]}
                    compact
                    animateDelay={0.4}
                  />
                </ClientNode>
                <ClientNode label="Client C" clientType="c" description="Behavioral Data" delay={0.4}>
                  <DataTable
                    data={clientCData}
                    headers={["ID", "Tenure", "Class"]}
                    showHeaders
                    clientColor="c"
                    highlightCols={[1, 2]}
                    compact
                    animateDelay={0.5}
                  />
                </ClientNode>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Key:</span> Same users (rows) across all clients, linked by ID
                </p>
              </motion.div>
            </motion.div>
          )}

          {step === "embeddings" && (
            <motion.div
              key="embeddings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: "Client A", type: "a" as const, features: "Demographics", emb: "[0.23, 0.87, ...]" },
                { label: "Client B", type: "b" as const, features: "Financial", emb: "[0.56, 0.12, ...]" },
                { label: "Client C", type: "c" as const, features: "Behavioral", emb: "[0.91, 0.44, ...]" },
              ].map((client, i) => (
                <ClientNode
                  key={client.type}
                  label={client.label}
                  clientType={client.type}
                  isActive
                  delay={i * 0.15}
                >
                  <div className="space-y-2">
                    <div className="text-xs opacity-70">{client.features}</div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                    >
                      <div className="text-[10px] font-mono opacity-80">Local Neural Network</div>
                      <motion.div className="h-1 bg-white/30 rounded-full mt-1 overflow-hidden">
                        <motion.div
                          className="h-full bg-white rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, delay: 0.6 + i * 0.2 }}
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.2 }}
                      className="text-xs font-mono bg-black/20 rounded p-2"
                    >
                      Embedding: {client.emb}
                    </motion.div>
                  </div>
                </ClientNode>
              ))}
            </motion.div>
          )}

          {step === "aggregate" && (
            <motion.div
              key="aggregate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                {[
                  { label: "Client A", type: "a" as const, emb: "E_A" },
                  { label: "Client B", type: "b" as const, emb: "E_B" },
                  { label: "Client C", type: "c" as const, emb: "E_C" },
                ].map((client, i) => (
                  <ClientNode
                    key={client.type}
                    label={client.label}
                    clientType={client.type}
                    delay={i * 0.1}
                  >
                    <div className="text-xs font-mono bg-white/10 rounded p-2 text-center">
                      {client.emb}
                    </div>
                  </ClientNode>
                ))}
              </div>

              <div className="flex items-center gap-8">
                <Arrow direction="down" label="🔒" animated />
                <Arrow direction="down" label="🔒" animated />
                <Arrow direction="down" label="🔒" animated />
              </div>

              <ClientNode label="Secure Aggregator" clientType="server" isActive delay={0.4}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="text-xs font-mono bg-white/10 rounded p-3"
                >
                  <div className="opacity-70 mb-1">Secure Computation:</div>
                  <div className="text-sm">E_combined = Concat(E_A, E_B, E_C)</div>
                  <div className="text-[10px] opacity-60 mt-1">Using MPC / Homomorphic Encryption</div>
                </motion.div>
              </ClientNode>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                {[
                  { label: "Client A", type: "a" as const },
                  { label: "Client B", type: "b" as const },
                  { label: "Client C", type: "c" as const },
                ].map((client, i) => (
                  <ClientNode
                    key={client.type}
                    label={client.label}
                    clientType={client.type}
                    delay={i * 0.1}
                  >
                    <div className="text-xs opacity-70">Data stays private ✓</div>
                  </ClientNode>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 max-w-md"
              >
                <h4 className="text-sm font-semibold mb-3 text-center">Joint Model Output</h4>
                <div className="space-y-2">
                  {["U1: Class A (89%)", "U2: Class B (92%)", "U3: Class A (85%)", "U4: Class C (94%)", "U5: Class B (88%)"].map((pred, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="text-xs font-mono bg-accent/10 text-accent-foreground rounded px-3 py-1.5"
                    >
                      {pred}
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-xs text-muted-foreground text-center mt-4"
                >
                  Predictions made without any party seeing complete data!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
        <Button
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-accent hover:bg-accent/90"
        >
          <Play className="w-4 h-4 mr-1" />
          {isPlaying ? "Playing..." : "Auto Play"}
        </Button>
        <Button variant="outline" size="sm" onClick={nextStep}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
