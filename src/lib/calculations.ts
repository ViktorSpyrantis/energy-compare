import { Provider, ProviderCost, ColorDistribution } from "../types";
import {
  REGULATED_RATE,
  REGULATED_MONTHLY_FEE,
  VAT_RATE,
  COLORED_REGULATED_RATES,
  DEFAULT_COLOR_DISTRIBUTION,
} from "../data/providers";

/**
 * Υπολογισμός μηνιαίου κόστους για έναν πάροχο.
 * Για χρωματιστά τιμολόγια χρησιμοποιεί την κατανομή ζωνών (ή DEFAULT_COLOR_DISTRIBUTION).
 */
export function calculateMonthlyCost(
  provider: Provider,
  monthlyKwh: number,
  colorDist?: ColorDistribution,
): number {
  if (provider.tariffType === "colored" && provider.coloredRates) {
    const dist = colorDist ?? DEFAULT_COLOR_DISTRIBUTION;
    const { blue, green, yellow, red } = provider.coloredRates;
    const supplyCost =
      monthlyKwh *
      (blue * dist.blue +
        green * dist.green +
        yellow * dist.yellow +
        red * dist.red);
    const regulatedCost =
      monthlyKwh *
      (COLORED_REGULATED_RATES.blue * dist.blue +
        COLORED_REGULATED_RATES.green * dist.green +
        COLORED_REGULATED_RATES.yellow * dist.yellow +
        COLORED_REGULATED_RATES.red * dist.red);
    return (
      (supplyCost +
        regulatedCost +
        provider.monthlyFee +
        REGULATED_MONTHLY_FEE) *
      (1 + VAT_RATE)
    );
  }

  const supplyCost = monthlyKwh * provider.supplyRate;
  const regulatedCost = monthlyKwh * REGULATED_RATE;
  return (
    (supplyCost + regulatedCost + provider.monthlyFee + REGULATED_MONTHLY_FEE) *
    (1 + VAT_RATE)
  );
}

/**
 * Υπολογισμός και σύγκριση κόστους όλων των παρόχων.
 * Ταξινόμηση από φθηνότερο σε ακριβότερο.
 */
export function calculateProviderCosts(
  providers: Provider[],
  monthlyKwh: number,
  currentProviderId: string,
  colorDistribution?: ColorDistribution,
): ProviderCost[] {
  const currentProvider = providers.find((p) => p.id === currentProviderId);
  const currentMonthlyCost = currentProvider
    ? calculateMonthlyCost(currentProvider, monthlyKwh, colorDistribution)
    : 0;

  return providers
    .map((provider) => {
      const monthlyCost = calculateMonthlyCost(
        provider,
        monthlyKwh,
        colorDistribution,
      );
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

/**
 * Προεπιλεγμένα προφίλ κατανομής χρωματιστού τιμολογίου
 */
export const COLOR_DISTRIBUTION_PRESETS = [
  {
    id: "typical",
    label: "Τυπικό",
    description: "Τυπικό νοικοκυριό",
    dist: { blue: 0.35, green: 0.25, yellow: 0.2, red: 0.2 },
  },
  {
    id: "night",
    label: "Νυχτερινός",
    description: "ΗΕΑ / νυχτερινή χρήση",
    dist: { blue: 0.5, green: 0.2, yellow: 0.15, red: 0.15 },
  },
  {
    id: "daytime",
    label: "Μεσημεριανός",
    description: "Εργασία από σπίτι",
    dist: { blue: 0.25, green: 0.2, yellow: 0.35, red: 0.2 },
  },
] as const;
