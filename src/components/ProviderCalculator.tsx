"use client";

import { useState } from "react";
import { allProviders } from "../data/providers";
import { calculateMonthlyCost, formatCurrency } from "../lib/calculations";

interface Props {
  providerId: string;
}

export default function ProviderCalculator({ providerId }: Props) {
  const [kwh, setKwh] = useState(250);
  const provider = allProviders.find((p) => p.id === providerId);
  if (!provider) return null;

  const isFlat = provider.flatMonthlyBill !== undefined;
  const monthlyCost = calculateMonthlyCost(provider, kwh);
  const annualCost = monthlyCost * 12;

  return (
    <div className="space-y-4">
      {isFlat ? (
        <p className="text-sm text-slate-500">
          Σταθερό μηνιαίο πρόγραμμα — το κόστος δεν εξαρτάται από την κατανάλωση.
        </p>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Μηνιαία κατανάλωση:{" "}
            <span className="text-teal-600 font-bold">{kwh} kWh</span>
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
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCurrency(monthlyCost)}</div>
          <div className="text-xs text-teal-600 mt-0.5">ανά μήνα (με ΦΠΑ)</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{formatCurrency(annualCost)}</div>
          <div className="text-xs text-slate-500 mt-0.5">ανά χρόνο</div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        * Εκτίμηση βάσει τιμοκαταλόγου 2026. Περιλαμβάνει τιμή προμήθειας + ρυθμιζόμενες χρεώσεις + ΦΠΑ 13%.
      </p>
    </div>
  );
}
