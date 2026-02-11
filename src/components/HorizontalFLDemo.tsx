import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientNode } from "./ClientNode";
import { DataTable } from "./DataTable";
import { Arrow } from "./Arrow";
import { Button } from "./ui/button";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import {
  MOCK_PEOPLE,
  HEADERS,
  toRows,
  HFL_CLIENT_A,
  HFL_CLIENT_B,
  HFL_CLIENT_C,
} from "@/data/mockPeopleDataset";

const fullData = toRows(MOCK_PEOPLE);
const headers = HEADERS;

const clientAData = toRows(HFL_CLIENT_A);
const clientBData = toRows(HFL_CLIENT_B);
const clientCData = toRows(HFL_CLIENT_C);

type Step = "partition" | "train" | "aggregate" | "distribute";

export function HorizontalFLDemo() {
  const [step, setStep] = useState<Step>("partition");
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: { key: Step; label: string; description: string }[] = [
    {
      key: "partition",
      label: "Data Partitioning",
      description: "Data is split by samples (rows). Each client has different users but identical features.",
    },
    {
      key: "train",
      label: "Local Training",
      description: "Each client trains a local model on their private data without sharing raw data.",
    },
    {
      key: "aggregate",
      label: "Model Aggregation",
      description: "Clients send model updates (gradients/weights) to the central server for aggregation.",
    },
    {
      key: "distribute",
      label: "Global Model",
      description: "The aggregated global model is distributed back to all clients for the next round.",
    },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (stepIndex < steps.length - 1) {
          setStep(steps[stepIndex + 1].key);
        } else {
          setIsPlaying(false);
        }
      }, 5000);
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
                ? "bg-primary text-primary-foreground shadow-md"
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
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === "partition" && (
            <motion.div
              key="partition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start"
            >
              {/* Original Data */}
              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-foreground" />
                  Complete Dataset
                </h4>
                <DataTable
                  data={fullData}
                  headers={headers}
                  showHeaders
                  highlightRows={[0, 1, 2]}
                />
                <div className="mt-3 flex gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[hsl(200_85%_50%/0.2)] text-[hsl(200_85%_40%)]">Rows 1-3 → Client A</span>
                  <span className="px-2 py-0.5 rounded bg-[hsl(280_70%_55%/0.2)] text-[hsl(280_70%_45%)]">Rows 4-6 → Client B</span>
                  <span className="px-2 py-0.5 rounded bg-[hsl(35_90%_55%/0.2)] text-[hsl(35_90%_40%)]">Rows 7-9 → Client C</span>
                </div>
              </div>

              {/* Partitioned Data */}
              <div className="grid gap-3">
                <ClientNode label="Client A" clientType="a" description="3 samples" delay={0.2}>
                  <DataTable data={clientAData} headers={headers} showHeaders clientColor="a" compact animateDelay={0.3} />
                </ClientNode>
                <ClientNode label="Client B" clientType="b" description="3 samples" delay={0.3}>
                  <DataTable data={clientBData} headers={headers} showHeaders clientColor="b" compact animateDelay={0.4} />
                </ClientNode>
                <ClientNode label="Client C" clientType="c" description="3 samples" delay={0.4}>
                  <DataTable data={clientCData} headers={headers} showHeaders clientColor="c" compact animateDelay={0.5} />
                </ClientNode>
              </div>
            </motion.div>
          )}

          {step === "train" && (
            <motion.div
              key="train"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: "Client A", type: "a" as const, data: clientAData },
                { label: "Client B", type: "b" as const, data: clientBData },
                { label: "Client C", type: "c" as const, data: clientCData },
              ].map((client, i) => (
                <ClientNode
                  key={client.type}
                  label={client.label}
                  clientType={client.type}
                  isActive
                  delay={i * 0.15}
                >
                  <DataTable data={client.data} clientColor={client.type} compact animateDelay={0.2 + i * 0.1} />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="mt-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                  >
                    <div className="text-[10px] font-mono opacity-80">Training local model...</div>
                    <motion.div
                      className="h-1 bg-white/30 rounded-full mt-1 overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 0.6 + i * 0.2 }}
                      />
                    </motion.div>
                  </motion.div>
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
                    <div className="text-xs font-mono bg-white/10 rounded p-2">
                      Model Weights
                    </div>
                  </ClientNode>
                ))}
              </div>

              <div className="flex items-center gap-8">
                <Arrow direction="down" label="∇W₁" animated />
                <Arrow direction="down" label="∇W₂" animated />
                <Arrow direction="down" label="∇W₃" animated />
              </div>

              <ClientNode label="Central Server" clientType="server" isActive delay={0.4}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="text-xs font-mono bg-white/10 rounded p-3"
                >
                  <div className="opacity-70 mb-1">Aggregation:</div>
                  <div className="text-sm">W_global = Σ(W_i × n_i) / N</div>
                </motion.div>
              </ClientNode>
            </motion.div>
          )}

          {step === "distribute" && (
            <motion.div
              key="distribute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <ClientNode label="Central Server" clientType="server" isActive>
                <div className="text-xs font-mono bg-white/10 rounded p-2">
                  Global Model v2
                </div>
              </ClientNode>

              <div className="flex items-center gap-8">
                <Arrow direction="down" label="W_global" animated />
                <Arrow direction="down" label="W_global" animated />
                <Arrow direction="down" label="W_global" animated />
              </div>

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
                    isActive
                    delay={0.5 + i * 0.1}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="text-xs font-mono bg-white/10 rounded p-2"
                    >
                      Updated Model ✓
                    </motion.div>
                  </ClientNode>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-sm text-muted-foreground text-center mt-4"
              >
                The cycle repeats until the model converges
              </motion.p>
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
          className="bg-primary"
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
