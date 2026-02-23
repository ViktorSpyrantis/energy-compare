"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { providers } from "../data/providers";
import {
  calculateProviderCosts,
  formatCurrency,
  CONSUMPTION_PRESETS,
} from "../lib/calculations";

export default function SavingsCalculator() {
  const searchParams = useSearchParams();

  const [kwh, setKwh] = useState(() => {
    const param = searchParams.get("kwh");
    return param ? Math.min(800, Math.max(50, Number(param))) : 250;
  });

  const [currentProviderId, setCurrentProviderId] = useState(() => {
    const param = searchParams.get("provider");
    return param && providers.find((p) => p.id === param) ? param : "dei";
  });

  // Recalculate on params change
  useEffect(() => {
    const kwhParam = searchParams.get("kwh");
    const providerParam = searchParams.get("provider");
    if (kwhParam) setKwh(Math.min(800, Math.max(50, Number(kwhParam))));
    if (providerParam && providers.find((p) => p.id === providerParam)) {
      setCurrentProviderId(providerParam);
    }
  }, [searchParams]);

  const costs = useMemo(
    () => calculateProviderCosts(providers, kwh, currentProviderId),
    [kwh, currentProviderId],
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
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-lg">
              ⚡
            </span>
            Τα στοιχεία σου
          </h2>

          {/* Current Provider */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Τρέχων πάροχος
            </label>
            <div className="grid grid-cols-1 gap-2">
              {providers.map((p) => (
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
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">
                      {p.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {p.fullName}
                    </div>
                  </div>
                  {currentProviderId === p.id && (
                    <svg
                      className="w-5 h-5 text-teal-600 ml-auto shrink-0"
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

        {/* Results list */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Σύγκριση για {kwh} kWh/μήνα
          </h3>

          {costs.map((item, i) => {
            const isCurrent = item.provider.id === currentProviderId;
            const isFirst = i === 0;
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
                        {item.provider.greenEnergy && (
                          <span className="text-emerald-700 text-[10px] font-medium">
                            🌿
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {(item.provider.supplyRate * 100).toFixed(2)}¢/kWh ·
                        πάγιο {formatCurrency(item.provider.monthlyFee)}/μήνα
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

        {/* Methodology note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
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
              • Οι ρυθμιζόμενες χρεώσεις (~7.15¢/kWh + 2.50€/μήνα) είναι{" "}
              <strong>ίδιες για όλους τους παρόχους</strong>
            </li>
            <li>
              • Δεν περιλαμβάνονται τυχόν εκπτώσεις e-bill ή direct debit που
              μπορεί να μειώσουν περαιτέρω το κόστος
            </li>
            <li>
              • Τιμές βάσει δημόσια διαθέσιμων τιμοκαταλόγων 2025 —
              επικοινωνήστε με τον πάροχο για επίσημη προσφορά
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
