"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { providers, COLOR_ZONE_HOURS } from "../data/providers";
import {
  calculateProviderCosts,
  calculateMonthlyCost,
  formatCurrency,
  CONSUMPTION_PRESETS,
  COLOR_DISTRIBUTION_PRESETS,
} from "../lib/calculations";
import { ColorDistribution } from "../types";

interface SavingsCalculatorProps {
  initialKwh?: number;
  initialProviderId?: string;
  actualBillAmount?: number;
  initialIsStudent?: boolean;
}

const ZONE_COLORS = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
    label: "Μπλε",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
    label: "Πράσινη",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    dot: "bg-yellow-500",
    label: "Κίτρινη",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    label: "Κόκκινη",
  },
} as const;

const hasColoredProviders = providers.some((p) => p.tariffType === "colored");

export default function SavingsCalculator({
  initialKwh,
  initialProviderId,
  actualBillAmount,
  initialIsStudent,
}: SavingsCalculatorProps = {}) {
  const searchParams = useSearchParams();

  const [kwh, setKwh] = useState(() => {
    if (initialKwh) return Math.min(800, Math.max(50, initialKwh));
    const param = searchParams.get("kwh");
    return param ? Math.min(800, Math.max(50, Number(param))) : 250;
  });

  const [currentProviderId, setCurrentProviderId] = useState(() => {
    if (initialProviderId && providers.find((p) => p.id === initialProviderId))
      return initialProviderId;
    const param = searchParams.get("provider");
    return param && providers.find((p) => p.id === param) ? param : "dei";
  });

  const [isStudent, setIsStudent] = useState(initialIsStudent ?? false);

  const visibleProviders = useMemo(
    () => providers.filter((p) => isStudent || !p.programEligibility),
    [isStudent],
  );

  // Αν ο τρέχων πάροχος κρυφτεί (π.χ. 4Students όταν απενεργοποιηθεί το φοιτητικό),
  // επαναφέρουμε σε ΔΕΗ ώστε η σύγκριση να παραμένει έγκυρη.
  useEffect(() => {
    if (!visibleProviders.find((p) => p.id === currentProviderId)) {
      setCurrentProviderId("dei");
    }
  }, [isStudent]); // eslint-disable-line react-hooks/exhaustive-deps

  const [colorPresetId, setColorPresetId] = useState<string>("typical");
  const colorDistribution: ColorDistribution = useMemo(
    () =>
      COLOR_DISTRIBUTION_PRESETS.find((p) => p.id === colorPresetId)?.dist ??
      COLOR_DISTRIBUTION_PRESETS[0].dist,
    [colorPresetId],
  );

  const fromBill = Boolean(initialKwh || initialProviderId);

  const costs = useMemo(
    () =>
      calculateProviderCosts(
        visibleProviders,
        kwh,
        currentProviderId,
        colorDistribution,
      ),
    [visibleProviders, kwh, currentProviderId, colorDistribution],
  );

  const currentCost = costs.find((c) => c.provider.id === currentProviderId);
  const cheapest = costs[0];
  const maxCost = costs[costs.length - 1]?.monthlyCost ?? 1;
  const minCost = costs[0]?.monthlyCost ?? 1;
  const costRange = maxCost - minCost;

  const bestSavings = currentCost ? Math.max(0, currentCost.annualSavings) : 0;
  const canSave = bestSavings > 1;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Input Panel */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-lg">
                ⚡
              </span>
              Τα στοιχεία σου
            </h2>
            {fromBill && (
              <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-200">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                Από τον λογαριασμό σου
              </span>
            )}
          </div>

          {/* Current Provider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Τρέχων πάροχος
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setIsStudent((s) => !s)}
                  className={`relative w-9 h-[1.125rem] rounded-full transition-colors ${
                    isStudent ? "bg-amber-500" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                      isStudent ? "translate-x-[1.125rem]" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  🎓 Είμαι φοιτητής/τρια
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {visibleProviders.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentProviderId(p.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    currentProviderId === p.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 border"
                    style={{
                      backgroundColor: p.bgColor,
                      color: p.textColor,
                      borderColor: p.primaryColor + "30",
                    }}
                  >
                    {p.logoText.length > 4 ? (
                      <span className="text-[8px] leading-tight text-center px-0.5">
                        {p.logoText}
                      </span>
                    ) : (
                      p.logoText
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 text-sm">
                      {p.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {p.fullName}
                    </div>
                  </div>
                  {p.tariffType === "colored" && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-100 via-yellow-100 to-red-100 text-slate-600 border border-slate-200 shrink-0">
                      Χρωμ.
                    </span>
                  )}
                  {currentProviderId === p.id && (
                    <svg
                      className="w-5 h-5 text-teal-600 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* kWh */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Μηνιαία κατανάλωση
              <span className="ml-2 text-teal-600 font-bold">{kwh} kWh</span>
            </label>
            <input
              type="range"
              min={50}
              max={800}
              step={10}
              value={kwh}
              onChange={(e) => setKwh(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>50 kWh</span>
              <span>800 kWh</span>
            </div>

            {/* Manual input */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="number"
                min={50}
                max={800}
                value={kwh}
                onChange={(e) => {
                  const val = Math.min(
                    800,
                    Math.max(50, Number(e.target.value)),
                  );
                  setKwh(val);
                }}
                className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-500">kWh/μήνα</span>
            </div>

            {/* Presets */}
            <div className="mt-3 space-y-1">
              {CONSUMPTION_PRESETS.map((preset) => (
                <button
                  key={preset.kwh}
                  onClick={() => setKwh(preset.kwh)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    kwh === preset.kwh
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "hover:bg-slate-50 text-slate-600 border border-transparent"
                  }`}
                >
                  <span className="font-medium">{preset.label}</span>
                  <span className="text-slate-400">
                    {preset.kwh} kWh — {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color distribution (shown when colored providers are present) */}
          {hasColoredProviders && (
            <div className="mb-6 rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 via-yellow-50 to-red-50 border-b border-slate-200">
                <span className="text-sm">🎨</span>
                <span className="text-sm font-semibold text-slate-700">
                  Προφίλ χρωματιστού τιμολογίου
                </span>
              </div>
              <div className="p-3 space-y-2">
                {COLOR_DISTRIBUTION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setColorPresetId(preset.id)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                      colorPresetId === preset.id
                        ? "border-purple-400 bg-purple-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900">
                        {preset.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {preset.description}
                      </div>
                      {/* Zone bar */}
                      <div className="flex h-1.5 rounded-full overflow-hidden mt-1.5 gap-px">
                        <div
                          className="bg-blue-400"
                          style={{ width: `${preset.dist.blue * 100}%` }}
                        />
                        <div
                          className="bg-green-400"
                          style={{ width: `${preset.dist.green * 100}%` }}
                        />
                        <div
                          className="bg-yellow-400"
                          style={{ width: `${preset.dist.yellow * 100}%` }}
                        />
                        <div
                          className="bg-red-400"
                          style={{ width: `${preset.dist.red * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right shrink-0 mt-0.5">
                      <div>{Math.round(preset.dist.blue * 100)}% 🔵</div>
                      <div>{Math.round(preset.dist.green * 100)}% 🟢</div>
                      <div>{Math.round(preset.dist.yellow * 100)}% 🟡</div>
                      <div>{Math.round(preset.dist.red * 100)}% 🔴</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary Box */}
          {currentCost && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-xs text-slate-500 mb-2 font-medium">
                Τρέχον κόστος ({currentCost.provider.name})
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(currentCost.monthlyCost)}
                <span className="text-sm font-normal text-slate-400">
                  /μήνα
                </span>
              </div>
              <div className="text-sm text-slate-600 mt-0.5">
                {formatCurrency(currentCost.annualCost)}/χρόνο
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Results */}
      <div className="lg:col-span-3">
        {/* Savings Banner */}
        {canSave ? (
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="text-sm font-semibold opacity-90 mb-1">
              Μέγιστη δυνατή εξοικονόμηση
            </div>
            <div className="text-4xl font-bold">
              {formatCurrency(bestSavings)}/χρόνο
            </div>
            <div className="text-sm opacity-90 mt-1">
              Αλλάζοντας από {currentCost?.provider.name} στον{" "}
              {cheapest.provider.name}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-xl font-bold">
              Έχεις ήδη τον φθηνότερο πάροχο!
            </div>
            <div className="text-sm opacity-90 mt-1">
              Ο {currentCost?.provider.name} είναι η καλύτερη επιλογή για {kwh}{" "}
              kWh/μήνα.
            </div>
          </div>
        )}

        {/* Bill validation banner */}
        {actualBillAmount &&
          currentCost &&
          (() => {
            const diff = Math.abs(actualBillAmount - currentCost.monthlyCost);
            const diffPct = (diff / actualBillAmount) * 100;
            const isClose = diffPct < 15;
            return (
              <div
                className={`rounded-2xl p-4 mb-6 border ${isClose ? "bg-emerald-50 border-emerald-200" : "bg-sky-50 border-sky-200"}`}
              >
                <div
                  className={`flex items-start gap-3 text-sm ${isClose ? "text-emerald-800" : "text-sky-800"}`}
                >
                  <span className="text-xl shrink-0">
                    {isClose ? "✅" : "💬"}
                  </span>
                  <div>
                    {isClose ? (
                      <>
                        <p className="font-semibold">
                          Η εκτίμησή μας ταιριάζει με τον λογαριασμό σου!
                        </p>
                        <p className="text-xs mt-0.5 opacity-80">
                          Εκτίμηση:{" "}
                          <strong>
                            {formatCurrency(currentCost.monthlyCost)}
                          </strong>{" "}
                          · Λογαριασμός:{" "}
                          <strong>{formatCurrency(actualBillAmount)}</strong> ·
                          Διαφορά: {formatCurrency(diff)} ({diffPct.toFixed(1)}
                          %)
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">
                          Η εκτίμηση διαφέρει κατά {formatCurrency(diff)} από
                          τον λογαριασμό σου
                        </p>
                        <p className="text-xs mt-0.5 opacity-80">
                          Αυτό μπορεί να οφείλεται σε εκπτώσεις e-bill/direct
                          debit ή άλλες χρεώσεις. Η σύγκριση μεταξύ παρόχων
                          παραμένει έγκυρη.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Results list */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Σύγκριση για {kwh} kWh/μήνα
          </h3>

          {costs.map((item, i) => {
            const isCurrent = item.provider.id === currentProviderId;
            const isFirst = i === 0;
            const isColored = item.provider.tariffType === "colored";
            const barWidth =
              costRange === 0
                ? 100
                : 40 + ((item.monthlyCost - minCost) / costRange) * 60;

            return (
              <div
                key={item.provider.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  isCurrent
                    ? "border-slate-400 bg-slate-50"
                    : isFirst
                      ? "border-teal-400 bg-white shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Rank */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCurrent
                          ? "bg-slate-700 text-white"
                          : isFirst
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isCurrent ? "★" : i + 1}
                    </div>

                    {/* Logo */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border"
                      style={{
                        backgroundColor: item.provider.bgColor,
                        color: item.provider.textColor,
                        borderColor: item.provider.primaryColor + "30",
                      }}
                    >
                      {item.provider.logoText.length > 4 ? (
                        <span className="text-[9px] leading-tight text-center px-0.5">
                          {item.provider.logoText}
                        </span>
                      ) : (
                        item.provider.logoText
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="font-bold text-slate-900">
                          {item.provider.name}
                        </span>
                        {isCurrent && (
                          <span className="bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Τρέχων
                          </span>
                        )}
                        {isFirst && !isCurrent && (
                          <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Φθηνότερος
                          </span>
                        )}
                        {isColored && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-100 via-yellow-100 to-red-100 text-slate-600 border border-slate-200">
                            🎨 Χρωματιστό
                          </span>
                        )}
                        {item.provider.greenEnergy && (
                          <span className="text-emerald-700 text-[10px] font-medium">
                            🌿
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {isColored
                          ? `Μ.ο. ${(item.provider.supplyRate * 100).toFixed(2)}¢/kWh · πάγιο ${formatCurrency(item.provider.monthlyFee)}/μήνα`
                          : `${(item.provider.supplyRate * 100).toFixed(2)}¢/kWh · πάγιο ${formatCurrency(item.provider.monthlyFee)}/μήνα`}
                      </div>
                    </div>

                    {/* Costs */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-slate-900">
                        {formatCurrency(item.monthlyCost)}
                      </div>
                      <div className="text-xs text-slate-400">/μήνα</div>
                    </div>

                    {/* Savings column */}
                    <div className="text-right shrink-0 min-w-[90px]">
                      {isCurrent ? (
                        <span className="text-xs text-slate-400 font-medium">
                          Βάση σύγκρισης
                        </span>
                      ) : item.savingsVsCurrent > 0.5 ? (
                        <div>
                          <div className="text-sm font-bold text-emerald-600">
                            -{formatCurrency(item.annualSavings)}
                          </div>
                          <div className="text-xs text-emerald-600">
                            εξοικ./χρόνο
                          </div>
                        </div>
                      ) : item.savingsVsCurrent < -0.5 ? (
                        <div>
                          <div className="text-sm font-bold text-red-500">
                            +{formatCurrency(Math.abs(item.annualSavings))}
                          </div>
                          <div className="text-xs text-red-400">
                            επιπλέον/χρόνο
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Παρόμοιο κόστος
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cost bar visualization */}
                  <div className="ml-[3.25rem] sm:ml-[5.5rem]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCurrent
                              ? "bg-slate-400"
                              : isFirst
                                ? "bg-teal-500"
                                : isColored
                                  ? "bg-purple-400"
                                  : "bg-slate-300"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatCurrency(item.annualCost)}/χρόνο
                      </span>
                    </div>
                  </div>

                  {/* Colored zone breakdown (inline) */}
                  {isColored && item.provider.coloredRates && (
                    <div className="mt-3 ml-[3.25rem] sm:ml-[5.5rem] grid grid-cols-4 gap-1">
                      {(
                        Object.keys(ZONE_COLORS) as Array<
                          keyof typeof ZONE_COLORS
                        >
                      ).map((zone) => {
                        const zc = ZONE_COLORS[zone];
                        const rate = item.provider.coloredRates![zone];
                        const kwh_zone = Math.round(
                          kwh * colorDistribution[zone],
                        );
                        const cost =
                          calculateMonthlyCost(
                            {
                              ...item.provider,
                              tariffType: "fixed",
                              supplyRate: rate,
                            },
                            kwh_zone,
                          ) -
                          ((item.provider.monthlyFee + 2.5) * 1.13) / 4; // approx zone cost
                        void cost;
                        return (
                          <div
                            key={zone}
                            className={`${zc.bg} rounded-lg px-2 py-1.5 text-center`}
                          >
                            <div className={`text-[10px] font-bold ${zc.text}`}>
                              {zc.label}
                            </div>
                            <div className={`text-xs font-bold ${zc.text}`}>
                              {(rate * 100).toFixed(1)}¢
                            </div>
                            <div
                              className={`text-[10px] ${zc.text} opacity-70`}
                            >
                              {Math.round(colorDistribution[zone] * 100)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Offer */}
                  {item.provider.newCustomerOffer && !isCurrent && (
                    <div className="mt-3 ml-[3.25rem] sm:ml-[5.5rem] bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-800 font-medium">
                      🎁 {item.provider.newCustomerOffer}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Colored zone legend */}
        {hasColoredProviders && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 via-yellow-50 to-red-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              🎨 Ωράρια ζωνών χρωματιστού τιμολογίου
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {(
                Object.keys(ZONE_COLORS) as Array<keyof typeof ZONE_COLORS>
              ).map((zone) => {
                const zc = ZONE_COLORS[zone];
                return (
                  <div key={zone} className="flex items-start gap-2 text-xs">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${zc.dot} shrink-0 mt-0.5`}
                    />
                    <div>
                      <span className="font-semibold text-slate-700">
                        {zc.label}:{" "}
                      </span>
                      <span className="text-slate-500">
                        {COLOR_ZONE_HOURS[zone]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Methodology note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Σχετικά με τον υπολογισμό
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>
              • Τα κόστη περιλαμβάνουν: τιμή προμήθειας + ρυθμιζόμενες χρεώσεις
              (δίκτυο, ΕΤΜΕΑΡ κ.ά.) + ΦΠΑ 13%
            </li>
            <li>
              • Για <strong>χρωματιστά τιμολόγια</strong>, το κόστος εξαρτάται
              από το επιλεγμένο προφίλ κατανομής ζωνών
            </li>
            <li>
              • Οι ρυθμιζόμενες χρεώσεις είναι{" "}
              <strong>ίδιες για όλους τους παρόχους</strong> (και διαφέρουν ανά
              ζώνη για χρωματιστά)
            </li>
            <li>• Δεν περιλαμβάνονται τυχόν εκπτώσεις e-bill ή direct debit</li>
            <li>• Τιμές βάσει δημόσια διαθέσιμων τιμοκαταλόγων 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
