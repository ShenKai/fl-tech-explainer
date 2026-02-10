/**
 * UCI Adult Income Dataset metadata & realistic partitioning utilities.
 * Source: https://huggingface.co/datasets/scikit-learn/adult-census-income
 *
 * The dataset contains 48,842 records with 14 features + 1 binary label (income >50K / ≤50K).
 * We embed actual feature names, types, and class distribution so that the simulation
 * references a real dataset rather than abstract "sample sizes".
 */

export interface DatasetFeature {
  name: string;
  type: "numerical" | "categorical";
  description: string;
}

export const ADULT_INCOME_FEATURES: DatasetFeature[] = [
  { name: "age", type: "numerical", description: "Age of the individual" },
  { name: "workclass", type: "categorical", description: "Employment type (Private, Gov, Self-emp, …)" },
  { name: "fnlwgt", type: "numerical", description: "Final sampling weight" },
  { name: "education", type: "categorical", description: "Highest education level" },
  { name: "education-num", type: "numerical", description: "Education level (numeric)" },
  { name: "marital-status", type: "categorical", description: "Marital status" },
  { name: "occupation", type: "categorical", description: "Occupation category" },
  { name: "relationship", type: "categorical", description: "Relationship role in household" },
  { name: "race", type: "categorical", description: "Race" },
  { name: "sex", type: "categorical", description: "Biological sex" },
  { name: "capital-gain", type: "numerical", description: "Capital gains" },
  { name: "capital-loss", type: "numerical", description: "Capital losses" },
  { name: "hours-per-week", type: "numerical", description: "Working hours per week" },
  { name: "native-country", type: "categorical", description: "Country of origin" },
];

export const DATASET_INFO = {
  name: "UCI Adult Census Income",
  source: "scikit-learn/adult-census-income",
  totalSamples: 48_842,
  trainSamples: 32_561,
  testSamples: 16_281,
  numFeatures: 14,
  labelName: "income",
  classes: [">50K", "≤50K"],
  classRatio: { ">50K": 0.24, "≤50K": 0.76 },
};

/**
 * Horizontal FL: each client gets a disjoint subset of rows (same features).
 * Returns sample counts per client that sum to the training set size.
 */
export function horizontalPartition(
  numClients: number,
  balanced: boolean
): number[] {
  const total = DATASET_INFO.trainSamples;
  if (balanced) {
    const base = Math.floor(total / numClients);
    const remainder = total - base * numClients;
    return Array.from({ length: numClients }, (_, i) =>
      i < remainder ? base + 1 : base
    );
  }
  // Skewed: use a Dirichlet-like fixed skew
  const weights = [0.35, 0.25, 0.20, 0.12, 0.08].slice(0, numClients);
  const wSum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.round((w / wSum) * total));
}

/**
 * Vertical FL: each client holds a disjoint subset of features (same rows).
 * Returns the feature names assigned to each client.
 */
export function verticalPartition(
  numClients: number
): { features: string[]; sampleSize: number }[] {
  const allFeatures = ADULT_INCOME_FEATURES.map((f) => f.name);
  // Pre-defined meaningful partitions
  const partitions: Record<number, string[][]> = {
    3: [
      ["age", "workclass", "education", "education-num", "occupation"],
      ["marital-status", "relationship", "sex", "race"],
      ["fnlwgt", "capital-gain", "capital-loss", "hours-per-week", "native-country"],
    ],
    4: [
      ["age", "workclass", "education", "education-num"],
      ["marital-status", "relationship", "sex"],
      ["occupation", "race", "native-country"],
      ["fnlwgt", "capital-gain", "capital-loss", "hours-per-week"],
    ],
    5: [
      ["age", "education", "education-num"],
      ["workclass", "occupation"],
      ["marital-status", "relationship", "sex"],
      ["race", "native-country"],
      ["fnlwgt", "capital-gain", "capital-loss", "hours-per-week"],
    ],
  };
  const chosen = partitions[numClients] ?? partitions[3];
  return chosen.map((features) => ({
    features,
    sampleSize: DATASET_INFO.trainSamples, // all clients share same rows in VFL
  }));
}
