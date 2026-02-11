/**
 * Shared mock dataset with fictitious people names.
 * Used by both Horizontal and Vertical FL demos for visual consistency.
 */

export interface MockPerson {
  name: string;
  age: string;
  city: string;
  income: string;
  class: string;
}

export const MOCK_PEOPLE: MockPerson[] = [
  { name: "Alice Chen", age: "25", city: "NYC", income: "85K", class: ">50K" },
  { name: "Bob Martinez", age: "32", city: "LA", income: "92K", class: ">50K" },
  { name: "Clara Nguyen", age: "28", city: "CHI", income: "48K", class: "≤50K" },
  { name: "David Okafor", age: "45", city: "NYC", income: "120K", class: ">50K" },
  { name: "Emma Fischer", age: "38", city: "SF", income: "105K", class: ">50K" },
  { name: "Fatima Al-Rashid", age: "29", city: "LA", income: "38K", class: "≤50K" },
  { name: "George Tanaka", age: "35", city: "CHI", income: "95K", class: ">50K" },
  { name: "Hannah Berg", age: "42", city: "SF", income: "115K", class: ">50K" },
  { name: "Ivan Petrov", age: "31", city: "NYC", income: "42K", class: "≤50K" },
];

/** Column headers for the full dataset */
export const HEADERS = ["Name", "Age", "City", "Income", "Income Class"];

/** Convert MockPerson to row arrays for DataTable */
export function toRows(people: MockPerson[]): string[][] {
  return people.map((p) => [p.name, p.age, p.city, p.income, p.class]);
}

/** Horizontal FL: split by rows (samples) */
export const HFL_CLIENT_A = MOCK_PEOPLE.slice(0, 3);
export const HFL_CLIENT_B = MOCK_PEOPLE.slice(3, 6);
export const HFL_CLIENT_C = MOCK_PEOPLE.slice(6, 9);

/**
 * Vertical FL: same people, split by features (columns).
 * Client A = Demographics (Name, Age, City)
 * Client B = Financials (Name, Income, Income Class)
 * All clients share "Name" as the join key.
 */
export const VFL_HEADERS_A = ["Name", "Age", "City"];
export const VFL_HEADERS_B = ["Name", "Income", "Income Class"];

export function toVflRowsA(people: MockPerson[]): string[][] {
  return people.map((p) => [p.name, p.age, p.city]);
}

export function toVflRowsB(people: MockPerson[]): string[][] {
  return people.map((p) => [p.name, p.income, p.class]);
}
