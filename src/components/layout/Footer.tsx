import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Ρευματοσκόπιο"
                  width={35}
                  height={35}
                />
              </div>
              <span className="font-bold text-white text-lg">
                Ρευματο<span className="text-teal-600">σκόπιο</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Η πλήρης πλατφόρμα σύγκρισης παρόχων ηλεκτρικής ενέργειας στην
              Ελλάδα. Σύγκρινε τιμές, αξιολογήσεις και χαρακτηριστικά για να
              βρεις τον καλύτερο πάροχο για εσένα.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <svg
                className="w-3.5 h-3.5 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Δεδομένα ενημερωμένα για το 2026
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Εργαλεία</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/compare"
                  className="hover:text-white transition-colors"
                >
                  Σύγκριση Παρόχων
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="hover:text-white transition-colors"
                >
                  Αριθμομηχανή Εξοικονόμησης
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="hover:text-white transition-colors"
                >
                  Γρήγορος Υπολογισμός
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="hover:text-white transition-colors"
                >
                  Οδηγός Αλλαγής Παρόχου
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Πάροχοι</h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  { href: "/providers/dei", label: "ΔΕΗ" },
                  { href: "/providers/elpedison", label: "Elpedison" },
                  { href: "/providers/nrg", label: "NRG" },
                  { href: "/providers/protergia", label: "Protergia" },
                  { href: "/providers/volton", label: "Volton" },
                  { href: "/providers/zenith", label: "Zenith" },
                ] as const
              ).map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/providers"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Όλοι οι πάροχοι →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} Ρευματοσκόπιο. Δωρεάν εργαλείο σύγκρισης παρόχων
            ρεύματος.
          </p>
          <p className="text-center">
            Οι τιμές αποτελούν εκτιμήσεις βάσει δημόσια διαθέσιμων δεδομένων.
            Επικοινωνήστε με τον πάροχο για επίσημες τιμές.
          </p>
        </div>
      </div>
    </footer>
  );
}
