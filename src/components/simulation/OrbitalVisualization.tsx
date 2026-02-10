import { motion, AnimatePresence } from "framer-motion";
import { Server, Database } from "lucide-react";
import type { ClientConfig, SimulationPhase } from "@/hooks/useSimulationEngine";

interface OrbitalVisualizationProps {
  clients: ClientConfig[];
  phase: SimulationPhase;
  currentRound: number;
  totalRounds: number;
}

export function OrbitalVisualization({
  clients,
  phase,
  currentRound,
  totalRounds,
}: OrbitalVisualizationProps) {
  const cx = 200;
  const cy = 200;
  const radius = 140;

  const getClientPos = (index: number) => {
    const angle = (index / clients.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  };

  const isClientActive = (id: number) => phase.activeClients.includes(id);

  const phaseLabel = {
    idle: "Idle",
    distributing: "Distributing Parameters",
    training: "Local Training",
    aggregating: "Aggregating Weights",
    evaluating: "Evaluating",
    complete: "Complete",
  }[phase.type];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Network Topology</h3>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          Round {currentRound}/{totalRounds}
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[400px] mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Orbit ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="6 4"
            opacity={0.5}
          />

          {/* Connection lines */}
          {clients.map((client, i) => {
            const pos = getClientPos(i);
            const active = isClientActive(client.id);
            return (
              <line
                key={`line-${client.id}`}
                x1={cx}
                y1={cy}
                x2={pos.x}
                y2={pos.y}
                stroke={active ? `hsl(${client.color})` : "hsl(var(--border))"}
                strokeWidth={active ? 2 : 1}
                opacity={active ? 0.7 : 0.3}
              />
            );
          })}

          {/* Animated data packets */}
          <AnimatePresence>
            {phase.type === "distributing" &&
              clients.map((client, i) => {
                const pos = getClientPos(i);
                return (
                  <motion.circle
                    key={`dist-${client.id}-${phase.round}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={`hsl(var(--primary))`}
                    initial={{ cx, cy, opacity: 1 }}
                    animate={{ cx: pos.x, cy: pos.y, opacity: [1, 1, 0] }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  />
                );
              })}
            {phase.type === "aggregating" &&
              clients.map((client, i) => {
                const pos = getClientPos(i);
                return (
                  <motion.circle
                    key={`agg-${client.id}-${phase.round}`}
                    r={4}
                    fill={`hsl(${client.color})`}
                    initial={{ cx: pos.x, cy: pos.y, opacity: 1 }}
                    animate={{ cx, cy, opacity: [1, 1, 0] }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  />
                );
              })}
          </AnimatePresence>

          {/* Server node (center) */}
          <g>
            <motion.circle
              cx={cx}
              cy={cy}
              r={28}
              fill="hsl(var(--server))"
              animate={{
                scale: phase.type === "aggregating" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.6, repeat: phase.type === "aggregating" ? Infinity : 0 }}
            />
            <foreignObject x={cx - 10} y={cy - 10} width={20} height={20}>
              <Server className="w-5 h-5 text-white" />
            </foreignObject>
          </g>

          {/* Client nodes */}
          {clients.map((client, i) => {
            const pos = getClientPos(i);
            const active = isClientActive(client.id);
            return (
              <g key={`node-${client.id}`}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={22}
                  fill={`hsl(${client.color})`}
                  animate={{
                    scale: active && phase.type === "training" ? [1, 1.12, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: active && phase.type === "training" ? Infinity : 0,
                  }}
                />
                {active && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={22}
                    fill="none"
                    stroke={`hsl(${client.color})`}
                    strokeWidth="2"
                    initial={{ r: 22, opacity: 0.6 }}
                    animate={{ r: 34, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <foreignObject x={pos.x - 8} y={pos.y - 8} width={16} height={16}>
                  <Database className="w-4 h-4 text-white" />
                </foreignObject>
                <text
                  x={pos.x}
                  y={pos.y + 36}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground font-medium"
                >
                  {client.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Phase indicator */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <span
          className={`w-2 h-2 rounded-full ${
            phase.type === "idle" || phase.type === "complete"
              ? "bg-muted-foreground"
              : "bg-primary animate-pulse"
          }`}
        />
        <span className="text-xs font-medium text-muted-foreground">{phaseLabel}</span>
      </div>
    </div>
  );
}
