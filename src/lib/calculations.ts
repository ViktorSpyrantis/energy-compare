import { Provider, ProviderCost } from "@/src/types";
import {
  REGULATED_RATE,
  REGULATED_MONTHLY_FEE,
  VAT_RATE,
} from "@/src/data/providers";

/**
 * Υπολογισμός μηνιαίου κόστους για έναν πάροχο
 * Περιλαμβάνει: τιμή προμήθειας + ρυθμιζόμενες χρεώσεις + ΦΠΑ 13%
 */
export function calculateMonthlyCost(
  provider: Provider,
  monthlyKwh: number,
): number {
  const supplyCost = monthlyKwh * provider.supplyRate;
  const regulatedCost = monthlyKwh * REGULATED_RATE;
  const fixedCosts = provider.monthlyFee + REGULATED_MONTHLY_FEE;
  const subtotal = supplyCost + regulatedCost + fixedCosts;
  return subtotal * (1 + VAT_RATE);
}

/**
 * Υπολογισμός και σύγκριση κόστους όλων των παρόχων
 * Ταξινόμηση από φθηνότερο σε ακριβότερο
 */
export function calculateProviderCosts(
  providers: Provider[],
  monthlyKwh: number,
  currentProviderId: string,
): ProviderCost[] {
  const currentProvider = providers.find((p) => p.id === currentProviderId);
  const currentMonthlyCost = currentProvider
    ? calculateMonthlyCost(currentProvider, monthlyKwh)
    : 0;

  return providers
    .map((provider) => {
      const monthlyCost = calculateMonthlyCost(provider, monthlyKwh);
      const annualCost = monthlyCost * 12;
      const savingsVsCurrent = currentMonthlyCost - monthlyCost;
      const annualSavings = savingsVsCurrent * 12;

      return {
        provider,
        monthlyCost,
        annualCost,
        savingsVsCurrent,
        annualSavings,
      };
    })
    .sort((a, b) => a.monthlyCost - b.monthlyCost);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatKwh(kwh: number): string {
  return `${kwh.toLocaleString("el-GR")} kWh`;
}

/**
 * Κατηγοριοποίηση κατανάλωσης για την αριθμομηχανή
 */
export const CONSUMPTION_PRESETS = [
  { label: "Μικρό σπίτι / Στούντιο", kwh: 100, description: "~50-100 τ.μ." },
  { label: "Διαμέρισμα 2-3 δωματίων", kwh: 200, description: "~80-120 τ.μ." },
  { label: "Μεγάλο διαμέρισμα", kwh: 350, description: "~120-180 τ.μ." },
  { label: "Μονοκατοικία", kwh: 500, description: "~180+ τ.μ." },
] as const;
