import type { Metadata } from "next";
import CalculatorWrapper from "../../components/CalculatorWrapper";

export const metadata: Metadata = {
  title: "Αριθμομηχανή Εξοικονόμησης Ρεύματος | EnergyCompare",
  description:
    "Υπολόγισε ακριβώς πόσα χρήματα εξοικονομείς αλλάζοντας πάροχο ρεύματος. Ανέβασε τον λογαριασμό σου ή εισήγαγε χειροκίνητα την κατανάλωσή σου.",
};

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
              Ανέβασε τον λογαριασμό σου για αυτόματη συμπλήρωση, ή εισήγαγε
              χειροκίνητα τη μηνιαία κατανάλωσή σου.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator + Bill Upload */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalculatorWrapper />
      </div>
    </div>
  );
}
