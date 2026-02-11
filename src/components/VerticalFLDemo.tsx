import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NeuralNetworkVFL } from "./NeuralNetworkVFL";
import { DecisionTreeVFL } from "./DecisionTreeVFL";
import { DataTable } from "./DataTable";
import { ClientNode } from "./ClientNode";
import { Network, TreeDeciduous, Info } from "lucide-react";
import {
  MOCK_PEOPLE,
  HEADERS,
  toRows,
  VFL_HEADERS_A,
  VFL_HEADERS_B,
  toVflRowsA,
  toVflRowsB,
} from "@/data/mockPeopleDataset";

type ModelType = "neural" | "tree";

export function VerticalFLDemo() {
  const [modelType, setModelType] = useState<ModelType>("neural");

  return (
    <div className="space-y-6">
      {/* Vertical Partitioning Visual — mirrors HFL's partition step */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start"
      >
        {/* Original Data */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-foreground" />
            Complete Dataset (same people)
          </h4>
          <DataTable
            data={toRows(MOCK_PEOPLE)}
            headers={HEADERS}
            showHeaders
            highlightCols={[1, 2]}
          />
          <div className="mt-3 flex gap-2 text-[10px] flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[hsl(200_85%_50%/0.2)] text-[hsl(200_85%_40%)]">
              Name, Age, City → Client A
            </span>
            <span className="px-2 py-0.5 rounded bg-[hsl(280_70%_55%/0.2)] text-[hsl(280_70%_45%)]">
              Name, Income, Class → Client B
            </span>
          </div>
        </div>

        {/* Partitioned by Features */}
        <div className="grid gap-3">
          <ClientNode label="Client A — Demographics" clientType="a" description="All 9 people, features: Name, Age, City" delay={0.2}>
            <DataTable
              data={toVflRowsA(MOCK_PEOPLE)}
              headers={VFL_HEADERS_A}
              showHeaders
              clientColor="a"
              compact
              animateDelay={0.3}
            />
          </ClientNode>
          <ClientNode label="Client B — Financials" clientType="b" description="All 9 people, features: Name, Income, Class" delay={0.3}>
            <DataTable
              data={toVflRowsB(MOCK_PEOPLE)}
              headers={VFL_HEADERS_B}
              showHeaders
              clientColor="b"
              compact
              animateDelay={0.4}
            />
          </ClientNode>
        </div>
      </motion.div>

      {/* Model Type Selector */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Select a model type to see how it's trained in Vertical FL</span>
        </div>
        
        <Tabs value={modelType} onValueChange={(v) => setModelType(v as ModelType)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="neural" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Neural Network (Split Learning)
            </TabsTrigger>
            <TabsTrigger value="tree" className="flex items-center gap-2">
              <TreeDeciduous className="w-4 h-4" />
              Decision Tree (SecureBoost)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="neural" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mb-6"
            >
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Network className="w-4 h-4 text-accent" />
                Split Learning Architecture
              </h4>
              <p className="text-xs text-muted-foreground">
                The neural network is split vertically: each party has a <strong>bottom model</strong> that processes their features 
                into embeddings. These embeddings are sent to an <strong>aggregator's top model</strong> for final prediction. 
                Only gradients (not raw data) cross boundaries during backpropagation.
              </p>
            </motion.div>
            <NeuralNetworkVFL />
          </TabsContent>

          <TabsContent value="tree" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mb-6"
            >
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TreeDeciduous className="w-4 h-4 text-accent" />
                Secure Tree Learning (e.g., SecureBoost)
              </h4>
              <p className="text-xs text-muted-foreground">
                Decision tree nodes are <strong>owned by the party whose feature is used for splitting</strong>. 
                Split candidates are proposed by each party; a coordinator selects the best split using 
                <strong> encrypted statistics</strong> without seeing raw data. Inference requires multi-party evaluation.
              </p>
            </motion.div>
            <DecisionTreeVFL />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
