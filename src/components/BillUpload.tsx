"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { providers } from "../data/providers";
import type { ParsedBill } from "../app/api/parse-bill/route";

export interface BillExtractedData {
  kwh: number;
  providerId: string;
  billAmount?: number;
}

interface BillUploadProps {
  onExtracted: (data: BillExtractedData) => void;
  onCancel: () => void;
}

type AnalysisState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "done"; result: ParsedBill }
  | { status: "error"; message: string };

// Which fields were auto-filled (to show visual indicators)
interface AutoFilled {
  kwh: boolean;
  provider: boolean;
  billAmount: boolean;
}

const CONFIDENCE_CONFIG = {
  high: {
    label: "Υψηλή αξιοπιστία",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "Μέτρια αξιοπιστία",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  low: {
    label: "Χαμηλή αξιοπιστία",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

function FieldBadge({ auto }: { auto: boolean }) {
  if (!auto) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      Αυτόματα
    </span>
  );
}

export default function BillUpload({ onExtracted, onCancel }: BillUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form fields
  const [kwh, setKwh] = useState("");
  const [providerId, setProviderId] = useState("dei");
  const [billAmount, setBillAmount] = useState("");

  // Auto-fill tracking (to show ✓ badges on fields that were auto-extracted)
  const [autoFilled, setAutoFilled] = useState<AutoFilled>({
    kwh: false,
    provider: false,
    billAmount: false,
  });

  // Analysis state machine
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: "idle" });
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ── Core: analyze the bill via the API ──────────────────────────────────────
  const analyzeBill = useCallback(async (selected: File) => {
    setAnalysis({ status: "analyzing" });
    setAutoFilled({ kwh: false, provider: false, billAmount: false });

    try {
      const fd = new FormData();
      fd.append("file", selected);

      const res = await fetch("/api/parse-bill", { method: "POST", body: fd });

      if (res.status === 503) {
        // API key not configured — fall back to manual entry silently
        setAnalysis({ status: "idle" });
        return;
      }

      const data: ParsedBill & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setAnalysis({
          status: "error",
          message: data.error ?? "Η ανάλυση απέτυχε.",
        });
        return;
      }

      setAnalysis({ status: "done", result: data });

      // Pre-fill form fields from extraction
      const af: AutoFilled = { kwh: false, provider: false, billAmount: false };

      if (data.kwh) {
        setKwh(String(data.kwh));
        af.kwh = true;
      }
      if (data.providerId) {
        setProviderId(data.providerId);
        af.provider = true;
      }
      if (data.billAmount) {
        setBillAmount(String(data.billAmount));
        af.billAmount = true;
      }
      setAutoFilled(af);
    } catch {
      setAnalysis({
        status: "error",
        message: "Δεν ήταν δυνατή η επικοινωνία με τον server.",
      });
    }
  }, []);

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFile = useCallback(
    (selected: File) => {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!validTypes.includes(selected.type)) {
        setFormError("Παρακαλώ επιλέξτε αρχείο PDF ή εικόνα (JPG, PNG, WEBP).");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setFormError("Το αρχείο δεν πρέπει να υπερβαίνει τα 10MB.");
        return;
      }
      setFormError("");
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setFileType(selected.type === "application/pdf" ? "pdf" : "image");
      analyzeBill(selected);
    },
    [analyzeBill],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setKwh("");
    setBillAmount("");
    setAnalysis({ status: "idle" });
    setAutoFilled({ kwh: false, provider: false, billAmount: false });
    setFormError("");
  };

  const handleApply = () => {
    const kwhVal = parseFloat(kwh.replace(",", "."));
    if (!kwh || isNaN(kwhVal) || kwhVal < 10) {
      setFormError("Παρακαλώ εισήγαγε έγκυρη κατανάλωση (τουλάχιστον 10 kWh).");
      return;
    }
    setFormError("");
    onExtracted({
      kwh: Math.min(800, Math.max(50, Math.round(kwhVal))),
      providerId,
      billAmount: billAmount
        ? parseFloat(billAmount.replace(",", ".")) || undefined
        : undefined,
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border-2 border-teal-300 shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base">Ανέβασε τον λογαριασμό σου</h3>
            <p className="text-xs text-teal-100">
              Αυτόματη ανάλυση με AI · PDF ή εικόνα · Μέχρι 10MB · Δεν
              αποθηκεύεται
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
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

      <div className="p-6">
        {!file ? (
          /* ── Drop Zone ─────────────────────────────────────────────────── */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all select-none ${
              isDragging
                ? "border-teal-400 bg-teal-50 scale-[1.01]"
                : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                  isDragging ? "bg-teal-100" : "bg-slate-100"
                }`}
              >
                <svg
                  className={`w-10 h-10 transition-colors ${isDragging ? "text-teal-600" : "text-slate-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-700">
                  {isDragging
                    ? "Άφεσε το αρχείο εδώ"
                    : "Σύρε τον λογαριασμό εδώ"}
                </p>
                <p className="text-slate-500 text-sm mt-1.5">
                  ή κάνε κλικ για να επιλέξεις αρχείο
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  {["PDF", "JPG", "PNG"].map((ext) => (
                    <span
                      key={ext}
                      className="bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {ext}
                    </span>
                  ))}
                  <span className="text-slate-300 text-xs">· Μέχρι 10MB</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2">
                <svg
                  className="w-4 h-4 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs text-teal-700 font-medium">
                  Αυτόματη εξαγωγή kWh, παρόχου & ποσού με AI
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
          </div>
        ) : (
          /* ── Preview + Form ─────────────────────────────────────────────── */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Preview Panel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      fileType === "pdf"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {fileType === "pdf" ? "PDF" : "IMG"}
                  </span>
                  <span className="font-medium text-slate-700 truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-xs text-teal-600 hover:underline shrink-0 ml-2"
                >
                  Αλλαγή
                </button>
              </div>

              {/* Bill preview */}
              <div
                className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative"
                style={{ height: "460px" }}
              >
                {fileType === "pdf" && previewUrl ? (
                  <embed
                    src={previewUrl}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                ) : previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Λογαριασμός"
                    className="w-full h-full object-contain"
                  />
                ) : null}

                {/* Analyzing overlay */}
                {analysis.status === "analyzing" && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-teal-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-800">
                        Ανάλυση λογαριασμού...
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Το AI εντοπίζει kWh, πάροχο & ποσό
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2 text-center">
                Εμφανίζεται μόνο στον browser σου · Δεν αποθηκεύεται
              </p>
            </div>

            {/* Entry Form */}
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {analysis.status === "analyzing"
                    ? "Ανάλυση σε εξέλιξη..."
                    : analysis.status === "done"
                      ? "Αποτελέσματα ανάλυσης"
                      : "Στοιχεία λογαριασμού"}
                </h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  {analysis.status === "analyzing"
                    ? "Παρακαλώ περίμενε..."
                    : analysis.status === "done"
                      ? "Έλεγξε τα παρακάτω στοιχεία και διόρθωσε αν χρειαστεί."
                      : "Συμπλήρωσε τα στοιχεία από τον λογαριασμό σου."}
                </p>
              </div>

              {/* Confidence badge — shown after done */}
              {analysis.status === "done" && (
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
                    CONFIDENCE_CONFIG[analysis.result.confidence].bg
                  } ${CONFIDENCE_CONFIG[analysis.result.confidence].border} ${
                    CONFIDENCE_CONFIG[analysis.result.confidence].color
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${CONFIDENCE_CONFIG[analysis.result.confidence].dot}`}
                  />
                  <span>
                    {CONFIDENCE_CONFIG[analysis.result.confidence].label}{" "}
                    εξαγωγής
                  </span>
                  {analysis.result.billingDays && (
                    <span className="ml-auto text-xs opacity-70">
                      Περίοδος: {analysis.result.billingDays} ημέρες → kWh/μήνα
                    </span>
                  )}
                </div>
              )}

              {/* Error from analysis */}
              {analysis.status === "error" && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800 flex items-start gap-2">
                  <svg
                    className="w-4 h-4 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold">
                      Δεν ήταν δυνατή η αυτόματη ανάλυση
                    </p>
                    <p className="text-xs mt-0.5 opacity-80">
                      {analysis.message} Συμπλήρωσε τα στοιχεία χειροκίνητα.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Provider ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Πάροχος
                  </label>
                  <FieldBadge auto={autoFilled.provider} />
                </div>
                <select
                  value={providerId}
                  onChange={(e) => {
                    setProviderId(e.target.value);
                    setAutoFilled((af) => ({ ...af, provider: false }));
                  }}
                  className={`w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    autoFilled.provider
                      ? "border-teal-400 bg-teal-50/30"
                      : "border-slate-200"
                  }`}
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.fullName}
                    </option>
                  ))}
                </select>
                {analysis.status === "done" &&
                  analysis.result.providerName &&
                  !analysis.result.providerId && (
                    <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Βρέθηκε &ldquo;{analysis.result.providerName}&rdquo; —
                      επίλεξε χειροκίνητα
                    </p>
                  )}
              </div>

              {/* ── kWh ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Μηνιαία κατανάλωση <span className="text-red-500">*</span>
                  </label>
                  <FieldBadge auto={autoFilled.kwh} />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={kwh}
                    onChange={(e) => {
                      setKwh(e.target.value);
                      setAutoFilled((af) => ({ ...af, kwh: false }));
                      setFormError("");
                    }}
                    placeholder={
                      analysis.status === "analyzing"
                        ? "Αναλύεται..."
                        : "π.χ. 250"
                    }
                    disabled={analysis.status === "analyzing"}
                    className={`w-full border rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors disabled:opacity-50 ${
                      autoFilled.kwh
                        ? "border-teal-400 bg-teal-50/30"
                        : analysis.status === "done" && !kwh
                          ? "border-red-300 bg-red-50/20"
                          : "border-slate-200"
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                    kWh
                  </span>
                </div>
                {analysis.status === "done" && !kwh && (
                  <p className="text-xs text-red-600 mt-1.5">
                    Δεν βρέθηκε αυτόματα — συμπλήρωσε χειροκίνητα από τον
                    λογαριασμό σου.
                  </p>
                )}
                {analysis.status !== "done" &&
                  analysis.status !== "analyzing" && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-800 mb-1.5">
                        💡 Πού να βρεις την κατανάλωση:
                      </p>
                      <ul className="text-xs text-amber-700 space-y-1">
                        <li>
                          <strong>ΔΕΗ:</strong> &ldquo;Καταναλωθείσα
                          ενέργεια&rdquo; ή &ldquo;Ενεργός ενέργεια (kWh)&rdquo;
                        </li>
                        <li>
                          <strong>Άλλοι:</strong> Αναζήτησε
                          &ldquo;Κατανάλωση&rdquo; ή &ldquo;kWh&rdquo; στον
                          πίνακα χρεώσεων
                        </li>
                      </ul>
                    </div>
                  )}
              </div>

              {/* ── Bill Amount ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Ποσό λογαριασμού
                    <span className="ml-1.5 font-normal text-slate-400 text-xs">
                      (προαιρετικό)
                    </span>
                  </label>
                  <FieldBadge auto={autoFilled.billAmount} />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => {
                      setBillAmount(e.target.value);
                      setAutoFilled((af) => ({ ...af, billAmount: false }));
                    }}
                    placeholder={
                      analysis.status === "analyzing"
                        ? "Αναλύεται..."
                        : "π.χ. 68.50"
                    }
                    disabled={analysis.status === "analyzing"}
                    step="0.01"
                    className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors disabled:opacity-50 ${
                      autoFilled.billAmount
                        ? "border-teal-400 bg-teal-50/30"
                        : "border-slate-200"
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                    €
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Χρησιμοποιείται για να επαληθευτεί η ακρίβεια της εκτίμησης.
                </p>
              </div>

              {/* Form-level error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                  <svg
                    className="w-4 h-4 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {formError}
                </div>
              )}

              {/* Apply */}
              <button
                onClick={handleApply}
                disabled={analysis.status === "analyzing" || !kwh}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                {analysis.status === "analyzing" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Ανάλυση...
                  </>
                ) : (
                  <>
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Εφαρμογή στην Αριθμομηχανή
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
