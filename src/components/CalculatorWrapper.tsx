"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import BillUpload, { BillExtractedData } from "../components/BillUpload";

// Dynamic import to defer heavy component (uses useSearchParams internally)
const SavingsCalculator = dynamic(
  () => import("../components/SavingsCalculator"),
  {
    ssr: false,
    loading: () => <CalculatorSkeleton />,
  },
);

function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-5 gap-8 animate-pulse">
      <div className="lg:col-span-2">
        <div className="bg-slate-200 rounded-2xl h-[600px]" />
      </div>
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-slate-200 rounded-2xl h-28" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-100 rounded-2xl h-24 border border-slate-200"
          />
        ))}
      </div>
    </div>
  );
}

export default function CalculatorWrapper() {
  const [showUpload, setShowUpload] = useState(false);
  const [billHistory, setBillHistory] = useState<BillExtractedData[]>([]);
  // Key changes on each bill application to force SavingsCalculator remount
  const [calcKey, setCalcKey] = useState(0);

  const handleBillExtracted = (data: BillExtractedData) => {
    setBillHistory((prev) => [data, ...prev].slice(0, 3));
    setCalcKey((k) => k + 1);
    setShowUpload(false);
  };

  const handleClearBills = () => {
    setBillHistory([]);
    setCalcKey((k) => k + 1);
  };

  // Aggregate data from bill history
  const hasBills = billHistory.length > 0;
  const latestBill = billHistory[0] ?? null;
  const avgKwh = hasBills
    ? Math.round(
        billHistory.reduce((sum, b) => sum + (b.kwh ?? 0), 0) /
          billHistory.filter((b) => b.kwh).length,
      )
    : undefined;
  const avgBillAmount = hasBills
    ? billHistory.filter((b) => b.billAmount).length > 0
      ? billHistory.reduce((sum, b) => sum + (b.billAmount ?? 0), 0) /
        billHistory.filter((b) => b.billAmount).length
      : undefined
    : undefined;

  return (
    <div>
      {/* ── Bill Upload Trigger / Status bar ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {!showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-700 font-semibold text-sm px-5 py-2.5 rounded-xl border-2 border-teal-200 hover:border-teal-400 transition-all shadow-sm cursor-pointer"
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {hasBills
              ? "Πρόσθεσε άλλον λογαριασμό"
              : "Ανέβασε τον λογαριασμό σου"}
          </button>
        )}

        {hasBills && !showUpload && (
          <div className="flex flex-col gap-2 flex-1">
            {/* Bill history pills */}
            <div className="flex flex-wrap items-center gap-2">
              {billHistory.map((bill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 text-xs text-teal-800"
                >
                  <svg
                    className="w-3.5 h-3.5 text-teal-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Λογ. {idx + 1}: {bill.kwh} kWh
                  </span>
                  {bill.billAmount && (
                    <span className="text-teal-600">
                      · {bill.billAmount.toFixed(2)}€
                    </span>
                  )}
                </div>
              ))}
              {billHistory.length > 1 && (
                <div className="bg-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Μ.ο.: {avgKwh} kWh
                </div>
              )}
              <button
                onClick={handleClearBills}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-1"
              >
                Καθαρισμός
              </button>
            </div>
            {billHistory.length < 3 && (
              <p className="text-xs text-slate-400">
                Πρόσθεσε έως {3 - billHistory.length} ακόμα λογαριασμό
                {billHistory.length < 2 ? "ύς" : ""} για ακριβέστερο μέσο όρο
                κατανάλωσης
              </p>
            )}
          </div>
        )}

        {!hasBills && !showUpload && (
          <p className="text-sm text-slate-500">
            ή εισήγαγε χειροκίνητα τα στοιχεία σου παρακάτω
          </p>
        )}
      </div>

      {/* ── Bill Upload Panel ── */}
      {showUpload && (
        <div className="mb-8">
          <BillUpload
            onExtracted={handleBillExtracted}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      {/* ── Savings Calculator ── */}
      <Suspense fallback={<CalculatorSkeleton />}>
        <SavingsCalculator
          key={calcKey}
          initialKwh={avgKwh ?? latestBill?.kwh}
          initialProviderId={latestBill?.providerId}
          actualBillAmount={avgBillAmount ?? latestBill?.billAmount}
          initialIsStudent={latestBill?.isStudentTariff}
        />
      </Suspense>
    </div>
  );
}
