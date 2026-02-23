"use client";

import { useState, useMemo } from "react";
import { providers } from "../data/providers";
import { calculateMonthlyCost, formatCurrency } from "../lib/calculations";
import { FilterOptions } from "../types";

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

export default function ComparisonTable() {
  const [kwh, setKwh] = useState(250);
  const [filters, setFilters] = useState<FilterOptions>({
    tariffType: "all",
    greenOnly: false,
    sortBy: "price",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const filtered = useMemo(() => {
    let list = providers.filter((p) => {
      if (filters.tariffType !== "all" && p.tariffType !== filters.tariffType)
        return false;
      if (filters.greenOnly && !p.greenEnergy) return false;
      return true;
    });

    list = list.sort((a, b) => {
      if (filters.sortBy === "price") {
        return calculateMonthlyCost(a, kwh) - calculateMonthlyCost(b, kwh);
      }
      if (filters.sortBy === "rating") return b.rating - a.rating;
      return a.name.localeCompare(b.name, "el");
    });

    return list;
  }, [filters, kwh]);

  const cheapestCost =
    filtered.length > 0 ? calculateMonthlyCost(filtered[0], kwh) : 0;
  const maxCost = filtered.reduce(
    (max, p) => Math.max(max, calculateMonthlyCost(p, kwh)),
    0,
  );

  return (
    <div>
      {/* Controls bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* kWh Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Τύπος τιμολογίου
              </label>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
                {(["all", "fixed", "variable"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFilters((f) => ({ ...f, tariffType: type }))
                    }
                    className={`px-3 py-2 transition-colors ${
                      filters.tariffType === type
                        ? "bg-teal-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type === "all"
                      ? "Όλα"
                      : type === "fixed"
                        ? "Σταθερή"
                        : "Μεταβλητή"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Ταξινόμηση
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    sortBy: e.target.value as "price" | "rating" | "name",
                  }))
                }
                className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="price">Κατά τιμή</option>
                <option value="rating">Κατά αξιολόγηση</option>
                <option value="name">Αλφαβητικά</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() =>
                    setFilters((f) => ({ ...f, greenOnly: !f.greenOnly }))
                  }
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    filters.greenOnly ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      filters.greenOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Πράσινη ενέργεια
                </span>
              </label>
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 transition-colors ${viewMode === "cards" ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                title="Κάρτες"
              >
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition-colors ${viewMode === "table" ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                title="Πίνακας"
              >
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
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-500 mb-4">
        Βρέθηκαν <strong className="text-slate-800">{filtered.length}</strong>{" "}
        πάροχοι για κατανάλωση{" "}
        <strong className="text-teal-600">{kwh} kWh/μήνα</strong>
      </div>

      {/* Card View */}
      {viewMode === "cards" && (
        <div className="space-y-4">
          {filtered.map((provider, i) => {
            const cost = calculateMonthlyCost(provider, kwh);
            const savings = (maxCost - cost) * 12;
            const isExpanded = expandedId === provider.id;

            return (
              <div
                key={provider.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                  i === 0 ? "border-teal-400" : "border-slate-200"
                }`}
              >
                {/* Main row */}
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        i === 0
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Logo */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border"
                      style={{
                        backgroundColor: provider.bgColor,
                        color: provider.textColor,
                        borderColor: provider.primaryColor + "30",
                      }}
                    >
                      {provider.logoText.length > 4 ? (
                        <span className="text-[9px] leading-tight text-center px-0.5">
                          {provider.logoText}
                        </span>
                      ) : (
                        provider.logoText
                      )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-900">
                          {provider.name}
                        </span>
                        {i === 0 && (
                          <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            Φθηνότερος
                          </span>
                        )}
                        {provider.greenEnergy && (
                          <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-200">
                            🌿 {provider.greenEnergyPercent}% Πράσινη
                          </span>
                        )}
                      </div>
                      <StarRating rating={provider.rating} />
                    </div>

                    {/* Tags - hidden on mobile */}
                    <div className="hidden sm:flex gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          provider.tariffType === "fixed"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {provider.tariffType === "fixed"
                          ? "Σταθερή"
                          : "Μεταβλητή"}
                      </span>
                      <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-full">
                        {provider.contractMonths === 0
                          ? "Χωρίς δέσμευση"
                          : `${provider.contractMonths} μήνες`}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-slate-900">
                        {formatCurrency(cost)}
                      </div>
                      <div className="text-xs text-slate-500">/μήνα</div>
                    </div>

                    {/* Savings */}
                    <div className="text-right shrink-0 hidden md:block">
                      {i === 0 ? (
                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                          Φθηνότερος
                        </span>
                      ) : (
                        <div>
                          <div className="text-sm font-bold text-slate-500">
                            {formatCurrency((cost - cheapestCost) * 12)}
                          </div>
                          <div className="text-xs text-slate-400">
                            επιπλέον/χρόνο
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : provider.id)
                      }
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Cost bar */}
                  <div className="mt-3 ml-12 sm:ml-16">
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${i === 0 ? "bg-teal-500" : "bg-slate-400"}`}
                        style={{ width: `${(cost / maxCost) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 p-5">
                    <div className="grid sm:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                          <span className="text-emerald-500">✓</span>{" "}
                          Πλεονεκτήματα
                        </h4>
                        <ul className="space-y-1.5">
                          {provider.pros.map((pro) => (
                            <li
                              key={pro}
                              className="text-sm text-slate-600 flex items-start gap-1.5"
                            >
                              <span className="text-emerald-500 shrink-0 mt-0.5">
                                +
                              </span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                          <span className="text-red-400">✕</span> Μειονεκτήματα
                        </h4>
                        <ul className="space-y-1.5">
                          {provider.cons.map((con) => (
                            <li
                              key={con}
                              className="text-sm text-slate-600 flex items-start gap-1.5"
                            >
                              <span className="text-red-400 shrink-0 mt-0.5">
                                –
                              </span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">
                          Ανάλυση κόστους
                        </h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Τιμή kWh (προμήθεια)
                            </span>
                            <span className="font-medium">
                              {(provider.supplyRate * 100).toFixed(2)}¢
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Μηνιαίο πάγιο
                            </span>
                            <span className="font-medium">
                              {formatCurrency(provider.monthlyFee)}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400 text-xs pt-1 border-t border-slate-200">
                            <span>Ρυθμιζόμενες χρεώσεις*</span>
                            <span>Ίδιες για όλους</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-1 border-t border-slate-200">
                            <span>Μηνιαίο σύνολο (με ΦΠΑ)</span>
                            <span className="text-teal-700">
                              {formatCurrency(cost)}
                            </span>
                          </div>
                        </div>
                        {provider.newCustomerOffer && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800 font-medium">
                            🎁 {provider.newCustomerOffer}
                          </div>
                        )}
                        <a
                          href={`tel:${provider.phone}`}
                          className="mt-3 block text-center bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                          📞 {provider.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    #
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Πάροχος
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Τιμή kWh
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Πάγιο/μήνα
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Κόστος/μήνα
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Κόστος/χρόνο
                  </th>
                  <th className="text-center px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Αξιολόγηση
                  </th>
                  <th className="text-center px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Τύπος
                  </th>
                  <th className="text-center px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                    Πράσινη
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((provider, i) => {
                  const cost = calculateMonthlyCost(provider, kwh);
                  return (
                    <tr
                      key={provider.id}
                      className={`hover:bg-slate-50 transition-colors ${i === 0 ? "bg-teal-50/50" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            i === 0
                              ? "bg-teal-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px] border shrink-0"
                            style={{
                              backgroundColor: provider.bgColor,
                              color: provider.textColor,
                              borderColor: provider.primaryColor + "30",
                            }}
                          >
                            {provider.logoText.length > 4 ? (
                              <span className="text-[8px] leading-tight text-center">
                                {provider.logoText}
                              </span>
                            ) : (
                              provider.logoText
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {provider.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {provider.contractMonths === 0
                                ? "Χωρίς δέσμευση"
                                : `${provider.contractMonths} μήνες`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-900">
                        {(provider.supplyRate * 100).toFixed(2)}¢
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700">
                        {formatCurrency(provider.monthlyFee)}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {formatCurrency(cost)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700">
                        {formatCurrency(cost * 12)}
                      </td>
                      <td className="px-5 py-4">
                        <StarRating rating={provider.rating} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            provider.tariffType === "fixed"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {provider.tariffType === "fixed"
                            ? "Σταθερή"
                            : "Μεταβλητή"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {provider.greenEnergy ? (
                          <span className="text-emerald-600 font-medium text-xs">
                            🌿 {provider.greenEnergyPercent}%
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400 bg-slate-50">
            * Κόστη βάσει δημόσια διαθέσιμων τιμοκαταλόγων 2025. Περιλαμβάνουν
            τιμή προμήθειας + ρυθμιζόμενες χρεώσεις + ΦΠΑ 13%.
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-slate-600">
            Δεν βρέθηκαν πάροχοι με αυτά τα φίλτρα
          </p>
          <button
            onClick={() =>
              setFilters({
                tariffType: "all",
                greenOnly: false,
                sortBy: "price",
              })
            }
            className="mt-4 text-teal-600 font-medium hover:underline text-sm"
          >
            Καθαρισμός φίλτρων
          </button>
        </div>
      )}
    </div>
  );
}
