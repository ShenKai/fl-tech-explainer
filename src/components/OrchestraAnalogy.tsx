import { motion } from "framer-motion";
import { Music, Users, Mic2, Headphones, Blend } from "lucide-react";

interface OrchestraAnalogyProps {
  type: "horizontal" | "vertical";
}

export function OrchestraAnalogy({ type }: OrchestraAnalogyProps) {
  if (type === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 mb-6 border-l-4 border-l-[hsl(var(--primary))]"
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              🎼 The Orchestra Analogy
              <span className="text-xs font-normal text-muted-foreground">— Same Score, Different Concerts</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Imagine <strong className="text-foreground">three orchestras</strong> in different cities, all performing the{" "}
              <strong className="text-foreground">same symphony</strong>. Each orchestra plays for a{" "}
              <strong className="text-foreground">different audience</strong> (different data samples), but they all follow the same sheet music (same features).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <AnalogyStep
                icon={<Users className="w-4 h-4" />}
                title="Local Rehearsal"
                description="Each orchestra rehearses independently with their own audience's feedback"
                color="primary"
              />
              <AnalogyStep
                icon={<Mic2 className="w-4 h-4" />}
                title="Share Performance Notes"
                description="Only performance notes (model weights) are sent to a central conductor — never the raw recordings"
                color="primary"
              />
              <AnalogyStep
                icon={<Headphones className="w-4 h-4" />}
                title="Updated Master Score"
                description="The conductor averages all notes to create an improved score, sent back to every orchestra"
                color="primary"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 mb-6 border-l-4 border-l-[hsl(var(--accent))]"
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-accent/10 shrink-0">
          <Music className="w-6 h-6 text-accent" />
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            🎼 The Orchestra Analogy
            <span className="text-xs font-normal text-muted-foreground">— Same Concert, Different Instruments</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Now imagine a <strong className="text-foreground">single concert</strong>, but each instrument section — strings, brass, percussion — rehearses in{" "}
            <strong className="text-foreground">isolated studios</strong>. They all practice the{" "}
            <strong className="text-foreground">same piece for the same audience</strong> (same samples), but each studio only has their own instrument parts (different features).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <AnalogyStep
              icon={<Music className="w-4 h-4" />}
              title="Isolated Studios"
              description="Strings, brass & percussion each learn their part separately — no studio hears the others"
              color="accent"
            />
            <AnalogyStep
              icon={<Blend className="w-4 h-4" />}
              title="Share Audio Stems"
              description="Each studio sends only audio stems (embeddings) to an encrypted mixing desk — never the raw sheet music"
              color="accent"
            />
            <AnalogyStep
              icon={<Headphones className="w-4 h-4" />}
              title="Final Performance"
              description="The mixing desk harmonizes all stems into one cohesive performance — all studios must reunite for inference"
              color="accent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalogyStep({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "accent";
}) {
  return (
    <div className={`rounded-lg p-3 bg-${color}/5 border border-${color}/10`}>
      <div className={`flex items-center gap-2 mb-1.5 text-${color}`}>
        {icon}
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">{description}</p>
    </div>
  );
}
