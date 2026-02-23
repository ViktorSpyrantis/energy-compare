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
  const [billData, setBillData] = useState<BillExtractedData | null>(null);
  // Key changes on each bill application to force SavingsCalculator remount
  const [calcKey, setCalcKey] = useState(0);

  const handleBillExtracted = (data: BillExtractedData) => {
    setBillData(data);
    setCalcKey((k) => k + 1);
    setShowUpload(false);
  };

  const handleClearBill = () => {
    setBillData(null);
    setCalcKey((k) => k + 1);
  };

  return (
    <div>
      {/* ── Bill Upload Trigger / Status bar ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {!showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-700 font-semibold text-sm px-5 py-2.5 rounded-xl border-2 border-teal-200 hover:border-teal-400 transition-all shadow-sm"
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
            Ανέβασε τον λογαριασμό σου
          </button>
        )}

        {billData && !showUpload && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
            <svg
              className="w-4 h-4 text-teal-600 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-teal-700 font-medium">
              Δεδομένα από τον λογαριασμό σου —{" "}
              <strong>{billData.kwh} kWh</strong>
              {billData.billAmount && (
                <span className="text-teal-600">
                  {" "}
                  · {billData.billAmount.toFixed(2)} €
                </span>
              )}
            </span>
            <button
              onClick={handleClearBill}
              className="ml-1 text-teal-400 hover:text-teal-700 transition-colors"
              title="Καθαρισμός"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {!billData && !showUpload && (
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
          initialKwh={billData?.kwh}
          initialProviderId={billData?.providerId}
          actualBillAmount={billData?.billAmount}
        />
      </Suspense>
    </div>
  );
}
