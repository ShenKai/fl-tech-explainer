import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NeuralNetworkVFL } from "./NeuralNetworkVFL";
import { DecisionTreeVFL } from "./DecisionTreeVFL";
import { Network, TreeDeciduous, Info } from "lucide-react";

type ModelType = "neural" | "tree";

export function VerticalFLDemo() {
  const [modelType, setModelType] = useState<ModelType>("neural");

  return (
    <div className="space-y-6">
      {/* Model Type Selector */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Select a model type to see how it's partitioned in Vertical FL</span>
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
