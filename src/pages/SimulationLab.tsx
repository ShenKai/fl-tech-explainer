import { motion } from "framer-motion";
import { FlaskConical, ArrowLeft, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSimulationEngine } from "@/hooks/useSimulationEngine";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { OrbitalVisualization } from "@/components/simulation/OrbitalVisualization";
import { LiveAnalytics } from "@/components/simulation/LiveAnalytics";
import { LogWindow } from "@/components/simulation/LogWindow";
import { DATASET_INFO } from "@/data/adultIncomeDataset";

const SimulationLab = () => {
  const engine = useSimulationEngine();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              <FlaskConical className="w-4 h-4" />
              Simulation Laboratory
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">FL Simulation</span>{" "}
              <span className="text-foreground">Laboratory</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Training on the <strong>{DATASET_INFO.name}</strong> dataset
              ({DATASET_INFO.trainSamples.toLocaleString()} train / {DATASET_INFO.testSamples.toLocaleString()} test samples, {DATASET_INFO.numFeatures} features).
              Flower-style FedAvg aggregation with live metrics.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <SimulationControls
              mode={engine.mode}
              setMode={engine.setMode}
              numClients={engine.numClients}
              balanced={engine.balanced}
              updateClients={engine.updateClients}
              hyperParams={engine.hyperParams}
              setHyperParams={engine.setHyperParams}
              totalRounds={engine.totalRounds}
              setTotalRounds={engine.setTotalRounds}
              clients={engine.clients}
              isRunning={engine.state.isRunning}
              onStart={engine.startSimulation}
              onStop={engine.stopSimulation}
              onReset={engine.resetSimulation}
            />
          </motion.div>

          {/* Center: Orbital Viz */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5"
          >
            <OrbitalVisualization
              clients={engine.clients}
              phase={engine.state.phase}
              currentRound={engine.state.currentRound}
              totalRounds={engine.totalRounds}
            />
          </motion.div>

          {/* Right: Stats summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-4"
          >
            {/* Quick stats */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold mb-3">Current Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Accuracy"
                  value={
                    engine.state.metrics.length > 0
                      ? `${(engine.state.metrics[engine.state.metrics.length - 1].globalAccuracy * 100).toFixed(1)}%`
                      : "—"
                  }
                  color="primary"
                />
                <StatCard
                  label="Loss"
                  value={
                    engine.state.metrics.length > 0
                      ? engine.state.metrics[engine.state.metrics.length - 1].globalLoss.toFixed(4)
                      : "—"
                  }
                  color="destructive"
                />
                <StatCard label="Round" value={`${engine.state.currentRound}/${engine.totalRounds}`} color="accent" />
                <StatCard label="Clients" value={`${engine.clients.length}`} color="muted-foreground" />
              </div>
            </div>

            {/* Client details */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold mb-3">
                {engine.mode === "vertical" ? "Party Details" : "Client Details"}
              </h3>
              <div className="space-y-2">
                {engine.clients.map((c) => {
                  const latest = engine.state.metrics[engine.state.metrics.length - 1];
                  const cm = latest?.clientMetrics.find((m) => m.clientId === c.id);
                  return (
                    <div key={c.id} className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: `hsl(${c.color})` }} />
                        <span className="font-medium w-16">{c.label}</span>
                        <span className="font-mono text-muted-foreground">
                          {c.sampleSize.toLocaleString()} samples
                        </span>
                        {cm && (
                          <span className="font-mono ml-auto text-muted-foreground">
                            {(cm.accuracy * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      {c.features && (
                        <div className="ml-5 flex flex-wrap gap-1">
                          {c.features.map((f) => (
                            <span
                              key={f}
                              className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dataset info */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Dataset</h3>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="font-medium">{DATASET_INFO.name}</p>
                <p className="text-muted-foreground">
                  {DATASET_INFO.totalSamples.toLocaleString()} total samples • {DATASET_INFO.numFeatures} features
                </p>
                <p className="text-muted-foreground">
                  Label: <span className="font-mono">"{DATASET_INFO.labelName}"</span> — {DATASET_INFO.classes.join(" / ")}
                </p>
                <p className="text-muted-foreground">
                  Class balance: {(DATASET_INFO.classRatio[">50K"] * 100).toFixed(0)}% / {(DATASET_INFO.classRatio["≤50K"] * 100).toFixed(0)}%
                </p>
                <a
                  href="https://huggingface.co/datasets/scikit-learn/adult-census-income"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-primary hover:underline text-[11px]"
                >
                  View on Hugging Face →
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Analytics + Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-6"
        >
          <LiveAnalytics metrics={engine.state.metrics} />
          <LogWindow logs={engine.state.logs} />
        </motion.div>
      </main>
    </div>
  );
};

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono text-${color}`}>{value}</p>
    </div>
  );
}

export default SimulationLab;
