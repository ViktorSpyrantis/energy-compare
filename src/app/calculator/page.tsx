import type { Metadata } from "next";
import { Suspense } from "react";
import SavingsCalculator from "../../components/SavingsCalculator";

export const metadata: Metadata = {
  title: "Αριθμομηχανή Εξοικονόμησης Ρεύματος | EnergyCompare",
  description:
    "Υπολόγισε ακριβώς πόσα χρήματα εξοικονομείς αλλάζοντας πάροχο ρεύματος. Εισήγαγε την κατανάλωσή σου και δες τη σύγκριση όλων των παρόχων.",
};

function CalculatorLoading() {
  return (
    <div className="grid lg:grid-cols-5 gap-8 animate-pulse">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 h-[600px]" />
      </div>
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-slate-200 rounded-2xl h-28" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 h-24"
          />
        ))}
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <span className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Αριθμομηχανή
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Πόσα εξοικονομείς αλλάζοντας πάροχο;
            </h1>
            <p className="text-slate-600 text-lg">
              Επίλεξε τον τρέχοντα πάροχό σου και βάλε τη μηνιαία κατανάλωσή
              σου. Δες αμέσως πόσα ευρώ μπορείς να εξοικονομήσεις κάθε χρόνο.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<CalculatorLoading />}>
          <SavingsCalculator />
        </Suspense>
      </div>
    </div>
  );
}
