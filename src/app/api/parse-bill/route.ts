import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EXTRACTION_PROMPT = `Αυτός είναι ένας ελληνικός λογαριασμός ηλεκτρικής ενέργειας.

Εξήγαγε τα παρακάτω στοιχεία και επέστρεψε ΜΟΝΟ ένα JSON αντικείμενο, χωρίς markdown ή άλλο κείμενο:

{
  "kwh": <συνολική κατανάλωση kWh για την τρέχουσα περίοδο - αριθμός ή null>,
  "billingDays": <ημέρες χρέωσης στην τρέχουσα περίοδο - αριθμός ή null>,
  "provider": "<ακριβές όνομα παρόχου όπως εμφανίζεται - string ή null>",
  "tariffName": "<ονομασία τιμολογίου ή προγράμματος όπως εμφανίζεται στον λογαριασμό - string ή null>",
  "billAmount": <συνολικό πληρωτέο ποσό με ΦΠΑ σε ευρώ - αριθμός ή null>,
  "colorZones": {
    "blue": <kWh Μπλε ζώνης - αριθμός ή null>,
    "green": <kWh Πράσινης ζώνης - αριθμός ή null>,
    "yellow": <kWh Κίτρινης ζώνης - αριθμός ή null>,
    "red": <kWh Κόκκινης ζώνης - αριθμός ή null>
  },
  "confidence": "<high|medium|low>"
}

Οδηγίες:
- kwh: Ψάξε για "Καταναλωθείσα ενέργεια", "Ενεργός ενέργεια", "Κατανάλωση (kWh)", "Σύνολο kWh". Παράδειγμα: αν δεις "250,00 kWh", βάλε 250.
- billingDays: Η διαφορά ημερών μεταξύ ημερ. λήξης και ημερ. έναρξης.
- provider: Το όνομα του παρόχου (ΔΕΗ, Elpedison, NRG, Protergia, Volton, Zenith, Watt+Volt, κ.ά.)
- tariffName: Το όνομα του τιμολογίου ή πακέτου (π.χ. "myHome 4Students", "myHome Enter", "Home Easy"). Ψάξε για "Τιμολόγιο Προμήθειας", "Πακέτο", "Πρόγραμμα", "Κατηγορία τιμολόγησης".
- billAmount: Το τελικό ποσό που πρέπει να πληρωθεί (μετά ΦΠΑ). Ψάξε για "Σύνολο", "Πληρωτέο", "Σύνολο Λογαριασμού".
- colorZones: Αν ο λογαριασμός έχει χρωματιστό τιμολόγιο, εξήγαγε τα kWh ανά ζώνη (Μπλε/Πράσινη/Κίτρινη/Κόκκινη). Αλλιώς βάλε null σε όλα.
- confidence: "high" αν βρήκες όλα ξεκάθαρα, "medium" αν βρήκες 2-3, "low" αν λιγότερα.`;

function resolveProviderId(name: string | null): string | null {
  if (!name) return null;
  const n = name.toLowerCase().trim();
  if (
    n.includes("δεη") ||
    n.includes("dei") ||
    n.includes("δημόσια επιχείρηση")
  )
    return "dei";
  if (n.includes("elpedison") || n.includes("ελπεδίσ")) return "elpedison";
  if (n === "nrg" || n.startsWith("nrg ")) return "nrg";
  if (n.includes("protergia") || n.includes("προτέρ")) return "protergia";
  if (n.includes("volton")) return "volton";
  if (n.includes("zenith")) return "zenith";
  if (n.includes("watt") || n.includes("w+v")) return "watt-volt";
  return null;
}

export interface ParsedBill {
  kwh: number | null;
  rawKwh: number | null;
  billingDays: number | null;
  providerId: string | null;
  providerName: string | null;
  tariffName: string | null;
  isStudentTariff: boolean;
  billAmount: number | null;
  colorZones: {
    blue: number | null;
    green: number | null;
    yellow: number | null;
    red: number | null;
  } | null;
  confidence: "high" | "medium" | "low";
}

function detectStudentTariff(tariffName: string | null): boolean {
  if (!tariffName) return false;
  const t = tariffName.toLowerCase();
  return t.includes("4students") || t.includes("4 students") || t.includes("φοιτητ");
}

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent([
      { inlineData: { mimeType: file.type, data: base64 } },
      EXTRACTION_PROMPT,
    ]);

    const rawText = result.response.text().trim();

    // Extract JSON (model might wrap it in markdown code fences)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not extract data from bill.", confidence: "low" },
        { status: 200 },
      );
    }

    const extracted = JSON.parse(jsonMatch[0]) as {
      kwh: number | null;
      billingDays: number | null;
      provider: string | null;
      tariffName: string | null;
      billAmount: number | null;
      colorZones?: {
        blue: number | null;
        green: number | null;
        yellow: number | null;
        red: number | null;
      } | null;
      confidence: "high" | "medium" | "low";
    };

    // Normalize kWh to monthly if billing period ≠ ~30 days
    let monthlyKwh = extracted.kwh;
    if (monthlyKwh && extracted.billingDays && extracted.billingDays > 15) {
      monthlyKwh = Math.round((monthlyKwh / extracted.billingDays) * 30);
    }
    if (monthlyKwh) {
      monthlyKwh = Math.min(800, Math.max(10, monthlyKwh));
    }

    const result2: ParsedBill = {
      kwh: monthlyKwh,
      rawKwh: extracted.kwh,
      billingDays: extracted.billingDays,
      providerId: resolveProviderId(extracted.provider),
      providerName: extracted.provider,
      tariffName: extracted.tariffName ?? null,
      isStudentTariff: detectStudentTariff(extracted.tariffName ?? null),
      billAmount: extracted.billAmount,
      colorZones: extracted.colorZones ?? null,
      confidence: extracted.confidence ?? "low",
    };

    return NextResponse.json(result2);
  } catch (err) {
    console.error("[parse-bill] error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again.", err },
      { status: 500 },
    );
  }
}
