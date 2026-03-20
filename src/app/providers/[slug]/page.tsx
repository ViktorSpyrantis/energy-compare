import { allProviders, programs } from "../../../data/providers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ProviderCalculator from "../../../components/ProviderCalculator";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allProviders.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = allProviders.find((p) => p.id === slug);
  if (!provider)
    return { title: "Πάροχος δεν βρέθηκε | Ρευματοσκόπιο" };
  return {
    title: `${provider.fullName} – Τιμές & Κριτική 2026 | Ρευματοσκόπιο`,
    description: `Αναλυτική παρουσίαση του ${provider.fullName}: τιμή kWh ${provider.supplyRate.toFixed(4)}€, πάγιο ${provider.monthlyFee}€/μήνα, αξιολόγηση ${provider.rating}/5. Υπολόγισε το κόστος σου.`,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-lg font-bold text-slate-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const provider = allProviders.find((p) => p.id === slug);
  if (!provider) notFound();

  const relatedPrograms = programs.filter(
    (p) => p.id !== provider.id && p.providerId === (provider.providerId ?? provider.id),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-teal-600 transition-colors">Αρχική</Link>
            <span>/</span>
            <Link href="/providers" className="hover:text-teal-600 transition-colors">Πάροχοι</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">{provider.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Logo */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border overflow-hidden"
              style={{
                backgroundColor: provider.bgColor,
                color: provider.textColor,
                borderColor: provider.primaryColor + "30",
              }}
            >
              {provider.logoText.length > 4 ? (
                <span className="text-xs leading-tight text-center px-1">{provider.logoText}</span>
              ) : (
                <span className="text-xl">{provider.logoText}</span>
              )}
            </div>

            {/* Name & rating */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">{provider.fullName}</h1>
                {provider.isProgram && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-300">
                    📋 Πρόγραμμα
                  </span>
                )}
              </div>
              <StarRating rating={provider.rating} />
              <p className="text-sm text-slate-500 mt-1">
                {provider.reviewCount.toLocaleString("el-GR")} αξιολογήσεις
              </p>
              {provider.programEligibility && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-sm text-amber-800">
                  🎓 {provider.programEligibility}
                </div>
              )}
            </div>

            {/* Signup CTA */}
            <div className="flex flex-col gap-2 shrink-0">
              {provider.signupUrl && (
                <a
                  href={provider.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center"
                >
                  Εγγραφή →
                </a>
              )}
              <a
                href={`tel:${provider.phone}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl transition-colors text-center text-sm"
              >
                📞 {provider.phone}
              </a>
            </div>
          </div>

          {/* Offer banner */}
          {provider.newCustomerOffer && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800 font-medium">
              🎁 {provider.newCustomerOffer}
            </div>
          )}
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {provider.flatMonthlyBill !== undefined
                ? `${provider.flatMonthlyBill.toFixed(2)}€`
                : `${provider.supplyRate.toFixed(4)}€`}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {provider.flatMonthlyBill !== undefined ? "Σταθερό/μήνα" : "kWh (προμήθεια)"}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {provider.flatMonthlyBill !== undefined ? "—" : `${provider.monthlyFee.toFixed(2)}€`}
            </div>
            <div className="text-xs text-slate-500 mt-1">Μηνιαίο πάγιο</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {provider.contractMonths === 0 ? "∞" : provider.contractMonths}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {provider.contractMonths === 0 ? "Χωρίς δέσμευση" : "Μήνες συμβόλαιο"}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {provider.greenEnergy ? `${provider.greenEnergyPercent}%` : "—"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {provider.greenEnergy ? "Πράσινη ενέργεια" : "Συμβατική"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Features */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Χαρακτηριστικά</h2>
            <ul className="space-y-2">
              {provider.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-teal-500 shrink-0 mt-0.5 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pros */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
            <h2 className="text-lg font-bold text-emerald-900 mb-4">Πλεονεκτήματα</h2>
            <ul className="space-y-2">
              {provider.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-emerald-800">
                  <span className="text-emerald-500 shrink-0 mt-0.5 font-bold">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
            <h2 className="text-lg font-bold text-red-900 mb-4">Μειονεκτήματα</h2>
            <ul className="space-y-2">
              {provider.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-400 shrink-0 mt-0.5 font-bold">–</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colored zone rates */}
        {provider.tariffType === "colored" && provider.coloredRates && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">🎨 Τιμές ανά ζώνη</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["blue", "green", "yellow", "red"] as const).map((zone) => {
                const labels = { blue: "🔵 Μπλε", green: "🟢 Πράσινη", yellow: "🟡 Κίτρινη", red: "🔴 Κόκκινη" };
                const bgs = { blue: "bg-blue-50 border-blue-200", green: "bg-green-50 border-green-200", yellow: "bg-yellow-50 border-yellow-200", red: "bg-red-50 border-red-200" };
                const texts = { blue: "text-blue-900", green: "text-green-900", yellow: "text-yellow-900", red: "text-red-900" };
                return (
                  <div key={zone} className={`rounded-xl border p-4 text-center ${bgs[zone]}`}>
                    <div className={`text-sm font-semibold mb-1 ${texts[zone]}`}>{labels[zone]}</div>
                    <div className={`text-2xl font-bold ${texts[zone]}`}>
                      {provider.coloredRates![zone].toFixed(3)}€
                    </div>
                    <div className={`text-xs mt-0.5 ${texts[zone]} opacity-70`}>/kWh</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calculator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Υπολόγισε το κόστος σου με {provider.name}
          </h2>
          <ProviderCalculator providerId={provider.id} />
        </div>

        {/* Related programs */}
        {relatedPrograms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Σχετικά προγράμματα
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPrograms.map((prog) => (
                <Link
                  key={prog.id}
                  href={`/providers/${prog.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border"
                      style={{
                        backgroundColor: prog.bgColor,
                        color: prog.textColor,
                        borderColor: prog.primaryColor + "30",
                      }}
                    >
                      {prog.logoText}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{prog.name}</div>
                      <div className="text-xs text-slate-500">{prog.contractMonths === 0 ? "Χωρίς δέσμευση" : `${prog.contractMonths}μ`} · {prog.flatMonthlyBill !== undefined ? `${prog.flatMonthlyBill}€/μήνα` : `${prog.supplyRate.toFixed(4)}€/kWh`}</div>
                    </div>
                  </div>
                  <span className="text-teal-600 text-xs font-medium">Δες λεπτομέρειες →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Οι τιμές και τα χαρακτηριστικά βασίζονται σε εκτιμήσεις από δημόσια διαθέσιμα στοιχεία 2026.
          Ενημερώθηκε: {provider.lastUpdated ?? "2026"}.
          Επαληθεύστε πάντα τα ισχύοντα στοιχεία απευθείας στο site του παρόχου.
        </div>
      </div>
    </div>
  );
}
