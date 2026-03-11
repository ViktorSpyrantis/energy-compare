import { providers } from "../../data/providers";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Όλοι οι Πάροχοι Ρεύματος 2026 | EnergyCompare",
  description:
    "Πλήρης κατάλογος παρόχων ηλεκτρικού ρεύματος στην Ελλάδα: ΔΕΗ, Elpedison, NRG, Protergia, Volton, Zenith, Watt+Volt και φοιτητικά προγράμματα.",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProvidersPage() {
  const mainProviders = providers.filter((p) => !p.isProgram);
  const programs = providers.filter((p) => p.isProgram && !p.programEligibility);
  const studentPrograms = providers.filter((p) => p.isProgram && p.programEligibility);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Πάροχοι Ρεύματος 2026
          </h1>
          <p className="text-lg text-slate-600">
            Πλήρης κατάλογος παρόχων και προγραμμάτων ηλεκτρικού ρεύματος για νοικοκυριά στην Ελλάδα
          </p>
        </div>

        {/* Main providers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Κύριοι πάροχοι</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mainProviders.map((p) => (
              <Link
                key={p.id}
                href={`/providers/${p.id}`}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
                    style={{
                      backgroundColor: p.bgColor,
                      color: p.textColor,
                      borderColor: p.primaryColor + "30",
                    }}
                  >
                    {p.logoText.length > 4 ? (
                      <span className="text-[9px] leading-tight text-center px-0.5">{p.logoText}</span>
                    ) : (
                      p.logoText
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-700 transition-colors">
                      {p.name}
                    </h3>
                    <StarRating rating={p.rating} />
                  </div>
                </div>

                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Τιμή kWh</span>
                    <span className="font-semibold text-slate-900">
                      {p.flatMonthlyBill !== undefined ? "all-in" : `${(p.supplyRate * 100).toFixed(2)}¢`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Μηνιαίο πάγιο</span>
                    <span className="font-semibold text-slate-900">
                      {p.flatMonthlyBill !== undefined ? "—" : `${p.monthlyFee.toFixed(2)}€`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Συμβόλαιο</span>
                    <span className="font-semibold text-slate-900">
                      {p.contractMonths === 0 ? "Χωρίς δέσμευση" : `${p.contractMonths} μήνες`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.tariffType !== "fixed" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      {p.tariffType === "colored" ? "🎨 Χρωματιστό" : "Μεταβλητή"}
                    </span>
                  )}
                  {p.greenEnergy && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      🌿 {p.greenEnergyPercent}% Πράσινη
                    </span>
                  )}
                  {p.newCustomerOffer && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      🎁 Προσφορά
                    </span>
                  )}
                </div>

                <div className="mt-4 text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                  Δες αναλυτικά →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Programs */}
        {programs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Ειδικά προγράμματα</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-300">
                📋
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((p) => (
                <Link
                  key={p.id}
                  href={`/providers/${p.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border"
                      style={{
                        backgroundColor: p.bgColor,
                        color: p.textColor,
                        borderColor: p.primaryColor + "30",
                      }}
                    >
                      {p.logoText.length > 4 ? (
                        <span className="text-[8px]">{p.logoText}</span>
                      ) : (
                        p.logoText
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-700">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.contractMonths === 0 ? "Χωρίς δέσμευση" : `${p.contractMonths} μήνες`}
                        {" · "}
                        {p.flatMonthlyBill !== undefined
                          ? `${p.flatMonthlyBill.toFixed(2)}€/μήνα`
                          : `${(p.supplyRate * 100).toFixed(2)}¢/kWh`}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-blue-600">Δες λεπτομέρειες →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Student programs */}
        {studentPrograms.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Φοιτητικά προγράμματα</h2>
              <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full border border-amber-300">
                🎓
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
              Τα φοιτητικά προγράμματα απαιτούν επαλήθευση ταυτότητας (φοιτητική ταυτότητα, πάσο ή Erasmus card).
              Επαληθεύστε τις ισχύουσες προϋποθέσεις απευθείας στον πάροχο.
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentPrograms.map((p) => (
                <Link
                  key={p.id}
                  href={`/providers/${p.id}`}
                  className="bg-white rounded-2xl border border-amber-200 p-5 hover:border-amber-400 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border"
                      style={{
                        backgroundColor: p.bgColor,
                        color: p.textColor,
                        borderColor: p.primaryColor + "30",
                      }}
                    >
                      {p.logoText.length > 4 ? (
                        <span className="text-[8px]">{p.logoText}</span>
                      ) : (
                        p.logoText
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-amber-700">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.contractMonths === 0 ? "Χωρίς δέσμευση" : `${p.contractMonths} μήνες`}
                        {" · "}
                        {p.flatMonthlyBill !== undefined
                          ? `${p.flatMonthlyBill.toFixed(2)}€/μήνα`
                          : `${(p.supplyRate * 100).toFixed(2)}¢/kWh · πάγιο ${p.monthlyFee}€`}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-amber-700 font-medium mb-1">
                    🎓 {p.programEligibility}
                  </div>
                  <div className="text-xs font-medium text-amber-600">Δες λεπτομέρειες →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-teal-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Συγκρίνετε τιμές αμέσως</h2>
          <p className="text-teal-100 mb-6">
            Χρησιμοποιήστε τον αναλυτικό συγκριτή μας για να βρείτε τον φθηνότερο πάροχο
            βάσει της πραγματικής σας κατανάλωσης.
          </p>
          <Link
            href="/calculator"
            className="inline-block bg-white text-teal-700 font-bold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Ξεκίνα σύγκριση →
          </Link>
        </div>
      </div>
    </div>
  );
}
