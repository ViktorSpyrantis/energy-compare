"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { providers } from "../data/providers";
import { calculateMonthlyCost, formatCurrency } from "../lib/calculations";

export default function QuickCalculator() {
  const [kwh, setKwh] = useState(250);
  const [currentProviderId, setCurrentProviderId] = useState("dei");
  const router = useRouter();

  const currentProvider = providers.find((p) => p.id === currentProviderId)!;
  const currentCost = calculateMonthlyCost(currentProvider, kwh);

  // Find cheapest provider
  const cheapest = providers
    .map((p) => ({ provider: p, cost: calculateMonthlyCost(p, kwh) }))
    .sort((a, b) => a.cost - b.cost)[0];

  const monthlySavings = currentCost - cheapest.cost;
  const annualSavings = monthlySavings * 12;
  const canSave = monthlySavings > 0.5;

  const handleCompare = () => {
    router.push(`/calculator?kwh=${kwh}&provider=${currentProviderId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Γρήγορος Υπολογισμός
        </h2>
      </div>

      {/* kWh Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Μηνιαία κατανάλωση
          <span className="ml-auto float-right text-teal-600 font-bold">
            {kwh} kWh
          </span>
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

        {/* Quick presets */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { label: "Στούντιο", kwh: 100 },
            { label: "Διαμ. 2-3 δωμ.", kwh: 200 },
            { label: "Μεγάλο σπίτι", kwh: 350 },
            { label: "Μονοκατοικία", kwh: 500 },
          ].map((preset) => (
            <button
              key={preset.kwh}
              onClick={() => setKwh(preset.kwh)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                kwh === preset.kwh
                  ? "bg-teal-600 text-white border-teal-600"
                  : "border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Provider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Τρέχων πάροχος
        </label>
        <select
          value={currentProviderId}
          onChange={(e) => setCurrentProviderId(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Current cost display */}
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Τρέχον μηνιαίο κόστος:</span>
          <span className="font-bold text-slate-900">
            {formatCurrency(currentCost)}
          </span>
        </div>
        {canSave && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-600">
              Φθηνότερος ({cheapest.provider.name}):
            </span>
            <span className="font-bold text-teal-600">
              {formatCurrency(cheapest.cost)}
            </span>
          </div>
        )}
      </div>

      {/* Savings Banner */}
      {canSave ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-amber-800 font-semibold text-sm">
                Μπορείς να εξοικονομήσεις έως{" "}
                <span className="text-amber-600 text-lg">
                  {formatCurrency(annualSavings)}
                </span>{" "}
                τον χρόνο
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                Αλλάζοντας στον {cheapest.provider.name}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <p className="text-emerald-800 text-sm font-medium">
              Ήδη έχεις έναν από τους φθηνότερους παρόχους!
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleCompare}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
      >
        Δες Πλήρη Σύγκριση
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
      </button>
    </div>
  );
}
