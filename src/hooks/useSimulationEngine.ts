import { useState, useCallback, useRef } from "react";
import {
  DATASET_INFO,
  horizontalPartition,
  verticalPartition,
} from "@/data/adultIncomeDataset";

export type FLMode = "horizontal" | "vertical";

export interface ClientConfig {
  id: number;
  label: string;
  sampleSize: number;
  color: string;
  /** Features held by this client (relevant in vertical FL) */
  features?: string[];
}

export interface HyperParams {
  learningRate: number;
  localEpochs: number;
  batchSize: number;
}

export interface RoundMetrics {
  round: number;
  globalAccuracy: number;
  globalLoss: number;
  clientMetrics: { clientId: number; accuracy: number; loss: number }[];
}

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "DEBUG";
  message: string;
}

export interface SimulationPhase {
  type: "idle" | "distributing" | "training" | "aggregating" | "evaluating" | "complete";
  activeClients: number[];
  round: number;
}

export interface SimulationState {
  isRunning: boolean;
  phase: SimulationPhase;
  currentRound: number;
  totalRounds: number;
  metrics: RoundMetrics[];
  logs: LogEntry[];
}

const CLIENT_COLORS = [
  "200 85% 50%",
  "280 70% 55%",
  "35 90% 55%",
  "140 60% 45%",
  "350 75% 55%",
];

function generateClientConfigs(
  count: number,
  balanced: boolean,
  mode: FLMode
): ClientConfig[] {
  if (mode === "vertical") {
    const parts = verticalPartition(count);
    return parts.map((p, i) => ({
      id: i,
      label: `Party ${i + 1}`,
      sampleSize: p.sampleSize,
      features: p.features,
      color: CLIENT_COLORS[i],
    }));
  }
  // Horizontal: split rows
  const sizes = horizontalPartition(count, balanced);
  return sizes.map((size, i) => ({
    id: i,
    label: `Client ${i + 1}`,
    sampleSize: size,
    color: CLIENT_COLORS[i],
  }));
}

function simulateRound(
  round: number,
  clients: ClientConfig[],
  hyperParams: HyperParams,
  mode: FLMode,
  prevMetrics?: RoundMetrics
): RoundMetrics {
  const decay = 0.85;
  const baseLoss = prevMetrics ? prevMetrics.globalLoss : 2.3;
  const baseAcc = prevMetrics ? prevMetrics.globalAccuracy : 0.1;

  const lr = hyperParams.learningRate;
  const epochFactor = Math.min(hyperParams.localEpochs / 5, 1.2);
  const improvementRate = lr * epochFactor * (mode === "horizontal" ? 1.0 : 0.9);

  const clientMetrics = clients.map((c) => {
    const sizeBonus = c.sampleSize / 500;
    const noise = (Math.random() - 0.5) * 0.05;
    const clientLoss = Math.max(0.05, baseLoss * (decay - improvementRate * sizeBonus) + noise * 0.3);
    const clientAcc = Math.min(0.99, baseAcc + improvementRate * sizeBonus * 0.15 + noise * 0.02);
    return { clientId: c.id, accuracy: clientAcc, loss: clientLoss };
  });

  const totalSamples = clients.reduce((s, c) => s + c.sampleSize, 0);
  const globalLoss = clients.reduce((sum, c, i) => {
    return sum + clientMetrics[i].loss * (c.sampleSize / totalSamples);
  }, 0);
  const globalAccuracy = clients.reduce((sum, c, i) => {
    return sum + clientMetrics[i].accuracy * (c.sampleSize / totalSamples);
  }, 0);

  return {
    round,
    globalLoss: Math.max(0.02, globalLoss),
    globalAccuracy: Math.min(0.99, globalAccuracy),
    clientMetrics,
  };
}

function ts(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function useSimulationEngine() {
  const [mode, _setMode] = useState<FLMode>("horizontal");
  const [numClients, setNumClients] = useState(3);
  const [balanced, setBalanced] = useState(true);
  const [hyperParams, setHyperParams] = useState<HyperParams>({
    learningRate: 0.01,
    localEpochs: 3,
    batchSize: 32,
  });
  const [totalRounds, setTotalRounds] = useState(10);
  const [clients, setClients] = useState<ClientConfig[]>(() =>
    generateClientConfigs(3, true, "horizontal")
  );

  const setMode = useCallback((m: FLMode) => {
    _setMode(m);
    setClients((prev) => generateClientConfigs(prev.length, balanced, m));
  }, [balanced]);
  const [state, setState] = useState<SimulationState>({
    isRunning: false,
    phase: { type: "idle", activeClients: [], round: 0 },
    currentRound: 0,
    totalRounds: 10,
    metrics: [],
    logs: [],
  });

  const abortRef = useRef(false);

  const updateClients = useCallback(
    (count: number, isBalanced: boolean) => {
      setNumClients(count);
      setBalanced(isBalanced);
      setClients(generateClientConfigs(count, isBalanced, mode));
    },
    [mode]
  );

  const addLog = useCallback(
    (level: LogEntry["level"], message: string) => {
      setState((prev) => ({
        ...prev,
        logs: [...prev.logs, { timestamp: ts(), level, message }],
      }));
    },
    []
  );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const startSimulation = useCallback(async () => {
    abortRef.current = false;

    setState((prev) => ({
      ...prev,
      isRunning: true,
      currentRound: 0,
      metrics: [],
      logs: [],
      phase: { type: "idle", activeClients: [], round: 0 },
    }));

    const modeLabel = mode === "horizontal" ? "Horizontal" : "Vertical";
    addLog("INFO", `flwr: Dataset: ${DATASET_INFO.name} (${DATASET_INFO.trainSamples.toLocaleString()} train / ${DATASET_INFO.testSamples.toLocaleString()} test)`);
    addLog("INFO", `flwr: Features: ${DATASET_INFO.numFeatures} | Label: "${DATASET_INFO.labelName}" | Classes: ${DATASET_INFO.classes.join(", ")}`);
    addLog("INFO", `flwr: Starting ${modeLabel} FL simulation with ${clients.length} ${mode === "vertical" ? "parties" : "clients"}`);
    if (mode === "vertical") {
      clients.forEach((c) => {
        addLog("DEBUG", `flwr: ${c.label} holds features: [${c.features?.join(", ")}]`);
      });
    } else {
      clients.forEach((c) => {
        addLog("DEBUG", `flwr: ${c.label} holds ${c.sampleSize.toLocaleString()} samples`);
      });
    }
    addLog("INFO", `flwr: Strategy FedAvg | LR=${hyperParams.learningRate} | Epochs=${hyperParams.localEpochs} | Batch=${hyperParams.batchSize}`);
    addLog("INFO", `flwr: Total rounds: ${totalRounds}`);
    await sleep(600);

    let prevMetrics: RoundMetrics | undefined;

    for (let round = 1; round <= totalRounds; round++) {
      if (abortRef.current) break;

      // Distributing phase
      setState((prev) => ({
        ...prev,
        currentRound: round,
        phase: { type: "distributing", activeClients: clients.map((c) => c.id), round },
      }));
      addLog("INFO", `flwr: FitRound ${round} — distributing global parameters to ${clients.length} clients`);
      await sleep(800);
      if (abortRef.current) break;

      // Training phase
      for (const client of clients) {
        if (abortRef.current) break;
        setState((prev) => ({
          ...prev,
          phase: { type: "training", activeClients: [client.id], round },
        }));
        addLog("DEBUG", `flwr: Client ${client.id + 1} training on ${client.sampleSize} samples (${hyperParams.localEpochs} epochs)`);
        await sleep(500);
      }
      if (abortRef.current) break;

      // Aggregating phase
      setState((prev) => ({
        ...prev,
        phase: { type: "aggregating", activeClients: clients.map((c) => c.id), round },
      }));
      addLog("INFO", `flwr: FitRound ${round} received ${clients.length} results — aggregating with FedAvg`);
      await sleep(700);
      if (abortRef.current) break;

      // Evaluating phase
      const roundMetrics = simulateRound(round, clients, hyperParams, mode, prevMetrics);
      prevMetrics = roundMetrics;

      setState((prev) => ({
        ...prev,
        phase: { type: "evaluating", activeClients: [], round },
        metrics: [...prev.metrics, roundMetrics],
      }));
      addLog("INFO", `flwr: EvalRound ${round} — accuracy: ${(roundMetrics.globalAccuracy * 100).toFixed(1)}%, loss: ${roundMetrics.globalLoss.toFixed(4)}`);
      await sleep(500);
    }

    if (!abortRef.current) {
      setState((prev) => ({
        ...prev,
        isRunning: false,
        phase: { type: "complete", activeClients: [], round: totalRounds },
      }));
      addLog("INFO", `flwr: Simulation complete after ${totalRounds} rounds`);
    }
  }, [mode, clients, hyperParams, totalRounds, addLog]);

  const stopSimulation = useCallback(() => {
    abortRef.current = true;
    setState((prev) => ({
      ...prev,
      isRunning: false,
      phase: { type: "idle", activeClients: [], round: prev.currentRound },
    }));
    addLog("WARN", "flwr: Simulation stopped by user");
  }, [addLog]);

  const resetSimulation = useCallback(() => {
    abortRef.current = true;
    setState({
      isRunning: false,
      phase: { type: "idle", activeClients: [], round: 0 },
      currentRound: 0,
      totalRounds,
      metrics: [],
      logs: [],
    });
  }, [totalRounds]);

  return {
    mode,
    setMode,
    numClients,
    balanced,
    updateClients,
    hyperParams,
    setHyperParams,
    totalRounds,
    setTotalRounds,
    clients,
    state,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };
}
