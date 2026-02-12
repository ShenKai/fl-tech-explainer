import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LogEntry } from "@/hooks/useSimulationEngine";

interface LogWindowProps {
  logs: LogEntry[];
}

const levelColors: Record<string, string> = {
  INFO: "text-primary",
  WARN: "text-[hsl(35_90%_55%)]",
  DEBUG: "text-muted-foreground",
};

export function LogWindow({ logs }: LogWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs.length]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(35_90%_55%/0.6)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent)/0.6)]" />
        </div>
        <span className="text-xs font-mono text-muted-foreground">Flower Server Logs</span>
      </div>
      <ScrollArea className="h-[200px]">
        <div ref={containerRef} className="p-3 space-y-0.5 font-mono text-[11px] leading-relaxed bg-[hsl(220_25%_6%)] text-[hsl(220_15%_75%)]">
          {logs.length === 0 && (
            <p className="text-muted-foreground opacity-50">
              $ waiting for simulation to start...
            </p>
          )}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted-foreground/50 shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 ${levelColors[log.level]}`}>{log.level}</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
