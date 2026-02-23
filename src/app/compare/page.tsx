import type { Metadata } from "next";
import ComparisonTable from "../../components/ComparisonTable";

export const metadata: Metadata = {
  title: "Σύγκριση Παρόχων Ρεύματος | EnergyCompare",
  description:
    "Σύγκρινε όλους τους παρόχους ηλεκτρικής ενέργειας στην Ελλάδα. Φίλτρα κατά τύπο τιμολογίου, πράσινη ενέργεια και ταξινόμηση κατά τιμή ή αξιολόγηση.",
};

export default function ComparePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <span className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Σύγκριση
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Σύγκριση Παρόχων Ρεύματος
            </h1>
            <p className="text-slate-600 text-lg">
              Συγκρίνουμε <strong className="text-slate-800">7 παρόχους</strong>{" "}
              ηλεκτρικής ενέργειας στην Ελλάδα. Βάλε τη μηνιαία κατανάλωσή σου
              και δες άμεσα ποιος πάροχος σε συμφέρει περισσότερο.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComparisonTable />
      </div>
    </div>
  );
}
