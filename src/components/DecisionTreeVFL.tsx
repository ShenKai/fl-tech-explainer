import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, Play, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

type Step = "partition" | "local_trees" | "coordination" | "joint_predict" | "result";

const steps: { key: Step; label: string; description: string }[] = [
  {
    key: "partition",
    label: "Feature Partitioning",
    description: "Each party owns different features for the same users. Labels are held by one coordinating party.",
  },
  {
    key: "local_trees",
    label: "Local Split Candidates",
    description: "Each party proposes split candidates using their features (e.g., Age<30, Income>80K).",
  },
  {
    key: "coordination",
    label: "Secure Best Split Selection",
    description: "Parties compute encrypted statistics; coordinator selects best split without seeing raw data.",
  },
  {
    key: "joint_predict",
    label: "Joint Prediction",
    description: "For inference, data flows through the distributed tree—each party evaluates their owned nodes.",
  },
  {
    key: "result",
    label: "Final Tree",
    description: "The complete tree spans all parties' features, enabling powerful predictions with privacy.",
  },
];

interface TreeNodeProps {
  label: string;
  isLeaf?: boolean;
  color: string;
  x: number;
  y: number;
  delay?: number;
  active?: boolean;
  children?: { leftX: number; rightX: number; leftY: number; rightY: number };
}

function TreeNode({ label, isLeaf, color, x, y, delay = 0, active, children }: TreeNodeProps) {
  return (
    <>
      {/* Connection lines to children */}
      {children && (
        <>
          <motion.line
            x1={x}
            y1={y + 26}
            x2={children.leftX}
            y2={children.leftY - 26}
            stroke={color}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.1 }}
          />
          <motion.line
            x1={x}
            y1={y + 26}
            x2={children.rightX}
            y2={children.rightY - 26}
            stroke={color}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.1 }}
          />
        </>
      )}
      
      {/* Node */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200 }}
      >
        {isLeaf ? (
          <motion.rect
            x={x - 42}
            y={y - 18}
            width={84}
            height={36}
            rx={8}
            fill={color}
            animate={active ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.circle
            cx={x}
            cy={y}
            r={32}
            fill={`${color}30`}
            stroke={color}
            strokeWidth={2.5}
            animate={active ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
        )}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontSize={isLeaf ? 13 : 12}
          fontWeight="bold"
        >
          {label}
        </text>
      </motion.g>
    </>
  );
}

interface PartyBoxProps {
  label: string;
  color: string;
  features: string[];
  splits?: string[];
  active?: boolean;
  delay?: number;
}

function PartyBox({ label, color, features, splits, active, delay = 0 }: PartyBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl p-5 border-2 backdrop-blur-sm min-w-[190px]"
      style={{ borderColor: color, backgroundColor: `${color}15` }}
    >
      <div className="text-xs font-bold text-center mb-3" style={{ color }}>
        {label}
      </div>
      
      <div className="space-y-1.5 mb-3">
        {features.map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.1 + i * 0.05 }}
            className="text-[11px] bg-black/20 rounded px-2.5 py-1 text-center"
          >
            {f}
          </motion.div>
        ))}
      </div>

      {splits && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="border-t border-white/20 pt-2.5 mt-2.5"
        >
          <div className="text-[10px] opacity-60 mb-1.5">Split Candidates:</div>
          {splits.map((s, i) => (
            <motion.div
              key={s}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: delay + 0.4 + i * 0.1 }}
              className={`text-[11px] rounded px-2.5 py-1 mb-1 ${active ? "bg-white/20" : "bg-black/10"}`}
            >
              {s}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export function DecisionTreeVFL() {
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

  const partyA = { color: "hsl(200, 85%, 50%)", features: ["Age", "City"], splits: ["Age < 30", "Age < 45", "City = NYC"] };
  const partyB = { color: "hsl(280, 70%, 55%)", features: ["Income", "Income Class"], splits: ["Income > 80K", "Income > 100K", "Class = >50K"] };
  const partyC = { color: "hsl(35, 90%, 55%)", features: ["Name (Join Key)", "Label*"], splits: ["Income > 85K", "Age > 35"] };

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
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {step === "partition" && (
            <motion.div
              key="partition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-start gap-6 flex-wrap justify-center">
                <PartyBox label="Party A (Demographics)" color={partyA.color} features={partyA.features} delay={0} />
                <PartyBox label="Party B (Financial)" color={partyB.color} features={partyB.features} delay={0.15} />
                <PartyBox label="Party C (Coordinator)" color={partyC.color} features={partyC.features} delay={0.3} />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-4 max-w-md text-center"
              >
                <div className="text-xs font-semibold mb-2">Vertical Partitioning</div>
                <div className="text-[10px] opacity-80 space-y-1">
                  <div>• Same users (IDs) across all parties</div>
                  <div>• Different features per party</div>
                  <div>• Party C holds labels (coordinator)</div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "local_trees" && (
            <motion.div
              key="local_trees"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-start gap-6 flex-wrap justify-center">
                <PartyBox label="Party A" color={partyA.color} features={partyA.features} splits={partyA.splits} active delay={0} />
                <PartyBox label="Party B" color={partyB.color} features={partyB.features} splits={partyB.splits} active delay={0.2} />
                <PartyBox label="Party C" color={partyC.color} features={["Tenure"]} splits={partyC.splits} active delay={0.4} />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="glass-card p-3 text-center"
              >
                <div className="text-[10px] font-mono">
                  For each candidate split, compute: Gini Impurity or Information Gain
                </div>
                <div className="text-[9px] text-muted-foreground mt-1">
                  Encrypted histograms sent to coordinator
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "coordination" && (
            <motion.div
              key="coordination"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Parties sending encrypted stats */}
              <div className="flex items-start gap-8">
                {[
                  { label: "A", color: partyA.color, split: "Age<30" },
                  { label: "B", color: partyB.color, split: "Income>80K" },
                  { label: "C", color: partyC.color, split: "Age>35" },
                ].map((p, i) => (
                  <motion.div
                    key={p.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.label}
                    </div>
                    <div className="text-xs font-mono">{p.split}</div>
                    <div className="text-[10px] opacity-60">🔒 encrypted</div>
                  </motion.div>
                ))}
              </div>

              {/* Arrows */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                ↓ ↓ ↓
              </motion.div>

              {/* Coordinator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="rounded-xl p-5 border-2 border-emerald-500 bg-emerald-500/10"
              >
                <div className="text-xs font-bold text-center mb-3 text-emerald-400">
                  Coordinator
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs font-mono space-y-1.5"
                >
                  <div>Comparing gain values...</div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="bg-white/20 rounded p-1.5"
                  >
                    ✓ Best: <span className="text-[hsl(280,70%,60%)] font-bold">Income &gt; 80K</span> (Party B)
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-xs text-muted-foreground text-center"
              >
                Process repeats for each tree level
              </motion.div>
            </motion.div>
          )}

          {step === "joint_predict" && (
            <motion.div
              key="joint_predict"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Tree visualization */}
              <svg viewBox="0 0 620 320" className="w-full max-w-[620px] h-auto overflow-visible">
                {/* Root - Party B */}
                <TreeNode
                  label="Income>80K"
                  color={partyB.color}
                  x={310}
                  y={40}
                  delay={0}
                  active
                  children={{ leftX: 155, rightX: 465, leftY: 150, rightY: 150 }}
                />
                
                {/* Level 2 Left - Party A */}
                <TreeNode
                  label="Age<30"
                  color={partyA.color}
                  x={155}
                  y={150}
                  delay={0.3}
                  active
                  children={{ leftX: 78, rightX: 232, leftY: 260, rightY: 260 }}
                />
                
                {/* Level 2 Right - Party C */}
                <TreeNode
                  label="Age>35"
                  color={partyC.color}
                  x={465}
                  y={150}
                  delay={0.3}
                  active
                  children={{ leftX: 388, rightX: 542, leftY: 260, rightY: 260 }}
                />
                
                {/* Leaves */}
                <TreeNode label="≤50K" isLeaf color="hsl(140, 60%, 45%)" x={78} y={260} delay={0.6} />
                <TreeNode label=">50K" isLeaf color="hsl(40, 70%, 50%)" x={232} y={260} delay={0.7} />
                <TreeNode label=">50K" isLeaf color="hsl(40, 70%, 50%)" x={388} y={260} delay={0.8} />
                <TreeNode label="≤50K" isLeaf color="hsl(0, 60%, 50%)" x={542} y={260} delay={0.9} />
              </svg>

              {/* Inference path */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="glass-card p-4 text-center max-w-lg"
              >
                <div className="text-sm font-semibold mb-2">Joint Inference for Emma Fischer</div>
                <div className="text-xs space-y-1.5">
                  <div><span style={{ color: partyB.color }}>Party B:</span> Income=105K → <span className="text-emerald-400">Yes (&gt;80K)</span></div>
                  <div><span style={{ color: partyA.color }}>Party A:</span> Age=38 → <span className="text-emerald-400">Yes (&gt;35)</span></div>
                  <div className="font-bold mt-2">→ Prediction: &gt;50K ✓</div>
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
              {/* Final Tree Summary */}
              <svg viewBox="0 0 620 300" className="w-full max-w-[620px] h-auto overflow-visible">
                <TreeNode
                  label="Income>80K"
                  color={partyB.color}
                  x={310}
                  y={40}
                  delay={0}
                  children={{ leftX: 155, rightX: 465, leftY: 145, rightY: 145 }}
                />
                <TreeNode
                  label="Age<30"
                  color={partyA.color}
                  x={155}
                  y={145}
                  delay={0.2}
                  children={{ leftX: 78, rightX: 232, leftY: 250, rightY: 250 }}
                />
                <TreeNode
                  label="Age>35"
                  color={partyC.color}
                  x={465}
                  y={145}
                  delay={0.2}
                  children={{ leftX: 388, rightX: 542, leftY: 250, rightY: 250 }}
                />
                <TreeNode label="≤50K" isLeaf color="hsl(140, 60%, 45%)" x={78} y={250} delay={0.4} />
                <TreeNode label=">50K" isLeaf color="hsl(40, 70%, 50%)" x={232} y={250} delay={0.5} />
                <TreeNode label=">50K" isLeaf color="hsl(40, 70%, 50%)" x={388} y={250} delay={0.6} />
                <TreeNode label="≤50K" isLeaf color="hsl(0, 60%, 50%)" x={542} y={250} delay={0.7} />
              </svg>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-5 text-xs"
              >
                <span style={{ color: partyA.color }}>■ Party A nodes</span>
                <span style={{ color: partyB.color }}>■ Party B nodes</span>
                <span style={{ color: partyC.color }}>■ Party C nodes</span>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-3 max-w-lg"
              >
                {[
                  { icon: "🌳", text: "Tree spans all features" },
                  { icon: "🔐", text: "Raw data stays private" },
                  { icon: "🤝", text: "Distributed evaluation" },
                ].map((b, i) => (
                  <div key={i} className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl">{b.icon}</div>
                    <div className="text-[11px] opacity-80">{b.text}</div>
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
