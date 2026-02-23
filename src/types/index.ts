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
  tariffType: "fixed" | "variable";
  contractMonths: number; // 0 = no lock-in
  monthlyFee: number; // πάγιο σε €
  supplyRate: number; // €/kWh - τιμή προμήθειας
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
  tariffType: "all" | "fixed" | "variable";
  greenOnly: boolean;
  sortBy: "price" | "rating" | "name";
}
