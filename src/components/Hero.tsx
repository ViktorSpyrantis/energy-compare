import QuickCalculator from "../components/QuickCalculator";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/30 rounded-full translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Ενημερωμένα δεδομένα 2025
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Βρες τον <span className="text-amber-300">φθηνότερο</span>
              <br />
              πάροχο ρεύματος
            </h1>

            <p className="text-lg text-teal-100 leading-relaxed mb-8 max-w-lg">
              Σύγκρινε όλους τους παρόχους ηλεκτρικής ενέργειας στην Ελλάδα σε
              δευτερόλεπτα. Δες ακριβώς πόσα χρήματα μπορείς να εξοικονομήσεις
              αλλάζοντας πάροχο.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "7+", label: "Πάροχοι" },
                { value: "~300€", label: "Μέση εξοικονόμηση/χρόνο" },
                { value: "100%", label: "Δωρεάν εργαλείο" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10"
                >
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-teal-200 mt-0.5 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Calculator */}
          <div>
            <QuickCalculator />
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center gap-6 text-teal-200 text-sm">
          {[
            { icon: "✓", text: "Δωρεάν σύγκριση" },
            { icon: "✓", text: "Χωρίς εγγραφή" },
            { icon: "✓", text: "8 πάροχοι στην αγορά" },
            { icon: "✓", text: "Ενημερωμένα δεδομένα" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
