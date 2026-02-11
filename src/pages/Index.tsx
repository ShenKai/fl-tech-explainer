import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HorizontalFLDemo } from "@/components/HorizontalFLDemo";
import { VerticalFLDemo } from "@/components/VerticalFLDemo";
import { ComparisonChart } from "@/components/ComparisonChart";
import { OrchestraAnalogy } from "@/components/OrchestraAnalogy";
import { ExcelDataView } from "@/components/ExcelDataView";
import { LayoutGrid, Layers, GitCompare, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeTab, setActiveTab] = useState("horizontal");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Interactive Demo
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Federated Learning</span>
              <br />
              <span className="text-foreground">Partitioning Explained</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              Explore how data is partitioned and models are trained in horizontal
              and vertical federated learning — without sharing raw data.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/simulation">
                <FlaskConical className="w-4 h-4" />
                FL Simulation Laboratory
              </Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-auto p-1">
              <TabsTrigger
                value="horizontal"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Horizontal FL</span>
                <span className="sm:hidden">HFL</span>
              </TabsTrigger>
              <TabsTrigger
                value="vertical"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Vertical FL</span>
                <span className="sm:hidden">VFL</span>
              </TabsTrigger>
              <TabsTrigger
                value="compare"
                className="flex items-center gap-2 py-3"
              >
                <GitCompare className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
                <span className="sm:hidden">Cmp</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="horizontal" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Horizontal Federated Learning</h2>
                  <p className="text-sm text-muted-foreground">
                    Same features, different samples across clients
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mb-6">
                <span className="px-3 py-1 rounded-full bg-muted">Healthcare</span>
                <span className="px-3 py-1 rounded-full bg-muted">Mobile Keyboards</span>
                <span className="px-3 py-1 rounded-full bg-muted">Google Gboard</span>
              </div>
              <OrchestraAnalogy type="horizontal" />
              <ExcelDataView type="horizontal" />
              <HorizontalFLDemo />
            </motion.div>
          </TabsContent>

          <TabsContent value="vertical" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Layers className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Vertical Federated Learning</h2>
                  <p className="text-sm text-muted-foreground">
                    Same samples, different features across clients
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mb-6">
                <span className="px-3 py-1 rounded-full bg-muted">Cross-Industry</span>
                <span className="px-3 py-1 rounded-full bg-muted">Bank + Retailer</span>
                <span className="px-3 py-1 rounded-full bg-muted">Credit Scoring</span>
              </div>
              <OrchestraAnalogy type="vertical" />
              <ExcelDataView type="vertical" />
              <VerticalFLDemo />
            </motion.div>
          </TabsContent>

          <TabsContent value="compare">
            <ComparisonChart />
          </TabsContent>
        </Tabs>

        {/* Key Takeaways */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Horizontal FL Key Points
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Data split by <strong className="text-foreground">samples (rows)</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Each client has <strong className="text-foreground">different users</strong>, same features
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Models trained locally, <strong className="text-foreground">weights aggregated</strong> centrally
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Common in healthcare, mobile apps, IoT
              </li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              Vertical FL Key Points
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Data split by <strong className="text-foreground">features (columns)</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Each client has <strong className="text-foreground">same users</strong>, different attributes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <strong className="text-foreground">Embeddings combined</strong> using secure computation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Common in cross-industry collaborations
              </li>
            </ul>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Interactive Federated Learning Demo • Built for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
