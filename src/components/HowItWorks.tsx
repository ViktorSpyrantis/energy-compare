const steps = [
  {
    number: "01",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Βάλε την κατανάλωσή σου",
    description:
      "Εισήγαγε τη μηνιαία κατανάλωσή σου σε kWh (θα τη βρεις στο λογαριασμό ρεύματος σου) ή επίλεξε ένα από τα προκαθορισμένα προφίλ.",
  },
  {
    number: "02",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Σύγκρινε τους παρόχους",
    description:
      "Βλέπεις αυτόματα όλους τους παρόχους ταξινομημένους από τον φθηνότερο στον ακριβότερο, με πλήρη ανάλυση κόστους.",
  },
  {
    number: "03",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Εξοικονόμησε χρήματα",
    description:
      "Βλέπεις ακριβώς πόσα ευρώ εξοικονομείς κάθε μήνα και κάθε χρόνο αν αλλάξεις πάροχο. Επικοινώνησε απευθείας με τον νέο σου πάροχο.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Πώς λειτουργεί
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            3 απλά βήματα για να εξοικονομήσεις
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Η σύγκριση παρόχων ρεύματος δεν ήταν ποτέ πιο εύκολη. Σε λιγότερο
            από 1 λεπτό γνωρίζεις αν πληρώνεις παραπάνω από όσο χρειάζεται.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector lines on desktop */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-teal-200 to-teal-200 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Number + Icon */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-3 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 group-hover:bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center transition-colors">
                    {i + 1}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/calculator"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-sm text-sm"
          >
            Ξεκίνα τώρα — είναι δωρεάν
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
