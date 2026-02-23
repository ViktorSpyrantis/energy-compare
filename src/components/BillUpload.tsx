"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { providers } from "../data/providers";

export interface BillExtractedData {
  kwh: number;
  providerId: string;
  billAmount?: number;
}

interface BillUploadProps {
  onExtracted: (data: BillExtractedData) => void;
  onCancel: () => void;
}

export default function BillUpload({ onExtracted, onCancel }: BillUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [kwh, setKwh] = useState("");
  const [providerId, setProviderId] = useState("dei");
  const [billAmount, setBillAmount] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = useCallback((selected: File) => {
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (!validTypes.includes(selected.type)) {
      setError("Παρακαλώ επιλέξτε αρχείο PDF ή εικόνα (JPG, PNG, WEBP).");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("Το αρχείο δεν πρέπει να υπερβαίνει τα 10MB.");
      return;
    }
    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setFileType(selected.type === "application/pdf" ? "pdf" : "image");

    // Best-effort provider detection from filename
    const name = selected.name.toLowerCase();
    if (name.includes("dei") || name.includes("δεη")) setProviderId("dei");
    else if (name.includes("elpedison")) setProviderId("elpedison");
    else if (name.includes("nrg")) setProviderId("nrg");
    else if (name.includes("protergia")) setProviderId("protergia");
    else if (name.includes("volton")) setProviderId("volton");
    else if (name.includes("zenith")) setProviderId("zenith");
    else if (name.includes("watt")) setProviderId("watt-volt");
  }, []);

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
    setError("");
  };

  const handleApply = () => {
    const kwhValue = parseFloat(kwh.replace(",", "."));
    if (!kwh || isNaN(kwhValue) || kwhValue < 10) {
      setError("Παρακαλώ εισήγαγε έγκυρη κατανάλωση (τουλάχιστον 10 kWh).");
      return;
    }
    setError("");
    onExtracted({
      kwh: Math.min(800, Math.max(50, Math.round(kwhValue))),
      providerId,
      billAmount: billAmount
        ? parseFloat(billAmount.replace(",", ".")) || undefined
        : undefined,
    });
  };

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
              PDF ή εικόνα (JPG, PNG) · Μέχρι 10MB · Δεν αποθηκεύεται
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Κλείσιμο"
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
          /* ── Drop Zone ── */
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
                <p className="text-slate-400 text-xs mt-3">
                  PDF · JPG · PNG · Μέχρι 10MB
                </p>
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
          /* ── Preview + Form ── */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Preview Panel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
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

              <div
                className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center"
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
                    alt="Λογαριασμός ρεύματος"
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>

              <p className="text-xs text-slate-400 mt-2 text-center">
                Το αρχείο εμφανίζεται μόνο στον browser σου · Δεν αποστέλλεται
                πουθενά
              </p>
            </div>

            {/* Entry Form */}
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Συμπλήρωσε τα στοιχεία
                </h4>
                <p className="text-sm text-slate-500">
                  Κοίτα τον λογαριασμό σου δίπλα και βρες τις παρακάτω τιμές.
                </p>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Πάροχος του λογαριασμού
                </label>
                <select
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* kWh — main field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Κατανάλωση ενέργειας <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={kwh}
                    onChange={(e) => {
                      setKwh(e.target.value);
                      setError("");
                    }}
                    placeholder="π.χ. 250"
                    min={10}
                    max={5000}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-14 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                    kWh
                  </span>
                </div>

                {/* Guided tip */}
                <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Πού να βρεις την κατανάλωση:
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span>
                        Πίνακας χρεώσεων →{" "}
                        <em>&quot;Καταναλωθείσα ενέργεια&quot;</em> ή{" "}
                        <em>&quot;Ενεργός ενέργεια (kWh)&quot;</em>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-200 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">
                        Άλλοι
                      </span>
                      <span>
                        Αναζήτησε <em>&quot;Κατανάλωση&quot;</em> ή{" "}
                        <em>&quot;kWh&quot;</em> στον πίνακα χρεώσεων
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">💡</span>
                      <span>
                        Για καλύτερη ακρίβεια, χρησιμοποίησε τον{" "}
                        <strong>μέσο όρο</strong> 2-3 λογαριασμών
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bill amount — optional */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Συνολικό ποσό λογαριασμού
                  <span className="ml-1.5 text-slate-400 font-normal text-xs">
                    (προαιρετικό)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    placeholder="π.χ. 68.50"
                    step="0.01"
                    min={0}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                    €
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Το χρησιμοποιούμε για να επαληθεύσουμε την ακρίβεια της
                  εκτίμησής μας.
                </p>
              </div>

              {/* Error */}
              {error && (
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
                  {error}
                </div>
              )}

              {/* Apply */}
              <button
                onClick={handleApply}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
              >
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
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
