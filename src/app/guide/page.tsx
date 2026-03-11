import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Οδηγός Αλλαγής Παρόχου Ρεύματος 2026 | EnergyCompare",
  description:
    "Πλήρης οδηγός για την αλλαγή παρόχου ηλεκτρικού ρεύματος στην Ελλάδα: βήμα-βήμα διαδικασία, τι να προσέξεις, πότε αξίζει η αλλαγή.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-teal-600 transition-colors">Αρχική</Link>
            <span>/</span>
            <span className="text-slate-800">Οδηγός</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Πώς να αλλάξεις πάροχο ρεύματος
          </h1>
          <p className="text-lg text-slate-600">
            Βήμα-βήμα οδηγός για αλλαγή παρόχου ηλεκτρικού ρεύματος στην Ελλάδα —
            από τη σύγκριση ως την ολοκλήρωση της αλλαγής.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 font-medium">
              ✅ Εντελώς δωρεάν
            </span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-3 py-1">
              ⏱ Διαδικασία: 10–15 λεπτά
            </span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-3 py-1">
              📅 Ολοκλήρωση: 2–4 εβδομάδες
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Συγκρίνετε τιμές</h2>
                <p className="text-slate-600 mb-4">
                  Χρησιμοποιήστε τον συγκριτή μας για να βρείτε ποιος πάροχος προσφέρει τη χαμηλότερη
                  τιμή για την κατανάλωσή σας. Θα χρειαστείτε:
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    Τη μηνιαία κατανάλωσή σας σε kWh (βρίσκεται στον λογαριασμό σας)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    Τον τρέχοντα πάροχο και τιμή σας
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    Αν έχετε νυχτερινό μετρητή (ΗΕΑ) ή χρωματιστό τιμολόγιο
                  </li>
                </ul>
                <Link
                  href="/calculator"
                  className="mt-4 inline-flex items-center gap-1 text-teal-600 font-semibold text-sm hover:underline"
                >
                  Ξεκίνα σύγκριση →
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Ελέγξτε τους όρους του τρέχοντος συμβολαίου</h2>
                <p className="text-slate-600 mb-4">
                  Πριν αλλάξετε, ελέγξτε αν υπάρχει πρόστιμο πρόωρης λύσης στο τρέχον συμβόλαιό σας:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="font-semibold text-emerald-800 mb-1">Χωρίς πρόστιμο</div>
                    <div className="text-sm text-emerald-700">
                      Μεταβλητά συμβόλαια ή λήξη ετήσιου συμβολαίου: αλλάξτε αμέσως
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="font-semibold text-amber-800 mb-1">Με πρόστιμο</div>
                    <div className="text-sm text-amber-700">
                      Υπολογίστε αν η εξοικονόμηση αποσβένει το πρόστιμο (χρησιμοποιήστε το εργαλείο μας)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Κάντε αίτηση στον νέο πάροχο</h2>
                <p className="text-slate-600 mb-4">
                  Επικοινωνήστε με τον νέο πάροχο (online, τηλεφωνικά ή σε κατάστημα). Θα χρειαστείτε:
                </p>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    ΑΦΜ και ΑΜΚΑ σας
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    Αριθμό παροχής (HΛΚΑ/ΜΕΤΕ) από τον τρέχοντα λογαριασμό σας
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    IBAN τραπεζικού λογαριασμού (για πάγια εντολή ή direct debit)
                  </li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  💡 Ο νέος πάροχος αναλαμβάνει τη διαδικασία αλλαγής — δεν χρειάζεται να επικοινωνήσετε
                  με τον παλιό πάροχο. Η διαδικασία γίνεται μέσω ΑΔΜΗΕ/ΔΕΔΔΗΕ.
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                4
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Περιμένετε την ολοκλήρωση</h2>
                <p className="text-slate-600 mb-4">
                  Η αλλαγή παρόχου ολοκληρώνεται σε 2–4 εβδομάδες. Κατά τη διάρκεια:
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">✓</span>
                    Δεν υπάρχει διακοπή ρεύματος
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">✓</span>
                    Θα λάβετε τελικό λογαριασμό από τον παλιό πάροχο
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">✓</span>
                    Ο νέος πάροχος θα σας ενημερώσει για την ημερομηνία έναρξης χρέωσης
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Συχνές ερωτήσεις</h2>
          <div className="space-y-4">
            {[
              {
                q: "Κοστίζει κάτι η αλλαγή παρόχου;",
                a: "Η αλλαγή παρόχου είναι δωρεάν. Μπορεί να υπάρξει πρόστιμο μόνο αν λύσετε πρόωρα ένα σταθερό συμβόλαιο — ελέγξτε τους όρους σας.",
              },
              {
                q: "Τι γίνεται με τον παλιό μου λογαριασμό;",
                a: "Ο παλιός πάροχος θα σας στείλει τελικό λογαριασμό για την κατανάλωση ως την ημερομηνία αλλαγής. Ο νέος πάροχος αναλαμβάνει από εκεί.",
              },
              {
                q: "Θα διακοπεί το ρεύμα μου;",
                a: "Όχι. Η αλλαγή παρόχου γίνεται αδιόρατα — δεν υπάρχει καμία διακοπή ρεύματος κατά τη διάρκεια της μεταφοράς.",
              },
              {
                q: "Πότε αξίζει να αλλάξω πάροχο;",
                a: "Αξίζει να ελέγχετε τιμές κάθε χρόνο, ιδίως πριν την ανανέωση συμβολαίου. Εξοικονόμηση 10–20€/μήνα (120–240€/χρόνο) είναι συνηθισμένη.",
              },
              {
                q: "Χρωματιστό ή σταθερό τιμολόγιο;",
                a: "Το χρωματιστό τιμολόγιο συμφέρει αν μπορείτε να μετατοπίσετε κατανάλωση στις νυχτερινές ώρες (π.χ. ηλεκτρικό αυτοκίνητο, πλυντήριο τη νύχτα). Διαφορετικά, το σταθερό τιμολόγιο είναι απλούστερο.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{q}</h3>
                <p className="text-sm text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-teal-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Έτοιμος να αλλάξεις πάροχο;</h2>
          <p className="text-teal-100 mb-6">
            Ξεκίνα συγκρίνοντας τιμές για τη δική σου κατανάλωση
          </p>
          <Link
            href="/calculator"
            className="inline-block bg-white text-teal-700 font-bold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Σύγκριση τώρα →
          </Link>
        </div>
      </div>
    </div>
  );
}
