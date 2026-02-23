import { Provider } from "../types";

interface ProviderCardProps {
  provider: Provider;
  monthlyKwh?: number;
  monthlyCost?: number;
  annualSavings?: number;
  rank?: number;
  isCurrent?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
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
      <span className="text-xs text-slate-500 ml-0.5 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProviderCard({
  provider,
  monthlyCost,
  annualSavings,
  rank,
  isCurrent = false,
}: ProviderCardProps) {
  const formatEur = (amount: number) =>
    new Intl.NumberFormat("el-GR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
        isCurrent
          ? "border-slate-300"
          : rank === 1
            ? "border-teal-400 shadow-md shadow-teal-100"
            : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Badges */}
      <div className="absolute -top-3 left-4 flex gap-2">
        {rank === 1 && !isCurrent && (
          <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            #1 Φθηνότερος
          </span>
        )}
        {isCurrent && (
          <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Τρέχων πάροχος
          </span>
        )}
        {provider.newCustomerOffer && !isCurrent && rank !== 1 && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Προσφορά
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 mb-5 mt-2">
        {/* Provider Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
            style={{
              backgroundColor: provider.bgColor,
              color: provider.textColor,
              borderColor: provider.primaryColor + "30",
            }}
          >
            {provider.logoText.length > 4 ? (
              <span className="text-[10px] leading-tight text-center px-1">
                {provider.logoText}
              </span>
            ) : (
              provider.logoText
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">
              {provider.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{provider.fullName}</p>
            <StarRating rating={provider.rating} />
          </div>
        </div>

        {/* Cost */}
        {monthlyCost !== undefined && (
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-slate-900">
              {formatEur(monthlyCost)}
            </div>
            <div className="text-xs text-slate-500">/μήνα</div>
            <div className="text-sm text-slate-600 mt-0.5">
              {formatEur(monthlyCost * 12)}/χρόνο
            </div>
          </div>
        )}
      </div>

      {/* Savings */}
      {annualSavings !== undefined && !isCurrent && annualSavings > 0.5 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
          <span className="text-emerald-800 text-sm font-medium">
            Εξοικονόμηση/χρόνο
          </span>
          <span className="text-emerald-700 font-bold">
            {formatEur(annualSavings)}
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {provider.greenEnergy && (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
            <span>🌿</span> {provider.greenEnergyPercent}% Ανανεώσιμες
          </span>
        )}
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            provider.tariffType === "fixed"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          }`}
        >
          {provider.tariffType === "fixed" ? "Σταθερή τιμή" : "Μεταβλητή τιμή"}
        </span>
        {provider.contractMonths === 0 ? (
          <span className="bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
            Χωρίς δέσμευση
          </span>
        ) : (
          <span className="bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
            {provider.contractMonths} μήνες
          </span>
        )}
      </div>

      {/* Key features */}
      <ul className="space-y-1.5 mb-5">
        {provider.features.slice(0, 3).map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-slate-600"
          >
            <svg
              className="w-4 h-4 text-teal-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Pricing details */}
      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-sm mb-5">
        <div>
          <span className="text-slate-500 text-xs block mb-0.5">Τιμή kWh</span>
          <span className="font-semibold text-slate-900">
            {(provider.supplyRate * 100).toFixed(2)} λεπτά
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-xs block mb-0.5">
            Μηνιαίο πάγιο
          </span>
          <span className="font-semibold text-slate-900">
            {formatEur(provider.monthlyFee)}
          </span>
        </div>
      </div>

      {/* New customer offer */}
      {provider.newCustomerOffer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-xs text-amber-800 font-medium flex items-start gap-2">
          <span>🎁</span>
          {provider.newCustomerOffer}
        </div>
      )}

      {/* CTA */}
      <a
        href={`tel:${provider.phone}`}
        className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors text-sm"
      >
        Επικοινώνησε: {provider.phone}
      </a>
    </div>
  );
}
