import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-700 to-cyan-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-5xl mb-5">⚡</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Πόσα χρήματα χάνεις κάθε μήνα;
        </h2>
        <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
          Η μέση ελληνική οικογένεια εξοικονομεί{" "}
          <span className="text-amber-300 font-bold">180-300€ το χρόνο</span>{" "}
          απλά αλλάζοντας πάροχο ρεύματος. Υπολόγισε τη δική σου εξοικονόμηση
          τώρα.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/calculator"
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-xl transition-colors text-base shadow-lg w-full sm:w-auto"
          >
            Υπολόγισε την Εξοικονόμησή σου →
          </Link>
          <Link
            href="/compare"
            className="bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base border border-white/30 w-full sm:w-auto"
          >
            Σύγκριση Παρόχων
          </Link>
        </div>
      </div>
    </section>
  );
}
