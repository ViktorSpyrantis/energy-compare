export interface ColoredRates {
  blue: number; // €/kWh - Μπλε ζώνη (off-peak)
  green: number; // €/kWh - Πράσινη ζώνη
  yellow: number; // €/kWh - Κίτρινη ζώνη
  red: number; // €/kWh - Κόκκινη ζώνη (peak)
}

export interface ColorDistribution {
  blue: number; // fraction 0–1
  green: number;
  yellow: number;
  red: number;
}

export interface Provider {
  id: string;
  name: string;
  fullName: string;
  logoText: string;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  rating: number;
  reviewCount: number;
  tariffType: "fixed" | "variable" | "colored";
  contractMonths: number; // 0 = no lock-in
  monthlyFee: number; // πάγιο σε €
  supplyRate: number; // €/kWh - τιμή προμήθειας (για flat/variable) ή σταθμισμένος μ.ο. (για colored)
  coloredRates?: ColoredRates;
  greenEnergy: boolean;
  greenEnergyPercent: number;
  features: string[];
  pros: string[];
  cons: string[];
  phone: string;
  tags: string[];
  popular: boolean;
  newCustomerOffer?: string;
}

export interface ProviderCost {
  provider: Provider;
  monthlyCost: number;
  annualCost: number;
  savingsVsCurrent: number;
  annualSavings: number;
}

export interface FilterOptions {
  tariffType: "all" | "fixed" | "variable" | "colored";
  greenOnly: boolean;
  sortBy: "price" | "rating" | "name";
}
