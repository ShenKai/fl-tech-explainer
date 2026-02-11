import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, Play, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

type Step = "partition" | "forward_local" | "forward_agg" | "backward" | "result";

const steps: { key: Step; label: string; description: string }[] = [
  {
    key: "partition",
    label: "Model Partitioning",
    description: "Each party owns bottom layers for their features. A top model at aggregator combines embeddings.",
  },
  {
    key: "forward_local",
    label: "Local Forward Pass",
    description: "Each party computes embeddings (hidden activations) from their features using their bottom model.",
  },
  {
    key: "forward_agg",
    label: "Aggregator Forward",
    description: "Embeddings are sent to aggregator, concatenated, and passed through top model to get prediction.",
  },
  {
    key: "backward",
    label: "Backward Propagation",
    description: "Gradients flow back: aggregator updates top model, sends gradients to parties for bottom model updates.",
  },
  {
    key: "result",
    label: "Converged Model",
    description: "After iterations, the split model converges—each party keeps their bottom model private.",
  },
];

interface NeuronLayerProps {
  neurons: number;
  color: string;
  label?: string;
  active?: boolean;
  delay?: number;
  compact?: boolean;
}

function NeuronLayer({ neurons, color, label, active, delay = 0, compact }: NeuronLayerProps) {
  const size = compact ? "w-3 h-3" : "w-4 h-4";
  const gap = compact ? "gap-1" : "gap-1.5";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-1"
    >
      {label && <span className="text-[9px] font-medium opacity-70">{label}</span>}
      <div className={`flex flex-col ${gap}`}>
        {Array.from({ length: neurons }).map((_, i) => (
          <motion.div
            key={i}
            className={`${size} rounded-full border-2`}
            style={{
              borderColor: color,
              backgroundColor: active ? color : "transparent",
            }}
            animate={active ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.5, delay: delay + i * 0.05 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface ConnectionsProps {
  fromCount: number;
  toCount: number;
  color: string;
  active?: boolean;
  delay?: number;
}

function Connections({ fromCount, toCount, color, active, delay = 0 }: ConnectionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.8 : 0.3 }}
      transition={{ delay }}
      className="w-6 flex items-center justify-center"
    >
      <svg width="24" height={Math.max(fromCount, toCount) * 20} className="overflow-visible">
        {Array.from({ length: fromCount }).map((_, i) =>
          Array.from({ length: toCount }).map((_, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1="0"
              y1={i * 18 + 10}
              x2="24"
              y2={j * 18 + 10}
              stroke={color}
              strokeWidth={active ? 1.5 : 0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: delay + (i * toCount + j) * 0.01 }}
            />
          ))
        )}
      </svg>
    </motion.div>
  );
}

interface BottomModelProps {
  partyLabel: string;
  color: string;
  features: string[];
  active?: boolean;
  showGradient?: boolean;
  delay?: number;
}

function BottomModel({ partyLabel, color, features, active, showGradient, delay = 0 }: BottomModelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col items-center"
    >
      <div
        className="rounded-xl p-3 border-2 backdrop-blur-sm relative"
        style={{ borderColor: color, backgroundColor: `${color}15` }}
      >
        <div className="text-[10px] font-bold text-center mb-2" style={{ color }}>
          {partyLabel}
        </div>
        
        {/* Features Input */}
        <div className="flex flex-col gap-1 mb-2">
          {features.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 + i * 0.05 }}
              className="text-[8px] bg-black/20 rounded px-2 py-0.5 text-center"
            >
              {f}
            </motion.div>
          ))}
        </div>

        {/* Neural Network Layers */}
        <div className="flex items-center gap-1 justify-center">
          <NeuronLayer neurons={features.length} color={color} label="Input" delay={delay + 0.2} compact />
          <Connections fromCount={features.length} toCount={4} color={color} active={active} delay={delay + 0.3} />
          <NeuronLayer neurons={4} color={color} label="Hidden" active={active} delay={delay + 0.4} compact />
          <Connections fromCount={4} toCount={2} color={color} active={active} delay={delay + 0.5} />
          <NeuronLayer neurons={2} color={color} label="Embed" active={active} delay={delay + 0.6} compact />
        </div>

        {/* Gradient indicator */}
        {showGradient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-red-400 font-mono"
          >
            ∇W_bottom
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function NeuralNetworkVFL() {
  const [step, setStep] = useState<Step>("partition");
  const [isPlaying, setIsPlaying] = useState(false);

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
  }, [isPlaying, step, stepIndex]);

  const nextStep = () => {
    const nextIndex = (stepIndex + 1) % steps.length;
    setStep(steps[nextIndex].key);
  };

  const reset = () => {
    setStep("partition");
    setIsPlaying(false);
  };

  const partyA = { color: "hsl(200, 85%, 50%)", features: ["Age", "City"] };
  const partyB = { color: "hsl(280, 70%, 55%)", features: ["Income", "Income Class"] };
  const partyC = { color: "hsl(35, 90%, 55%)", features: ["Name (Join Key)"] };

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
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          {steps.find((s) => s.key === step)?.description}
        </p>
      </motion.div>

      {/* Visualization */}
      <div className="relative min-h-[450px]">
        <AnimatePresence mode="wait">
          {step === "partition" && (
            <motion.div
              key="partition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Bottom Models */}
              <div className="flex items-start gap-6 flex-wrap justify-center">
                <BottomModel partyLabel="Party A - Bottom Model" color={partyA.color} features={partyA.features} delay={0} />
                <BottomModel partyLabel="Party B - Bottom Model" color={partyB.color} features={partyB.features} delay={0.15} />
                <BottomModel partyLabel="Party C - Bottom Model" color={partyC.color} features={partyC.features} delay={0.3} />
              </div>

              {/* Aggregator / Top Model */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl p-4 border-2 border-emerald-500 bg-emerald-500/10 backdrop-blur-sm"
              >
                <div className="text-[10px] font-bold text-center mb-3 text-emerald-400">
                  Aggregator - Top Model
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <NeuronLayer neurons={6} color="hsl(160, 70%, 50%)" label="Concat" delay={0.6} />
                  <Connections fromCount={6} toCount={4} color="hsl(160, 70%, 50%)" delay={0.7} />
                  <NeuronLayer neurons={4} color="hsl(160, 70%, 50%)" label="Hidden" delay={0.8} />
                  <Connections fromCount={4} toCount={3} color="hsl(160, 70%, 50%)" delay={0.9} />
                  <NeuronLayer neurons={3} color="hsl(160, 70%, 50%)" label="Output" delay={1} />
                </div>
                <div className="text-[9px] text-center mt-2 opacity-60">
                  3-class classification
                </div>
              </motion.div>

              {/* Architecture Diagram */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="glass-card p-4 max-w-lg text-center"
              >
                <div className="text-xs font-semibold mb-2">Split Learning Architecture</div>
                <div className="text-[10px] font-mono opacity-80 space-y-1">
                  <div>Each party: Bottom Model (private)</div>
                  <div>Aggregator: Top Model (shared coordination)</div>
                  <div className="text-muted-foreground">Only embeddings cross boundaries, not raw data</div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "forward_local" && (
            <motion.div
              key="forward_local"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-start gap-6 flex-wrap justify-center">
                <BottomModel partyLabel="Party A" color={partyA.color} features={partyA.features} active delay={0} />
                <BottomModel partyLabel="Party B" color={partyB.color} features={partyB.features} active delay={0.2} />
                <BottomModel partyLabel="Party C" color={partyC.color} features={partyC.features} active delay={0.4} />
              </div>

              {/* Embeddings Output */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-4"
              >
                {[
                  { label: "E_A", color: partyA.color, val: "[0.23, 0.87]" },
                  { label: "E_B", color: partyB.color, val: "[0.56, 0.12]" },
                  { label: "E_C", color: partyC.color, val: "[0.91, 0.44]" },
                ].map((e, i) => (
                  <motion.div
                    key={e.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                    className="rounded-lg p-2 text-center"
                    style={{ backgroundColor: `${e.color}20`, borderColor: e.color, borderWidth: 1 }}
                  >
                    <div className="text-[10px] font-bold" style={{ color: e.color }}>{e.label}</div>
                    <div className="text-[8px] font-mono opacity-70">{e.val}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Math */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="glass-card p-3 text-center"
              >
                <div className="text-[10px] font-mono">
                  E_i = σ(W_2 · σ(W_1 · X_i + b_1) + b_2)
                </div>
                <div className="text-[9px] text-muted-foreground mt-1">
                  Each party computes embedding using their bottom model
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "forward_agg" && (
            <motion.div
              key="forward_agg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Embeddings flowing */}
              <div className="flex gap-6">
                {[
                  { label: "E_A", color: partyA.color },
                  { label: "E_B", color: partyB.color },
                  { label: "E_C", color: partyC.color },
                ].map((e, i) => (
                  <motion.div
                    key={e.label}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="w-12 h-8 rounded flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: e.color, color: "#fff" }}
                  >
                    {e.label}
                  </motion.div>
                ))}
              </div>

              {/* Arrows */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 text-muted-foreground"
              >
                <span>↓</span>
                <span>↓</span>
                <span>↓</span>
              </motion.div>

              {/* Top Model Processing */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="rounded-xl p-4 border-2 border-emerald-500 bg-emerald-500/10 backdrop-blur-sm"
              >
                <div className="text-[10px] font-bold text-center mb-3 text-emerald-400">
                  Top Model - Forward Pass
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <NeuronLayer neurons={6} color="hsl(160, 70%, 50%)" label="[E_A,E_B,E_C]" active delay={1} />
                  <Connections fromCount={6} toCount={4} color="hsl(160, 70%, 50%)" active delay={1.1} />
                  <NeuronLayer neurons={4} color="hsl(160, 70%, 50%)" active delay={1.2} />
                  <Connections fromCount={4} toCount={3} color="hsl(160, 70%, 50%)" active delay={1.3} />
                  <NeuronLayer neurons={3} color="hsl(160, 70%, 50%)" label="ŷ" active delay={1.4} />
                </div>
              </motion.div>

              {/* Prediction + Loss */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="glass-card p-3 text-center"
              >
                <div className="text-[10px] font-mono mb-1">
                  ŷ = softmax(W_top · [E_A || E_B || E_C])
                </div>
                <div className="text-[10px] font-mono text-red-400">
                  L = CrossEntropy(ŷ, y)
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "backward" && (
            <motion.div
              key="backward"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Top Model with Gradients */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-4 border-2 border-emerald-500 bg-emerald-500/10 backdrop-blur-sm relative"
              >
                <div className="text-[10px] font-bold text-center mb-2 text-emerald-400">
                  Top Model - Compute ∇L/∂W_top
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[9px] font-mono text-center text-red-400"
                >
                  W_top ← W_top - η · ∇W_top
                </motion.div>
              </motion.div>

              {/* Gradient flow down */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-6 text-red-400 font-mono text-xs"
              >
                <span>∂L/∂E_A ↓</span>
                <span>∂L/∂E_B ↓</span>
                <span>∂L/∂E_C ↓</span>
              </motion.div>

              {/* Bottom Models receiving gradients */}
              <div className="flex items-start gap-6 flex-wrap justify-center">
                <BottomModel partyLabel="Party A" color={partyA.color} features={partyA.features} showGradient delay={1} />
                <BottomModel partyLabel="Party B" color={partyB.color} features={partyB.features} showGradient delay={1.2} />
                <BottomModel partyLabel="Party C" color={partyC.color} features={partyC.features} showGradient delay={1.4} />
              </div>

              {/* Update equation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="glass-card p-3 text-center"
              >
                <div className="text-[10px] font-mono">
                  W_bottom_i ← W_bottom_i - η · (∂L/∂E_i) · (∂E_i/∂W_bottom_i)
                </div>
                <div className="text-[9px] text-muted-foreground mt-1">
                  Chain rule: Gradients propagate through split point
                </div>
              </motion.div>
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
              {/* Final Architecture */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="glass-card p-6"
              >
                <div className="text-sm font-semibold text-center mb-4">Converged Split Model</div>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    {[
                      { label: "Party A", color: partyA.color },
                      { label: "Party B", color: partyB.color },
                      { label: "Party C", color: partyC.color },
                    ].map((p, i) => (
                      <motion.div
                        key={p.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-3 rounded-lg text-center"
                        style={{ backgroundColor: `${p.color}20`, borderColor: p.color, borderWidth: 1 }}
                      >
                        <div className="text-[10px] font-bold" style={{ color: p.color }}>{p.label}</div>
                        <div className="text-[9px] opacity-70">Private Bottom Model ✓</div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-muted-foreground"
                  >
                    ↓ embeddings only ↓
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500 text-center"
                  >
                    <div className="text-[10px] font-bold text-emerald-400">Shared Top Model</div>
                    <div className="text-[9px] opacity-70">Coordinated by Aggregator</div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="grid grid-cols-3 gap-3 max-w-lg"
              >
                {[
                  { icon: "🔒", text: "Raw features never shared" },
                  { icon: "🧠", text: "Full model accuracy" },
                  { icon: "⚡", text: "Gradient-based training" },
                ].map((b, i) => (
                  <div key={i} className="text-center p-2 bg-muted/30 rounded-lg">
                    <div className="text-lg">{b.icon}</div>
                    <div className="text-[9px] opacity-80">{b.text}</div>
                  </div>
                ))}
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
