import { providers } from "../data/providers";
import { calculateMonthlyCost } from "../lib/calculations";
import ProviderCard from "../components/ProviderCard";
import Link from "next/link";

const DEFAULT_KWH = 250;

export default function FeaturedProviders() {
  // Get top 3 cheapest for default 250 kWh
  const ranked = providers
    .map((p) => ({
      provider: p,
      monthlyCost: calculateMonthlyCost(p, DEFAULT_KWH),
    }))
    .sort((a, b) => a.monthlyCost - b.monthlyCost)
    .slice(0, 3);

  const maxCost = calculateMonthlyCost(
    providers.find((p) => p.id === "dei")!,
    DEFAULT_KWH,
  );

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Κορυφαίοι πάροχοι
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Φθηνότεροι πάροχοι
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Για κατανάλωση {DEFAULT_KWH} kWh/μήνα — αλλάξτε στην αριθμομηχανή
              για τη δική σας
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm border border-teal-200 hover:border-teal-400 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Δες όλους
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranked.map((item, i) => (
            <ProviderCard
              key={item.provider.id}
              provider={item.provider}
              monthlyKwh={DEFAULT_KWH}
              monthlyCost={item.monthlyCost}
              annualSavings={(maxCost - item.monthlyCost) * 12}
              rank={i + 1}
            />
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          * Κόστη υπολογισμένα βάσει δημόσια διαθέσιμων τιμοκαταλόγων 2025.
          Περιλαμβάνουν τιμή προμήθειας + ρυθμιζόμενες χρεώσεις + ΦΠΑ 13%.
        </p>
      </div>
    </section>
  );
}
